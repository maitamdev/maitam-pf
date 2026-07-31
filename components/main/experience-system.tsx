"use client";

import { useEffect, useRef, useState } from "react";

import { LINKS, PROFILE } from "@/constants";

type Language = "en" | "vi";

const preloadAssets = [
  "/space/nebula-premium.png",
  "/space/planets/sun-surface.webp",
  "/space/planets/moon-surface.webp",
  "/space/planets/jupiter-surface.webp",
  "/space/planets/mars-surface.webp",
  "/projects/project-1.png",
  "/projects/project-5.png",
] as const;

const loadingSteps = [
  "INITIALIZING CAREER UNIVERSE",
  "LOADING PLANETARY TEXTURES",
  "CALIBRATING NAVIGATION",
  "READY TO LAUNCH",
] as const;

export const ExperienceSystem = ({
  language,
  setRecruiterMode,
  track,
}: {
  language: Language;
  setRecruiterMode: (enabled: boolean) => void;
  track: (event: string) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [developerLab, setDeveloperLab] = useState(false);
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([
    "MAITAMDEV OS 2.0 — type help to list commands.",
  ]);
  const konami = useRef<string[]>([]);
  const vi = language === "vi";

  useEffect(() => {
    if (window.sessionStorage.getItem("maitam-loaded") === "true") {
      const timer = window.setTimeout(() => setLoading(false), 0);
      return () => window.clearTimeout(timer);
    }

    let completed = 0;
    const settle = () => {
      completed += 1;
      setProgress(Math.round((completed / preloadAssets.length) * 100));
      if (completed === preloadAssets.length) {
        window.setTimeout(() => {
          setProgress(100);
          setLoading(false);
          window.sessionStorage.setItem("maitam-loaded", "true");
        }, 520);
      }
    };
    preloadAssets.forEach((src) => {
      const image = new window.Image();
      image.onload = settle;
      image.onerror = settle;
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const sequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    const onTerminal = () => setTerminalOpen(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "`" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setTerminalOpen((open) => !open);
      }
      konami.current = [...konami.current, event.key].slice(-sequence.length);
      if (konami.current.join("|") === sequence.join("|")) {
        setDeveloperLab(true);
        setTerminalOpen(true);
        setOutput((lines) => [
          ...lines,
          "DEVELOPER LAB UNLOCKED — experimental systems online.",
        ]);
        track("easter-egg-konami");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("maitam-terminal", onTerminal);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("maitam-terminal", onTerminal);
    };
  }, [track]);

  const run = (raw: string) => {
    const value = raw.trim().toLowerCase();
    const next = [`> ${raw}`];
    const jump = (id: string) => {
      setTerminalOpen(false);
      window.setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        40,
      );
    };

    if (value === "help") {
      next.push(
        "about · skills · experience · projects · recruiter · contact · download-cv · github · stats · clear",
      );
    } else if (["about", "skills", "experience", "projects"].includes(value)) {
      jump(value === "about" ? "about-me" : value);
      next.push(`Navigating to ${value}.`);
    } else if (value === "recruiter") {
      setRecruiterMode(true);
      setTerminalOpen(false);
      next.push("Recruiter mode enabled.");
    } else if (value === "contact") {
      window.location.href = LINKS.email;
      track("contact");
      next.push(`Opening email for ${PROFILE.email}.`);
    } else if (value === "download-cv") {
      const link = document.createElement("a");
      link.href = LINKS.cv;
      link.download = "";
      link.click();
      track("cv-download");
      next.push("CV download started.");
    } else if (value === "github") {
      window.open(LINKS.github, "_blank", "noopener,noreferrer");
      next.push("Opening GitHub.");
    } else if (value === "stats") {
      try {
        const stats = JSON.parse(
          window.localStorage.getItem("maitam-private-analytics") ?? "{}",
        ) as Record<string, number>;
        const rows = Object.entries(stats).sort((a, b) => b[1] - a[1]);
        next.push(
          rows.length
            ? rows.map(([name, count]) => `${name}: ${count}`).join(" | ")
            : "No local interaction data yet.",
        );
      } catch {
        next.push("Local analytics could not be read.");
      }
    } else if (value === "clear") {
      setOutput([]);
      setCommand("");
      return;
    } else if (value) {
      next.push(`Unknown command: ${value}. Type help.`);
    }
    setOutput((lines) => [...lines, ...next].slice(-14));
    setCommand("");
  };

  const stepIndex =
    progress >= 100 ? 3 : progress >= 66 ? 2 : progress >= 30 ? 1 : 0;

  return (
    <>
      {loading && (
        <div className="universe-loader" role="status" aria-live="polite">
          <div>
            <p>MAITAMDEV / CAREER UNIVERSE</p>
            <h1>{loadingSteps[stepIndex]}</h1>
            <div className="loader-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <footer>
              <span>SYS.0{stepIndex + 1}</span>
              <strong>{progress}%</strong>
            </footer>
          </div>
        </div>
      )}

      <button
        type="button"
        className="contact-satellite"
        aria-label={vi ? "Liên hệ MaiTamDev" : "Contact MaiTamDev"}
        onClick={() => {
          window.location.href = LINKS.email;
          track("contact-satellite");
        }}
      >
        <span aria-hidden="true" />
        {vi ? "LIÊN HỆ" : "CONTACT"}
      </button>

      <button
        type="button"
        className="secret-star"
        aria-label={vi ? "Mở GitHub Live Station" : "Open GitHub Live Station"}
        title={vi ? "Tín hiệu bí mật" : "Hidden signal"}
        onClick={() => {
          document
            .querySelector(".github-station")
            ?.scrollIntoView({ behavior: "smooth" });
          track("easter-egg-star");
        }}
      >
        <span aria-hidden="true" />
      </button>

      {terminalOpen && (
        <div
          className="terminal-backdrop"
          role="presentation"
          onMouseDown={() => setTerminalOpen(false)}
        >
          <section
            className="developer-terminal"
            role="dialog"
            aria-modal="true"
            aria-label="MaiTamDev interactive terminal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <span>MAITAMDEV://TERMINAL</span>
              <button type="button" onClick={() => setTerminalOpen(false)}>
                ESC
              </button>
            </header>
            <div className="terminal-output" aria-live="polite">
              {output.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
              {developerLab && (
                <aside>
                  <strong>DEVELOPER LAB</strong>
                  <span>Warp diagnostics: nominal</span>
                  <span>Private analytics: local only</span>
                  <span>Experimental flight controls: enabled</span>
                </aside>
              )}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                run(command);
              }}
            >
              <label htmlFor="terminal-command">$</label>
              <input
                id="terminal-command"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                autoFocus
                autoComplete="off"
                spellCheck={false}
                placeholder="help"
              />
            </form>
            <footer>` terminal · Konami code unlocks Developer Lab</footer>
          </section>
        </div>
      )}
    </>
  );
};
