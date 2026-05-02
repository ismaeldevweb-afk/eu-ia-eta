import type { Post } from './types';

export async function loadPosts(): Promise<Post[]> {
  const response = await fetch('/data/posts.json');

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar a lista de artigos.');
  }

  const posts = (await response.json()) as Post[];

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function formatLongDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`));
}

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return Math.max(1, Math.ceil(words.length / 220));
}
