"use client";

import { usePortfolio } from "@/lib/portfolio-context";

const events = [
  {
    year: "2023",
    title: "Software Engineering",
    titleVi: "Bắt đầu Kỹ thuật Phần mềm",
    text: "Started at Hung Vuong University and built a foundation in software development.",
    textVi:
      "Bắt đầu tại Hung Vuong University và xây nền tảng phát triển phần mềm.",
  },
  {
    year: "2024",
    title: "Full-stack foundations",
    titleVi: "Nền tảng full-stack",
    text: "Expanded from responsive interfaces into APIs, databases and product workflows.",
    textVi:
      "Mở rộng từ giao diện responsive sang API, cơ sở dữ liệu và luồng sản phẩm.",
  },
  {
    year: "2025",
    title: "Valley Campus",
    titleVi: "Valley Campus",
    text: "Built, tested and fixed an Odoo-based e-commerce product as a FullStack Developer.",
    textVi:
      "Xây dựng, kiểm thử và sửa lỗi sản phẩm thương mại điện tử Odoo với vai trò FullStack Developer.",
  },
  {
    year: "2025",
    title: "Innovation & Startup",
    titleVi: "Innovation & Startup",
    text: "Developed DHV Guiding Light and SCS GO around mentoring and EV mobility.",
    textVi:
      "Phát triển DHV Guiding Light và SCS GO cho cố vấn sinh viên và di chuyển xe điện.",
  },
  {
    year: "NOW",
    title: "Product builder",
    titleVi: "Xây dựng sản phẩm",
    text: "Shipping web, mobile and AI-assisted products while sharpening architecture and quality.",
    textVi:
      "Phát hành sản phẩm web, mobile và AI, đồng thời nâng cao kiến trúc và chất lượng.",
  },
  {
    year: "NEXT",
    title: "FullStack opportunities",
    titleVi: "Cơ hội FullStack",
    text: "Ready to contribute to a product team and grow through real delivery.",
    textVi:
      "Sẵn sàng đóng góp cho đội ngũ sản phẩm và phát triển qua quá trình triển khai thực tế.",
  },
] as const;

export const CareerTimeline = () => {
  const { language } = usePortfolio();
  const vi = language === "vi";

  return (
    <section className="flight-timeline" aria-labelledby="flight-timeline-title">
      <header>
        <p>{vi ? "TUYẾN BAY SỰ NGHIỆP" : "CAREER FLIGHT PATH"}</p>
        <h2 id="flight-timeline-title">
          {vi ? "Từ nền tảng đến sản phẩm thực tế." : "From foundations to shipped products."}
        </h2>
      </header>
      <ol>
        {events.map((event, index) => (
          <li key={`${event.year}-${event.title}`}>
            <div>
              <span>{event.year}</span>
              <i aria-hidden="true" />
            </div>
            <article>
              <small>FLIGHT 0{index + 1}</small>
              <h3>{vi ? event.titleVi : event.title}</h3>
              <p>{vi ? event.textVi : event.text}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
};
