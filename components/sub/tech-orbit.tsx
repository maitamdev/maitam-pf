import Image from "next/image";
import type { CSSProperties } from "react";

const technologies = [
  { name: "React", image: "react.png", x: "17%", y: "17%", delay: "-0.4s" },
  { name: "TypeScript", image: "ts.png", x: "70%", y: "11%", delay: "-1.8s" },
  { name: "Next.js", image: "next.png", x: "82%", y: "42%", delay: "-3.1s" },
  { name: "Supabase", image: "supabase.svg", x: "66%", y: "75%", delay: "-2.2s" },
  { name: "Flutter", image: "flutter.svg", x: "25%", y: "78%", delay: "-0.9s" },
  { name: "Node.js", image: "node.png", x: "4%", y: "48%", delay: "-2.7s" },
] as const;

export const TechOrbit = () => (
  <div className="tech-orbit" role="img" aria-label="MaiTamDev technology orbit">
    <div className="tech-orbit__glow" aria-hidden="true" />
    <div className="tech-orbit__ring tech-orbit__ring--outer" aria-hidden="true" />
    <div className="tech-orbit__ring tech-orbit__ring--middle" aria-hidden="true" />
    <div className="tech-orbit__ring tech-orbit__ring--inner" aria-hidden="true" />
    <div className="tech-orbit__sweep" aria-hidden="true" />

    <div className="tech-orbit__core" aria-hidden="true">
      <span>MT</span>
      <i />
    </div>

    {technologies.map((technology) => (
      <figure
        key={technology.name}
        className="tech-orbit__node"
        style={{
          "--node-x": technology.x,
          "--node-y": technology.y,
          "--node-delay": technology.delay,
        } as CSSProperties}
      >
        <Image
          src={`/skills/${technology.image}`}
          alt=""
          width={58}
          height={58}
          unoptimized
        />
        <figcaption>{technology.name}</figcaption>
      </figure>
    ))}

    <div className="tech-orbit__coordinate tech-orbit__coordinate--x" aria-hidden="true" />
    <div className="tech-orbit__coordinate tech-orbit__coordinate--y" aria-hidden="true" />
  </div>
);
