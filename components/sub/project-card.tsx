import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  link: string;
  source: string;
  stack: readonly string[];
  caseStudyLabel: string;
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
  caseStudyLabel,
  liveLabel,
  sourceLabel,
  onCaseStudy,
  onLive,
}: ProjectCardProps) => {
  return (
    <article className="relative overflow-hidden rounded-xl shadow-lg border border-[#2A0E61] bg-[#09031c]/70 transition-transform duration-300 hover:-translate-y-1">
      <Image
        src={src}
        alt={title}
        width={1000}
        height={1000}
        unoptimized
        className="w-full aspect-[2/1] object-cover"
      />

      <div className="relative p-5">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-3 text-gray-300 leading-relaxed">{description}</p>
        <p className="mt-4 text-sm leading-relaxed text-[#b9a7ef]">
          {stack.join(" · ")}
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onCaseStudy}
            className="button-primary rounded-lg px-4 py-2 text-sm font-medium text-white active:scale-[0.98]"
          >
            {caseStudyLabel}
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
