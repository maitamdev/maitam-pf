"use client";

/* eslint-disable react-hooks/immutability -- R3F animation updates Three.js objects in place. */

import {
  PointMaterial,
  Points,
  type PointsInstancesProps,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as random from "maath/random";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Group, Mesh, Points as PointsType } from "three";

import { usePortfolio } from "@/lib/portfolio-context";

const Nebula = () => {
  const texture = useTexture("/space/nebula-premium.png");
  const mesh = useRef<Mesh>(null);
  const { viewport } = useThree();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((state, delta) => {
    if (!mesh.current || reduceMotion) return;
    mesh.current.rotation.z += delta * 0.006;
    mesh.current.position.x = THREE.MathUtils.damp(
      mesh.current.position.x,
      state.pointer.x * 0.09,
      2.4,
      delta,
    );
    mesh.current.position.y = THREE.MathUtils.damp(
      mesh.current.position.y,
      state.pointer.y * 0.055,
      2.4,
      delta,
    );
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

export const StarBackground = ({ count, ...props }: PointsInstancesProps & { count: number }) => {
  const stars = useRef<PointsType | null>(null);
  const field = useRef<Group>(null);
  const reduceMotion = useReducedMotion();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(count * 3), { radius: 1.35 }),
  );

  useFrame((state, delta) => {
    if (!stars.current || reduceMotion) return;
    stars.current.rotation.x -= delta / 16;
    stars.current.rotation.y -= delta / 22;
    if (field.current) {
      field.current.rotation.x = THREE.MathUtils.damp(
        field.current.rotation.x,
        -state.pointer.y * 0.055,
        3.2,
        delta,
      );
      field.current.rotation.y = THREE.MathUtils.damp(
        field.current.rotation.y,
        state.pointer.x * 0.075,
        3.2,
        delta,
      );
    }
  });

  return (
    <>
      <Nebula />
      <group ref={field} rotation={[0, 0, Math.PI / 4]}>
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

export const StarsCanvas = () => {
  const pathname = usePathname();
  const { recruiterMode } = usePortfolio();
  const [visible, setVisible] = useState(true);
  const [quality] = useState(() => {
    if (typeof navigator === "undefined") return "balanced" as const;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const reducedData =
      "connection" in navigator &&
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    return lowPower || reducedData ? ("low" as const) : ("balanced" as const);
  });

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (pathname !== "/" || recruiterMode || !visible) return null;

  return (
    <div className="space-backdrop pointer-events-none fixed inset-0 -z-10 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={quality === "low" ? 1 : [1, 1.35]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[1.4, 1.2, 1]} color="#6ac9ff" intensity={1.3} />
        <pointLight position={[-1.2, -1, 0.5]} color="#8858ff" intensity={0.8} />
        <Suspense fallback={null}>
          <StarBackground count={quality === "low" ? 850 : 1400} />
        </Suspense>
      </Canvas>
    </div>
  );
};
