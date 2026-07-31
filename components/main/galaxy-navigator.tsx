"use client";

/* eslint-disable react-hooks/immutability -- R3F animation updates Three.js objects in place. */

import { Html, Stars, useTexture } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { Group, Mesh, PerspectiveCamera, Points, Texture } from "three";

import {
  BACKEND_SKILL,
  FRONTEND_SKILL,
  FULLSTACK_SKILL,
  LINKS,
  OTHER_SKILL,
  PROJECTS,
  SKILL_DATA,
} from "@/constants";

import styles from "./galaxy-navigator.module.css";

const WARP_DURATION = 2100;
const PLANET_WARP_DURATION = 980;

type GraphicsQuality = "low" | "balanced" | "high";
type PortalPhase = "warping" | "system";

const destinations = [
  {
    id: "about-me",
    name: "Sun",
    section: "About me",
    texture: "/space/planets/sun-surface.webp",
    position: [-0.8, -0.12, 0] as [number, number, number],
    radius: 1.24,
    rotationSpeed: 0.055,
    selfLit: true,
  },
  {
    id: "skills",
    name: "Moon",
    section: "Skills",
    texture: "/space/planets/moon-surface.webp",
    position: [-3.05, 1.55, -0.3] as [number, number, number],
    radius: 0.5,
    rotationSpeed: 0.035,
    selfLit: false,
  },
  {
    id: "experience",
    name: "Jupiter",
    section: "Experience",
    texture: "/space/planets/jupiter-surface.webp",
    position: [2.25, 1.15, -0.4] as [number, number, number],
    radius: 1.02,
    rotationSpeed: 0.085,
    selfLit: false,
  },
  {
    id: "projects",
    name: "Mars",
    section: "Projects",
    texture: "/space/planets/mars-surface.webp",
    position: [2.05, -1.65, 0.2] as [number, number, number],
    radius: 0.64,
    rotationSpeed: 0.045,
    selfLit: false,
  },
] as const;

type DestinationId = (typeof destinations)[number]["id"];
type Destination = (typeof destinations)[number];
type CelestialBodyProps = (typeof destinations)[number] & {
  map: Texture;
  onSelect: (id: DestinationId) => void;
  segments: number;
};

const qualitySettings: Record<
  GraphicsQuality,
  {
    dpr: [number, number];
    stars: number;
    dust: number;
    segments: number;
    streaks: number;
    asteroids: number;
  }
> = {
  low: {
    dpr: [0.75, 1],
    stars: 900,
    dust: 90,
    segments: 32,
    streaks: 150,
    asteroids: 70,
  },
  balanced: {
    dpr: [1, 1.35],
    stars: 1800,
    dust: 180,
    segments: 48,
    streaks: 300,
    asteroids: 130,
  },
  high: {
    dpr: [1, 1.65],
    stars: 3000,
    dust: 280,
    segments: 72,
    streaks: 460,
    asteroids: 220,
  },
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
  segments,
}: CelestialBodyProps) => {
  const body = useRef<Mesh>(null);
  const group = useRef<Group>(null);
  const isHovered = useRef(false);
  const reduceMotion = useReducedMotionPreference();

  useFrame((_state, delta) => {
    if (!body.current || !group.current) return;

    if (!reduceMotion) {
      body.current.rotation.y += delta * rotationSpeed;
    }

    const targetScale = isHovered.current ? 1.09 : 1;
    const nextScale = THREE.MathUtils.damp(
      group.current.scale.x,
      targetScale,
      7,
      delta,
    );
    group.current.scale.setScalar(nextScale);
  });

  const selectBody = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta > 6) return;
    onSelect(id);
  };

  return (
    <group
      ref={group}
      position={position}
      onPointerEnter={() => {
        isHovered.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        isHovered.current = false;
        document.body.style.cursor = "";
      }}
    >
      <mesh ref={body} onClick={selectBody}>
        <sphereGeometry args={[radius, segments, segments]} />
        {selfLit ? (
          <meshStandardMaterial
            map={map}
            emissiveMap={map}
            emissive="#ff7a18"
            emissiveIntensity={1.4}
            roughness={0.62}
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
          <mesh scale={1.12}>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshBasicMaterial
              color="#ff8a2a"
              transparent
              opacity={0.1}
              depthWrite={false}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh scale={1.25}>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshBasicMaterial
              color="#ff5f35"
              transparent
              opacity={0.035}
              depthWrite={false}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color="#ffb15a" intensity={36} distance={11} decay={2} />
        </>
      )}

      <Html
        center
        position={[0, radius + 0.44, 0]}
        distanceFactor={7.5}
        zIndexRange={[80, 40]}
      >
        <button
          type="button"
          onClick={() => onSelect(id)}
          className={styles.planetTrigger}
        >
          <span>{name}</span>
          <small>{section}</small>
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

const CosmicDust = ({ count }: { count: number }) => {
  const dust = useRef<Points>(null);
  const reduceMotion = useReducedMotionPreference();
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    const random = seededRandom(4217);

    for (let index = 0; index < count; index += 1) {
      const radius = 4 + random() * 15;
      const angle = random() * Math.PI * 2;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = (random() - 0.5) * 8;
      values[index * 3 + 2] = Math.sin(angle) * radius - 4;
    }

    return values;
  }, [count]);

  useFrame((_state, delta) => {
    if (!dust.current || reduceMotion) return;
    dust.current.rotation.y += delta * 0.012;
    dust.current.rotation.z -= delta * 0.006;
  });

  return (
    <points ref={dust}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d8ceff"
        size={0.025}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const AsteroidBelt = ({ count }: { count: number }) => {
  const belt = useRef<THREE.InstancedMesh>(null);
  const reduceMotion = useReducedMotionPreference();

  useEffect(() => {
    if (!belt.current) return;
    const random = seededRandom(8192 + count);
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 3.9 + random() * 0.58;
      position.set(
        Math.cos(angle) * radius,
        (random() - 0.5) * 0.28,
        Math.sin(angle) * radius,
      );
      rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
      quaternion.setFromEuler(rotation);
      const size = 0.025 + random() * 0.07;
      scale.set(size * (0.8 + random()), size, size * (0.8 + random()));
      matrix.compose(position, quaternion, scale);
      belt.current.setMatrixAt(index, matrix);
    }
    belt.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame((_state, delta) => {
    if (!belt.current || reduceMotion) return;
    belt.current.rotation.y += delta * 0.025;
    belt.current.rotation.z = 0.12;
  });

  return (
    <instancedMesh ref={belt} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#716886" roughness={0.94} metalness={0.04} />
    </instancedMesh>
  );
};

const SmoothOrbitRig = ({
  active,
  resetSignal,
}: {
  active: boolean;
  resetSignal: number;
}) => {
  const { camera, gl, size } = useThree();
  const reduceMotion = useReducedMotionPreference();
  const current = useRef({ yaw: 0, pitch: 0.045, radius: 6.65 });
  const target = useRef({ yaw: 0, pitch: 0.045, radius: 6.65 });
  const velocity = useRef({ yaw: 0, pitch: 0 });
  const drag = useRef({
    active: false,
    pointerId: -1,
    x: 0,
    y: 0,
  });
  const lastInteraction = useRef(0);
  const initialized = useRef(false);
  const cameraRef = camera as PerspectiveCamera;

  const resetView = useCallback(
    (immediate = false) => {
      const radius = size.width < 768 ? 12.4 : 6.65;
      target.current = { yaw: 0, pitch: 0.045, radius };
      velocity.current = { yaw: 0, pitch: 0 };
      lastInteraction.current = performance.now();

      if (immediate) {
        current.current = { ...target.current };
        cameraRef.position.set(0, Math.sin(0.045) * radius, radius);
        cameraRef.lookAt(0, 0, 0);
      }
    },
    [cameraRef, size.width],
  );

  useEffect(() => {
    resetView(!initialized.current);
    initialized.current = true;
  }, [resetSignal, resetView]);

  useEffect(() => {
    const element = gl.domElement;
    const previousTouchAction = element.style.touchAction;
    const previousCursor = element.style.cursor;
    element.style.touchAction = "none";
    element.style.cursor = "grab";

    const finishDrag = (event?: PointerEvent) => {
      if (!drag.current.active) return;
      if (event && event.pointerId !== drag.current.pointerId) return;
      drag.current.active = false;
      element.style.cursor = "grab";
      if (
        event &&
        element.hasPointerCapture(event.pointerId)
      ) {
        element.releasePointerCapture(event.pointerId);
      }
      lastInteraction.current = performance.now();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!active || event.button !== 0) return;
      drag.current = {
        active: true,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      velocity.current = { yaw: 0, pitch: 0 };
      lastInteraction.current = performance.now();
      element.setPointerCapture(event.pointerId);
      element.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (
        !active ||
        !drag.current.active ||
        event.pointerId !== drag.current.pointerId
      ) {
        return;
      }

      const rawX = event.clientX - drag.current.x;
      const rawY = event.clientY - drag.current.y;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;

      const deltaX = THREE.MathUtils.clamp(rawX, -26, 26);
      const deltaY = THREE.MathUtils.clamp(rawY, -22, 22);
      const yawImpulse = THREE.MathUtils.clamp(-deltaX * 0.0027, -0.045, 0.045);
      const pitchImpulse = THREE.MathUtils.clamp(
        deltaY * 0.00215,
        -0.034,
        0.034,
      );

      target.current.yaw = THREE.MathUtils.clamp(
        target.current.yaw + yawImpulse,
        current.current.yaw - 0.72,
        current.current.yaw + 0.72,
      );
      target.current.pitch = THREE.MathUtils.clamp(
        target.current.pitch + pitchImpulse,
        -0.52,
        0.68,
      );
      velocity.current.yaw = THREE.MathUtils.lerp(
        velocity.current.yaw,
        yawImpulse,
        0.32,
      );
      velocity.current.pitch = THREE.MathUtils.lerp(
        velocity.current.pitch,
        pitchImpulse,
        0.28,
      );
      lastInteraction.current = performance.now();
      event.preventDefault();
    };

    const onWheel = (event: WheelEvent) => {
      if (!active) return;
      target.current.radius = THREE.MathUtils.clamp(
        target.current.radius + event.deltaY * 0.004,
        size.width < 768 ? 9.2 : 5.9,
        size.width < 768 ? 15.2 : 11.5,
      );
      lastInteraction.current = performance.now();
      event.preventDefault();
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", finishDrag);
    element.addEventListener("pointercancel", finishDrag);
    element.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      if (
        drag.current.pointerId >= 0 &&
        element.hasPointerCapture(drag.current.pointerId)
      ) {
        element.releasePointerCapture(drag.current.pointerId);
      }
      drag.current.active = false;
      drag.current.pointerId = -1;
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", finishDrag);
      element.removeEventListener("pointercancel", finishDrag);
      element.removeEventListener("wheel", onWheel);
      element.style.touchAction = previousTouchAction;
      element.style.cursor = previousCursor;
    };
  }, [active, gl, size.width]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!active) return;
      const key = event.key.toLowerCase();
      if (key === "r") {
        resetView();
        return;
      }

      const yawDirection =
        key === "arrowleft" || key === "a"
          ? -1
          : key === "arrowright" || key === "d"
            ? 1
            : 0;
      const pitchDirection =
        key === "arrowup" || key === "w"
          ? -1
          : key === "arrowdown" || key === "s"
            ? 1
            : 0;

      if (!yawDirection && !pitchDirection) return;
      target.current.yaw += yawDirection * 0.16;
      target.current.pitch = THREE.MathUtils.clamp(
        target.current.pitch + pitchDirection * 0.11,
        -0.52,
        0.68,
      );
      velocity.current = { yaw: 0, pitch: 0 };
      lastInteraction.current = performance.now();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, resetView]);

  useFrame((_state, delta) => {
    if (!active) return;

    const safeDelta = Math.min(delta, 1 / 24);
    const idleFor = performance.now() - lastInteraction.current;

    if (!drag.current.active) {
      const decay = Math.exp(-safeDelta * 7.5);
      velocity.current.yaw *= decay;
      velocity.current.pitch *= decay;
      target.current.yaw += velocity.current.yaw * safeDelta * 17;
      target.current.pitch = THREE.MathUtils.clamp(
        target.current.pitch + velocity.current.pitch * safeDelta * 13,
        -0.52,
        0.68,
      );

      if (
        !reduceMotion &&
        idleFor > 2400 &&
        Math.abs(velocity.current.yaw) < 0.0005
      ) {
        target.current.yaw += safeDelta * 0.022;
      }
    }

    current.current.yaw = THREE.MathUtils.damp(
      current.current.yaw,
      target.current.yaw,
      9.5,
      safeDelta,
    );
    current.current.pitch = THREE.MathUtils.damp(
      current.current.pitch,
      target.current.pitch,
      10.5,
      safeDelta,
    );
    current.current.radius = THREE.MathUtils.damp(
      current.current.radius,
      target.current.radius,
      8.5,
      safeDelta,
    );

    const { yaw, pitch, radius } = current.current;
    const horizontalRadius = Math.cos(pitch) * radius;
    cameraRef.position.set(
      Math.sin(yaw) * horizontalRadius,
      Math.sin(pitch) * radius,
      Math.cos(yaw) * horizontalRadius,
    );
    cameraRef.lookAt(0, 0, 0);
    cameraRef.updateMatrixWorld();
  });

  return null;
};

const SolarSystemScene = ({
  active,
  onSelect,
  quality,
  resetViewSignal,
}: {
  active: boolean;
  onSelect: (id: DestinationId) => void;
  quality: GraphicsQuality;
  resetViewSignal: number;
}) => {
  const reduceMotion = useReducedMotionPreference();
  const texturePaths = useMemo(
    () => destinations.map((destination) => destination.texture),
    [],
  );
  const textures = useTexture(texturePaths) as Texture[];
  const settings = qualitySettings[quality];

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
    });
  }, [textures]);

  return (
    <>
      <fog attach="fog" args={["#03010d", 8, 34]} />
      <SmoothOrbitRig active={active} resetSignal={resetViewSignal} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[4, 5, 5]} intensity={1.2} color="#c7d9ff" />
      <Stars
        radius={70}
        depth={42}
        count={settings.stars}
        factor={4}
        saturation={0.25}
        fade
        speed={reduceMotion ? 0 : 0.35}
      />
      <CosmicDust count={settings.dust} />

      <group>
        <OrbitRing radius={2.3} />
        <OrbitRing radius={3.35} />
        <AsteroidBelt count={settings.asteroids} />
        {destinations.map((destination, index) => (
          <CelestialBody
            key={destination.id}
            {...destination}
            map={textures[index]}
            onSelect={onSelect}
            segments={settings.segments}
          />
        ))}
      </group>
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

const skillGroups = [
  {
    name: "Frontend",
    skills: FRONTEND_SKILL.map((skill) => skill.skill_name),
  },
  {
    name: "Backend",
    skills: BACKEND_SKILL.map((skill) => skill.skill_name),
  },
  {
    name: "Product development",
    skills: FULLSTACK_SKILL.map((skill) => skill.skill_name),
  },
  {
    name: "Tools",
    skills: OTHER_SKILL.map((skill) => skill.skill_name),
  },
] as const;

const PlanetPortraitScene = ({
  planet,
  quality,
}: {
  planet: Destination;
  quality: GraphicsQuality;
}) => {
  const group = useRef<Group>(null);
  const planetMesh = useRef<Mesh>(null);
  const texture = useTexture(planet.texture) as Texture;
  const reduceMotion = useReducedMotionPreference();
  const settings = qualitySettings[quality];

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 6;
  }, [texture]);

  useFrame((state, delta) => {
    if (!group.current || !planetMesh.current) return;

    if (!reduceMotion) {
      planetMesh.current.rotation.y += delta * planet.rotationSpeed * 1.8;
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        state.pointer.x * 0.12,
        3,
        delta,
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        -state.pointer.y * 0.08,
        3,
        delta,
      );
    }
  });

  return (
    <>
      <fog attach="fog" args={["#03010d", 8, 26]} />
      <ambientLight intensity={planet.selfLit ? 0.55 : 0.38} />
      <directionalLight
        position={[-4, 4, 6]}
        intensity={planet.selfLit ? 0.5 : 2.6}
        color="#d8e3ff"
      />
      <pointLight
        position={[4, -2, 4]}
        color="#8269c9"
        intensity={9}
        distance={14}
      />
      <Stars
        radius={55}
        depth={28}
        count={Math.max(700, Math.round(settings.stars * 0.64))}
        factor={3.2}
        saturation={0.18}
        fade
        speed={reduceMotion ? 0 : 0.22}
      />

      <group ref={group}>
        <mesh ref={planetMesh}>
          <sphereGeometry
            args={[2.05, Math.max(48, settings.segments), Math.max(48, settings.segments)]}
          />
          {planet.selfLit ? (
            <meshStandardMaterial
              map={texture}
              emissiveMap={texture}
              emissive="#ff792e"
              emissiveIntensity={1.55}
              roughness={0.62}
            />
          ) : (
            <meshStandardMaterial
              map={texture}
              roughness={planet.name === "Jupiter" ? 0.76 : 0.94}
              metalness={0.01}
            />
          )}
        </mesh>

        {planet.selfLit && (
          <>
            <mesh scale={1.09}>
              <sphereGeometry args={[2.05, 64, 64]} />
              <meshBasicMaterial
                color="#ff8f42"
                transparent
                opacity={0.1}
                depthWrite={false}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <mesh scale={1.2}>
              <sphereGeometry args={[2.05, 64, 64]} />
              <meshBasicMaterial
                color="#ff5f35"
                transparent
                opacity={0.035}
                depthWrite={false}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight color="#ffad5c" intensity={30} distance={15} decay={2} />
          </>
        )}
      </group>
    </>
  );
};

const AboutWorld = ({ onContact }: { onContact: () => void }) => (
  <div className={styles.detailContent}>
    <p className={styles.eyebrow}>Identity file 01</p>
    <h3>Mai Tran Thien Tam</h3>
    <p className={styles.detailLead}>
      MaiTamDev is a final-year Software Engineering student building practical
      web, mobile and AI-powered products.
    </p>

    <dl className={styles.factGrid}>
      <div>
        <dt>University</dt>
        <dd>Hung Vuong University</dd>
      </div>
      <div>
        <dt>Major</dt>
        <dd>Software Engineering</dd>
      </div>
      <div>
        <dt>Current stage</dt>
        <dd>Final-year student</dd>
      </div>
      <div>
        <dt>Focus</dt>
        <dd>Full-stack product development</dd>
      </div>
    </dl>

    <div className={styles.detailActions}>
      <a href={LINKS.github} target="_blank" rel="noreferrer noopener">
        GitHub
      </a>
      <a href={LINKS.email}>Email me</a>
      <a href="/Mai-Tran-Thien-Tam-Resume.md" download>
        Download resume
      </a>
      <button type="button" onClick={onContact}>
        Start a conversation
      </button>
    </div>
  </div>
);

const SkillsWorld = () => (
  <div className={styles.detailContent}>
    <p className={styles.eyebrow}>Capability archive 02</p>
    <h3>Skills and technologies</h3>
    <p className={styles.detailLead}>
      A full-stack toolkit for building production-ready web, mobile and
      AI-powered software.
    </p>

    <div className={styles.coreSkills}>
      {SKILL_DATA.map((skill) => (
        <div key={skill.skill_name}>
          <Image
            src={`/skills/${skill.image}`}
            alt=""
            aria-hidden="true"
            width={skill.width}
            height={skill.height}
            unoptimized
          />
          <span>{skill.skill_name}</span>
        </div>
      ))}
    </div>

    <div className={styles.skillGroups}>
      {skillGroups.map((group) => (
        <section key={group.name}>
          <h4>{group.name}</h4>
          <p>{group.skills.join(", ")}</p>
        </section>
      ))}
    </div>
  </div>
);

const ExperienceWorld = () => (
  <div className={styles.detailContent}>
    <p className={styles.eyebrow}>Mission record 03</p>
    <h3>FullStack Developer</h3>
    <p className={styles.detailLead}>
      Professional full-stack development experience at Valley Campus.
    </p>

    <div className={styles.experienceBlock}>
      <div>
        <h4>Valley Campus</h4>
        <p>Jan 2025 - Feb 2026</p>
      </div>
      <p>Full-stack development using Odoo.</p>
      <dl>
        <div>
          <dt>Role</dt>
          <dd>FullStack Developer</dd>
        </div>
        <div>
          <dt>Technology</dt>
          <dd>Odoo</dd>
        </div>
      </dl>
    </div>
  </div>
);

const ProjectsWorld = () => (
  <div className={styles.detailContent}>
    <p className={styles.eyebrow}>Launch archive 04</p>
    <h3>Selected projects</h3>
    <p className={styles.detailLead}>
      Four products spanning AI, retail, education and developer tools.
    </p>

    <div className={styles.projectGrid}>
      {PROJECTS.map((project) => (
        <article key={project.title}>
          <Image
            src={project.image}
            alt={`${project.title} interface`}
            width={720}
            height={360}
            unoptimized
          />
          <div>
            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <nav aria-label={`${project.title} links`}>
              <a href={project.link} target="_blank" rel="noreferrer noopener">
                View live
              </a>
              <a href={project.source} target="_blank" rel="noreferrer noopener">
                Source
              </a>
            </nav>
          </div>
        </article>
      ))}
    </div>
  </div>
);

const PlanetDetail = ({
  planet,
  onBack,
  onSelect,
  onContact,
  onShare,
  quality,
  tourActive,
  onNextTour,
}: {
  planet: Destination;
  onBack: () => void;
  onSelect: (id: DestinationId) => void;
  onContact: () => void;
  onShare: () => void;
  quality: GraphicsQuality;
  tourActive: boolean;
  onNextTour: () => void;
}) => {
  const content =
    planet.id === "about-me" ? (
      <AboutWorld onContact={onContact} />
    ) : planet.id === "skills" ? (
      <SkillsWorld />
    ) : planet.id === "experience" ? (
      <ExperienceWorld />
    ) : (
      <ProjectsWorld />
    );

  return (
    <section
      key={planet.id}
      className={styles.planetDetail}
      aria-labelledby={`planet-detail-${planet.id}`}
    >
      <div className={styles.planetPortrait} aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 6.4], fov: 43 }}
          dpr={qualitySettings[quality].dpr}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <PlanetPortraitScene planet={planet} quality={quality} />
          </Suspense>
        </Canvas>
        <div className={styles.planetHalo} />
        <p>{planet.name}</p>
      </div>

      <div className={styles.detailPanel}>
        <header className={styles.detailNavigation}>
          <button type="button" onClick={onShare}>
            Copy link
          </button>
          {tourActive && (
            <button type="button" onClick={onNextTour}>
              {planet.id === destinations.at(-1)?.id
                ? "Finish tour"
                : "Next stop"}
            </button>
          )}
          <button type="button" onClick={onBack}>
            Back to solar system
          </button>
        </header>

        <div id={`planet-detail-${planet.id}`}>{content}</div>

        <nav className={styles.worldSwitcher} aria-label="Explore another world">
          {destinations.map((destination) => (
            <button
              key={destination.id}
              type="button"
              aria-current={
                destination.id === planet.id ? "page" : undefined
              }
              onClick={() => onSelect(destination.id)}
            >
              <span>{destination.name}</span>
              <small>{destination.section}</small>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
};

const seededRandom = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

const WarpStreaks = ({
  departing,
  count,
}: {
  departing: boolean;
  count: number;
}) => {
  const geometry = useRef<THREE.BufferGeometry>(null);
  const chromaGeometry = useRef<THREE.BufferGeometry>(null);
  const reduceMotion = useReducedMotionPreference();
  const streakData = useMemo(() => {
    const random = seededRandom((departing ? 9251 : 7307) + count);
    const values = new Float32Array(count * 5);

    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 0.45 + Math.pow(random(), 0.72) * 14;
      values[index * 5] = Math.cos(angle) * radius;
      values[index * 5 + 1] = Math.sin(angle) * radius;
      values[index * 5 + 2] = -4 - random() * 76;
      values[index * 5 + 3] = 15 + random() * 38;
      values[index * 5 + 4] = 0.3 + random() * 1.65;
    }

    return values;
  }, [count, departing]);
  const positions = useMemo(
    () => new Float32Array(count * 2 * 3),
    [count],
  );
  const chromaPositions = useMemo(
    () => new Float32Array(count * 2 * 3),
    [count],
  );

  useFrame((_state, delta) => {
    if (!geometry.current || !chromaGeometry.current || reduceMotion) return;

    for (let index = 0; index < count; index += 1) {
      const dataIndex = index * 5;
      const positionIndex = index * 6;
      const speed = streakData[dataIndex + 3] * (departing ? 1.45 : 1);
      let z = streakData[dataIndex + 2] + delta * speed;

      if (z > 4) {
        z = -76;
      }

      streakData[dataIndex + 2] = z;
      const depthFactor = THREE.MathUtils.clamp((z + 76) / 80, 0, 1);
      const stretch = streakData[dataIndex + 4] * (0.35 + depthFactor * 5.8);
      const x = streakData[dataIndex] * (0.72 + depthFactor * 0.5);
      const y = streakData[dataIndex + 1] * (0.72 + depthFactor * 0.5);

      positions[positionIndex] = x;
      positions[positionIndex + 1] = y;
      positions[positionIndex + 2] = z;
      positions[positionIndex + 3] = x;
      positions[positionIndex + 4] = y;
      positions[positionIndex + 5] = z - stretch;

      chromaPositions[positionIndex] = x + 0.045 * depthFactor;
      chromaPositions[positionIndex + 1] = y - 0.025 * depthFactor;
      chromaPositions[positionIndex + 2] = z + 0.02;
      chromaPositions[positionIndex + 3] = x + 0.045 * depthFactor;
      chromaPositions[positionIndex + 4] = y - 0.025 * depthFactor;
      chromaPositions[positionIndex + 5] = z - stretch;
    }

    geometry.current.attributes.position.needsUpdate = true;
    chromaGeometry.current.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry ref={geometry}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#efeaff"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments>
        <bufferGeometry ref={chromaGeometry}>
          <bufferAttribute
            attach="attributes-position"
            args={[chromaPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#6edcff"
          transparent
          opacity={0.36}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
};

const AccretionDisk = ({ departing }: { departing: boolean }) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const reduceMotion = useReducedMotionPreference();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDirection: { value: departing ? -1 : 1 },
    }),
    [departing],
  );

  useFrame((_state, delta) => {
    if (!material.current || reduceMotion) return;
    material.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[0, 0, -28]}>
      <ringGeometry args={[2.28, 5.4, 160, 8]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uDirection;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          void main() {
            vec2 p = vUv - 0.5;
            float radius = length(p) * 2.0;
            float angle = atan(p.y, p.x);
            float spin = angle * 8.0 - uTime * 4.6 * uDirection;
            float turbulence = sin(spin + radius * 25.0);
            turbulence += sin(spin * 0.47 - radius * 46.0) * 0.45;
            turbulence += (hash(floor(vUv * 96.0 + uTime)) - 0.5) * 0.18;
            float edge = smoothstep(0.02, 0.19, vUv.y) * smoothstep(0.98, 0.72, vUv.y);
            float intensity = max(0.0, 0.56 + turbulence * 0.34) * edge;
            vec3 violet = vec3(0.36, 0.12, 1.0);
            vec3 whiteHot = vec3(1.0, 0.82, 0.96);
            vec3 color = mix(violet, whiteHot, smoothstep(0.35, 1.0, intensity));
            gl_FragColor = vec4(color, intensity * 0.78);
          }
        `}
      />
    </mesh>
  );
};

const PortalCore = ({ departing }: { departing: boolean }) => {
  const group = useRef<Group>(null);
  const outerRing = useRef<Mesh>(null);
  const innerRing = useRef<Mesh>(null);
  const reduceMotion = useReducedMotionPreference();

  useFrame((state, delta) => {
    if (!group.current || !outerRing.current || !innerRing.current || reduceMotion)
      return;

    const elapsed = state.clock.getElapsedTime();
    group.current.rotation.z += delta * (departing ? -1.8 : 1.15);
    outerRing.current.rotation.x = Math.sin(elapsed * 1.8) * 0.34;
    outerRing.current.rotation.y += delta * 0.85;
    innerRing.current.rotation.x -= delta * 1.4;
    innerRing.current.rotation.y += delta * 1.1;
    const pulse = 1 + Math.sin(elapsed * 7) * 0.045;
    group.current.scale.setScalar(pulse);
  });

  return (
    <>
      <AccretionDisk departing={departing} />
      <group ref={group} position={[0, 0, -27.98]}>
        <mesh>
          <sphereGeometry args={[2.15, 48, 48]} />
          <meshBasicMaterial color="#010006" />
        </mesh>
        <mesh ref={outerRing}>
          <torusGeometry args={[3.25, 0.14, 20, 140]} />
          <meshBasicMaterial
            color="#aa82ff"
            transparent
            opacity={0.62}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={innerRing}>
          <torusGeometry args={[2.62, 0.07, 16, 120]} />
          <meshBasicMaterial
            color="#f0eaff"
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <pointLight color="#8b5cff" intensity={24} distance={26} decay={2} />
      </group>
    </>
  );
};

const WarpCamera = ({ departing }: { departing: boolean }) => {
  const { camera } = useThree();
  const reduceMotion = useReducedMotionPreference();
  const perspectiveCamera = camera as PerspectiveCamera;
  const elapsed = useRef(0);

  useFrame((_state, delta) => {
    if (reduceMotion) return;
    elapsed.current += delta;
    const progress = THREE.MathUtils.clamp(
      elapsed.current / (departing ? 0.92 : 2.1),
      0,
      1,
    );
    const acceleration = progress * progress;

    perspectiveCamera.fov = 58 + acceleration * 30;
    perspectiveCamera.rotation.z =
      Math.sin(elapsed.current * 5.2) * 0.012 +
      acceleration * (departing ? -0.16 : 0.12);
    perspectiveCamera.position.x =
      Math.sin(elapsed.current * 21) * acceleration * 0.035;
    perspectiveCamera.position.y =
      Math.cos(elapsed.current * 18) * acceleration * 0.028;
    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
};

const WarpScene = ({
  departing,
  quality,
}: {
  departing: boolean;
  quality: GraphicsQuality;
}) => (
  <>
    <color attach="background" args={["#02000a"]} />
    <fog attach="fog" args={["#08011c", 18, 86]} />
    <WarpCamera departing={departing} />
    <WarpStreaks
      departing={departing}
      count={qualitySettings[quality].streaks}
    />
    <PortalCore departing={departing} />
  </>
);

const WarpTunnel = ({
  departing,
  quality,
  label: customLabel,
}: {
  departing: boolean;
  quality: GraphicsQuality;
  label?: string;
}) => {
  const reduceMotion = useReducedMotionPreference();
  const label =
    customLabel ??
    (departing ? "Warping to destination" : "Entering the solar system");

  if (reduceMotion) {
    return (
      <div className={styles.reducedWarp}>
        <div className={styles.reducedCore} />
        <p>{label}</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.warpLayer} ${
        departing ? styles.departing : styles.arriving
      }`}
      aria-live="polite"
    >
      <div className={styles.warpCanvas}>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 58 }}
          dpr={[1, 1.35]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <WarpScene departing={departing} quality={quality} />
        </Canvas>
      </div>
      <div className={styles.chromaticA} aria-hidden="true" />
      <div className={styles.chromaticB} aria-hidden="true" />
      <div className={styles.bloom} aria-hidden="true" />
      <div className={styles.shockwave} aria-hidden="true" />
      <div className={styles.shockwaveSecond} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.flash} aria-hidden="true" />
      <p className={styles.warpLabel}>{label}</p>
    </div>
  );
};

const useReducedMotionPreference = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
};

const useCosmicAudio = () => {
  const [enabled, setEnabled] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const ambient = useRef<{
    oscillator: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const getContext = useCallback(() => {
    if (!context.current) {
      context.current = new AudioContext();
    }
    return context.current;
  }, []);

  const stopAmbient = useCallback(() => {
    if (!ambient.current) return;
    const now = ambient.current.gain.context.currentTime;
    ambient.current.gain.gain.cancelScheduledValues(now);
    ambient.current.gain.gain.linearRampToValueAtTime(0, now + 0.22);
    ambient.current.oscillator.stop(now + 0.24);
    ambient.current = null;
  }, []);

  const startAmbient = useCallback(async () => {
    const audio = getContext();
    await audio.resume();
    if (ambient.current) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 47;
    gain.gain.value = 0;
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    gain.gain.linearRampToValueAtTime(0.018, audio.currentTime + 0.7);
    ambient.current = { oscillator, gain };
  }, [getContext]);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      if (next) {
        void startAmbient();
      } else {
        stopAmbient();
      }
      return next;
    });
  }, [startAmbient, stopAmbient]);

  const playWarp = useCallback(() => {
    if (!enabled) return;
    const audio = getContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(84, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      780,
      audio.currentTime + 0.68,
    );
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.055, audio.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.75);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.78);
  }, [enabled, getContext]);

  useEffect(
    () => () => {
      stopAmbient();
      void context.current?.close();
    },
    [stopAmbient],
  );

  return { enabled, toggle, playWarp };
};

const MissionProgress = ({
  visited,
  onSelect,
}: {
  visited: Set<DestinationId>;
  onSelect: (id: DestinationId) => void;
}) => (
  <aside className={styles.missionProgress} aria-label="Exploration progress">
    <p>
      Mission log
      <span>
        {visited.size} of {destinations.length}
      </span>
    </p>
    <div>
      {destinations.map((destination, index) => (
        <button
          key={destination.id}
          type="button"
          data-visited={visited.has(destination.id)}
          onClick={() => onSelect(destination.id)}
          aria-label={`Open ${destination.name}: ${destination.section}`}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {destination.name}
        </button>
      ))}
    </div>
  </aside>
);

type CommandAction = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

const CommandPalette = ({
  open,
  onClose,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  actions: CommandAction[];
}) => {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => {
      setQuery("");
      input.current?.focus();
    }, 20);
  }, [open]);

  if (!open) return null;

  const filtered = actions.filter((action) =>
    `${action.label} ${action.hint}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className={styles.overlayShade} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.commandPalette}
        role="dialog"
        aria-modal="true"
        aria-label="Career Universe command palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <label htmlFor="universe-command">Jump anywhere</label>
        <input
          ref={input}
          id="universe-command"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search worlds and actions"
          autoComplete="off"
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
            if (event.key === "Enter" && filtered[0]) {
              filtered[0].run();
              onClose();
            }
          }}
        />
        <div className={styles.commandResults}>
          {filtered.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                action.run();
                onClose();
              }}
            >
              <span>{action.label}</span>
              <small>{action.hint}</small>
            </button>
          ))}
          {filtered.length === 0 && <p>No command found.</p>}
        </div>
        <footer>Press Enter to launch the first result</footer>
      </section>
    </div>
  );
};

const ContactPanel = ({ onClose }: { onClose: () => void }) => {
  const [sent, setSent] = useState(false);

  return (
    <div className={styles.overlayShade} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.contactPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <p>Ground control</p>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>
        <h2 id="contact-title">Start a conversation</h2>
        <p>
          Tell me what you are building. This opens your email app with the
          message ready to send.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const name = String(form.get("name") ?? "");
            const email = String(form.get("email") ?? "");
            const message = String(form.get("message") ?? "");
            const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
            const body = encodeURIComponent(
              `Name: ${name}\nEmail: ${email}\n\n${message}`,
            );
            setSent(true);
            window.location.href = `mailto:maitamdev@gmail.com?subject=${subject}&body=${body}`;
          }}
        >
          <label>
            Your name
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            Your email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Project or message
            <textarea name="message" required rows={5} />
          </label>
          <button type="submit">Prepare email</button>
          {sent && <p role="status">Your email app should now be open.</p>}
        </form>
      </section>
    </div>
  );
};

export const GalaxyNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<PortalPhase>("warping");
  const [selectedId, setSelectedId] = useState<DestinationId | null>(null);
  const [travelTarget, setTravelTarget] = useState<DestinationId | null>(null);
  const [visited, setVisited] = useState<Set<DestinationId>>(() => {
    if (typeof window === "undefined") return new Set<DestinationId>();
    try {
      const saved = JSON.parse(
        window.localStorage.getItem("career-universe-visited") ?? "[]",
      ) as DestinationId[];
      return new Set(
        saved.filter((id) =>
          destinations.some((destination) => destination.id === id),
        ),
      );
    } catch {
      return new Set<DestinationId>();
    }
  });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [quality, setQuality] = useState<GraphicsQuality>(() => {
    if (typeof window === "undefined") return "balanced";
    const saved = window.localStorage.getItem("career-universe-quality");
    if (saved === "low" || saved === "balanced" || saved === "high") {
      return saved;
    }
    return (navigator.hardwareConcurrency ?? 8) <= 4 ? "low" : "balanced";
  });
  const [resetViewSignal, setResetViewSignal] = useState(0);
  const [toast, setToast] = useState("");
  const reduceMotion = useReducedMotionPreference();
  const audio = useCosmicAudio();
  const portalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const travelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const selectedPlanet = selectedId
    ? destinations.find((destination) => destination.id === selectedId) ?? null
    : null;
  const targetPlanet = travelTarget
    ? destinations.find((destination) => destination.id === travelTarget) ?? null
    : null;

  const clearPortalTimer = () => {
    if (!portalTimer.current) return;
    clearTimeout(portalTimer.current);
    portalTimer.current = null;
  };

  const clearTravelTimer = () => {
    if (!travelTimer.current) return;
    clearTimeout(travelTimer.current);
    travelTimer.current = null;
  };

  const updateDeepLink = useCallback((id: DestinationId | null) => {
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set("world", id);
    } else {
      url.searchParams.delete("world");
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const markVisited = useCallback((id: DestinationId) => {
    setVisited((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }, []);

  const closePortal = useCallback(() => {
    clearPortalTimer();
    clearTravelTimer();
    document.body.style.cursor = "";
    setIsOpen(false);
    setPhase("warping");
    setSelectedId(null);
    setTravelTarget(null);
    setPaletteOpen(false);
    setContactOpen(false);
    setTourActive(false);
    setFocusMode(false);
    updateDeepLink(null);
  }, [updateDeepLink]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (phase === "system" && !selectedId && !travelTarget) {
      closeButton.current?.focus();
    }
  }, [phase, selectedId, travelTarget]);

  useEffect(() => {
    const world = new URL(window.location.href).searchParams.get(
      "world",
    ) as DestinationId | null;
    if (world && destinations.some((destination) => destination.id === world)) {
      window.setTimeout(() => {
        setIsOpen(true);
        setPhase("system");
        setSelectedId(world);
        markVisited(world);
      }, 0);
    }
  }, [markVisited]);

  useEffect(() => {
    window.localStorage.setItem(
      "career-universe-visited",
      JSON.stringify(Array.from(visited)),
    );
  }, [visited]);

  const openPortal = useCallback(() => {
    clearPortalTimer();
    clearTravelTimer();
    setIsOpen(true);
    setSelectedId(null);
    setTravelTarget(null);
    updateDeepLink(null);
    audio.playWarp();

    if (reduceMotion) {
      setPhase("system");
      return;
    }

    setPhase("warping");
    portalTimer.current = setTimeout(
      () => setPhase("system"),
      WARP_DURATION,
    );
  }, [audio, reduceMotion, updateDeepLink]);

  const selectPlanet = useCallback(
    (id: DestinationId) => {
      if (phase !== "system" || travelTarget || selectedId === id) return;
      clearTravelTimer();
      document.body.style.cursor = "";
      audio.playWarp();
      setSelectedId(null);

      const arrive = () => {
        setTravelTarget(null);
        setSelectedId(id);
        markVisited(id);
        updateDeepLink(id);
      };

      if (reduceMotion) {
        arrive();
        return;
      }

      setTravelTarget(id);
      travelTimer.current = setTimeout(arrive, PLANET_WARP_DURATION);
    },
    [
      audio,
      markVisited,
      phase,
      reduceMotion,
      selectedId,
      travelTarget,
      updateDeepLink,
    ],
  );

  const backToSystem = useCallback(() => {
    clearTravelTimer();
    setTravelTarget(null);
    setSelectedId(null);
    setTourActive(false);
    updateDeepLink(null);
  }, [updateDeepLink]);

  const startTour = useCallback(() => {
    setTourActive(true);
    selectPlanet(destinations[0].id);
  }, [selectPlanet]);

  const nextTourStop = useCallback(() => {
    if (!selectedId) return;
    const index = destinations.findIndex(
      (destination) => destination.id === selectedId,
    );
    const next = destinations[index + 1];
    if (!next) {
      setTourActive(false);
      setSelectedId(null);
      updateDeepLink(null);
      showToast("Tour complete. All four worlds are now unlocked.");
      return;
    }
    selectPlanet(next.id);
  }, [selectedId, selectPlanet, showToast, updateDeepLink]);

  const cycleQuality = useCallback(() => {
    setQuality((current) => {
      const next =
        current === "low" ? "balanced" : current === "balanced" ? "high" : "low";
      window.localStorage.setItem("career-universe-quality", next);
      showToast(`Graphics quality: ${next}`);
      return next;
    });
  }, [showToast]);

  const resetUniverseView = useCallback(() => {
    setResetViewSignal((current) => current + 1);
    showToast("Camera returned to the launch view.");
  }, [showToast]);

  const shareWorld = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("World link copied.");
    } catch {
      showToast("Copy the current address to share this world.");
    }
  }, [showToast]);

  const commandActions = useMemo<CommandAction[]>(
    () => [
      {
        id: "solar-map",
        label: "Solar system",
        hint: "Return to the four-world map",
        run: backToSystem,
      },
      ...destinations.map((destination) => ({
        id: destination.id,
        label: `${destination.name}: ${destination.section}`,
        hint: `Warp to ${destination.name}`,
        run: () => selectPlanet(destination.id),
      })),
      {
        id: "guided-tour",
        label: "Start guided tour",
        hint: "Visit every world in order",
        run: startTour,
      },
      {
        id: "contact",
        label: "Contact MaiTamDev",
        hint: "Open ground control",
        run: () => setContactOpen(true),
      },
      {
        id: "sound",
        label: audio.enabled ? "Turn sound off" : "Turn sound on",
        hint: "Toggle the ambient audio layer",
        run: audio.toggle,
      },
      {
        id: "quality",
        label: "Cycle graphics quality",
        hint: `Current setting: ${quality}`,
        run: cycleQuality,
      },
      {
        id: "reset-view",
        label: "Reset universe view",
        hint: "Center the camera and clear momentum",
        run: resetUniverseView,
      },
      {
        id: "focus-mode",
        label: focusMode ? "Exit focus mode" : "Enter focus mode",
        hint: "Show only the universe",
        run: () => setFocusMode((current) => !current),
      },
    ],
    [
      audio.enabled,
      audio.toggle,
      backToSystem,
      cycleQuality,
      focusMode,
      quality,
      resetUniverseView,
      selectPlanet,
      startTour,
    ],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) setPaletteOpen((current) => !current);
        return;
      }

      if (!isOpen) return;

      if (event.key === "Escape") {
        if (paletteOpen) {
          setPaletteOpen(false);
        } else if (contactOpen) {
          setContactOpen(false);
        } else if (focusMode) {
          setFocusMode(false);
        } else if (selectedId) {
          backToSystem();
        } else if (!travelTarget) {
          closePortal();
        }
        return;
      }

      if (
        selectedId &&
        !paletteOpen &&
        !contactOpen &&
        (event.key === "ArrowRight" || event.key === "ArrowLeft")
      ) {
        const currentIndex = destinations.findIndex(
          (destination) => destination.id === selectedId,
        );
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex =
          (currentIndex + direction + destinations.length) %
          destinations.length;
        selectPlanet(destinations[nextIndex].id);
      }

      if (
        !selectedId &&
        !paletteOpen &&
        !contactOpen &&
        event.key.toLowerCase() === "h"
      ) {
        setFocusMode((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    backToSystem,
    closePortal,
    contactOpen,
    focusMode,
    isOpen,
    paletteOpen,
    selectPlanet,
    selectedId,
    travelTarget,
  ]);

  useEffect(
    () => () => {
      clearPortalTimer();
      clearTravelTimer();
      if (toastTimer.current) clearTimeout(toastTimer.current);
      document.body.style.cursor = "";
    },
    [],
  );

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

      {isOpen && (
        <section
          id="solar-navigation"
          role="dialog"
          aria-modal="true"
          aria-labelledby="solar-navigation-title"
          className={styles.portal}
        >
          <div
            className={`${styles.systemLayer} ${
              phase === "system" ? styles.systemVisible : ""
            } ${selectedPlanet || travelTarget ? styles.systemObscured : ""}`}
          >
            <Canvas
              camera={{ position: [0, 0.3, 6.65], fov: 43 }}
              dpr={qualitySettings[quality].dpr}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
            >
              <Suspense fallback={<SceneFallback />}>
                <SolarSystemScene
                  active={
                    phase === "system" && !selectedPlanet && !travelTarget
                  }
                  onSelect={selectPlanet}
                  quality={quality}
                  resetViewSignal={resetViewSignal}
                />
              </Suspense>
            </Canvas>
          </div>

          {phase !== "system" && (
            <WarpTunnel departing={false} quality={quality} />
          )}
          {targetPlanet && (
            <WarpTunnel
              departing
              quality={quality}
              label={`Approaching ${targetPlanet.name}`}
            />
          )}

          <header
            className={`${styles.navigationHeader} ${
              phase === "system" &&
              !selectedPlanet &&
              !travelTarget &&
              !focusMode
                ? styles.navigationHeaderVisible
                : ""
            }`}
          >
            <h2 id="solar-navigation-title">Explore my universe</h2>
            <p>Choose a world to open its story.</p>
          </header>

          <button
            ref={closeButton}
            type="button"
            onClick={closePortal}
            className={`${styles.closeButton} ${
              selectedPlanet || travelTarget || focusMode
                ? styles.closeButtonHidden
                : ""
            }`}
          >
            Close
          </button>

          {phase === "system" &&
            !selectedPlanet &&
            !travelTarget &&
            !focusMode && (
            <>
              <p className={styles.interactionHint}>
                <span aria-hidden="true" />
                Drag to orbit
                <small>Scroll to zoom / Press R to reset</small>
              </p>
              <MissionProgress visited={visited} onSelect={selectPlanet} />
              <nav className={styles.universeToolbar} aria-label="Universe tools">
                <button type="button" onClick={startTour}>
                  Guided tour
                </button>
                <button type="button" onClick={() => setPaletteOpen(true)}>
                  Commands <kbd>Ctrl K</kbd>
                </button>
                <button type="button" onClick={audio.toggle}>
                  Sound {audio.enabled ? "on" : "off"}
                </button>
                <button type="button" onClick={cycleQuality}>
                  Graphics {quality}
                </button>
                <button type="button" onClick={resetUniverseView}>
                  Reset view
                </button>
                <button type="button" onClick={() => setFocusMode(true)}>
                  Focus mode
                </button>
                <button type="button" onClick={() => setContactOpen(true)}>
                  Contact
                </button>
              </nav>
            </>
          )}

          {phase === "system" &&
            !selectedPlanet &&
            !travelTarget &&
            focusMode && (
              <button
                type="button"
                className={styles.focusExit}
                onClick={() => setFocusMode(false)}
              >
                Exit focus <kbd>H</kbd>
              </button>
            )}

          {selectedPlanet && phase === "system" && (
            <PlanetDetail
              planet={selectedPlanet}
              onBack={backToSystem}
              onSelect={selectPlanet}
              onContact={() => setContactOpen(true)}
              onShare={() => void shareWorld()}
              quality={quality}
              tourActive={tourActive}
              onNextTour={nextTourStop}
            />
          )}

          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            actions={commandActions}
          />
          {contactOpen && (
            <ContactPanel onClose={() => setContactOpen(false)} />
          )}
          {toast && (
            <p className={styles.toast} role="status">
              {toast}
            </p>
          )}
        </section>
      )}
    </>
  );
};
