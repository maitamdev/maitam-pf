"use client";

import { Html, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import {
  Suspense,
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
type PortalPhase = "warping" | "system";

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
        <sphereGeometry args={[radius, 64, 64]} />
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

const CosmicDust = () => {
  const dust = useRef<Points>(null);
  const reduceMotion = useReducedMotionPreference();
  const positions = useMemo(() => {
    const values = new Float32Array(260 * 3);
    const random = seededRandom(4217);

    for (let index = 0; index < 260; index += 1) {
      const radius = 4 + random() * 15;
      const angle = random() * Math.PI * 2;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = (random() - 0.5) * 8;
      values[index * 3 + 2] = Math.sin(angle) * radius - 4;
    }

    return values;
  }, []);

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

const ResponsiveCamera = ({ active }: { active: boolean }) => {
  const { camera, size } = useThree();
  const reduceMotion = useReducedMotionPreference();
  const cameraRef = camera as PerspectiveCamera;

  useEffect(() => {
    const finalZ = size.width < 768 ? 12.4 : 6.65;
    cameraRef.position.set(0, 0.3, active && !reduceMotion ? finalZ + 4.5 : finalZ);
    cameraRef.lookAt(0, 0, 0);
    cameraRef.updateProjectionMatrix();
  }, [cameraRef, reduceMotion, size.width]);

  useFrame((_state, delta) => {
    if (!active || reduceMotion) return;
    const finalZ = size.width < 768 ? 12.4 : 6.65;
    cameraRef.position.z = THREE.MathUtils.damp(
      cameraRef.position.z,
      finalZ,
      2.7,
      delta,
    );
  });

  return null;
};

const SolarSystemScene = ({
  active,
  onSelect,
}: {
  active: boolean;
  onSelect: (id: DestinationId) => void;
}) => {
  const system = useRef<Group>(null);
  const reduceMotion = useReducedMotionPreference();
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
    if (!system.current || reduceMotion || !active) return;
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
      <fog attach="fog" args={["#03010d", 8, 34]} />
      <ResponsiveCamera active={active} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[4, 5, 5]} intensity={1.2} color="#c7d9ff" />
      <Stars
        radius={70}
        depth={42}
        count={2600}
        factor={4}
        saturation={0.25}
        fade
        speed={reduceMotion ? 0 : 0.35}
      />
      <CosmicDust />

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
        autoRotate={active && !reduceMotion}
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

const PlanetPortraitScene = ({ planet }: { planet: Destination }) => {
  const group = useRef<Group>(null);
  const planetMesh = useRef<Mesh>(null);
  const texture = useTexture(planet.texture) as Texture;
  const reduceMotion = useReducedMotionPreference();

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
        count={1600}
        factor={3.2}
        saturation={0.18}
        fade
        speed={reduceMotion ? 0 : 0.22}
      />

      <group ref={group}>
        <mesh ref={planetMesh}>
          <sphereGeometry args={[2.05, 96, 96]} />
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

const AboutWorld = () => (
  <div className={styles.detailContent}>
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
    </div>
  </div>
);

const SkillsWorld = () => (
  <div className={styles.detailContent}>
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
}: {
  planet: Destination;
  onBack: () => void;
  onSelect: (id: DestinationId) => void;
}) => {
  const content =
    planet.id === "about-me" ? (
      <AboutWorld />
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
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <PlanetPortraitScene planet={planet} />
          </Suspense>
        </Canvas>
        <div className={styles.planetHalo} />
        <p>{planet.name}</p>
      </div>

      <div className={styles.detailPanel}>
        <header className={styles.detailNavigation}>
          <button type="button" onClick={onBack}>
            Close
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

const WarpStreaks = ({ departing }: { departing: boolean }) => {
  const geometry = useRef<THREE.BufferGeometry>(null);
  const chromaGeometry = useRef<THREE.BufferGeometry>(null);
  const reduceMotion = useReducedMotionPreference();
  const streakCount = 440;
  const streakData = useMemo(() => {
    const random = seededRandom(departing ? 9251 : 7307);
    const values = new Float32Array(streakCount * 5);

    for (let index = 0; index < streakCount; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 0.45 + Math.pow(random(), 0.72) * 14;
      values[index * 5] = Math.cos(angle) * radius;
      values[index * 5 + 1] = Math.sin(angle) * radius;
      values[index * 5 + 2] = -4 - random() * 76;
      values[index * 5 + 3] = 15 + random() * 38;
      values[index * 5 + 4] = 0.3 + random() * 1.65;
    }

    return values;
  }, [departing]);
  const positions = useMemo(
    () => new Float32Array(streakCount * 2 * 3),
    [],
  );
  const chromaPositions = useMemo(
    () => new Float32Array(streakCount * 2 * 3),
    [],
  );

  useFrame((_state, delta) => {
    if (!geometry.current || !chromaGeometry.current || reduceMotion) return;

    for (let index = 0; index < streakCount; index += 1) {
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
    <group ref={group} position={[0, 0, -28]}>
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

const WarpScene = ({ departing }: { departing: boolean }) => (
  <>
    <color attach="background" args={["#02000a"]} />
    <fog attach="fog" args={["#08011c", 18, 86]} />
    <WarpCamera departing={departing} />
    <WarpStreaks departing={departing} />
    <PortalCore departing={departing} />
  </>
);

const WarpTunnel = ({ departing }: { departing: boolean }) => {
  const reduceMotion = useReducedMotionPreference();
  const label = departing
    ? "Warping to destination"
    : "Entering the solar system";

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
          <WarpScene departing={departing} />
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

export const GalaxyNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<PortalPhase>("warping");
  const [selectedId, setSelectedId] = useState<DestinationId | null>(null);
  const reduceMotion = useReducedMotionPreference();
  const portalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const selectedPlanet = selectedId
    ? destinations.find((destination) => destination.id === selectedId) ?? null
    : null;

  const clearPortalTimer = () => {
    if (!portalTimer.current) return;
    clearTimeout(portalTimer.current);
    portalTimer.current = null;
  };

  const closePortal = () => {
    clearPortalTimer();
    document.body.style.cursor = "";
    setIsOpen(false);
    setPhase("warping");
    setSelectedId(null);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (selectedId) {
        setSelectedId(null);
        return;
      }
      closePortal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearPortalTimer();
      document.body.style.cursor = "";
    };
  }, [selectedId]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (phase === "system" && !selectedId) closeButton.current?.focus();
  }, [phase, selectedId]);

  const openPortal = () => {
    clearPortalTimer();
    setIsOpen(true);
    setSelectedId(null);

    if (reduceMotion) {
      setPhase("system");
      return;
    }

    setPhase("warping");
    portalTimer.current = setTimeout(
      () => setPhase("system"),
      WARP_DURATION,
    );
  };

  const selectPlanet = (id: DestinationId) => {
    if (phase !== "system") return;
    document.body.style.cursor = "";
    setSelectedId(id);
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
            } ${selectedPlanet ? styles.systemObscured : ""}`}
          >
            <Canvas
              camera={{ position: [0, 0.3, 6.65], fov: 43 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
            >
              <Suspense fallback={<SceneFallback />}>
                <SolarSystemScene
                  active={phase === "system" && !selectedPlanet}
                  onSelect={selectPlanet}
                />
              </Suspense>
            </Canvas>
          </div>

          {phase !== "system" && <WarpTunnel departing={false} />}

          <header
            className={`${styles.navigationHeader} ${
              phase === "system" && !selectedPlanet
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
              selectedPlanet ? styles.closeButtonHidden : ""
            }`}
          >
            Close
          </button>

          {selectedPlanet && phase === "system" && (
            <PlanetDetail
              planet={selectedPlanet}
              onBack={() => setSelectedId(null)}
              onSelect={selectPlanet}
            />
          )}
        </section>
      )}
    </>
  );
};
