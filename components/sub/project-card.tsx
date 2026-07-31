import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  link: string;
  source: string;
  stack: readonly string[];
  status: string;
  role: string;
  caseStudyPath: string;
  featured?: boolean;
  caseStudyLabel: string;
  previewLabel: string;
  liveLabel: string;
  sourceLabel: string;
  onCaseStudy: () => void;
  onLive: () => void;
};

export const ProjectCard = ({
  src,
  title,
  description,
  link,
  source,
  stack,
  status,
  role,
  caseStudyPath,
  featured = false,
  caseStudyLabel,
  previewLabel,
  liveLabel,
  sourceLabel,
  onCaseStudy,
  onLive,
}: ProjectCardProps) => {
  return (
    <article
      className={`project-card relative overflow-hidden rounded-xl border border-[#2A0E61] bg-[#09031c]/70 shadow-lg transition-transform duration-300 hover:-translate-y-1 ${featured ? "md:col-span-2" : ""}`}
    >
      <Link
        href={caseStudyPath}
        aria-label={`${title} case study`}
        className="block overflow-hidden"
      >
      <Image
        src={src}
        alt={title}
        width={1000}
        height={1000}
        unoptimized
        sizes={featured ? "(max-width: 768px) 100vw, 1200px" : "(max-width: 768px) 100vw, 680px"}
        className={`w-full object-cover transition duration-500 hover:scale-[1.015] ${featured ? "aspect-[2/1] md:aspect-[3/1]" : "aspect-[2/1]"}`}
      />
      </Link>

      <div className="relative p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#8bdcff]">{status}</span>
          <span className="text-gray-500">{role}</span>
        </div>
        <h3 className="text-2xl font-semibold text-white">
          <Link href={caseStudyPath}>{title}</Link>
        </h3>
        <p className="mt-3 text-gray-300 leading-relaxed">{description}</p>
        <p className="mt-4 text-sm leading-relaxed text-[#b9a7ef]">
          {stack.join(" · ")}
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            href={caseStudyPath}
            className="button-primary rounded-lg px-4 py-2 text-sm font-medium text-white active:scale-[0.98]"
          >
            {caseStudyLabel}
          </Link>
          <button
            type="button"
            onClick={onCaseStudy}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#7042f88b] hover:text-white active:scale-[0.98]"
          >
            {previewLabel}
          </button>
          <Link
            href={link}
            target="_blank"
            rel="noreferrer noopener"
            onClick={onLive}
            className="rounded-lg border border-[#7042f88b] px-4 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-[#7042f833] active:scale-[0.98]"
          >
            {liveLabel}
          </Link>
          <Link
            href={source}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg border border-[#7042f88b] px-4 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-[#7042f833] active:scale-[0.98]"
          >
            {sourceLabel}
          </Link>
        </div>
      </div>
    </article>
  );
};
