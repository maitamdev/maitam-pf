export const ORBIT_WORLDS = [
  "about-me",
  "skills",
  "experience",
  "projects",
] as const;

export const ORBIT_PROJECTS = [
  "safe-return",
  "sora-pos-v2",
  "dhv-guiding-light",
  "uml-gen",
  "scs-go",
] as const;

export type OrbitWorld = (typeof ORBIT_WORLDS)[number];
export type OrbitProject = (typeof ORBIT_PROJECTS)[number];
export type OrbitLanguage = "en" | "vi";

export type OrbitAction =
  | { type: "none" }
  | { type: "go_home" }
  | { type: "open_world"; world: OrbitWorld }
  | { type: "open_project"; slug: OrbitProject }
  | { type: "scroll_to"; section: OrbitWorld }
  | { type: "recruiter_mode"; enabled: boolean }
  | { type: "download_cv" }
  | { type: "switch_language"; language: OrbitLanguage }
  | { type: "contact" };

export type OrbitMessage = {
  role: "user" | "assistant";
  content: string;
};

export type OrbitResponse = {
  message: string;
  action: OrbitAction;
  mode: "groq" | "demo";
};

export const isOrbitWorld = (value: unknown): value is OrbitWorld =>
  typeof value === "string" &&
  (ORBIT_WORLDS as readonly string[]).includes(value);

export const isOrbitProject = (value: unknown): value is OrbitProject =>
  typeof value === "string" &&
  (ORBIT_PROJECTS as readonly string[]).includes(value);

export const isOrbitLanguage = (value: unknown): value is OrbitLanguage =>
  value === "en" || value === "vi";
