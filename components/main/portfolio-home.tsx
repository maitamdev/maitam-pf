"use client";

import { Encryption } from "@/components/main/encryption";
import { CareerSignal } from "@/components/main/career-signal";
import { CareerTimeline } from "@/components/main/career-timeline";
import { Hero } from "@/components/main/hero";
import { GitHubStation } from "@/components/main/github-station";
import { FlightProgress } from "@/components/main/flight-progress";
import { Journey } from "@/components/main/journey";
import { Projects } from "@/components/main/projects";
import { ProfileSignal } from "@/components/main/profile-signal";
import { RecruiterView } from "@/components/main/recruiter-view";
import { Skills } from "@/components/main/skills";
import { usePortfolio } from "@/lib/portfolio-context";

export const PortfolioHome = () => {
  const { recruiterMode } = usePortfolio();

  if (recruiterMode) return <RecruiterView />;

  return (
    <main id="main-content" className="min-h-[100dvh] w-full">
      <FlightProgress />
      <div className="flex flex-col gap-12 md:gap-20">
        <Hero />
        <ProfileSignal />
        <Skills />
        <Journey />
        <CareerTimeline />
        <CareerSignal />
        <GitHubStation />
        <Encryption />
        <Projects />
      </div>
    </main>
  );
};
