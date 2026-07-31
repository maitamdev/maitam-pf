"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

import { usePortfolio } from "@/lib/portfolio-context";

const stops = [
  { id: "about-me", en: "About", vi: "Giới thiệu" },
  { id: "skills", en: "Skills", vi: "Kỹ năng" },
  { id: "experience", en: "Experience", vi: "Kinh nghiệm" },
  { id: "projects", en: "Projects", vi: "Dự án" },
] as const;

export const FlightProgress = () => {
  const { language, track } = usePortfolio();
  const [active, setActive] = useState("about-me");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.28,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55%", threshold: [0.05, 0.2, 0.5] },
    );

    stops.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="flight-progress" aria-label={language === "vi" ? "Điều hướng trang" : "Page navigation"}>
      <div className="flight-progress__track" aria-hidden="true">
        <motion.span style={{ scaleY: progress }} />
      </div>
      <nav>
        {stops.map((stop) => (
          <a
            key={stop.id}
            href={`#${stop.id}`}
            aria-current={active === stop.id ? "location" : undefined}
            onClick={() => track(`rail-${stop.id}`)}
          >
            <i aria-hidden="true" />
            <span>{language === "vi" ? stop.vi : stop.en}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};
