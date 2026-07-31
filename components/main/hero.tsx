"use client";

import { useEffect, useRef } from "react";

import { GalaxyNavigator } from "@/components/main/galaxy-navigator";
import { HeroContent } from "@/components/sub/hero-content";

export const Hero = () => {
  const blackHoleVideo = useRef<HTMLVideoElement>(null);

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
    <div className="relative flex h-full w-full flex-col overflow-hidden">
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
          preload="auto"
          disablePictureInPicture
          className="absolute left-0 top-[-340px] h-full w-full object-cover mix-blend-screen"
        >
          <source src="/videos/blackhole.webm" type="video/webm" />
        </video>
      </div>

      <GalaxyNavigator />
      <HeroContent />
    </div>
  );
};
