import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectControlRoom } from "@/components/main/project-control-room";
import {
  getProjectBySlug,
  PROJECT_DETAILS,
} from "@/constants/project-details";

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

  const image = `https://raw.githubusercontent.com/maitamdev/maitam-pf/main/public${project.image}`;
  return {
    title: `${project.title} Case Study | MaiTamDev`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — Mission Report`,
      description: project.summary,
      type: "article",
      images: [{ url: image, width: 1200, height: 600 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Mission Report`,
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

  return (
    <main className="mission-page">
      <div className="mission-page-nav">
        <Link href="/#projects">← Back to universe</Link>
        <span>{project.status} · {project.period}</span>
      </div>
      <ProjectControlRoom project={project} />
    </main>
  );
}
