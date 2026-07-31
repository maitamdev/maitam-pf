"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ArrowUpIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MicrophoneIcon,
  MinusIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  SparklesIcon,
  StopIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";

import { LINKS } from "@/constants";
import {
  type OrbitAction,
  type OrbitMessage,
  type OrbitResponse,
} from "@/lib/orbit-agent";
import { usePortfolio } from "@/lib/portfolio-context";

import styles from "./orbit-guide.module.css";

type AgentState = "idle" | "listening" | "thinking" | "guiding";

type SpeechRecognitionResultLike = {
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  results: {
    0: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const stateColors: Record<AgentState, { primary: string; secondary: string }> = {
  idle: { primary: "#9f7aea", secondary: "#8bdcff" },
  listening: { primary: "#65e7ff", secondary: "#c6fbff" },
  thinking: { primary: "#b98aff", secondary: "#ffb4f5" },
  guiding: { primary: "#8bdcff", secondary: "#c9ffea" },
};

const AgentCharacter = ({
  state,
  speaking,
  cursor,
}: {
  state: AgentState;
  speaking: boolean;
  cursor: MutableRefObject<{ x: number; y: number }>;
}) => {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const coatLeft = useRef<THREE.Mesh>(null);
  const coatRight = useRef<THREE.Mesh>(null);
  const hologram = useRef<THREE.Group>(null);
  const shoulderFins = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const eyeLight = useRef<THREE.PointLight>(null);
  const reduceMotion = useReducedMotion();
  const colors = stateColors[state];

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const safeDelta = Math.min(delta, 1 / 30);
    if (!root.current || !head.current) return;

    const energy = state === "thinking" ? 1.8 : state === "guiding" ? 1.45 : 1;
    root.current.position.y = reduceMotion
      ? 0
      : Math.sin(time * 1.55) * 0.035 * energy;
    root.current.rotation.z = THREE.MathUtils.damp(
      root.current.rotation.z,
      state === "guiding" ? -0.08 : Math.sin(time * 0.55) * 0.012,
      5,
      safeDelta,
    );

    head.current.rotation.y = THREE.MathUtils.damp(
      head.current.rotation.y,
      cursor.current.x * 0.22,
      6,
      safeDelta,
    );
    head.current.rotation.x = THREE.MathUtils.damp(
      head.current.rotation.x,
      -cursor.current.y * 0.11,
      6,
      safeDelta,
    );

    const stride =
      state === "guiding" && !reduceMotion ? Math.sin(time * 7.2) * 0.34 : 0;
    if (leftArm.current && rightArm.current) {
      leftArm.current.rotation.x = THREE.MathUtils.damp(
        leftArm.current.rotation.x,
        stride * 0.55,
        12,
        safeDelta,
      );
      rightArm.current.rotation.x = THREE.MathUtils.damp(
        rightArm.current.rotation.x,
        -stride,
        12,
        safeDelta,
      );
    }
    if (leftLeg.current && rightLeg.current) {
      leftLeg.current.rotation.x = THREE.MathUtils.damp(
        leftLeg.current.rotation.x,
        -stride,
        12,
        safeDelta,
      );
      rightLeg.current.rotation.x = THREE.MathUtils.damp(
        rightLeg.current.rotation.x,
        stride,
        12,
        safeDelta,
      );
    }
    if (coatLeft.current && coatRight.current && !reduceMotion) {
      const coatSwing =
        Math.sin(time * (state === "guiding" ? 5.5 : 1.25)) *
        (state === "guiding" ? 0.14 : 0.025);
      coatLeft.current.rotation.z = -0.1 + coatSwing;
      coatRight.current.rotation.z = 0.1 - coatSwing;
    }
    if (hologram.current && !reduceMotion) {
      hologram.current.rotation.z +=
        safeDelta * (state === "thinking" ? 2.8 : state === "listening" ? 1.8 : 0.45);
      const pulse =
        state === "listening"
          ? 1 + Math.sin(time * 5.5) * 0.1
          : state === "thinking"
            ? 1 + Math.sin(time * 3.2) * 0.05
            : 1;
      hologram.current.scale.setScalar(pulse);
    }
    if (shoulderFins.current && !reduceMotion) {
      shoulderFins.current.position.y = Math.sin(time * 1.7) * 0.035;
      shoulderFins.current.rotation.y = Math.sin(time * 0.85) * 0.16;
    }
    if (mouth.current) {
      const mouthPulse = speaking ? 0.65 + Math.abs(Math.sin(time * 14)) * 1.25 : 0.4;
      mouth.current.scale.y = THREE.MathUtils.damp(
        mouth.current.scale.y,
        mouthPulse,
        18,
        safeDelta,
      );
    }
    if (eyeLight.current) {
      eyeLight.current.intensity = speaking
        ? 1.8 + Math.abs(Math.sin(time * 11)) * 1.4
        : state === "thinking"
          ? 3.4
          : 1.8;
    }
  });

  return (
    <Float
      speed={reduceMotion ? 0 : 1.25}
      rotationIntensity={reduceMotion ? 0 : 0.025}
      floatIntensity={reduceMotion ? 0 : 0.08}
    >
      <group ref={root} scale={0.86} position={[0, -0.05, 0]}>
        <group ref={head} position={[0, 1.35, 0]}>
          <mesh scale={[0.82, 1, 0.76]}>
            <sphereGeometry args={[0.42, 32, 24]} />
            <meshPhysicalMaterial
              color="#d7cbd3"
              roughness={0.58}
              metalness={0.02}
              clearcoat={0.18}
            />
          </mesh>

          <mesh position={[0, 0.14, -0.08]} scale={[0.93, 1.02, 0.82]}>
            <sphereGeometry args={[0.43, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <meshStandardMaterial color="#dbe5ff" metalness={0.38} roughness={0.3} />
          </mesh>
          {[
            [-0.27, 0.31, 0.04, -0.48],
            [-0.1, 0.39, 0.08, -0.2],
            [0.08, 0.38, 0.06, 0.12],
            [0.26, 0.28, 0.02, 0.46],
            [-0.36, 0.15, -0.04, -0.74],
            [0.35, 0.13, -0.04, 0.72],
          ].map(([x, y, z, rz], index) => (
            <mesh
              key={index}
              position={[x, y, z]}
              rotation={[0.12, 0, rz]}
              scale={[0.9, 1.2, 0.55]}
            >
              <coneGeometry args={[0.13, 0.5, 5]} />
              <meshStandardMaterial
                color={index % 2 ? "#c4d2f2" : "#e7edff"}
                metalness={0.42}
                roughness={0.28}
              />
            </mesh>
          ))}

          <mesh position={[-0.145, 0.02, 0.34]} scale={[1.35, 0.48, 0.45]}>
            <sphereGeometry args={[0.055, 20, 12]} />
            <meshBasicMaterial color={colors.secondary} toneMapped={false} />
          </mesh>
          <mesh position={[0.145, 0.02, 0.34]} scale={[1.35, 0.48, 0.45]}>
            <sphereGeometry args={[0.055, 20, 12]} />
            <meshBasicMaterial color={colors.secondary} toneMapped={false} />
          </mesh>
          <mesh position={[-0.145, 0.095, 0.347]} rotation={[0, 0, -0.06]}>
            <boxGeometry args={[0.16, 0.018, 0.012]} />
            <meshBasicMaterial color="#7b6985" />
          </mesh>
          <mesh position={[0.145, 0.095, 0.347]} rotation={[0, 0, 0.06]}>
            <boxGeometry args={[0.16, 0.018, 0.012]} />
            <meshBasicMaterial color="#7b6985" />
          </mesh>
          <mesh ref={mouth} position={[0, -0.18, 0.36]} scale={[1, 0.4, 1]}>
            <capsuleGeometry args={[0.018, 0.09, 4, 10]} />
            <meshBasicMaterial color={colors.primary} toneMapped={false} />
          </mesh>
          <pointLight
            ref={eyeLight}
            position={[0, 0.02, 0.55]}
            color={colors.secondary}
            intensity={1.8}
            distance={1.8}
          />
        </group>

        <mesh position={[0, 0.9, -0.02]}>
          <cylinderGeometry args={[0.12, 0.14, 0.24, 16]} />
          <meshStandardMaterial color="#cdbfc9" roughness={0.62} />
        </mesh>

        <mesh position={[0, 0.37, 0]} scale={[1, 1, 0.55]}>
          <cylinderGeometry args={[0.38, 0.5, 1.02, 7]} />
          <meshPhysicalMaterial
            color="#0a1021"
            metalness={0.58}
            roughness={0.27}
            clearcoat={0.72}
          />
        </mesh>
        <mesh position={[-0.19, 0.72, 0.23]} rotation={[0, 0, -0.36]}>
          <boxGeometry args={[0.14, 0.54, 0.06]} />
          <meshStandardMaterial color="#202945" metalness={0.66} roughness={0.2} />
        </mesh>
        <mesh position={[0.19, 0.72, 0.23]} rotation={[0, 0, 0.36]}>
          <boxGeometry args={[0.14, 0.54, 0.06]} />
          <meshStandardMaterial color="#202945" metalness={0.66} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.5, 0.34]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color={colors.secondary} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.5, 0.354]}>
          <ringGeometry args={[0.17, 0.215, 8]} />
          <meshBasicMaterial
            color={colors.primary}
            transparent
            opacity={0.86}
            toneMapped={false}
          />
        </mesh>

        <group ref={shoulderFins} position={[0, 0.72, -0.06]}>
          <mesh position={[-0.66, 0.06, 0]} rotation={[0.15, 0.15, -0.2]}>
            <tetrahedronGeometry args={[0.24, 0]} />
            <meshPhysicalMaterial
              color="#6e5de5"
              emissive={colors.primary}
              emissiveIntensity={0.55}
              transparent
              opacity={0.72}
              metalness={0.25}
              roughness={0.18}
            />
          </mesh>
          <mesh position={[0.66, 0.06, 0]} rotation={[0.15, -0.15, 0.2]}>
            <tetrahedronGeometry args={[0.24, 0]} />
            <meshPhysicalMaterial
              color="#6e5de5"
              emissive={colors.primary}
              emissiveIntensity={0.55}
              transparent
              opacity={0.72}
              metalness={0.25}
              roughness={0.18}
            />
          </mesh>
        </group>

        <group ref={leftArm} position={[-0.46, 0.69, 0]} rotation={[0, 0, -0.63]}>
          <mesh position={[0, -0.35, 0]}>
            <capsuleGeometry args={[0.105, 0.5, 8, 14]} />
            <meshStandardMaterial color="#11182d" metalness={0.52} roughness={0.3} />
          </mesh>
          <group position={[0, -0.69, 0]} rotation={[0, 0, -0.72]}>
            <mesh position={[0, -0.3, 0]}>
              <capsuleGeometry args={[0.09, 0.43, 8, 14]} />
              <meshStandardMaterial color="#19223a" metalness={0.48} roughness={0.28} />
            </mesh>
            <mesh position={[0, -0.6, 0.02]} scale={[0.72, 1, 0.55]}>
              <sphereGeometry args={[0.14, 16, 12]} />
              <meshStandardMaterial color="#cdbfc9" roughness={0.6} />
            </mesh>
          </group>
        </group>

        <group ref={rightArm} position={[0.46, 0.69, 0]} rotation={[0, 0, 0.13]}>
          <mesh position={[0, -0.38, 0]}>
            <capsuleGeometry args={[0.105, 0.54, 8, 14]} />
            <meshStandardMaterial color="#11182d" metalness={0.52} roughness={0.3} />
          </mesh>
          <mesh position={[0.04, -0.94, 0]}>
            <capsuleGeometry args={[0.09, 0.42, 8, 14]} />
            <meshStandardMaterial color="#19223a" metalness={0.48} roughness={0.28} />
          </mesh>
          <mesh position={[0.05, -1.27, 0.02]} scale={[0.72, 1, 0.55]}>
            <sphereGeometry args={[0.14, 16, 12]} />
            <meshStandardMaterial color="#cdbfc9" roughness={0.6} />
          </mesh>
        </group>

        <group ref={hologram} position={[-1.15, 1.15, 0.16]} rotation={[1.05, 0.2, 0]}>
          {[0.23, 0.34, 0.46].map((radius, index) => (
            <mesh key={radius} rotation={[0, 0, index * 0.38]}>
              <torusGeometry args={[radius, index === 2 ? 0.008 : 0.012, 6, 48]} />
              <meshBasicMaterial
                color={index === 1 ? colors.primary : colors.secondary}
                transparent
                opacity={0.72 - index * 0.12}
                toneMapped={false}
              />
            </mesh>
          ))}
          {[0, 1.7, 3.35].map((rotation) => (
            <mesh key={rotation} rotation={[0, 0, rotation]}>
              <boxGeometry args={[0.86, 0.008, 0.008]} />
              <meshBasicMaterial color={colors.secondary} transparent opacity={0.45} />
            </mesh>
          ))}
          <mesh>
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>

        <mesh
          ref={coatLeft}
          position={[-0.24, -0.32, -0.12]}
          rotation={[0, 0, -0.1]}
          scale={[1, 1, 0.45]}
        >
          <coneGeometry args={[0.38, 1.9, 4]} />
          <meshPhysicalMaterial
            color="#10172d"
            metalness={0.36}
            roughness={0.3}
            transparent
            opacity={0.92}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh
          ref={coatRight}
          position={[0.24, -0.32, -0.12]}
          rotation={[0, 0, 0.1]}
          scale={[1, 1, 0.45]}
        >
          <coneGeometry args={[0.38, 1.9, 4]} />
          <meshPhysicalMaterial
            color="#17152e"
            emissive="#32236c"
            emissiveIntensity={0.12}
            metalness={0.36}
            roughness={0.3}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>

        <group ref={leftLeg} position={[-0.2, -0.2, 0]}>
          <mesh position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.14, 0.82, 8, 14]} />
            <meshStandardMaterial color="#090f20" metalness={0.48} roughness={0.32} />
          </mesh>
          <mesh position={[0, -1.25, 0.015]}>
            <capsuleGeometry args={[0.125, 0.62, 8, 14]} />
            <meshStandardMaterial color="#111a30" metalness={0.6} roughness={0.24} />
          </mesh>
          <RoundedBox
            args={[0.3, 0.24, 0.5]}
            radius={0.06}
            smoothness={3}
            position={[0, -1.67, 0.1]}
          >
            <meshStandardMaterial color="#111a30" metalness={0.7} roughness={0.2} />
          </RoundedBox>
        </group>
        <group ref={rightLeg} position={[0.2, -0.2, 0]}>
          <mesh position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.14, 0.82, 8, 14]} />
            <meshStandardMaterial color="#090f20" metalness={0.48} roughness={0.32} />
          </mesh>
          <mesh position={[0, -1.25, 0.015]}>
            <capsuleGeometry args={[0.125, 0.62, 8, 14]} />
            <meshStandardMaterial color="#111a30" metalness={0.6} roughness={0.24} />
          </mesh>
          <RoundedBox
            args={[0.3, 0.24, 0.5]}
            radius={0.06}
            smoothness={3}
            position={[0, -1.67, 0.1]}
          >
            <meshStandardMaterial color="#111a30" metalness={0.7} roughness={0.2} />
          </RoundedBox>
        </group>

        <pointLight
          position={[0, 0.48, 0.72]}
          color={colors.secondary}
          intensity={3.5}
          distance={3.2}
        />
      </group>
    </Float>
  );
};

const AgentViewport = ({
  state,
  speaking,
  cursor,
}: {
  state: AgentState;
  speaking: boolean;
  cursor: MutableRefObject<{ x: number; y: number }>;
}) => (
  <Canvas
    camera={{ position: [0, 0.08, 5.35], fov: 31 }}
    dpr={[1, 1.5]}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
  >
    <ambientLight intensity={0.55} />
    <directionalLight position={[3, 4, 5]} intensity={2.8} color="#d8e6ff" />
    <directionalLight position={[-4, 1, 2]} intensity={1.6} color="#7868ff" />
    <AgentCharacter state={state} speaking={speaking} cursor={cursor} />
  </Canvas>
);

const getGreeting = (vi: boolean) =>
  vi
    ? "Chào bạn, mình là M.A.I — trợ lý 3D của Mai Tâm. Mình có thể giới thiệu, trả lời câu hỏi và dẫn bạn đi xem portfolio."
    : "Hi, I’m M.A.I — Mai Tam’s 3D guide. I can introduce his work, answer questions and guide you through the portfolio.";

const subscribeToClient = () => () => {};

export const OrbitGuide = () => {
  const { language, setLanguage, setRecruiterMode, track } = usePortfolio();
  const vi = language === "vi";
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [mode, setMode] = useState<"groq" | "demo">("demo");
  const [flightOffset, setFlightOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<OrbitMessage[]>(() => [
    { role: "assistant", content: getGreeting(language === "vi") },
  ]);
  const cursor = useRef({ x: 0, y: 0 });
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const micSupported =
    isClient &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    const pointerMove = (event: PointerEvent) => {
      cursor.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", pointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", pointerMove);
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, pending, reduceMotion]);

  useEffect(
    () => () => {
      if (returnTimer.current) clearTimeout(returnTimer.current);
      recognition.current?.stop();
      window.speechSynthesis?.cancel();
    },
    [],
  );

  const returnHome = useCallback((delay = 2200) => {
    if (returnTimer.current) clearTimeout(returnTimer.current);
    returnTimer.current = setTimeout(() => {
      setFlightOffset({ x: 0, y: 0 });
      setAgentState("idle");
    }, delay);
  }, []);

  const flyNear = useCallback(
    (element: Element | null) => {
      if (!element || reduceMotion) return;
      const rect = element.getBoundingClientRect();
      const homeX = window.innerWidth - 94;
      const homeY = window.innerHeight - 170;
      const targetX = Math.min(
        window.innerWidth - 90,
        Math.max(90, rect.left + Math.min(rect.width * 0.82, rect.width - 30)),
      );
      const targetY = Math.min(
        window.innerHeight - 120,
        Math.max(110, rect.top + Math.min(110, rect.height * 0.3)),
      );
      setFlightOffset({ x: targetX - homeX, y: targetY - homeY });
    },
    [reduceMotion],
  );

  const speak = useCallback(
    (text: string, keepGuiding = false) => {
      if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) {
        if (!keepGuiding) setAgentState("idle");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = vi ? "vi-VN" : "en-US";
      utterance.rate = vi ? 1.02 : 1;
      utterance.pitch = 1.06;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((voice) =>
        voice.lang.toLowerCase().startsWith(vi ? "vi" : "en"),
      );
      if (preferred) utterance.voice = preferred;
      utterance.onstart = () => {
        setSpeaking(true);
        if (!keepGuiding) setAgentState("idle");
      };
      utterance.onend = () => {
        setSpeaking(false);
        if (!keepGuiding) setAgentState("idle");
      };
      utterance.onerror = () => {
        setSpeaking(false);
        if (!keepGuiding) setAgentState("idle");
      };
      window.speechSynthesis.speak(utterance);
    },
    [vi, voiceEnabled],
  );

  const executeAction = useCallback(
    (action: OrbitAction) => {
      if (action.type === "none") return false;
      setAgentState("guiding");
      track(`orbit-${action.type}`);

      if (action.type === "open_world") {
        setOpen(false);
        setFlightOffset({
          x: reduceMotion ? 0 : -Math.min(window.innerWidth * 0.28, 430),
          y: reduceMotion ? 0 : -Math.min(window.innerHeight * 0.28, 250),
        });
        window.dispatchEvent(
          new CustomEvent("maitam-ai-open-world", {
            detail: { world: action.world },
          }),
        );
        returnHome(3600);
        return true;
      }

      if (action.type === "scroll_to") {
        const target = document.getElementById(action.section);
        target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        flyNear(target);
        returnHome();
        return true;
      }

      if (action.type === "open_project") {
        setFlightOffset({
          x: reduceMotion ? 0 : -Math.min(window.innerWidth * 0.32, 520),
          y: reduceMotion ? 0 : -120,
        });
        window.setTimeout(
          () => window.location.assign(`/projects/${action.slug}`),
          reduceMotion ? 0 : 1300,
        );
        return true;
      }

      if (action.type === "recruiter_mode") {
        setRecruiterMode(action.enabled);
        window.setTimeout(() => flyNear(document.querySelector("main")), 100);
        returnHome();
        return true;
      }

      if (action.type === "download_cv") {
        const anchor = document.createElement("a");
        anchor.href = LINKS.cv;
        anchor.download = "Mai-Tran-Thien-Tam-CV.pdf";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        returnHome(1200);
        return true;
      }

      if (action.type === "switch_language") {
        setLanguage(action.language);
        returnHome(1000);
        return true;
      }

      window.location.href = LINKS.email;
      returnHome(1000);
      return true;
    },
    [
      flyNear,
      reduceMotion,
      returnHome,
      setLanguage,
      setRecruiterMode,
      track,
    ],
  );

  const submitPrompt = useCallback(
    async (rawPrompt: string) => {
      const prompt = rawPrompt.trim();
      if (!prompt || pending) return;
      const userMessage: OrbitMessage = { role: "user", content: prompt };
      const nextMessages = [...messages, userMessage].slice(-10);
      setMessages(nextMessages);
      setInput("");
      setPending(true);
      setAgentState("thinking");
      track("orbit-message");

      try {
        const response = await fetch("/api/orbit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages, language }),
        });
        if (!response.ok) throw new Error("Orbit request failed");
        const result = (await response.json()) as OrbitResponse;
        setMode(result.mode);
        setMessages((current) => [
          ...current,
          { role: "assistant", content: result.message },
        ]);
        const guiding = executeAction(result.action);
        speak(result.message, guiding);
        if (!guiding) setAgentState("idle");
      } catch {
        const fallback = vi
          ? "Mình đang mất kết nối tạm thời. Bạn vẫn có thể hỏi về dự án, kỹ năng, kinh nghiệm hoặc CV."
          : "I’m temporarily offline. You can still ask about projects, skills, experience or the CV.";
        setMessages((current) => [
          ...current,
          { role: "assistant", content: fallback },
        ]);
        setAgentState("idle");
      } finally {
        setPending(false);
      }
    },
    [
      executeAction,
      language,
      messages,
      pending,
      speak,
      track,
      vi,
    ],
  );

  const startListening = useCallback(() => {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const instance = new Recognition();
    recognition.current = instance;
    instance.lang = vi ? "vi-VN" : "en-US";
    instance.continuous = false;
    instance.interimResults = false;
    instance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      void submitPrompt(transcript);
    };
    instance.onerror = () => {
      setListening(false);
      setAgentState("idle");
    };
    instance.onend = () => {
      setListening(false);
      setAgentState("idle");
    };
    setListening(true);
    setAgentState("listening");
    instance.start();
  }, [listening, submitPrompt, vi]);

  const quickPrompts = useMemo(
    () =>
      vi
        ? [
            "Giới thiệu về Mai Tâm",
            "Mở dự án tốt nhất",
            "Cho xem kinh nghiệm",
            "Tải CV",
          ]
        : [
            "Introduce Mai Tam",
            "Open the best project",
            "Show experience",
            "Download CV",
          ],
    [vi],
  );

  const openGuide = () => {
    setMessages((current) =>
      current.length === 1 && current[0]?.role === "assistant"
        ? [{ role: "assistant", content: getGreeting(vi) }]
        : current,
    );
    setOpen(true);
    setMinimized(false);
    track("orbit-open");
    if (!sessionStorage.getItem("orbit-introduced")) {
      sessionStorage.setItem("orbit-introduced", "true");
      speak(getGreeting(vi));
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setAgentState("idle");
  };

  const toggleVoice = () => {
    setVoiceEnabled((current) => {
      if (current) stopSpeaking();
      return !current;
    });
  };

  const closeGuide = () => {
    recognition.current?.stop();
    window.speechSynthesis?.cancel();
    setListening(false);
    setSpeaking(false);
    setAgentState("idle");
    setOpen(false);
  };

  return (
    <>
      <motion.button
        type="button"
        className={styles.agent}
        aria-label={vi ? "Mở trợ lý AI M.A.I" : "Open M.A.I assistant"}
        aria-expanded={open}
        animate={{
          x: flightOffset.x,
          y: flightOffset.y,
          scale: agentState === "thinking" ? 1.04 : 1,
        }}
        transition={{
          x: { type: "spring", stiffness: 72, damping: 18, mass: 0.8 },
          y: { type: "spring", stiffness: 72, damping: 18, mass: 0.8 },
          scale: { duration: 0.2 },
        }}
        onClick={openGuide}
      >
        <span className={styles.agentCanvas} aria-hidden="true">
          <AgentViewport state={agentState} speaking={speaking} cursor={cursor} />
        </span>
        <span className={styles.agentLabel}>
          <i data-state={agentState} />
          {agentState === "listening"
            ? vi
              ? "Đang nghe"
              : "Listening"
            : agentState === "thinking"
              ? vi
                ? "Đang suy nghĩ"
                : "Thinking"
              : agentState === "guiding"
                ? vi
                  ? "Đi theo mình"
                  : "Follow me"
                : "M.A.I"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && !minimized && (
          <motion.section
            className={styles.panel}
            role="dialog"
            aria-modal="false"
            aria-labelledby="orbit-guide-title"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
          >
            <header className={styles.panelHeader}>
              <div>
                <span className={styles.guideMark}>
                  <SparklesIcon aria-hidden="true" />
                </span>
                <span>
                  <strong id="orbit-guide-title">M.A.I // ORBIT GUIDE</strong>
                  <small>
                    <i data-online={mode === "groq"} />
                    {mode === "groq"
                      ? vi
                        ? "Groq đang hoạt động"
                        : "Groq online"
                      : vi
                        ? "Chế độ demo"
                        : "Demo mode"}
                  </small>
                </span>
              </div>
              <nav aria-label={vi ? "Điều khiển trợ lý" : "Assistant controls"}>
                <button
                  type="button"
                  onClick={toggleVoice}
                  aria-label={
                    voiceEnabled
                      ? vi
                        ? "Tắt giọng nói"
                        : "Mute voice"
                      : vi
                        ? "Bật giọng nói"
                        : "Enable voice"
                  }
                >
                  {voiceEnabled ? <SpeakerWaveIcon /> : <SpeakerXMarkIcon />}
                </button>
                {speaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    aria-label={vi ? "Dừng nói" : "Stop speaking"}
                  >
                    <StopIcon />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMinimized(true)}
                  aria-label={vi ? "Thu nhỏ" : "Minimize"}
                >
                  <MinusIcon />
                </button>
                <button
                  type="button"
                  onClick={closeGuide}
                  aria-label={vi ? "Đóng" : "Close"}
                >
                  <XMarkIcon />
                </button>
              </nav>
            </header>

            <div className={styles.messages} aria-live="polite">
              {messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  data-role={message.role}
                >
                  {message.role === "assistant" && (
                    <SparklesIcon aria-hidden="true" />
                  )}
                  <p>{message.content}</p>
                </article>
              ))}
              {pending && (
                <article data-role="assistant" data-thinking="true">
                  <SparklesIcon aria-hidden="true" />
                  <p>
                    <span />
                    <span />
                    <span />
                  </p>
                </article>
              )}
              <div ref={messagesEnd} />
            </div>

            <div className={styles.quickPrompts}>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={pending}
                  onClick={() => void submitPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className={styles.composer}
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                void submitPrompt(input);
              }}
            >
              <button
                type="button"
                data-listening={listening}
                disabled={!micSupported || pending}
                onClick={startListening}
                aria-label={
                  micSupported
                    ? listening
                      ? vi
                        ? "Dừng nghe"
                        : "Stop listening"
                      : vi
                        ? "Nói với M.A.I"
                        : "Talk to M.A.I"
                    : vi
                      ? "Trình duyệt không hỗ trợ nhận giọng nói"
                      : "Speech recognition is unavailable"
                }
              >
                {listening ? <StopIcon /> : <MicrophoneIcon />}
              </button>
              <label htmlFor="orbit-message" className="sr-only">
                {vi ? "Nhắn cho M.A.I" : "Message M.A.I"}
              </label>
              <input
                id="orbit-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  vi ? "Hỏi về Mai Tâm hoặc portfolio..." : "Ask about Mai Tam or the portfolio..."
                }
                disabled={pending}
                maxLength={500}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={pending || input.trim().length === 0}
                aria-label={vi ? "Gửi" : "Send"}
              >
                <ArrowUpIcon />
              </button>
            </form>

            <footer>
              <ChatBubbleOvalLeftEllipsisIcon aria-hidden="true" />
              {vi
                ? "AI chỉ trả lời từ dữ liệu portfolio đã xác minh."
                : "AI answers from verified portfolio data only."}
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && minimized && (
          <motion.button
            type="button"
            className={styles.restore}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setMinimized(false)}
          >
            <ChatBubbleOvalLeftEllipsisIcon />
            {vi ? "Tiếp tục chat" : "Resume chat"}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
