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
      className="mx-auto flex w-full max-w-[1480px] flex-col items-center justify-center px-6 py-20 md:px-10"
    >
      <header className="mb-12 w-full border-b border-white/10 pb-9">
        <h2 className="max-w-[850px] text-4xl font-semibold leading-none tracking-[-0.05em] text-white md:text-7xl">
          {vi ? "Sản phẩm thật, quyết định kỹ thuật thật." : "Real products. Real engineering decisions."}
        </h2>
        <p className="mt-5 max-w-[680px] text-base leading-7 text-gray-400 md:text-lg">
          {vi
            ? "Mỗi dự án có mission report riêng về bài toán, vai trò, kiến trúc, cách xử lý và kết quả."
            : "Each project has a dedicated mission report covering the problem, role, architecture, decisions and outcome."}
        </p>
      </header>
      <div className="grid h-full w-full grid-cols-1 gap-8 md:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.title}
            src={project.image}
            title={project.title}
            description={vi ? project.descriptionVi : project.description}
            link={project.link}
            source={project.source}
            stack={project.stack}
            status={PROJECT_DETAILS[index].status}
            role={vi ? PROJECT_DETAILS[index].roleVi : PROJECT_DETAILS[index].role}
            caseStudyPath={`/projects/${PROJECT_DETAILS[index].slug}`}
            featured={index === 0}
            caseStudyLabel={vi ? "Đọc case study" : "Read case study"}
            previewLabel={vi ? "Xem nhanh" : "Quick preview"}
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
