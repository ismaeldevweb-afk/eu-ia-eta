import { Suspense } from "react";
import { Footer, Hero } from "@/app/_components";
import PostList from "@/app/PostList";
import { getPosts } from "@/lib/posts";
import { author, absoluteUrl, site } from "@/lib/site";

export default async function HomePage() {
  const posts = await getPosts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl("/"),
    description: site.description,
    inLanguage: "pt-BR",
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
  };

  return (
    <div className="home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="site-shell">
        <Hero />
        <main id="main-content">
          <section id="comece" className="start-section" aria-labelledby="start-title">
            <div className="section-heading">
              <p className="section-kicker">Comece por aqui</p>
              <h2 id="start-title">Três portas de entrada para acompanhar o processo.</h2>
            </div>
            <div className="start-grid">
              <a className="start-card" href="/blog/making-of-blog-eu-ia/">
                <span className="start-number">01</span>
                <strong>Leia o making-of</strong>
                <span>Entenda como a identidade, a estrutura e o primeiro MVP nasceram.</span>
              </a>
              <a className="start-card" href="/blog/making-of-blog-eu-ia/#o-prompt-inicial">
                <span className="start-number">02</span>
                <strong>Veja os prompts</strong>
                <span>Compare pedidos, escolhas de interface e respostas que viraram tela.</span>
              </a>
              <a className="start-card" href="/?tag=prompt%20engineering">
                <span className="start-number">03</span>
                <strong>Explore por tema</strong>
                <span>Use as tags para encontrar artigos por ferramenta, linguagem ou método.</span>
              </a>
            </div>
          </section>

          <section id="artigos" className="post-list-section" aria-labelledby="posts-title">
            <div className="section-heading is-inline">
              <div>
                <p className="section-kicker">Artigos recentes</p>
                <h2 id="posts-title">Bastidores publicados</h2>
              </div>
              <p>Relatos curtos, prompts reais e decisões práticas de construção.</p>
            </div>
            <Suspense fallback={<div className="post-list" />}>
              <PostList posts={posts} />
            </Suspense>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
