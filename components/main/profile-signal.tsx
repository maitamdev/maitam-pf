"use client";

import { usePortfolio } from "@/lib/portfolio-context";

export const ProfileSignal = () => {
  const { language } = usePortfolio();
  const vi = language === "vi";

  const facts = [
    {
      value: "5",
      label: vi ? "sản phẩm có case study" : "products with case studies",
    },
    {
      value: "01/25 - 02/26",
      label: vi ? "FullStack Developer, Valley Campus" : "FullStack Developer, Valley Campus",
    },
    {
      value: "Web + Mobile + AI",
      label: vi ? "phạm vi sản phẩm" : "product range",
    },
    {
      value: "HCM",
      label: vi ? "sẵn sàng cho cơ hội mới" : "open to new opportunities",
    },
  ];

  return (
    <section className="profile-signal" aria-label={vi ? "Điểm nổi bật" : "Profile highlights"}>
      <dl>
        {facts.map((fact) => (
          <div key={fact.value}>
            <dt>{fact.value}</dt>
            <dd>{fact.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
