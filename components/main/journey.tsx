"use client";

import { usePortfolio } from "@/lib/portfolio-context";

export const Journey = () => {
  const { language } = usePortfolio();
  const vi = language === "vi";

  return (
    <section
      id="experience"
      aria-labelledby="journey-title"
      className="relative mx-auto w-full max-w-[1200px] px-6 py-20 md:px-10"
    >
      <div className="mb-12 max-w-2xl">
        <h2
          id="journey-title"
          className="text-4xl font-semibold tracking-tight text-white md:text-5xl"
        >
          {vi ? "Học vấn & Kinh nghiệm" : "Education & Experience"}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-400">
          {vi
            ? "Nền tảng học thuật và kinh nghiệm chuyên môn của mình trong phát triển phần mềm full-stack."
            : "My academic foundation and professional experience in full-stack software development."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-xl border border-[#2A0E61] bg-[#09031c]/70 p-6 shadow-lg shadow-[#2A0E61]/10 md:p-8">
          <p className="text-sm font-medium text-[#b49bff]">
            {vi ? "Học vấn" : "Education"}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            Hung Vuong University
          </h3>
          <p className="mt-2 text-lg text-gray-300">Software Engineering</p>
          <p className="mt-2 text-sm font-medium text-[#b49bff]">
            2023 - 2027
          </p>
          <p className="mt-5 max-w-md leading-relaxed text-gray-400">
            {vi
              ? "Sinh viên năm cuối tập trung xây dựng các sản phẩm web, mobile và AI có giá trị sử dụng thực tế."
              : "Final-year student focused on building practical web, mobile and AI-powered software products."}
          </p>
        </article>

        <article className="rounded-xl border border-[#2A0E61] bg-gradient-to-br from-[#12062b]/90 to-[#070217]/90 p-6 shadow-lg shadow-[#2A0E61]/10 md:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#b49bff]">
                {vi ? "Kinh nghiệm" : "Experience"}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                FullStack Developer
              </h3>
              <p className="mt-2 text-lg text-gray-300">Valley Campus</p>
            </div>
            <p className="whitespace-nowrap text-sm font-medium text-gray-400">
              Jan 2025 - Feb 2026
            </p>
          </div>
          <p className="mt-5 max-w-xl leading-relaxed text-gray-400">
            {vi
              ? "Xây dựng, kiểm thử và sửa lỗi cho website thương mại điện tử dựa trên Odoo của Valley Campus, phục vụ sản phẩm bảo vệ sức khỏe và mỹ phẩm."
              : "Built, tested and fixed issues for Valley Campus's Odoo-based e-commerce website serving health-protection and cosmetics products."}
          </p>
          <div className="mt-6 inline-flex rounded-lg border border-[#7042f88b] px-3 py-2 text-sm font-medium text-gray-200">
            Odoo
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-xl border border-[#2A0E61] bg-[#09031c]/70 p-6 shadow-lg shadow-[#2A0E61]/10 md:p-8">
        <p className="text-sm font-medium text-[#b49bff]">
          Innovation &amp; Startup 2025
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold text-white">
              DHV Guiding Light
            </h3>
            <p className="mt-2 leading-relaxed text-gray-400">
              {vi
                ? "Phát triển nền tảng cố vấn một-một kết nối sinh viên Hung Vuong University với người hướng dẫn."
                : "Developed a one-to-one mentoring platform connecting Hung Vuong University students with advisors."}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">SCS GO</h3>
            <p className="mt-2 leading-relaxed text-gray-400">
              {vi
                ? "Phát triển nền tảng web và mobile để tìm trạm sạc xe điện, phân tích vị trí và đưa ra gợi ý."
                : "Developed a web and mobile platform for EV charging-station discovery, location analysis and recommendations."}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};
