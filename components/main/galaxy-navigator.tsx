"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const destinations = [
  {
    id: "about-me",
    label: "About me",
    detail: "Origin",
    color: "from-[#a68bff] via-[#7052dd] to-[#26144f]",
  },
  {
    id: "skills",
    label: "Skills",
    detail: "Toolkit",
    color: "from-[#66c9ff] via-[#2a77d8] to-[#152663]",
  },
  {
    id: "experience",
    label: "Experience",
    detail: "Journey",
    color: "from-[#d59cff] via-[#9048ca] to-[#431668]",
  },
  {
    id: "projects",
    label: "Projects",
    detail: "Work",
    color: "from-[#8ce6d5] via-[#2e9d99] to-[#123d50]",
  },
] as const;

export const GalaxyNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const reduceMotion = useReducedMotion();
  const travelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (travelTimer.current) clearTimeout(travelTimer.current);
    };
  }, []);

  const travelTo = (id: (typeof destinations)[number]["id"]) => {
    if (isWarping) return;

    const target = document.getElementById(id);
    if (!target) return;

    if (reduceMotion) {
      setIsOpen(false);
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    setIsWarping(true);
    travelTimer.current = setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
      setIsWarping(false);
    }, 680);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open galaxy navigation"
        aria-expanded={isOpen}
        aria-controls="galaxy-navigation"
        onClick={() => setIsOpen(true)}
        className="absolute left-1/2 top-0 z-30 h-[180px] w-[min(64vw,680px)] -translate-x-1/2 cursor-pointer rounded-b-[48%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b49bff]"
      >
        <span className="sr-only">Open galaxy navigation</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="galaxy-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="galaxy-navigation-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
            className="fixed inset-0 z-[70] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#060219]/95 px-5 py-10 text-white backdrop-blur-xl"
          >
            <motion.div
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0.25, rotate: -20, scale: 0.6 }}
              animate={
                reduceMotion
                  ? { opacity: 0.3 }
                  : { opacity: [0.25, 0.7, 0.25], rotate: 340, scale: [0.6, 1.25, 1] }
              }
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-[80vmax] w-[80vmax] rounded-full bg-[conic-gradient(from_90deg,transparent_0deg,#3d2096_52deg,transparent_120deg,#157eb0_188deg,transparent_260deg,#7444cd_320deg,transparent_360deg)] opacity-70 blur-3xl"
            />
            <motion.div
              aria-hidden="true"
              animate={isWarping && !reduceMotion ? { scale: [0.2, 3.5], opacity: [0.8, 0] } : { scale: 0.2, opacity: 0 }}
              transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-40 w-40 rounded-full border border-[#d7ceff] bg-[#5b33d0]/20 shadow-[0_0_80px_rgba(112,66,248,0.7)]"
            />

            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.08 }}
                className="text-sm font-medium tracking-[0.18em] text-[#c8baff]"
              >
                GALAXY NAVIGATION
              </motion.p>
              <motion.h2
                id="galaxy-navigation-title"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.14 }}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Choose a destination
              </motion.h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-300 sm:text-base">
                Select a planet to continue the journey.
              </p>

              <div className="mt-10 grid w-full max-w-xl grid-cols-2 gap-x-7 gap-y-10 sm:gap-x-14">
                {destinations.map((destination, index) => (
                  <motion.button
                    type="button"
                    key={destination.id}
                    onClick={() => travelTo(destination.id)}
                    disabled={isWarping}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.2 + index * 0.08,
                      type: "spring",
                      stiffness: 170,
                      damping: 16,
                    }}
                    whileHover={reduceMotion ? undefined : { y: -6, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex flex-col items-center rounded-2xl px-2 py-1 text-center outline-none transition disabled:cursor-wait focus-visible:ring-2 focus-visible:ring-[#d7ceff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#060219]"
                  >
                    <span
                      className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${destination.color} shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_34px_rgba(20,8,68,0.6)] sm:h-24 sm:w-24`}
                    >
                      <span className="absolute inset-[11%] rounded-full border border-white/35" />
                      <span className="absolute inset-[23%] rounded-full border border-white/15" />
                      <span className="relative text-xs font-medium tracking-[0.12em] text-white/90">
                        {destination.detail}
                      </span>
                    </span>
                    <span className="mt-4 text-base font-medium text-white transition group-hover:text-[#d8d0ff]">
                      {destination.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-10 rounded-full border border-white/20 px-4 py-2 text-sm text-gray-200 transition hover:border-[#b49bff] hover:text-white active:scale-[0.98]"
              >
                Close map
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};
