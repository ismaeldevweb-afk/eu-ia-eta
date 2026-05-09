import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { absoluteUrl, blogPath } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date("2026-05-07"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/sobre/"),
      lastModified: new Date("2026-05-07"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(blogPath(post.slug)),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
