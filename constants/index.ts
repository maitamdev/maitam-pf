import { FaFacebook } from "react-icons/fa";
import { RxGithubLogo, RxLinkedinLogo } from "react-icons/rx";

export const PROFILE = {
  name: "Mai Tran Thien Tam",
  alias: "MaiTamDev",
  email: "maitamit062005@gmail.com",
  phone: "+84 877 724 374",
  phoneHref: "tel:+84877724374",
  location: "HCM, Vietnam",
  cv: "/Mai-Tran-Thien-Tam-CV.pdf",
  github: "https://github.com/maitamdev",
  linkedin: "https://www.linkedin.com/in/maitam-dev-403220399",
  facebook: "https://www.facebook.com/maitamdvfb",
} as const;

export const SKILL_DATA = [
  { skill_name: "TypeScript", image: "ts.png", width: 80, height: 80 },
  { skill_name: "JavaScript", image: "js.png", width: 65, height: 65 },
  { skill_name: "React", image: "react.png", width: 80, height: 80 },
  { skill_name: "Next.js", image: "next.png", width: 80, height: 80 },
  { skill_name: "Vite", image: "vite.svg", width: 80, height: 80 },
] as const;

export const SOCIALS = [
  {
    name: "GitHub",
    icon: RxGithubLogo,
    link: PROFILE.github,
  },
  {
    name: "LinkedIn",
    icon: RxLinkedinLogo,
    link: PROFILE.linkedin,
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    link: PROFILE.facebook,
  },
] as const;

export const FRONTEND_SKILL = [
  { skill_name: "HTML", image: "html.png", width: 80, height: 80 },
  { skill_name: "CSS", image: "css.png", width: 80, height: 80 },
  {
    skill_name: "Tailwind CSS",
    image: "tailwind.png",
    width: 80,
    height: 80,
  },
] as const;

export const BACKEND_SKILL = [
  { skill_name: "Node.js", image: "node.png", width: 80, height: 80 },
  { skill_name: "Express.js", image: "express.png", width: 80, height: 80 },
  {
    skill_name: "PostgreSQL",
    image: "postgresql.png",
    width: 70,
    height: 70,
  },
  { skill_name: "MongoDB", image: "mongodb.png", width: 48, height: 48 },
  { skill_name: "Supabase", image: "supabase.svg", width: 80, height: 80 },
  { skill_name: "Firebase", image: "firebase.png", width: 55, height: 55 },
] as const;

export const FULLSTACK_SKILL = [
  { skill_name: "Flutter", image: "flutter.svg", width: 80, height: 80 },
  { skill_name: "Dart", image: "dart.svg", width: 80, height: 80 },
  { skill_name: "Python", image: "python.svg", width: 80, height: 80 },
  { skill_name: "FastAPI", image: "fastapi.svg", width: 80, height: 80 },
] as const;

export const OTHER_SKILL = [
  { skill_name: "Docker", image: "docker.png", width: 70, height: 70 },
  { skill_name: "Git", image: "git.svg", width: 80, height: 80 },
  { skill_name: "Vercel", image: "vercel.svg", width: 80, height: 80 },
  { skill_name: "Rust", image: "rust.svg", width: 80, height: 80 },
] as const;

export const PROJECTS = [
  {
    title: "SafeReturn / FindBack",
    description:
      "An AI-assisted lost-and-found platform with Solana Devnet escrow, realtime data and evidence review powered by Groq.",
    image: "/projects/project-1.png",
    link: "https://safereturn-delta.vercel.app",
    source: "https://github.com/maitamdev/safe-return",
    stack: ["Next.js", "TypeScript", "Supabase", "Solana", "Groq"],
  },
  {
    title: "Sora POS V2",
    description:
      "A full-stack retail POS for inventory, role-based access, analytics and AI-assisted restocking decisions.",
    image: "/projects/project-2.png",
    link: "https://sora-pos.vercel.app",
    source: "https://github.com/maitamdev/SORA-POS-V2",
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Groq"],
  },
  {
    title: "DHV Guiding Light",
    description:
      "A mentorship platform connecting DHV students and advisors through bookings, dashboards and practical guidance tools.",
    image: "/projects/project-3.png",
    link: "https://dhv-guiding-light.vercel.app",
    source: "https://github.com/maitamdev/DHV-GUIDING-LIGHT",
    stack: ["React", "TypeScript", "Firebase", "Node.js"],
  },
  {
    title: "UML Gen",
    description:
      "An AI-powered tool that turns natural-language prompts into editable UML diagrams with multiple export formats.",
    image: "/projects/project-4.png",
    link: "https://uml-gen-nine.vercel.app",
    source: "https://github.com/maitamdev/uml-gen",
    stack: ["TypeScript", "Vite", "Mermaid", "Groq"],
  },
  {
    title: "SCS GO",
    description:
      "A smart EV charging platform with station discovery, booking, location analysis, mobile access and AI-assisted recommendations.",
    image: "/projects/project-5.png",
    link: "https://scs-go.vercel.app",
    source: "https://github.com/maitamdev/s-c-th-ng-minh",
    stack: ["React", "TypeScript", "Flutter", "Supabase"],
  },
] as const;

export const FOOTER_DATA = [
  {
    title: "Find me",
    data: [
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: PROFILE.github,
      },
      {
        name: "LinkedIn",
        icon: RxLinkedinLogo,
        link: PROFILE.linkedin,
      },
      {
        name: "Portfolio source",
        icon: null,
        link: "https://github.com/maitamdev/maitam-pf",
      },
    ],
  },
  {
    title: "Social",
    data: [
      {
        name: "Facebook",
        icon: FaFacebook,
        link: PROFILE.facebook,
      },
    ],
  },
  {
    title: "Contact",
    data: [
      {
        name: PROFILE.email,
        icon: null,
        link: `mailto:${PROFILE.email}`,
      },
      {
        name: PROFILE.phone,
        icon: null,
        link: PROFILE.phoneHref,
      },
      {
        name: "HCM, Vietnam",
        icon: null,
        link: "https://www.google.com/maps/search/?api=1&query=Ho+Chi+Minh+City%2C+Vietnam",
      },
      {
        name: "Explore all projects",
        icon: null,
        link: "https://github.com/maitamdev?tab=repositories",
      },
    ],
  },
] as const;

export const NAV_LINKS = [
  { title: "About me", link: "#about-me" },
  { title: "Skills", link: "#skills" },
  { title: "Experience", link: "#experience" },
  { title: "Projects", link: "#projects" },
] as const;

export const LINKS = {
  github: PROFILE.github,
  email: `mailto:${PROFILE.email}`,
  phone: PROFILE.phoneHref,
  cv: PROFILE.cv,
  linkedin: PROFILE.linkedin,
} as const;
