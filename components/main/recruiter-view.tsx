"use client";

import Image from "next/image";

import {
  BACKEND_SKILL,
  FRONTEND_SKILL,
  FULLSTACK_SKILL,
  LINKS,
  OTHER_SKILL,
  PROFILE,
  PROJECTS,
  SKILL_DATA,
} from "@/constants";
import { PROJECT_DETAILS } from "@/constants/project-details";
import { usePortfolio } from "@/lib/portfolio-context";

export const RecruiterView = () => {
  const { language, track } = usePortfolio();
  const vi = language === "vi";
  const skills = [
    ...SKILL_DATA,
    ...FRONTEND_SKILL,
    ...BACKEND_SKILL,
    ...FULLSTACK_SKILL,
    ...OTHER_SKILL,
  ];

  return (
    <main id="main-content" className="recruiter-view">
      <header className="recruiter-hero">
        <div>
          <p className="recruiter-kicker">
            {vi ? "HỒ SƠ KỸ SƯ PHẦN MỀM" : "SOFTWARE ENGINEER PROFILE"}
          </p>
          <h1>Mai Tran Thien Tam</h1>
          <h2>FullStack Developer · MaiTamDev</h2>
          <p>
            {vi
              ? "Sinh viên năm cuối ngành Kỹ thuật Phần mềm, xây dựng sản phẩm web, mobile và AI có thể sử dụng trong thực tế."
              : "Final-year Software Engineering student building practical web, mobile and AI-powered products."}
          </p>
          <div className="recruiter-actions">
            <a
              href={LINKS.cv}
              download
              onClick={() => track("cv-download")}
            >
              {vi ? "Tải CV PDF" : "Download CV"}
            </a>
            <a href={LINKS.email} onClick={() => track("contact")}>
              {vi ? "Liên hệ" : "Contact"}
            </a>
            <a href={LINKS.github} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
          </div>
          <p className="recruiter-availability">
            {vi ? "Đang mở cho cơ hội FullStack Developer tại HCM hoặc remote." : "Open to FullStack Developer opportunities in HCM or remote."}
          </p>
        </div>
        <Image
          src="/avatar.png"
          alt="Mai Tran Thien Tam"
          width={220}
          height={220}
          priority
          unoptimized
        />
      </header>

      <section className="recruiter-metrics" aria-label="Profile highlights">
        <div>
          <strong>05</strong>
          <span>{vi ? "Sản phẩm nổi bật" : "Selected products"}</span>
        </div>
        <div>
          <strong>2023–27</strong>
          <span>{vi ? "Kỹ thuật Phần mềm" : "Software Engineering"}</span>
        </div>
        <div>
          <strong>01/25–02/26</strong>
          <span>Valley Campus</span>
        </div>
      </section>

      <section className="recruiter-section recruiter-split">
        <div>
          <p className="recruiter-kicker">
            {vi ? "KINH NGHIỆM" : "EXPERIENCE"}
          </p>
          <h3>FullStack Developer</h3>
          <p className="recruiter-meta">Valley Campus · Jan 2025 – Feb 2026</p>
        </div>
        <p>
          {vi
            ? "Xây dựng, kiểm thử và sửa lỗi cho website thương mại điện tử dựa trên Odoo, phục vụ các sản phẩm bảo vệ sức khỏe và mỹ phẩm."
            : "Built, tested and fixed issues for an Odoo-based e-commerce website serving health-protection and cosmetics products."}
        </p>
      </section>

      <section className="recruiter-section">
        <p className="recruiter-kicker">
          {vi ? "SẢN PHẨM TIÊU BIỂU" : "SELECTED PRODUCTS"}
        </p>
        <div className="recruiter-projects">
          {PROJECTS.slice(0, 3).map((project, index) => (
            <article key={project.title}>
              <span>0{index + 1}</span>
              <h3>{project.title}</h3>
              <p>{vi ? project.descriptionVi : project.description}</p>
              <small>{project.stack.join(" · ")}</small>
              <nav>
                <a href={`/projects/${PROJECT_DETAILS[index].slug}`}>
                  {vi ? "Case study" : "Case study"}
                </a>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => track("project-live")}
                >
                  Live
                </a>
                <a
                  href={project.source}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Source
                </a>
              </nav>
            </article>
          ))}
        </div>
      </section>

      <section className="recruiter-section recruiter-split">
        <div>
          <p className="recruiter-kicker">{vi ? "HỌC VẤN" : "EDUCATION"}</p>
          <h3>Hung Vuong University</h3>
          <p className="recruiter-meta">
            Software Engineering · 2023 – 2027
          </p>
        </div>
        <div>
          <p className="recruiter-kicker">
            {vi ? "NĂNG LỰC KỸ THUẬT" : "TECHNICAL RANGE"}
          </p>
          <p className="recruiter-skill-line">
            {skills.map((skill) => skill.skill_name).join(" · ")}
          </p>
        </div>
      </section>

      <footer className="recruiter-contact">
        <div>
          <p className="recruiter-kicker">
            {vi ? "SẴN SÀNG KẾT NỐI" : "LET'S CONNECT"}
          </p>
          <h2>{vi ? "Cùng xây sản phẩm hữu ích." : "Let's build useful products."}</h2>
        </div>
        <div>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
          <span>{PROFILE.location}</span>
        </div>
      </footer>
    </main>
  );
};
