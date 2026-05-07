import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import { formatLongDate } from "@/lib/date";
import type { Post } from "@/types";

const rootDir = process.cwd();
const postsPath = join(rootDir, "public/data/posts.json");
const postsDir = join(rootDir, "public/posts");

export async function getPosts(): Promise<Post[]> {
  const raw = await readFile(postsPath, "utf8");
  const posts = JSON.parse(raw) as Post[];

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();

  return posts.find((post) => post.slug === slug);
}

export async function getPostMarkdown(slug: string): Promise<string> {
  return readFile(join(postsDir, `${slug}.md`), "utf8");
}

export { formatLongDate };

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return Math.max(1, Math.ceil(words.length / 220));
}

function slugifyHeading(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "secao"
  );
}

function withHeadingIds(html: string): string {
  const usedIds = new Map<string, number>();

  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level, content) => {
    const baseId = slugifyHeading(content);
    const count = usedIds.get(baseId) || 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    usedIds.set(baseId, count + 1);

    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

function withPromptBlocks(html: string): string {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_match, content) => {
    return `<blockquote class="prompt" aria-label="Bloco de prompt">${content}<button type="button" class="copy-prompt" title="Copiar prompt" aria-label="Copiar prompt"><span class="copy-icon" aria-hidden="true"></span></button></blockquote>`;
  });
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const html = await marked.parse(markdown, { gfm: true });

  return withPromptBlocks(withHeadingIds(html));
}

export function getArticleImageData(markdown: string, title: string): { src: string; alt: string } {
  const match = markdown.match(/<img\s+[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/i);

  if (match) {
    return {
      src: match[1],
      alt: match[2] || `Imagem do artigo ${title}.`,
    };
  }

  const srcOnlyMatch = markdown.match(/<img\s+[^>]*src="([^"]+)"/i);

  return {
    src: srcOnlyMatch?.[1] || "/images/articles/blog-eu-ia/home-desktop.png",
    alt: `Imagem de capa do artigo ${title}.`,
  };
}
