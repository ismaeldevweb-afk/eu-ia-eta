import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { absoluteUrl, blogPath } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  return [
    {
      url: absoluteUrl("/"),
    },
    {
      url: absoluteUrl("/sobre/"),
    },
    ...posts.map((post) => ({
      url: absoluteUrl(blogPath(post.slug)),
      lastModified: post.date,
    })),
  ];
}
