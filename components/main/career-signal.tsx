"use client";

import { LINKS } from "@/constants";
import { usePortfolio } from "@/lib/portfolio-context";

export const CareerSignal = () => {
  const { language, track } = usePortfolio();
  const vi = language === "vi";

  return (
    <section className="career-signal" aria-labelledby="career-signal-title">
      <div>
        <p>{vi ? "TÍN HIỆU HIỆN TẠI" : "CURRENT SIGNAL"}</p>
        <h2 id="career-signal-title">
          {vi
            ? "Biến ý tưởng thật thành sản phẩm hoạt động."
            : "Turning real ideas into working products."}
        </h2>
      </div>
      <div className="career-signal-grid">
        <article>
          <span>01</span>
          <h3>{vi ? "Đang xây dựng" : "Currently building"}</h3>
          <p>
            {vi
              ? "Tiếp tục phát triển DHV Guiding Light cùng các sản phẩm web, mobile và AI có giá trị sử dụng thực tế."
              : "Continuing DHV Guiding Light alongside practical web, mobile and AI-powered products."}
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>{vi ? "Đang nâng cấp" : "Currently sharpening"}</h3>
          <p>
            {vi
              ? "Kiến trúc full-stack, React/TypeScript, Flutter, kiểm thử và cách biến AI thành tính năng đáng tin cậy."
              : "Full-stack architecture, React/TypeScript, Flutter, testing and reliable AI-assisted features."}
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>{vi ? "Sẵn sàng kết nối" : "Open to conversations"}</h3>
          <p>
            {vi
              ? "Đang mở cho cơ hội FullStack Developer, ý tưởng sản phẩm mới và dự án cộng tác."
              : "Open to FullStack Developer opportunities, product ideas and collaborative projects."}
          </p>
          <a href={LINKS.email} onClick={() => track("contact")}>
            {vi ? "Gửi email" : "Start a conversation"}
          </a>
        </article>
      </div>
    </section>
  );
};
