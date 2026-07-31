import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import type { PropsWithChildren } from "react";

import { Footer } from "@/components/main/footer";
import { DeferredExperience } from "@/components/main/deferred-experience";
import { Navbar } from "@/components/main/navbar";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import { PortfolioProvider } from "@/lib/portfolio-context";

import "./globals.css";

const geist = Geist({ subsets: ["latin", "latin-ext"] });

export const viewport: Viewport = {
  themeColor: "#030014",
  colorScheme: "dark",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mai Tran Thien Tam",
    alternateName: "MaiTamDev",
    jobTitle: "FullStack Developer",
    email: "mailto:maitamit062005@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "VN",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Hung Vuong University",
    },
    sameAs: [
      "https://github.com/maitamdev",
      "https://www.linkedin.com/in/maitam-dev-403220399",
      "https://www.facebook.com/maitamdvfb",
    ],
    knowsAbout: [
      "Full-stack development",
      "Odoo",
      "Next.js",
      "TypeScript",
      "Flutter",
      "Artificial intelligence",
    ],
  };

  return (
    <html lang="en">
      <body
        className={cn(
          "bg-[#030014] overflow-y-scroll overflow-x-hidden",
          geist.className
        )}
      >
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <PortfolioProvider>
          <DeferredExperience />
          <Navbar />
          {children}
          <Footer />
        </PortfolioProvider>
      </body>
    </html>
  );
}
