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
    <div className="relative flex flex-col h-full w-full">
      <video
        ref={blackHoleVideo}
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-[-340px] left-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      <GalaxyNavigator />
      <HeroContent />
    </div>
  );
};
