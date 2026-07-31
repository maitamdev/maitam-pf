import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectControlRoom } from "@/components/main/project-control-room";
import {
  getProjectBySlug,
  PROJECT_DETAILS,
} from "@/constants/project-details";
import { SITE_URL } from "@/config";

export const generateStaticParams = () =>
  PROJECT_DETAILS.map((project) => ({ slug: project.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const image = project.image;
  return {
    title: `${project.title} Case Study | MaiTamDev`,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} - Mission Report`,
      description: project.summary,
      type: "article",
      url: `${SITE_URL}/projects/${project.slug}`,
      images: [{ url: image, width: 1200, height: 600 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - Mission Report`,
      description: project.summary,
      images: [image],
    },
  };
};

export default async function ProjectMissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const projectIndex = PROJECT_DETAILS.findIndex((item) => item.slug === project.slug);
  const previous =
    PROJECT_DETAILS[(projectIndex - 1 + PROJECT_DETAILS.length) % PROJECT_DETAILS.length];
  const next = PROJECT_DETAILS[(projectIndex + 1) % PROJECT_DETAILS.length];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: `${SITE_URL}${project.image}`,
    creator: {
      "@type": "Person",
      name: "Mai Tran Thien Tam",
      url: SITE_URL,
    },
    keywords: project.stack.join(", "),
    temporalCoverage: project.period,
    sameAs: [project.live, project.source],
  };

  return (
    <main id="main-content" className="mission-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mission-page-nav">
        <Link href="/#projects">← Back to universe</Link>
        <span>{project.status} · {project.period}</span>
      </div>
      <ProjectControlRoom project={project} />
      <nav className="mission-neighbor-nav" aria-label="More project case studies">
        <Link href={`/projects/${previous.slug}`}>
          <span>Previous mission</span>
          <strong>{previous.title}</strong>
        </Link>
        <Link href={`/projects/${next.slug}`}>
          <span>Next mission</span>
          <strong>{next.title}</strong>
        </Link>
      </nav>
    </main>
  );
}
