"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";
import { usePortfolio } from "@/lib/portfolio-context";

export const HeroContent = () => {
  const { language } = usePortfolio();
  const vi = language === "vi";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-20 mt-28 md:mt-36 w-full z-[20]"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]]"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">
            Mai Tran Thien Tam | MaiTamDev
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-6xl text-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span>
            {vi ? "Xây dựng " : "Building "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              {vi ? "sản phẩm hữu ích" : "useful products"}
            </span>{" "}
            {vi ? "từ những ý tưởng thật." : "from real ideas."}
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
          {vi
            ? "Mình là Mai Tran Thien Tam, sinh viên năm cuối ngành Kỹ thuật Phần mềm tại Hung Vuong University. Hiện ở HCM, mình xây dựng sản phẩm web, mobile và AI."
            : "I'm Mai Tran Thien Tam, a final-year Software Engineering student at Hung Vuong University. Based in HCM, I build web, mobile and AI-powered products."}
        </motion.p>

        <motion.a
          variants={slideInFromLeft(1)}
          href="#projects"
          className="py-3 px-5 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px] active:scale-[0.98]"
        >
          {vi ? "Khám phá sản phẩm" : "Explore my work"}
        </motion.a>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-center items-center"
      >
        <Image
          src="/hero-bg.svg"
          alt="Developer workspace illustration"
          height={650}
          width={650}
          unoptimized
          draggable={false}
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
};
