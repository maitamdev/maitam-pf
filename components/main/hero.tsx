"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

import { HeroContent } from "@/components/sub/hero-content";

const GalaxyNavigator = dynamic(
  () =>
    import("@/components/main/galaxy-navigator").then(
      (module) => module.GalaxyNavigator,
    ),
  { ssr: false, loading: () => null },
);

export const Hero = () => {
  const blackHoleVideo = useRef<HTMLVideoElement>(null);
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    const charge = () => {
      if (blackHoleVideo.current) blackHoleVideo.current.playbackRate = 2.1;
    };
    const release = () => {
      if (blackHoleVideo.current) blackHoleVideo.current.playbackRate = 1;
    };
    window.addEventListener("maitam-blackhole-charge", charge);
    window.addEventListener("maitam-blackhole-release", release);
    return () => {
      window.removeEventListener("maitam-blackhole-charge", charge);
      window.removeEventListener("maitam-blackhole-release", release);
    };
  }, []);

  return (
    <section
      ref={hero}
      className="hero-cosmos relative flex min-h-[100dvh] w-full flex-col overflow-hidden"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--gravity-x",
          `${event.clientX - bounds.left}px`,
        );
        event.currentTarget.style.setProperty(
          "--gravity-y",
          `${event.clientY - bounds.top}px`,
        );
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      >
        <video
          ref={blackHoleVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="black-hole-video absolute left-0 h-full w-full object-cover"
        >
          <source src="/videos/blackhole-alpha.webm" type="video/webm" />
        </video>
      </div>

      <div className="hero-gravity-field" aria-hidden="true" />
      <div className="hero-orbital-grid" aria-hidden="true" />
      <div className="hero-spectrum" aria-hidden="true" />

      <GalaxyNavigator />
      <HeroContent />
    </section>
  );
};
