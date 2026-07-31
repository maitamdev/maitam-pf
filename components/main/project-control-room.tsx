"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { ProjectDetail } from "@/constants/project-details";
import { usePortfolio } from "@/lib/portfolio-context";

import styles from "./project-control-room.module.css";

type View = "visual" | "system" | "results";
const views: readonly View[] = ["visual", "system", "results"];

export const ProjectControlRoom = ({
  project,
  modal = false,
  onClose,
}: {
  project: ProjectDetail;
  modal?: boolean;
  onClose?: () => void;
}) => {
  const { language, track } = usePortfolio();
  const [view, setView] = useState<View>("visual");
  const touchStart = useRef<number | null>(null);
  const vi = language === "vi";

  useEffect(() => {
    if (!modal) track(`project-report-${project.slug}`);
  }, [modal, project.slug, track]);

  const move = (direction: -1 | 1) => {
    const index = views.indexOf(view);
    setView(views[(index + direction + views.length) % views.length]);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "Escape" && modal) onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const content = (
    <article
      className={styles.room}
      aria-label={`${project.title} project control room`}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const end = event.changedTouches[0]?.clientX ?? touchStart.current;
        const distance = end - touchStart.current;
        if (Math.abs(distance) > 52) move(distance > 0 ? -1 : 1);
        touchStart.current = null;
      }}
    >
      <header className={styles.header}>
        <div>
          <p>{vi ? "PHÒNG ĐIỀU KHIỂN DỰ ÁN" : "PROJECT CONTROL ROOM"}</p>
          <h1>{project.title}</h1>
        </div>
        <div className={styles.headerActions}>
          <span data-status={project.status}>{project.status}</span>
          {modal && (
            <button type="button" onClick={onClose} autoFocus>
              {vi ? "Đóng" : "Close"}
            </button>
          )}
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Control room views">
        {views.map((item, index) => (
          <button
            type="button"
            key={item}
            aria-pressed={view === item}
            onClick={() => setView(item)}
          >
            <span>0{index + 1}</span>
            {item === "visual"
              ? vi
                ? "Nhiệm vụ"
                : "Mission"
              : item === "system"
                ? vi
                  ? "Hệ thống"
                  : "System"
                : vi
                  ? "Kết quả"
                  : "Results"}
          </button>
        ))}
      </nav>

      <div className={styles.viewport}>
        {view === "visual" && (
          <div className={styles.visualView}>
            <div className={styles.screen}>
              <Image
                src={project.image}
                alt={`${project.title} interface`}
                width={1200}
                height={600}
                priority={!modal}
                unoptimized
              />
              <div className={styles.scanline} />
            </div>
            <div className={styles.missionCopy}>
              <p className={styles.label}>{vi ? "BÀI TOÁN" : "THE PROBLEM"}</p>
              <p>{vi ? project.problemVi : project.problem}</p>
              <p className={styles.label}>{vi ? "VAI TRÒ" : "MY ROLE"}</p>
              <p>{vi ? project.roleVi : project.role}</p>
              <small>{project.period}</small>
            </div>
          </div>
        )}

        {view === "system" && (
          <div className={styles.systemView}>
            <div>
              <p className={styles.label}>
                {vi ? "KIẾN TRÚC HỆ THỐNG" : "SYSTEM ARCHITECTURE"}
              </p>
              <div className={styles.architecture}>
                {(vi ? project.architectureVi : project.architecture).map(
                  (node, index) => (
                    <div key={node}>
                      <span>0{index + 1}</span>
                      <strong>{node}</strong>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className={styles.systemCopy}>
              <p className={styles.label}>
                {vi ? "THỬ THÁCH" : "THE CHALLENGE"}
              </p>
              <p>{vi ? project.challengeVi : project.challenge}</p>
              <p className={styles.label}>
                {vi ? "CÁCH XỬ LÝ" : "THE SOLUTION"}
              </p>
              <p>{vi ? project.solutionVi : project.solution}</p>
            </div>
          </div>
        )}

        {view === "results" && (
          <div className={styles.resultsView}>
            <div>
              <p className={styles.label}>{vi ? "KẾT QUẢ" : "THE OUTCOME"}</p>
              <h2>{vi ? project.outcomeVi : project.outcome}</h2>
              <div className={styles.metrics}>
                {project.metrics.map((metric) => (
                  <div key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{vi ? metric.labelVi : metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className={styles.label}>
                {vi ? "TÍNH NĂNG CHÍNH" : "CORE FEATURES"}
              </p>
              <ol className={styles.features}>
                {(vi ? project.featuresVi : project.features).map(
                  (feature, index) => (
                    <li key={feature}>
                      <span>0{index + 1}</span>
                      {feature}
                    </li>
                  ),
                )}
              </ol>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>{project.stack.join(" · ")}</p>
        <p className={styles.hint}>
          {vi ? "Vuốt hoặc dùng phím ← →" : "Swipe or use ← →"}
        </p>
        <nav>
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => track(`project-live-${project.slug}`)}
          >
            {vi ? "Mở demo" : "Live demo"}
          </a>
          <a href={project.source} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          {modal && (
            <Link href={`/projects/${project.slug}`}>
              {vi ? "Mở hồ sơ đầy đủ" : "Full mission report"}
            </Link>
          )}
        </nav>
      </footer>
    </article>
  );

  if (!modal) return content;

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
