import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://maitam-pf.vercel.app";

export const siteConfig: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    "Odoo developer",
    "React developer",
    "Next.js developer",
    "Flutter developer",
    "3D developer portfolio",
  ] as Array<string>,
  authors: {
    name: "Mai Tran Thien Tam",
    url: "https://github.com/maitamdev",
  },
  creator: "Mai Tran Thien Tam",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MaiTamDev | Full-stack Developer",
    description:
      "Web, mobile and AI-powered products built by Mai Tran Thien Tam.",
    siteName: "MaiTamDev Portfolio",
    url: "/",
    locale: "en_US",
    alternateLocale: "vi_VN",
    images: [
      {
        url: "/career-universe-og.jpg",
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
      "/career-universe-og.jpg",
    ],
  },
} as const;
