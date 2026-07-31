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
        className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]]"
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <h1 className="Welcome-text text-[13px]">
          {vi ? "Bộ công cụ kỹ thuật" : "Engineering toolbox"}
        </h1>
      </motion.div>

      <motion.div
        variants={slideInFromLeft(0.5)}
        className="text-[30px] text-white font-medium mt-[10px] text-center mb-[15px]"
      >
        {vi
          ? "Xây dựng trên nền tảng web, mobile và AI."
          : "Building across web, mobile and AI."}
      </motion.div>

      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive text-[20px] text-gray-200 mb-10 mt-[10px] text-center"
      >
        {vi
          ? "Những công cụ mình dùng để biến bài toán thực tế thành phần mềm hoạt động."
          : "Tools I use to turn real-world problems into working software."}
      </motion.div>
    </div>
  );
};
