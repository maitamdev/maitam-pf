"use client";

import { Encryption } from "@/components/main/encryption";
import { CareerSignal } from "@/components/main/career-signal";
import { CareerTimeline } from "@/components/main/career-timeline";
import { Hero } from "@/components/main/hero";
import { GitHubStation } from "@/components/main/github-station";
import { Journey } from "@/components/main/journey";
import { Projects } from "@/components/main/projects";
import { RecruiterView } from "@/components/main/recruiter-view";
import { Skills } from "@/components/main/skills";
import { usePortfolio } from "@/lib/portfolio-context";

export const PortfolioHome = () => {
  const { recruiterMode } = usePortfolio();

  if (recruiterMode) return <RecruiterView />;

  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
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
