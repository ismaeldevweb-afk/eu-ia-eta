import { author, blogPath } from "@/lib/site";
import { formatLongDate } from "@/lib/date";
import type { Post } from "@/types";

export function TagBadge({ tag, selectedTag }: { tag: string; selectedTag?: string }) {
  const isActive = tag.toLowerCase() === selectedTag?.toLowerCase();

  return (
    <a
      className={`badge${isActive ? " is-active" : ""}`}
      href={`/?tag=${encodeURIComponent(tag)}`}
      aria-label={`Ver artigos com a tag ${tag}`}
    >
      #{tag}
    </a>
  );
}

export function PostCard({
  post,
  selectedTag,
  index,
}: {
  post: Post;
  selectedTag?: string;
  index: number;
}) {
  const postNumber = String(index + 1).padStart(2, "0");

  return (
    <article className="post-card">
      <div className="post-index" aria-hidden="true">
        {postNumber}
      </div>
      <div className="post-card-body">
        <div className="post-card-meta">
          <time dateTime={post.date}>{formatLongDate(post.date)}</time>
          {post.readingMinutes ? <span>~{post.readingMinutes} min de leitura</span> : null}
        </div>
        <h2>
          <a className="post-title-link" href={blogPath(post.slug)}>
            {post.title}
          </a>
        </h2>
        <p>{post.description}</p>
        <div className="post-card-footer">
          <div className="tag-list" aria-label="Tags do artigo">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} selectedTag={selectedTag} />
            ))}
          </div>
          <a className="read-link" href={blogPath(post.slug)} aria-label={`Ler artigo ${post.title}`}>
            Ler artigo
          </a>
        </div>
      </div>
    </article>
  );
}

export function Hero() {
  return (
    <header className="site-header" aria-label="Apresentação do blog">
      <div className="hero-layout">
        <div className="hero-content">
          <p className="site-kicker">Diário de criação com IA</p>
          <h1>Eu + IA</h1>
          <p className="site-signature">
            Prompts reais, decisões humanas e bastidores de desenvolvimento transformados em produtos
            digitais.
          </p>
          <div className="hero-actions" aria-label="Ações principais">
            <a className="button-link is-primary" href="#artigos">
              Ler artigos
            </a>
            <a className="button-link is-secondary" href="#comece">
              Comece por aqui
            </a>
            <a className="button-link is-secondary" href="/sobre/">
              Sobre
            </a>
          </div>
        </div>
        <div className="hero-terminal" aria-label="Exemplo de prompt do blog">
          <div className="terminal-topline">
            <span>prompt.md</span>
            <span>Eu + IA</span>
          </div>
          <pre>
            <code>{`Objetivo:
documentar como uma ideia vira produto.

Entrada:
prompt + contexto + decisões.

Saída:
artigo real, código real, aprendizado real.`}</code>
          </pre>
        </div>
      </div>
      <div className="hero-proof" aria-label="Resumo do blog">
        <span>Prompts reais</span>
        <span>Making-of aberto</span>
        <span>HTML + TypeScript</span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" aria-labelledby="footer-title">
      <div className="footer-brand">
        <a id="footer-title" className="footer-logo" href="/">
          Eu + IA
        </a>
        <p>Diário de criação com inteligência artificial, prompts reais e bastidores de produtos digitais.</p>
      </div>
      <nav className="footer-nav" aria-label="Navegação do rodapé">
        <strong>Explorar</strong>
        <a href="/#comece">Comece por aqui</a>
        <a href="/#artigos">Artigos</a>
        <a href="/sobre/">Sobre</a>
      </nav>
      <nav className="footer-nav" aria-label="Links externos">
        <strong>Conectar</strong>
        <a href="https://github.com/ismaeldevweb-afk/Blog-Eu-IA">GitHub</a>
        <a href={author.url}>LinkedIn</a>
      </nav>
      <div className="footer-stack" aria-label="Tecnologias usadas">
        <strong>Feito com</strong>
        <div>
          <span>Next.js</span>
          <span>React</span>
          <span>TypeScript</span>
          <span>Markdown</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Ismael Nunes dos Santos.</span>
        <span>Prompts reais, produtos reais.</span>
      </div>
    </footer>
  );
}
