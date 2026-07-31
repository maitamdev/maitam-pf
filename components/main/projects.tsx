"use client";

import { useEffect, useState } from "react";

import { ProjectControlRoom } from "@/components/main/project-control-room";
import { ProjectCard } from "@/components/sub/project-card";
import { PROJECTS } from "@/constants";
import { PROJECT_DETAILS } from "@/constants/project-details";
import { usePortfolio } from "@/lib/portfolio-context";

export const Projects = () => {
  const { language, track } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const vi = language === "vi";
  const active = activeIndex === null ? null : PROJECT_DETAILS[activeIndex];

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  return (
    <section
      id="projects"
      className="flex flex-col items-center justify-center py-20"
    >
      <h1 className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text py-20 text-[40px] font-semibold text-transparent">
        {vi ? "Sản phẩm tiêu biểu" : "Selected Work"}
      </h1>
      <div className="grid h-full w-full max-w-[1400px] grid-cols-1 gap-8 px-6 md:grid-cols-2 md:px-10">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.title}
            src={project.image}
            title={project.title}
            description={vi ? project.descriptionVi : project.description}
            link={project.link}
            source={project.source}
            stack={project.stack}
            caseStudyLabel={vi ? "Mở Control Room" : "Control Room"}
            liveLabel={vi ? "Xem sản phẩm" : "View live"}
            sourceLabel={vi ? "Mã nguồn" : "Source code"}
            onCaseStudy={() => {
              setActiveIndex(index);
              track(`case-study-${PROJECT_DETAILS[index].slug}`);
              window.dispatchEvent(new Event("maitam-hologram"));
            }}
            onLive={() => track(`project-live-${PROJECT_DETAILS[index].slug}`)}
          />
        ))}
      </div>

      {active && (
        <ProjectControlRoom
          project={active}
          modal
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
};
