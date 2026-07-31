"use client";

import { useEffect, useMemo, useState } from "react";

import { PROFILE } from "@/constants";
import { PROJECT_DETAILS } from "@/constants/project-details";
import { usePortfolio } from "@/lib/portfolio-context";

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  stargazers_count: number;
};

type GitHubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
};

type GitHubPayload = {
  repos: Repo[];
  events: GitHubEvent[];
  updatedAt: string;
};

const fallbackRepos: Repo[] = PROJECT_DETAILS.slice(0, 5).map((project) => ({
  name: project.slug,
  html_url: project.source,
  description: project.summary,
  language: project.stack[0] ?? "TypeScript",
  pushed_at: "",
  stargazers_count: 0,
}));

export const GitHubStation = () => {
  const { language } = usePortfolio();
  const [repos, setRepos] = useState<Repo[]>(fallbackRepos);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [state, setState] = useState<"loading" | "live" | "fallback">("loading");
  const vi = language === "vi";

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub signal unavailable");
        return response.json() as Promise<GitHubPayload>;
      })
      .then((payload) => {
        setRepos(payload.repos);
        setEvents(payload.events);
        setState("live");
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("fallback");
      });
    return () => controller.abort();
  }, []);

  const languages = useMemo(
    () =>
      Array.from(
        new Set(repos.map((repo) => repo.language).filter(Boolean)),
      ).slice(0, 5),
    [repos],
  );

  return (
    <section className="github-station" aria-labelledby="github-station-title">
      <header>
        <div>
          <p>GITHUB LIVE STATION</p>
          <h2 id="github-station-title">
            {vi ? "Tín hiệu mã nguồn công khai." : "Public code signals."}
          </h2>
        </div>
        <span data-state={state}>
          {state === "loading"
            ? vi
              ? "Đang kết nối"
              : "Connecting"
            : state === "live"
              ? "Live API"
              : vi
                ? "Dữ liệu dự phòng"
                : "Fallback data"}
        </span>
      </header>

      <div className="github-station-grid">
        <div>
          <p className="station-label">
            {vi ? "REPOSITORY GẦN ĐÂY" : "RECENT REPOSITORIES"}
          </p>
          <div className="repo-list">
            {repos.slice(0, 5).map((repo) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <strong>{repo.name}</strong>
                <span>{repo.language ?? "Code"}</span>
                <small>{repo.description ?? "Public repository"}</small>
              </a>
            ))}
          </div>
        </div>
        <aside>
          <p className="station-label">
            {vi ? "NGÔN NGỮ THƯỜNG DÙNG" : "LANGUAGE SIGNAL"}
          </p>
          <p className="language-cloud">{languages.join(" · ")}</p>
          <p className="station-label">
            {vi ? "HOẠT ĐỘNG GẦN ĐÂY" : "RECENT ACTIVITY"}
          </p>
          <div className="activity-list">
            {events.length ? (
              events.slice(0, 4).map((event) => (
                <div key={event.id}>
                  <strong>{event.type.replace("Event", "")}</strong>
                  <span>{event.repo.name.replace("maitamdev/", "")}</span>
                </div>
              ))
            ) : (
              <p>
                {vi
                  ? "Hoạt động trực tiếp sẽ xuất hiện khi GitHub API khả dụng."
                  : "Live activity appears when the GitHub API is available."}
              </p>
            )}
          </div>
          <a href={PROFILE.github} target="_blank" rel="noreferrer noopener">
            {vi ? "Mở hồ sơ GitHub" : "Open GitHub profile"} →
          </a>
        </aside>
      </div>
    </section>
  );
};
