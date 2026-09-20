import type { MetadataRoute } from "next";
import projects from "@/public/projectData.json";

const SITE = "https://www.vivekchaturvedi.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/archive`, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${SITE}/project/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
