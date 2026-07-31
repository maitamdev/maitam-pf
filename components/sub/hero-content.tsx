"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Link from "next/link";

import { TechOrbit } from "@/components/sub/tech-orbit";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";
import { usePortfolio } from "@/lib/portfolio-context";

export const HeroContent = () => {
  const { language, track } = usePortfolio();
  const vi = language === "vi";

  return (
    <motion.div
      id="about-me"
      initial="hidden"
      animate="visible"
      className="relative z-[20] mx-auto flex min-h-[100dvh] w-full max-w-[1500px] flex-col-reverse items-center justify-center gap-6 px-6 pb-14 pt-32 md:flex-row md:px-12 md:pb-20 md:pt-36 xl:px-20"
    >
      <div className="flex h-full w-full flex-col justify-center gap-5 text-start md:w-[56%]">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box border border-[#7042f88b] px-[9px] py-[8px] opacity-90"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">
            Mai Tran Thien Tam | MaiTamDev
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="mt-4 max-w-[820px] text-[clamp(3rem,6.2vw,6.6rem)] font-semibold leading-[0.93] tracking-[-0.065em] text-white"
        >
          <span>
            {vi ? "Biến ý tưởng thành " : "Real ideas. "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              {vi ? "sản phẩm thật." : "Working products."}
            </span>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="my-3 max-w-[640px] text-base leading-7 text-gray-300 md:text-lg"
        >
          {vi
            ? "Mình là Mai Tran Thien Tam, sinh viên năm cuối ngành Kỹ thuật Phần mềm tại Hung Vuong University. Hiện ở HCM, mình xây dựng sản phẩm web, mobile và AI."
            : "I'm Mai Tran Thien Tam, a final-year Software Engineering student at Hung Vuong University. Based in HCM, I build web, mobile and AI-powered products."}
        </motion.p>

        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-wrap items-center gap-3"
        >
          <Link
            href="/projects/safe-return"
            onClick={() => track("hero-case-study")}
            className="button-primary rounded-lg border border-[#7f5cff]/50 px-5 py-3 text-center font-semibold text-white active:scale-[0.98]"
          >
            {vi ? "Xem case study nổi bật" : "View featured case study"}
          </Link>
          <a
            href="/Mai-Tran-Thien-Tam-CV.pdf"
            download
            onClick={() => track("cv-download")}
            className="rounded-lg border border-white/15 px-5 py-3 text-center font-semibold text-gray-100 transition hover:border-[#8bdcff]/50 hover:text-white active:scale-[0.98]"
          >
            {vi ? "Tải CV" : "Download CV"}
          </a>
          <a
            href="mailto:maitamit062005@gmail.com"
            onClick={() => track("contact")}
            className="px-3 py-3 text-sm font-semibold text-[#8bdcff] underline-offset-4 hover:underline"
          >
            {vi ? "Liên hệ" : "Contact"}
          </a>
        </motion.div>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="flex h-full w-full items-center justify-center md:w-[44%]"
      >
        <TechOrbit />
      </motion.div>
    </motion.div>
  );
};
