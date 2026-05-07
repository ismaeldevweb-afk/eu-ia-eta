import { Footer } from "@/app/_components";

export default function NotFound() {
  return (
    <div className="about-page">
      <div className="site-shell">
        <header className="article-topbar">
          <a className="brand-link" href="/" aria-label="Ir para a página inicial">
            Eu + IA
          </a>
        </header>
        <main>
          <section className="about-hero" aria-labelledby="not-found-title">
            <p className="site-kicker">404</p>
            <h1 id="not-found-title">Página não encontrada.</h1>
            <p>O conteúdo que você tentou acessar não existe ou mudou de endereço.</p>
            <div className="hero-actions">
              <a className="button-link is-primary" href="/">
                Voltar para a home
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
