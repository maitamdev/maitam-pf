"use client";

import { SkillDataProvider } from "@/components/sub/skill-data-provider";
import { SkillText } from "@/components/sub/skill-text";

import {
  BACKEND_SKILL,
  FRONTEND_SKILL,
  FULLSTACK_SKILL,
  OTHER_SKILL,
  SKILL_DATA,
} from "@/constants";
import { usePortfolio } from "@/lib/portfolio-context";

export const Skills = () => {
  const { language } = usePortfolio();
  const vi = language === "vi";
  const groups = [
    {
      title: vi ? "Sản phẩm web" : "Web products",
      note: vi ? "Giao diện, luồng dữ liệu và ứng dụng full-stack." : "Interfaces, data flows and full-stack applications.",
      skills: [...SKILL_DATA, ...FRONTEND_SKILL],
    },
    {
      title: vi ? "Backend & dữ liệu" : "Backend and data",
      note: vi ? "API, xác thực, dữ liệu realtime và hệ thống dịch vụ." : "APIs, authentication, realtime data and services.",
      skills: BACKEND_SKILL,
    },
    {
      title: vi ? "Mobile & AI" : "Mobile and AI",
      note: vi ? "Ứng dụng đa nền tảng và tính năng được hỗ trợ bởi AI." : "Cross-platform apps and AI-assisted features.",
      skills: FULLSTACK_SKILL,
    },
    {
      title: vi ? "Vận hành" : "Delivery",
      note: vi ? "Quản lý mã nguồn, container và triển khai sản phẩm." : "Source control, containers and product deployment.",
      skills: OTHER_SKILL,
    },
  ];

  return (
    <section
      id="skills"
      className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-3 overflow-hidden px-6 py-20 md:px-10"
    >
      <SkillText />

      <div className="skills-matrix">
        {groups.map((group, groupIndex) => (
          <article key={group.title}>
            <header>
              <h3>{group.title}</h3>
              <p>{group.note}</p>
            </header>
            <div>
              {group.skills.map((skill, index) => (
                <SkillDataProvider
                  key={skill.skill_name}
                  src={skill.image}
                  name={skill.skill_name}
                  width={Math.min(skill.width, 52)}
                  height={Math.min(skill.height, 52)}
                  index={groupIndex * 2 + index}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 flex items-center justify-center bg-cover opacity-20">
          <video
            className="h-full w-full object-cover"
            preload="none"
            playsInline
            loop
            muted
            autoPlay
          >
            <source src="/videos/skills-bg.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
};
