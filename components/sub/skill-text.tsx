"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";
import { usePortfolio } from "@/lib/portfolio-context";

export const SkillText = () => {
  const { language } = usePortfolio();
  const vi = language === "vi";

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center">
      <motion.div
        variants={slideInFromTop}
        className="Welcome-box border border-[#7042f88b] px-[9px] py-[8px] opacity-90"
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <p className="Welcome-text text-[13px]">
          {vi ? "Bộ công cụ kỹ thuật" : "Engineering toolbox"}
        </p>
      </motion.div>

      <motion.h2
        variants={slideInFromLeft(0.5)}
        className="mt-4 max-w-[760px] text-center text-4xl font-semibold leading-none tracking-[-0.045em] text-white md:text-6xl"
      >
        {vi
          ? "Xây dựng trên nền tảng web, mobile và AI."
          : "Building across web, mobile and AI."}
      </motion.h2>

      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive mb-8 mt-5 max-w-[640px] text-center text-base leading-7 text-gray-400 md:text-lg"
      >
        {vi
          ? "Những công cụ mình dùng để biến bài toán thực tế thành phần mềm hoạt động."
          : "Tools I use to turn real-world problems into working software."}
      </motion.div>
    </div>
  );
};
