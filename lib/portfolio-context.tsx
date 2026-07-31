"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ExperienceSystem } from "@/components/main/experience-system";

type Language = "en" | "vi";
type PortfolioContextValue = {
  language: Language;
  recruiterMode: boolean;
  setLanguage: (language: Language) => void;
  setRecruiterMode: (enabled: boolean) => void;
  track: (event: string) => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export const PortfolioProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [recruiterMode, setRecruiterModeState] = useState(false);

  useEffect(() => {
    const restorePreferences = window.setTimeout(() => {
      const savedLanguage = window.localStorage.getItem("maitam-language");
      const savedMode = window.localStorage.getItem("maitam-recruiter-mode");
      if (savedLanguage === "vi" || savedLanguage === "en") {
        setLanguageState(savedLanguage);
      }
      setRecruiterModeState(savedMode === "true");
    }, 0);
    return () => window.clearTimeout(restorePreferences);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.recruiter = String(recruiterMode);
  }, [language, recruiterMode]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("maitam-language", next);
  }, []);

  const track = useCallback((event: AnalyticsEvent) => {
    try {
      const key = "maitam-private-analytics";
      const current = JSON.parse(window.localStorage.getItem(key) ?? "{}") as
        Record<string, number>;
      current[event] = (current[event] ?? 0) + 1;
      window.localStorage.setItem(key, JSON.stringify(current));
    } catch {
      // Analytics is intentionally optional and never leaves the device.
    }
  }, []);

  const setRecruiterMode = useCallback(
    (enabled: boolean) => {
      setRecruiterModeState(enabled);
      window.localStorage.setItem("maitam-recruiter-mode", String(enabled));
      if (enabled) track("recruiter-mode");
    },
    [track],
  );

  const value = useMemo(
    () => ({
      language,
      recruiterMode,
      setLanguage,
      setRecruiterMode,
      track,
    }),
    [language, recruiterMode, setLanguage, setRecruiterMode, track],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
      <div className="experience-controls" aria-label="Experience controls">
        <div className="language-switch" aria-label="Language">
          <button
            type="button"
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            type="button"
            aria-pressed={language === "vi"}
            onClick={() => setLanguage("vi")}
          >
            VI
          </button>
        </div>
        <button
          type="button"
          className="recruiter-switch"
          aria-pressed={recruiterMode}
          onClick={() => setRecruiterMode(!recruiterMode)}
        >
          {recruiterMode
            ? language === "vi"
              ? "Khám phá 3D"
              : "3D universe"
            : language === "vi"
              ? "Chế độ tuyển dụng"
              : "Recruiter mode"}
        </button>
      </div>
      <ExperienceSystem
        language={language}
        setRecruiterMode={setRecruiterMode}
        track={track}
      />
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }
  return context;
};
