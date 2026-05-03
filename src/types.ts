export interface Post {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes?: number;
}
