"use client";

import { motion } from "framer-motion";

import { slideInFromTop } from "@/lib/motion";
import { usePortfolio } from "@/lib/portfolio-context";

const principles = [
  {
    code: "RELIABILITY",
    title: "Predictable product flows",
    titleVi: "Luồng sản phẩm có thể tin cậy",
    text: "Validation, explicit error states and fallbacks keep the product useful beyond a perfect demo path.",
    textVi:
      "Validation, trạng thái lỗi rõ ràng và dữ liệu dự phòng giúp sản phẩm vẫn hữu ích ngoài kịch bản demo hoàn hảo.",
    signal: "Validation / errors / fallbacks",
  },
  {
    code: "ARCHITECTURE",
    title: "Clear system boundaries",
    titleVi: "Ranh giới hệ thống rõ ràng",
    text: "Interfaces, services and data responsibilities are separated so features can evolve without fragile coupling.",
    textVi:
      "Giao diện, dịch vụ và trách nhiệm dữ liệu được tách rõ để tính năng phát triển mà không tạo liên kết mong manh.",
    signal: "UI / services / data",
  },
  {
    code: "RESPONSIBILITY",
    title: "AI with a safe fallback",
    titleVi: "AI luôn có phương án dự phòng",
    text: "AI assists decisions and navigation, while verified portfolio data and deterministic actions remain in control.",
    textVi:
      "AI hỗ trợ quyết định và điều hướng, còn dữ liệu portfolio đã xác minh cùng hành động xác định vẫn giữ quyền kiểm soát.",
    signal: "Verified context / controlled actions",
  },
] as const;

export const Encryption = () => {
  const { language } = usePortfolio();
  const vi = language === "vi";

  return (
    <section className="engineering-principles" aria-labelledby="principles-title">
      <div className="engineering-principles__field" aria-hidden="true" />
      <motion.header variants={slideInFromTop}>
        <p>{vi ? "NGUYÊN TẮC KỸ THUẬT" : "ENGINEERING PRINCIPLES"}</p>
        <h2 id="principles-title">
          {vi ? "Không dừng ở một bản demo đẹp." : "Built beyond the demo."}
        </h2>
        <span>
          {vi
            ? "Sản phẩm tốt phải dễ hiểu, chịu lỗi và tiếp tục mở rộng được."
            : "Good software stays understandable, resilient and ready to evolve."}
        </span>
      </motion.header>

      <div className="engineering-principles__list">
        {principles.map((principle, index) => (
          <article key={principle.code}>
            <span>0{index + 1}</span>
            <div>
              <small>{principle.code}</small>
              <h3>{vi ? principle.titleVi : principle.title}</h3>
            </div>
            <p>{vi ? principle.textVi : principle.text}</p>
            <strong>{principle.signal}</strong>
          </article>
        ))}
      </div>
    </section>
  );
};
