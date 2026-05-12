import { siteUrl } from "@/lib/site";

const lastModified = "2026-05-12T15:55:09+00:00";

const sitemapEntries = [
  {
    loc: `${siteUrl}/`,
    priority: "1.00",
  },
  {
    loc: `${siteUrl}/sobre/`,
    priority: "0.80",
  },
  {
    loc: `${siteUrl}/?tag=prompt%20engineering`,
    priority: "0.80",
  },
];

function buildSitemapXml(): string {
  const urls = sitemapEntries
    .map((entry) => {
      return [
        "<url>",
        `<loc>${entry.loc}</loc>`,
        `<lastmod>${lastModified}</lastmod>`,
        `<priority>${entry.priority}</priority>`,
        "</url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    "<!--  created with Free Online Sitemap Generator www.xml-sitemaps.com  -->",
    urls,
    "</urlset>",
  ].join("\n");
}

export function GET(): Response {
  return new Response(buildSitemapXml(), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
