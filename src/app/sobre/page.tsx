import type { Metadata } from "next";
import { Footer } from "@/app/_components";
import { absoluteUrl, author, site } from "@/lib/site";

const description =
  "Conheça o Eu + IA, um diário de criação com inteligência artificial, prompts reais, decisões humanas e aprendizados práticos.";

export const metadata: Metadata = {
  title: "Sobre o Eu + IA | Diário de criação com inteligência artificial",
  description,
  alternates: {
    canonical: "/sobre/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    url: absoluteUrl("/sobre/"),
    title: "Sobre o Eu + IA | Diário de criação com inteligência artificial",
    description,
    images: [
      {
        url: absoluteUrl(site.image),
        width: 1280,
        height: 900,
        alt: site.imageAlt,
      },
    ],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Sobre o Eu + IA",
    url: absoluteUrl("/sobre/"),
    description,
    inLanguage: "pt-BR",
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
  };

  return (
    <div className="about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="site-shell">
        <header className="article-topbar">
          <a className="back-link" href="/" aria-label="Voltar para a página inicial do blog">
            <span aria-hidden="true">&larr;</span> Voltar para o blog
          </a>
          <a className="brand-link" href="/" aria-label="Ir para a página inicial">
            Eu + IA
          </a>
        </header>
        <main>
          <section className="about-hero" aria-labelledby="about-title">
            <p className="site-kicker">Sobre</p>
            <h1 id="about-title">Um diário de criação com inteligência artificial.</h1>
            <p>
              Este blog é meu espaço para documentar projetos reais, prompts, decisões, erros e
              aprendizados práticos. A IA aparece como parceira, mas a curadoria, o contexto e as
              escolhas continuam humanas.
            </p>
          </section>
          <section className="about-panel">
            <h2>O que você encontra aqui</h2>
            <p>
              Making-ofs de produtos digitais, bastidores de desenvolvimento, trechos de prompts,
              decisões de design, escolhas técnicas e reflexões sobre como transformar ideias em
              entregas reais.
            </p>
            <p>
              O objetivo é mostrar o processo com clareza: o que foi pedido, o que foi ajustado, o que
              funcionou e o que pode melhorar no próximo projeto.
            </p>
            <div className="hero-actions">
              <a className="button-link is-primary" href="/#artigos">
                Ler artigos
              </a>
              <a className="button-link is-secondary" href={author.url}>
                LinkedIn
              </a>
              <a className="button-link is-secondary" href="https://github.com/ismaeldevweb-afk/Blog-Eu-IA">
                GitHub
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
