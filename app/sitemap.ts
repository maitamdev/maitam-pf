import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config";
import { PROJECT_DETAILS } from "@/constants/project-details";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = PROJECT_DETAILS.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects,
  ];
}
