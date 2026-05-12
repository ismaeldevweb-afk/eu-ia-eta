import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, TagBadge } from "@/app/_components";
import PromptCopyEnhancer from "@/app/blog/[slug]/PromptCopyEnhancer";
import {
  estimateReadingMinutes,
  formatLongDate,
  getArticleImageData,
  getPost,
  getPostMarkdown,
  getPosts,
  renderMarkdown,
} from "@/lib/posts";
import { absoluteUrl, author, blogPath, site } from "@/lib/site";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  const markdown = await getPostMarkdown(post.slug);
  const image = getArticleImageData(markdown, post.title);
  const url = absoluteUrl(blogPath(post.slug));
  const title = `${post.seoTitle || post.title} | ${site.name}`;

  return {
    title,
    description: post.description,
    alternates: {
      canonical: blogPath(post.slug),
    },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: site.name,
      url,
      title,
      description: post.description,
      images: [
        {
          url: absoluteUrl(image.src),
          alt: image.alt,
        },
      ],
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: [absoluteUrl(image.src)],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const markdown = await getPostMarkdown(post.slug);
  const content = await renderMarkdown(markdown);
  const image = getArticleImageData(markdown, post.title);
  const readingMinutes = post.readingMinutes ?? estimateReadingMinutes(markdown);
  const postIndex = posts.findIndex((item) => item.slug === post.slug);
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost = postIndex >= 0 ? posts[postIndex + 1] : undefined;
  const canonicalPath = blogPath(post.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(canonicalPath),
    },
    headline: post.title,
    description: post.description,
    image: [absoluteUrl(image.src)],
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "pt-BR",
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    publisher: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <div className="article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PromptCopyEnhancer />
      <div className="site-shell">
        <header className="article-topbar">
          <a className="back-link" href="/" aria-label="Voltar para a página inicial do blog">
            <span aria-hidden="true">&larr;</span> Voltar para o blog
          </a>
          <a className="brand-link" href="/" aria-label="Ir para a página inicial">
            Eu + IA
          </a>
        </header>
        <main id="main-content">
          <article className="article-reader">
            <header className="article-hero">
              <p className="article-kicker">Making-of publicado</p>
              <h1 id="article-title">{post.title}</h1>
              <p id="article-description" className="article-description">
                {post.description}
              </p>
              <p id="article-meta" className="article-meta">
                {formatLongDate(post.date)} · ~{readingMinutes} min de leitura
              </p>
            </header>
            <div
              id="article-content"
              className="article-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <footer id="article-footer" className="article-footer">
              <p>Publicado em {formatLongDate(post.date)} no Eu + IA</p>
              <div className="tag-list is-centered" aria-label="Tags do artigo">
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
              <nav className="article-nav" aria-label="Navegação entre artigos">
                {previousPost ? (
                  <a href={blogPath(previousPost.slug)}>
                    <span>Artigo mais recente</span>
                    <strong>{previousPost.title}</strong>
                  </a>
                ) : (
                  <span />
                )}
                {nextPost ? (
                  <a href={blogPath(nextPost.slug)}>
                    <span>Próximo artigo</span>
                    <strong>{nextPost.title}</strong>
                  </a>
                ) : (
                  <span />
                )}
              </nav>
              <a className="button-link is-secondary" href="/">
                Voltar para a home
              </a>
            </footer>
          </article>
        </main>
        <Footer />
      </div>
    </div>
  );
}
