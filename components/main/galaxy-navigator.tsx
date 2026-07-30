"use client";

import { Html, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { Group, Mesh, Texture } from "three";

const destinations = [
  {
    id: "about-me",
    name: "Sun",
    section: "About me",
    texture: "/space/planets/sun-surface.webp",
    position: [-0.65, -0.15, 0] as [number, number, number],
    radius: 1.05,
    rotationSpeed: 0.055,
    selfLit: true,
  },
  {
    id: "skills",
    name: "Moon",
    section: "Skills",
    texture: "/space/planets/moon-surface.webp",
    position: [-2.65, 1.22, -0.3] as [number, number, number],
    radius: 0.43,
    rotationSpeed: 0.035,
    selfLit: false,
  },
  {
    id: "experience",
    name: "Jupiter",
    section: "Experience",
    texture: "/space/planets/jupiter-surface.webp",
    position: [2.35, 0.74, -0.4] as [number, number, number],
    radius: 0.86,
    rotationSpeed: 0.085,
    selfLit: false,
  },
  {
    id: "projects",
    name: "Mars",
    section: "Projects",
    texture: "/space/planets/mars-surface.webp",
    position: [1.2, -1.46, 0.2] as [number, number, number],
    radius: 0.53,
    rotationSpeed: 0.045,
    selfLit: false,
  },
] as const;

type DestinationId = (typeof destinations)[number]["id"];
type PortalPhase = "warping" | "system" | "departing";

type CelestialBodyProps = (typeof destinations)[number] & {
  map: Texture;
  onSelect: (id: DestinationId) => void;
};

const CelestialBody = ({
  id,
  name,
  section,
  position,
  radius,
  rotationSpeed,
  selfLit,
  map,
  onSelect,
}: CelestialBodyProps) => {
  const body = useRef<Mesh>(null);
  const reduceMotion = useReducedMotion();

  useFrame((_state, delta) => {
    if (!body.current || reduceMotion) return;
    body.current.rotation.y += delta * rotationSpeed;
  });

  const selectBody = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <group position={position}>
      <mesh ref={body} onClick={selectBody}>
        <sphereGeometry args={[radius, 64, 64]} />
        {selfLit ? (
          <meshStandardMaterial
            map={map}
            emissiveMap={map}
            emissive="#ff7a18"
            emissiveIntensity={1.25}
            roughness={0.68}
          />
        ) : (
          <meshStandardMaterial
            map={map}
            roughness={name === "Jupiter" ? 0.78 : 0.92}
            metalness={0.02}
          />
        )}
      </mesh>

      {selfLit && (
        <>
          <mesh scale={1.13}>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshBasicMaterial
              color="#ff8a2a"
              transparent
              opacity={0.08}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color="#ffb15a" intensity={32} distance={10} decay={2} />
        </>
      )}

      <Html
        center
        position={[0, radius + 0.48, 0]}
        distanceFactor={7.5}
        zIndexRange={[80, 40]}
      >
        <button
          type="button"
          onClick={() => onSelect(id)}
          className="group min-w-28 rounded-xl border border-white/15 bg-[#09051d]/80 px-3 py-2 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_30px_rgba(4,1,18,0.45)] backdrop-blur-md transition hover:border-[#b49bff] hover:bg-[#160b35]/90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7ceff]"
        >
          <span className="block text-sm font-semibold">{name}</span>
          <span className="mt-0.5 block text-[11px] text-gray-300 transition group-hover:text-white">
            {section}
          </span>
        </button>
      </Html>
    </group>
  );
};

const OrbitRing = ({ radius }: { radius: number }) => (
  <mesh rotation={[Math.PI / 2.22, 0.16, 0]}>
    <torusGeometry args={[radius, 0.006, 6, 160]} />
    <meshBasicMaterial
      color="#8f7dca"
      transparent
      opacity={0.2}
      depthWrite={false}
    />
  </mesh>
);

const ResponsiveCamera = () => {
  const { camera, size } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.3, size.width < 768 ? 11.8 : 8.4);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
};

const SolarSystemScene = ({
  onSelect,
}: {
  onSelect: (id: DestinationId) => void;
}) => {
  const system = useRef<Group>(null);
  const reduceMotion = useReducedMotion();
  const texturePaths = useMemo(
    () => destinations.map((destination) => destination.texture),
    [],
  );
  const textures = useTexture(texturePaths) as Texture[];

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
    });
  }, [textures]);

  useFrame((state, delta) => {
    if (!system.current || reduceMotion) return;
    system.current.rotation.y = THREE.MathUtils.damp(
      system.current.rotation.y,
      state.pointer.x * 0.08,
      2.4,
      delta,
    );
    system.current.rotation.x = THREE.MathUtils.damp(
      system.current.rotation.x,
      -state.pointer.y * 0.04,
      2.4,
      delta,
    );
  });

  return (
    <>
      <ResponsiveCamera />
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 5, 5]} intensity={1.1} color="#c7d9ff" />
      <Stars
        radius={70}
        depth={42}
        count={2200}
        factor={4}
        saturation={0.25}
        fade
        speed={reduceMotion ? 0 : 0.35}
      />

      <group ref={system}>
        <OrbitRing radius={2.3} />
        <OrbitRing radius={3.35} />
        {destinations.map((destination, index) => (
          <CelestialBody
            key={destination.id}
            {...destination}
            map={textures[index]}
            onSelect={onSelect}
          />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={6.5}
        maxDistance={12}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.18}
        dampingFactor={0.06}
        enableDamping
      />
    </>
  );
};

const SceneFallback = () => (
  <Html center>
    <div className="whitespace-nowrap text-sm text-[#c8baff]">
      Loading solar system
    </div>
  </Html>
);

const WarpTunnel = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pointer-events-none absolute inset-0 z-30 overflow-hidden bg-[#050116]"
  >
    <motion.div
      animate={{ scale: [0.55, 1.45, 2.8], opacity: [0.3, 1, 0.12] }}
      transition={{ duration: 1.12, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ddd5ff] bg-[#6d44d8]/30 shadow-[0_0_100px_rgba(128,84,255,0.9)]"
    />
    {Array.from({ length: 28 }).map((_, index) => (
      <span
        key={index}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-px w-[14vw] origin-left"
        style={{ transform: `rotate(${index * (360 / 28)}deg) translateX(42px)` }}
      >
        <motion.span
          animate={{ scaleX: [0.05, 1.5, 7], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.05,
            delay: (index % 7) * 0.035,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="block h-px w-full origin-left bg-gradient-to-r from-white via-[#a98dff] to-transparent"
        />
      </span>
    ))}
    <div className="absolute inset-x-0 bottom-16 text-center text-sm font-medium tracking-[0.14em] text-[#ddd5ff]">
      {label}
    </div>
  </motion.div>
);

export const GalaxyNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<PortalPhase>("warping");
  const reduceMotion = useReducedMotion();
  const portalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPortalTimer = () => {
    if (!portalTimer.current) return;
    clearTimeout(portalTimer.current);
    portalTimer.current = null;
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearPortalTimer();
    };
  }, []);

  const openPortal = () => {
    clearPortalTimer();
    setIsOpen(true);

    if (reduceMotion) {
      setPhase("system");
      return;
    }

    setPhase("warping");
    portalTimer.current = setTimeout(() => setPhase("system"), 1120);
  };

  const travelTo = (id: DestinationId) => {
    if (phase !== "system") return;

    const target = document.getElementById(id);
    if (!target) return;

    if (reduceMotion) {
      setIsOpen(false);
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    setPhase("departing");
    clearPortalTimer();
    portalTimer.current = setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
      setPhase("warping");
    }, 760);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Enter the black hole"
        aria-expanded={isOpen}
        aria-controls="solar-navigation"
        onClick={openPortal}
        className="absolute left-1/2 top-0 z-30 h-[180px] w-[min(64vw,680px)] -translate-x-1/2 cursor-pointer rounded-b-[48%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b49bff]"
      >
        <span className="sr-only">Enter the black hole</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="solar-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="solar-navigation-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
            className="fixed inset-0 z-[70] min-h-[100dvh] overflow-hidden bg-[#03010d] text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.76 }}
              animate={{
                opacity: phase === "system" ? 1 : 0.28,
                scale: phase === "system" ? 1 : 0.76,
              }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Canvas
                camera={{ position: [0, 0.3, 8.4], fov: 47 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, powerPreference: "high-performance" }}
              >
                <Suspense fallback={<SceneFallback />}>
                  <SolarSystemScene onSelect={travelTo} />
                </Suspense>
              </Canvas>
            </motion.div>

            <AnimatePresence>
              {phase !== "system" && (
                <WarpTunnel
                  label={phase === "warping" ? "ENTERING THE SOLAR SYSTEM" : "WARPING TO DESTINATION"}
                />
              )}
            </AnimatePresence>

            <motion.header
              animate={{ opacity: phase === "system" ? 1 : 0, y: phase === "system" ? 0 : -12 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute inset-x-0 top-0 z-20 p-5 text-center sm:p-7"
            >
              <h2 id="solar-navigation-title" className="text-xl font-semibold sm:text-2xl">
                Solar navigation
              </h2>
              <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                Drag to explore. Select a world to continue.
              </p>
            </motion.header>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 z-40 rounded-full border border-white/20 bg-[#09051d]/75 px-4 py-2 text-sm text-gray-100 backdrop-blur-md transition hover:border-[#b49bff] hover:text-white active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7ceff] sm:right-7 sm:top-7"
            >
              Close
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};
