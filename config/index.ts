import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: "MaiTamDev | Full-stack Developer",
  description:
    "Portfolio of Mai Tran Thien Tam, a final-year Software Engineering student with FullStack Developer experience at Valley Campus.",
  keywords: [
    "Mai Tran Thien Tam",
    "maitamdev",
    "full-stack developer",
    "software engineering student",
    "Vietnam developer",
    "AI product builder",
    "Next.js",
    "TypeScript",
    "Flutter",
    "Supabase",
    "Solana",
    "space-portfolio",
    "portfolio",
    "react-icons",
    "cn",
    "clsx",
    "3d-portfolio",
    "3d-website",
    "sonner",
    "framer-motion",
    "motion",
    "animation",
    "heroicons",
    "next-themes",
    "postcss",
    "prettier",
    "react-dom",
    "tailwindcss",
    "tailwindcss-animate",
    "ui/ux",
    "js",
    "javascript",
    "typescript",
    "eslint",
    "html",
    "css",
  ] as Array<string>,
  authors: {
    name: "Mai Tran Thien Tam",
    url: "https://github.com/maitamdev",
  },
  creator: "Mai Tran Thien Tam",
  openGraph: {
    title: "MaiTamDev | Full-stack Developer",
    description:
      "Web, mobile and AI-powered products built by Mai Tran Thien Tam.",
    siteName: "MaiTamDev Portfolio",
    images: [
      {
        url: "https://raw.githubusercontent.com/maitamdev/maitam-pf/main/public/career-universe-og.jpg",
        width: 1200,
        height: 630,
        alt: "MaiTamDev Career Universe",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaiTamDev | Full-stack Developer",
    description:
      "Explore Mai Tran Thien Tam's work through an interactive Career Universe.",
    images: [
      "https://raw.githubusercontent.com/maitamdev/maitam-pf/main/public/career-universe-og.jpg",
    ],
  },
} as const;
