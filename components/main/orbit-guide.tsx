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
  const halo = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const eyeLight = useRef<THREE.PointLight>(null);
  const reduceMotion = useReducedMotion();
  const colors = stateColors[state];

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const safeDelta = Math.min(delta, 1 / 30);
    if (!root.current || !head.current) return;

    const energy = state === "thinking" ? 2.2 : state === "guiding" ? 1.6 : 1;
    root.current.position.y = reduceMotion
      ? 0
      : Math.sin(time * 1.8) * 0.055 * energy;
    root.current.rotation.z = THREE.MathUtils.damp(
      root.current.rotation.z,
      state === "guiding" ? -0.09 : Math.sin(time * 0.7) * 0.025,
      5,
      safeDelta,
    );

    head.current.rotation.y = THREE.MathUtils.damp(
      head.current.rotation.y,
      cursor.current.x * 0.34,
      6,
      safeDelta,
    );
    head.current.rotation.x = THREE.MathUtils.damp(
      head.current.rotation.x,
      -cursor.current.y * 0.18,
      6,
      safeDelta,
    );

    const stride =
      state === "guiding" && !reduceMotion ? Math.sin(time * 8.5) * 0.62 : 0;
    if (leftArm.current && rightArm.current) {
      leftArm.current.rotation.x = THREE.MathUtils.damp(
        leftArm.current.rotation.x,
        stride,
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
        -stride * 0.72,
        12,
        safeDelta,
      );
      rightLeg.current.rotation.x = THREE.MathUtils.damp(
        rightLeg.current.rotation.x,
        stride * 0.72,
        12,
        safeDelta,
      );
    }
    if (halo.current && !reduceMotion) {
      halo.current.rotation.z += safeDelta * (state === "thinking" ? 3.8 : 0.8);
      halo.current.rotation.x =
        1.1 + Math.sin(time * 0.9) * (state === "listening" ? 0.18 : 0.05);
      const pulse =
        state === "listening" ? 1 + Math.sin(time * 5) * 0.08 : 1;
      halo.current.scale.setScalar(pulse);
    }
    if (mouth.current) {
      const mouthPulse = speaking ? 0.7 + Math.abs(Math.sin(time * 13)) * 0.9 : 0.55;
      mouth.current.scale.x = THREE.MathUtils.damp(
        mouth.current.scale.x,
        mouthPulse,
        18,
        safeDelta,
      );
    }
    if (eyeLight.current) {
      eyeLight.current.intensity = speaking
        ? 2.8 + Math.abs(Math.sin(time * 11)) * 2
        : state === "thinking"
          ? 4.2
          : 2.6;
    }
  });

  const limbMaterial = (
    <meshStandardMaterial
      color="#dfe8ff"
      metalness={0.78}
      roughness={0.2}
    />
  );

  return (
    <Float
      speed={reduceMotion ? 0 : 2}
      rotationIntensity={reduceMotion ? 0 : 0.08}
      floatIntensity={reduceMotion ? 0 : 0.14}
    >
      <group ref={root} scale={0.92} position={[0, -0.1, 0]}>
        <group ref={head} position={[0, 0.72, 0]}>
          <RoundedBox args={[1.05, 0.72, 0.58]} radius={0.22} smoothness={5}>
            <meshPhysicalMaterial
              color="#17102e"
              metalness={0.62}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.16}
            />
          </RoundedBox>
          <mesh position={[-0.23, 0.06, 0.3]}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshBasicMaterial color={colors.secondary} toneMapped={false} />
          </mesh>
          <mesh position={[0.23, 0.06, 0.3]}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshBasicMaterial color={colors.secondary} toneMapped={false} />
          </mesh>
          <mesh ref={mouth} position={[0, -0.18, 0.305]} scale={[0.55, 1, 1]}>
            <boxGeometry args={[0.28, 0.035, 0.018]} />
            <meshBasicMaterial color={colors.primary} toneMapped={false} />
          </mesh>
          <pointLight
            ref={eyeLight}
            position={[0, 0.02, 0.55]}
            color={colors.secondary}
            intensity={2.6}
            distance={2.4}
          />
        </group>

        <RoundedBox
          args={[0.72, 0.78, 0.46]}
          radius={0.2}
          smoothness={5}
          position={[0, 0.02, 0]}
        >
          <meshPhysicalMaterial
            color="#211442"
            metalness={0.72}
            roughness={0.2}
            clearcoat={1}
          />
        </RoundedBox>
        <mesh position={[0, 0.08, 0.245]}>
          <circleGeometry args={[0.16, 32]} />
          <meshBasicMaterial
            color={colors.primary}
            transparent
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.08, 0.26]}>
          <ringGeometry args={[0.19, 0.225, 32]} />
          <meshBasicMaterial
            color={colors.secondary}
            transparent
            opacity={0.58}
            toneMapped={false}
          />
        </mesh>

        <group ref={leftArm} position={[-0.48, 0.28, 0]}>
          <mesh position={[0, -0.25, 0]}>
            <capsuleGeometry args={[0.105, 0.34, 6, 12]} />
            {limbMaterial}
          </mesh>
          <mesh position={[0, -0.53, 0]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color={colors.primary} metalness={0.55} />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.48, 0.28, 0]}>
          <mesh position={[0, -0.25, 0]}>
            <capsuleGeometry args={[0.105, 0.34, 6, 12]} />
            {limbMaterial}
          </mesh>
          <mesh position={[0, -0.53, 0]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color={colors.primary} metalness={0.55} />
          </mesh>
        </group>
        <group ref={leftLeg} position={[-0.22, -0.43, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.12, 0.36, 6, 12]} />
            {limbMaterial}
          </mesh>
          <RoundedBox
            args={[0.28, 0.15, 0.42]}
            radius={0.07}
            smoothness={3}
            position={[0, -0.58, 0.07]}
          >
            <meshStandardMaterial color="#bfcdf0" metalness={0.76} roughness={0.22} />
          </RoundedBox>
        </group>
        <group ref={rightLeg} position={[0.22, -0.43, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.12, 0.36, 6, 12]} />
            {limbMaterial}
          </mesh>
          <RoundedBox
            args={[0.28, 0.15, 0.42]}
            radius={0.07}
            smoothness={3}
            position={[0, -0.58, 0.07]}
          >
            <meshStandardMaterial color="#bfcdf0" metalness={0.76} roughness={0.22} />
          </RoundedBox>
        </group>

        <mesh ref={halo} position={[0, 0.35, -0.28]} rotation={[1.1, 0, 0]}>
          <torusGeometry args={[0.92, 0.018, 10, 80]} />
          <meshBasicMaterial
            color={colors.secondary}
            transparent
            opacity={0.56}
            toneMapped={false}
          />
        </mesh>
        <pointLight position={[0, 0.2, 0.8]} color={colors.primary} intensity={4} distance={4} />
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
    camera={{ position: [0, 0.2, 4.6], fov: 34 }}
    dpr={[1, 1.5]}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
  >
    <ambientLight intensity={0.9} />
    <directionalLight position={[3, 4, 5]} intensity={2.4} color="#d8e6ff" />
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
