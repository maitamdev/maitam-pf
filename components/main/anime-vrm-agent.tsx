"use client";

import { Float } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  type VRM,
  VRMLoaderPlugin,
  VRMUtils,
} from "@pixiv/three-vrm";
import {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type AgentState = "idle" | "listening" | "thinking" | "guiding";

type AnimeVrmAgentProps = {
  state: AgentState;
  speaking: boolean;
  cursor: MutableRefObject<{ x: number; y: number }>;
  reduceMotion: boolean;
  colors: {
    primary: string;
    secondary: string;
  };
};

const configuredVrms = new WeakSet<VRM>();

const dampRotation = (
  bone: THREE.Object3D | null,
  axis: "x" | "y" | "z",
  target: number,
  delta: number,
  lambda = 8,
) => {
  if (!bone) return;
  bone.rotation[axis] = THREE.MathUtils.damp(
    bone.rotation[axis],
    target,
    lambda,
    delta,
  );
};

export const AnimeVrmAgent = ({
  state,
  speaking,
  cursor,
  reduceMotion,
  colors,
}: AnimeVrmAgentProps) => {
  const root = useRef<THREE.Group>(null);
  const hologram = useRef<THREE.Group>(null);
  const gltf = useLoader(
    GLTFLoader,
    "/models/mai-guide.vrm",
    (loader) => {
      loader.register((parser) => new VRMLoaderPlugin(parser));
    },
  );
  const vrm = gltf.userData.vrm as VRM;

  const bones = useMemo(
    () => ({
      head: vrm.humanoid.getNormalizedBoneNode("head"),
      chest: vrm.humanoid.getNormalizedBoneNode("chest"),
      hips: vrm.humanoid.getNormalizedBoneNode("hips"),
      leftUpperArm: vrm.humanoid.getNormalizedBoneNode("leftUpperArm"),
      leftLowerArm: vrm.humanoid.getNormalizedBoneNode("leftLowerArm"),
      rightUpperArm: vrm.humanoid.getNormalizedBoneNode("rightUpperArm"),
      rightLowerArm: vrm.humanoid.getNormalizedBoneNode("rightLowerArm"),
      leftUpperLeg: vrm.humanoid.getNormalizedBoneNode("leftUpperLeg"),
      rightUpperLeg: vrm.humanoid.getNormalizedBoneNode("rightUpperLeg"),
    }),
    [vrm],
  );

  useEffect(() => {
    if (!configuredVrms.has(vrm)) {
      VRMUtils.removeUnnecessaryVertices(vrm.scene);
      VRMUtils.combineSkeletons(vrm.scene);
      VRMUtils.rotateVRM0(vrm);
      vrm.scene.traverse((object) => {
        object.frustumCulled = false;
        if ("castShadow" in object) object.castShadow = false;
        if ("receiveShadow" in object) object.receiveShadow = false;
      });
      configuredVrms.add(vrm);
    }

    return () => {
      vrm.expressionManager?.setValue("blink", 0);
      vrm.expressionManager?.setValue("aa", 0);
      vrm.expressionManager?.setValue("happy", 0);
    };
  }, [vrm]);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const time = clock.elapsedTime;
    const thinking = state === "thinking";
    const listening = state === "listening";
    const guiding = state === "guiding";
    const movement = reduceMotion ? 0 : 1;

    if (root.current) {
      root.current.position.y =
        -0.93 +
        Math.sin(time * (guiding ? 3.8 : 1.35)) *
          (guiding ? 0.045 : 0.018) *
          movement;
      root.current.rotation.z = THREE.MathUtils.damp(
        root.current.rotation.z,
        guiding ? -0.07 : Math.sin(time * 0.7) * 0.008 * movement,
        7,
        delta,
      );
    }

    dampRotation(
      bones.head,
      "y",
      cursor.current.x * 0.3 * movement,
      delta,
      7,
    );
    dampRotation(
      bones.head,
      "x",
      -cursor.current.y * 0.16 * movement +
        Math.sin(time * 1.1) * 0.018 * movement,
      delta,
      7,
    );
    dampRotation(
      bones.chest,
      "y",
      cursor.current.x * 0.08 * movement,
      delta,
      5,
    );
    dampRotation(
      bones.chest,
      "x",
      Math.sin(time * 1.35) * 0.012 * movement,
      delta,
      5,
    );

    const stride = guiding ? Math.sin(time * 7.2) * 0.26 * movement : 0;
    const gesture = speaking ? Math.sin(time * 2.6) * 0.12 * movement : 0;
    dampRotation(
      bones.leftUpperArm,
      "z",
      listening || thinking ? -0.72 : -1.12 + gesture,
      delta,
      9,
    );
    dampRotation(
      bones.leftUpperArm,
      "x",
      guiding ? stride : speaking ? -0.18 : 0,
      delta,
      9,
    );
    dampRotation(
      bones.leftLowerArm,
      "z",
      listening || thinking ? -0.72 : speaking ? -0.32 : -0.08,
      delta,
      9,
    );
    dampRotation(
      bones.rightUpperArm,
      "z",
      1.12 - gesture * 0.35,
      delta,
      9,
    );
    dampRotation(
      bones.rightUpperArm,
      "x",
      guiding ? -stride : 0,
      delta,
      9,
    );
    dampRotation(
      bones.rightLowerArm,
      "z",
      speaking ? 0.22 : 0.08,
      delta,
      9,
    );
    dampRotation(bones.leftUpperLeg, "x", -stride, delta, 10);
    dampRotation(bones.rightUpperLeg, "x", stride, delta, 10);
    dampRotation(
      bones.hips,
      "y",
      guiding ? Math.sin(time * 3.6) * 0.035 * movement : 0,
      delta,
      7,
    );

    if (hologram.current) {
      hologram.current.visible = listening || thinking || speaking;
      hologram.current.rotation.z +=
        delta * (thinking ? 2.4 : listening ? 1.5 : 0.65);
      const pulse = 1 + Math.sin(time * 4.5) * 0.055 * movement;
      hologram.current.scale.setScalar(pulse);
    }

    const blinkPhase = time % 4.6;
    const blink =
      reduceMotion || blinkPhase > 0.16
        ? 0
        : Math.sin((blinkPhase / 0.16) * Math.PI);
    const mouth = speaking
      ? 0.18 + Math.abs(Math.sin(time * 12.5)) * 0.58
      : 0;
    vrm.expressionManager?.setValue("blink", blink);
    vrm.expressionManager?.setValue("aa", mouth);
    vrm.expressionManager?.setValue(
      "happy",
      state === "idle" && !speaking ? 0.12 : 0.03,
    );
    vrm.update(delta);
  });

  return (
    <Float
      speed={reduceMotion ? 0 : 1.15}
      rotationIntensity={reduceMotion ? 0 : 0.02}
      floatIntensity={reduceMotion ? 0 : 0.04}
    >
      <group ref={root} position={[0, -0.93, 0]} scale={1.08}>
        <primitive object={vrm.scene} />

        <group
          ref={hologram}
          position={[-0.72, 1.42, 0.14]}
          rotation={[1.08, 0.08, 0]}
          visible={false}
        >
          {[0.13, 0.2, 0.28].map((radius, index) => (
            <mesh key={radius}>
              <torusGeometry
                args={[radius, index === 2 ? 0.004 : 0.007, 6, 48]}
              />
              <meshBasicMaterial
                color={index === 1 ? colors.primary : colors.secondary}
                transparent
                opacity={0.82 - index * 0.13}
                toneMapped={false}
              />
            </mesh>
          ))}
          <mesh>
            <sphereGeometry args={[0.027, 12, 10]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <pointLight
            color={colors.secondary}
            intensity={1.5}
            distance={0.9}
          />
        </group>
      </group>
    </Float>
  );
};

