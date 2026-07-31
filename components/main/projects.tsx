"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ProjectCard } from "@/components/sub/project-card";
import { PROJECTS } from "@/constants";
import { usePortfolio } from "@/lib/portfolio-context";

export const Projects = () => {
  const { language, track } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const vi = language === "vi";
  const active = activeIndex === null ? null : PROJECTS[activeIndex];

  useEffect(() => {
    if (!active) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [active]);

  return (
    <section
      id="projects"
      className="flex flex-col items-center justify-center py-20"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
        {vi ? "Sản phẩm tiêu biểu" : "Selected Work"}
      </h1>
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-10 max-w-[1400px]">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.title}
            src={project.image}
            title={project.title}
            description={vi ? project.descriptionVi : project.description}
            link={project.link}
            source={project.source}
            stack={project.stack}
            caseStudyLabel={vi ? "Xem case study" : "Case study"}
            liveLabel={vi ? "Xem sản phẩm" : "View live"}
            sourceLabel={vi ? "Mã nguồn" : "Source code"}
            onCaseStudy={() => {
              setActiveIndex(index);
              track("case-study");
            }}
            onLive={() => track("project-live")}
          />
        ))}
      </div>

      {active && (
        <div
          className="case-study-backdrop"
          role="presentation"
          onMouseDown={() => setActiveIndex(null)}
        >
          <section
            className="case-study-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <p>{vi ? "HỒ SƠ NHIỆM VỤ" : "MISSION CASE STUDY"}</p>
                <h2 id="case-study-title">{active.title}</h2>
              </div>
              <button type="button" onClick={() => setActiveIndex(null)}>
                {vi ? "Đóng" : "Close"}
              </button>
            </header>

            <Image
              src={active.image}
              alt={`${active.title} interface`}
              width={1200}
              height={600}
              unoptimized
            />

            <div className="case-study-grid">
              <div>
                <p className="case-study-label">
                  {vi ? "BÀI TOÁN" : "THE BRIEF"}
                </p>
                <p>{vi ? active.caseStudy.briefVi : active.caseStudy.brief}</p>
              </div>
              <div>
                <p className="case-study-label">
                  {vi ? "ĐÓNG GÓP" : "CONTRIBUTION"}
                </p>
                <p>
                  {vi
                    ? active.caseStudy.contributionVi
                    : active.caseStudy.contribution}
                </p>
              </div>
            </div>

            <div className="case-study-results">
              <p className="case-study-label">
                {vi ? "ĐIỂM NỔI BẬT" : "PRODUCT HIGHLIGHTS"}
              </p>
              <ol>
                {(vi
                  ? active.caseStudy.highlightsVi
                  : active.caseStudy.highlights
                ).map((highlight, index) => (
                  <li key={highlight}>
                    <span>0{index + 1}</span>
                    {highlight}
                  </li>
                ))}
              </ol>
            </div>

            <footer>
              <p>{active.stack.join(" · ")}</p>
              <nav>
                <a
                  href={active.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => track("project-live")}
                >
                  {vi ? "Mở sản phẩm" : "Open live product"}
                </a>
                <a
                  href={active.source}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {vi ? "Xem mã nguồn" : "View source"}
                </a>
              </nav>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
};
