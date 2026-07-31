"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const StarsCanvas = dynamic(
  () =>
    import("@/components/main/star-background").then(
      (module) => module.StarsCanvas,
    ),
  { ssr: false, loading: () => null },
);

const OrbitGuide = dynamic(
  () =>
    import("@/components/main/orbit-guide").then(
      (module) => module.OrbitGuide,
    ),
  { ssr: false, loading: () => null },
);

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export const DeferredExperience = () => {
  const [guideReady, setGuideReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as IdleWindow;
    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(
        () => setGuideReady(true),
        { timeout: 1400 },
      );
      return () => idleWindow.cancelIdleCallback?.(handle);
    }

    const timer = window.setTimeout(() => setGuideReady(true), 850);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <StarsCanvas />
      {guideReady && <OrbitGuide />}
    </>
  );
};
