import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import type { PropsWithChildren } from "react";

import { Footer } from "@/components/main/footer";
import { Navbar } from "@/components/main/navbar";
import { StarsCanvas } from "@/components/main/star-background";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import { PortfolioProvider } from "@/lib/portfolio-context";

import "./globals.css";

const geist = Geist({ subsets: ["latin", "latin-ext"] });

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-[#030014] overflow-y-scroll overflow-x-hidden",
          geist.className
        )}
      >
        <PortfolioProvider>
          <StarsCanvas />
          <Navbar />
          {children}
          <Footer />
        </PortfolioProvider>
      </body>
    </html>
  );
}
