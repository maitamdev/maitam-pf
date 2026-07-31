"use client";

/* eslint-disable react-hooks/immutability -- R3F animation updates Three.js objects in place. */

import {
  Float,
  PointMaterial,
  Points,
  type PointsInstancesProps,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as random from "maath/random";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Group, Mesh, Points as PointsType } from "three";

const Nebula = () => {
  const texture = useTexture("/space/nebula-premium.png");
  const mesh = useRef<Mesh>(null);
  const { viewport } = useThree();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((_state, delta) => {
    if (!mesh.current || reduceMotion) return;
    mesh.current.rotation.z += delta * 0.006;
  });

  return (
    <mesh
      ref={mesh}
      position={[0, 0, -2.4]}
      scale={[viewport.width * 2, viewport.height * 2, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.3}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};

const NeonPlanet = () => {
  const planet = useRef<Group>(null);
  const reduceMotion = useReducedMotion();
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!planet.current || reduceMotion) return;

    const targetX = viewport.width * 0.3 + state.pointer.x * 0.08;
    const targetY = viewport.height * 0.14 + state.pointer.y * 0.06;

    planet.current.position.x = THREE.MathUtils.damp(
      planet.current.position.x,
      targetX,
      4,
      delta,
    );
    planet.current.position.y = THREE.MathUtils.damp(
      planet.current.position.y,
      targetY,
      4,
      delta,
    );
    planet.current.rotation.y += delta * 0.12;
    planet.current.rotation.x = THREE.MathUtils.damp(
      planet.current.rotation.x,
      state.pointer.y * 0.14,
      3,
      delta,
    );
  });

  const core = (
    <group
      ref={planet}
      position={[viewport.width * 0.3, viewport.height * 0.14, -0.2]}
    >
      <mesh>
        <sphereGeometry args={[0.34, 48, 48]} />
        <meshStandardMaterial
          color="#090724"
          emissive="#19104a"
          emissiveIntensity={1.2}
          metalness={0.65}
          roughness={0.4}
        />
      </mesh>
      <mesh scale={1.015}>
        <sphereGeometry args={[0.34, 28, 28]} />
        <meshBasicMaterial
          color="#8c6cff"
          transparent
          opacity={0.34}
          wireframe
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[1.06, 0.35, -0.4]}>
        <torusGeometry args={[0.5, 0.005, 8, 100]} />
        <meshBasicMaterial
          color="#72d7ff"
          transparent
          opacity={0.72}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh scale={1.18}>
        <sphereGeometry args={[0.34, 40, 40]} />
        <meshBasicMaterial
          color="#7259ff"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );

  return reduceMotion ? core : <Float speed={1.2} rotationIntensity={0.12}>{core}</Float>;
};

export const StarBackground = (props: PointsInstancesProps) => {
  const stars = useRef<PointsType | null>(null);
  const reduceMotion = useReducedMotion();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(4800), { radius: 1.35 }),
  );

  useFrame((_state, delta) => {
    if (!stars.current || reduceMotion) return;
    stars.current.rotation.x -= delta / 16;
    stars.current.rotation.y -= delta / 22;
  });

  return (
    <>
      <Nebula />
      <NeonPlanet />
      <group rotation={[0, 0, Math.PI / 4]}>
        <Points
          ref={stars}
          stride={3}
          positions={new Float32Array(sphere)}
          frustumCulled
          {...props}
        >
          <PointMaterial
            transparent
            color="#eef3ff"
            size={0.0022}
            sizeAttenuation
            depthWrite={false}
          />
        </Points>
      </group>
    </>
  );
};

export const StarsCanvas = () => (
  <div className="space-backdrop pointer-events-none fixed inset-0 -z-10 h-full w-full">
    <Canvas
      camera={{ position: [0, 0, 1], fov: 75 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[1.4, 1.2, 1]} color="#6ac9ff" intensity={1.3} />
      <pointLight position={[-1.2, -1, 0.5]} color="#8858ff" intensity={0.8} />
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);
