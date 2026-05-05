import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';

const rootDir = process.cwd();
const distDir = join(rootDir, 'dist');
const postsPath = join(rootDir, 'public/data/posts.json');
const postsDir = join(rootDir, 'public/posts');
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || 'https://eu-ia-eta.vercel.app');
const author = {
  name: 'Ismael Nunes dos Santos',
  url: 'https://www.linkedin.com/in/ismael-nunes-dos-santos'
};
const site = {
  name: 'Eu + IA',
  title: 'Eu + IA | Prompts, IA e bastidores de projetos reais',
  description:
    'Um diário de criação onde prompts, inteligência artificial e decisões humanas viram produtos digitais reais.',
  image: '/images/articles/blog-eu-ia/home-desktop.png',
  imageAlt: 'Página inicial do blog Eu + IA em desktop, com hero editorial e lista de artigos.'
};

const posts = JSON.parse(readFileSync(postsPath, 'utf8')).sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

const assets = getBuildAssets();

rmSync(join(distDir, 'blog'), { recursive: true, force: true });
rmSync(join(distDir, 'sobre'), { recursive: true, force: true });
rmSync(join(distDir, 'sobre.html'), { force: true });

writeHome();
writeAbout();
await writeArticles();
writeSitemap();
writeRobots();

function normalizeSiteUrl(value) {
  return value.replace(/\/+$/, '');
}

function getBuildAssets() {
  const assetDir = join(distDir, 'assets');
  const files = readdirSync(assetDir);
  const css = files.find((file) => file.endsWith('.css'));
  const shared = files.find((file) => file.startsWith('components-') && file.endsWith('.js'));
  const index = files.find((file) => file.startsWith('index-') && file.endsWith('.js'));
  const article = files.find((file) => file.startsWith('article-') && file.endsWith('.js'));

  if (!css || !shared || !index || !article) {
    throw new Error('Não foi possível localizar os assets gerados pelo Vite.');
  }

  return {
    css: `/assets/${css}`,
    shared: `/assets/${shared}`,
    index: `/assets/${index}`,
    article: `/assets/${article}`
  };
}

function absoluteUrl(pathname) {
  if (pathname.startsWith('http')) {
    return pathname;
  }

  return `${siteUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

function getLocalAssetPath(pathname) {
  return join(rootDir, 'public', pathname.replace(/^\//, ''));
}

function blogUrl(slug) {
  return `/blog/${encodeURIComponent(slug)}/`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function getImageDimensions(pathname) {
  if (!pathname.startsWith('/')) {
    return undefined;
  }

  if (!pathname.toLowerCase().endsWith('.png')) {
    return undefined;
  }

  try {
    const file = readFileSync(getLocalAssetPath(pathname));

    if (file.length < 24 || file.toString('ascii', 1, 4) !== 'PNG') {
      return undefined;
    }

    return {
      width: file.readUInt32BE(16),
      height: file.readUInt32BE(20)
    };
  } catch {
    return undefined;
  }
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`));
}

function slugifyHeading(value) {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'secao'
  );
}

function withHeadingIds(html) {
  const usedIds = new Map();

  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level, content) => {
    const baseId = slugifyHeading(content);
    const count = usedIds.get(baseId) || 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    usedIds.set(baseId, count + 1);

    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

function withPromptBlocks(html) {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_match, content) => {
    return `<blockquote class="prompt" aria-label="Bloco de prompt">${content}<button type="button" class="copy-prompt" title="Copiar prompt" aria-label="Copiar prompt"><span class="copy-icon" aria-hidden="true"></span></button></blockquote>`;
  });
}

async function renderMarkdown(markdown) {
  const html = await marked.parse(markdown, { gfm: true });
  return withPromptBlocks(withHeadingIds(html));
}

function getArticleImageData(markdown, title) {
  const match = markdown.match(/<img\s+[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/i);

  if (match) {
    return {
      src: match[1],
      alt: match[2] || `Imagem do artigo ${title}.`
    };
  }

  const srcOnlyMatch = markdown.match(/<img\s+[^>]*src="([^"]+)"/i);

  return {
    src: srcOnlyMatch?.[1] || site.image,
    alt: `Imagem de capa do artigo ${title}.`
  };
}

function renderTagBadge(tag, selectedTag) {
  const isActive = selectedTag && tag.toLowerCase() === selectedTag.toLowerCase();

  return `<a class="badge${isActive ? ' is-active' : ''}" href="/?tag=${encodeURIComponent(tag)}" aria-label="Ver artigos com a tag ${escapeHtml(tag)}">#${escapeHtml(tag)}</a>`;
}

function renderPostCard(post, index) {
  const number = String(index + 1).padStart(2, '0');

  return `
    <article class="post-card">
      <div class="post-index" aria-hidden="true">${number}</div>
      <div class="post-card-body">
        <div class="post-card-meta">
          <time datetime="${escapeHtml(post.date)}">${formatLongDate(post.date)}</time>
          <span>~${post.readingMinutes || 1} min de leitura</span>
        </div>
        <h2>
          <a class="post-title-link" href="${blogUrl(post.slug)}">${escapeHtml(post.title)}</a>
        </h2>
        <p>${escapeHtml(post.description)}</p>
        <div class="post-card-footer">
          <div class="tag-list" aria-label="Tags do artigo">
            ${post.tags.map((tag) => renderTagBadge(tag)).join('')}
          </div>
          <a class="read-link" href="${blogUrl(post.slug)}" aria-label="Ler artigo ${escapeHtml(post.title)}">Ler artigo</a>
        </div>
      </div>
    </article>
  `;
}

function renderHead({
  title,
  description,
  canonicalPath,
  type = 'website',
  image = site.image,
  imageAlt = site.imageAlt,
  jsonLd
}) {
  const canonical = absoluteUrl(canonicalPath);
  const absoluteImage = absoluteUrl(image);
  const imageDimensions = getImageDimensions(image);
  const imageMeta = imageDimensions
    ? `
    <meta property="og:image:width" content="${imageDimensions.width}" />
    <meta property="og:image:height" content="${imageDimensions.height}" />`
    : '';

  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${escapeHtml(site.name)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${absoluteImage}" />
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />${imageMeta}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${absoluteImage}" />
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />
    <script type="application/ld+json">${escapeJson(jsonLd)}</script>
    <link rel="modulepreload" crossorigin href="${assets.shared}">
    <link rel="stylesheet" crossorigin href="${assets.css}">
  `;
}

function renderHero() {
  return `
    <header class="site-header" aria-label="Apresentação do blog">
      <div class="hero-layout">
        <div class="hero-content">
          <p class="site-kicker">Diário de criação com IA</p>
          <h1>Eu + IA</h1>
          <p class="site-signature">Prompts reais, decisões humanas e bastidores de desenvolvimento transformados em produtos digitais.</p>
          <div class="hero-actions" aria-label="Ações principais">
            <a class="button-link is-primary" href="#artigos">Ler artigos</a>
            <a class="button-link is-secondary" href="#comece">Comece por aqui</a>
            <a class="button-link is-secondary" href="/sobre/">Sobre</a>
          </div>
        </div>
        <div class="hero-terminal" aria-label="Exemplo de prompt do blog">
          <div class="terminal-topline">
            <span>prompt.md</span>
            <span>Eu + IA</span>
          </div>
          <pre><code>Objetivo:
documentar como uma ideia vira produto.

Entrada:
prompt + contexto + decisões.

Saída:
artigo real, código real, aprendizado real.</code></pre>
        </div>
      </div>
      <div class="hero-proof" aria-label="Resumo do blog">
        <span>Prompts reais</span>
        <span>Making-of aberto</span>
        <span>HTML + TypeScript</span>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer" aria-labelledby="footer-title">
      <div class="footer-brand">
        <a id="footer-title" class="footer-logo" href="/">Eu + IA</a>
        <p>Diário de criação com inteligência artificial, prompts reais e bastidores de produtos digitais.</p>
      </div>
      <nav class="footer-nav" aria-label="Navegação do rodapé">
        <strong>Explorar</strong>
        <a href="/#comece">Comece por aqui</a>
        <a href="/#artigos">Artigos</a>
        <a href="/sobre/">Sobre</a>
      </nav>
      <nav class="footer-nav" aria-label="Links externos">
        <strong>Conectar</strong>
        <a href="https://github.com/ismaeldevweb-afk/Blog-Eu-IA">GitHub</a>
        <a href="${author.url}">LinkedIn</a>
      </nav>
      <div class="footer-stack" aria-label="Tecnologias usadas">
        <strong>Feito com</strong>
        <div>
          <span>HTML</span>
          <span>CSS</span>
          <span>TypeScript</span>
          <span>Markdown</span>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Ismael Nunes dos Santos.</span>
        <span>Prompts reais, produtos reais.</span>
      </div>
    </footer>
  `;
}

function writeHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl('/'),
    description: site.description,
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/')}?tag={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
${renderHead({
  title: site.title,
  description: site.description,
  canonicalPath: '/',
  image: site.image,
  imageAlt: site.imageAlt,
  jsonLd
})}
    <script type="module" crossorigin src="${assets.index}"></script>
  </head>
  <body class="home-page">
    <div class="site-shell">
      ${renderHero()}
      <main id="main-content">
        <section id="comece" class="start-section" aria-labelledby="start-title">
          <div class="section-heading">
            <p class="section-kicker">Comece por aqui</p>
            <h2 id="start-title">Três portas de entrada para acompanhar o processo.</h2>
          </div>
          <div class="start-grid">
            <a class="start-card" href="/blog/making-of-blog-eu-ia/">
              <span class="start-number">01</span>
              <strong>Leia o making-of</strong>
              <span>Entenda como a identidade, a estrutura e o primeiro MVP nasceram.</span>
            </a>
            <a class="start-card" href="/blog/making-of-blog-eu-ia/#o-prompt-inicial">
              <span class="start-number">02</span>
              <strong>Veja os prompts</strong>
              <span>Compare pedidos, escolhas de interface e respostas que viraram tela.</span>
            </a>
            <a class="start-card" href="/?tag=prompt%20engineering">
              <span class="start-number">03</span>
              <strong>Explore por tema</strong>
              <span>Use as tags para encontrar artigos por ferramenta, linguagem ou método.</span>
            </a>
          </div>
        </section>
        <section id="artigos" class="post-list-section" aria-labelledby="posts-title">
          <div class="section-heading is-inline">
            <div>
              <p class="section-kicker">Artigos recentes</p>
              <h2 id="posts-title">Bastidores publicados</h2>
            </div>
            <p>Relatos curtos, prompts reais e decisões práticas de construção.</p>
          </div>
          <div id="filter-state" class="filter-state" hidden></div>
          <div id="posts-list" class="post-list" aria-live="polite">
            ${posts.map((post, index) => renderPostCard(post, index)).join('')}
          </div>
        </section>
      </main>
      ${renderFooter()}
    </div>
  </body>
</html>`;

  writeFileSync(join(distDir, 'index.html'), html);
}

function renderArticleFooter(post, index) {
  const previousPost = index > 0 ? posts[index - 1] : undefined;
  const nextPost = index >= 0 ? posts[index + 1] : undefined;

  return `
    <footer id="article-footer" class="article-footer">
      <p>Publicado em ${formatLongDate(post.date)} no Eu + IA</p>
      <div class="tag-list is-centered" aria-label="Tags do artigo">
        ${post.tags.map((tag) => renderTagBadge(tag)).join('')}
      </div>
      <nav class="article-nav" aria-label="Navegação entre artigos">
        ${
          previousPost
            ? `<a href="${blogUrl(previousPost.slug)}"><span>Artigo mais recente</span><strong>${escapeHtml(previousPost.title)}</strong></a>`
            : '<span></span>'
        }
        ${
          nextPost
            ? `<a href="${blogUrl(nextPost.slug)}"><span>Próximo artigo</span><strong>${escapeHtml(nextPost.title)}</strong></a>`
            : '<span></span>'
        }
      </nav>
      <a class="button-link is-secondary" href="/">Voltar para a home</a>
    </footer>
  `;
}

async function writeArticles() {
  for (const [index, post] of posts.entries()) {
    const markdown = readFileSync(join(postsDir, `${post.slug}.md`), 'utf8');
    const content = await renderMarkdown(markdown);
    const image = getArticleImageData(markdown, post.title);
    const canonicalPath = blogUrl(post.slug);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': absoluteUrl(canonicalPath)
      },
      headline: post.title,
      description: post.description,
      image: [absoluteUrl(image.src)],
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: 'pt-BR',
      author: {
        '@type': 'Person',
        name: author.name,
        url: author.url
      },
      publisher: {
        '@type': 'Person',
        name: author.name,
        url: author.url
      },
      keywords: post.tags.join(', ')
    };
    const outDir = join(distDir, 'blog', post.slug);

    mkdirSync(outDir, { recursive: true });
    writeFileSync(
      join(outDir, 'index.html'),
      `<!doctype html>
<html lang="pt-BR">
  <head>
${renderHead({
  title: `${post.seoTitle || post.title} | Eu + IA`,
  description: post.description,
  canonicalPath,
  type: 'article',
  image: image.src,
  imageAlt: image.alt,
  jsonLd
})}
    <meta property="article:published_time" content="${post.date}" />
    ${post.tags.map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n    ')}
    <script type="module" crossorigin src="${assets.article}"></script>
  </head>
  <body class="article-page">
    <div class="site-shell">
      <header class="article-topbar">
        <a class="back-link" href="/" aria-label="Voltar para a página inicial do blog"><span aria-hidden="true">←</span> Voltar para o blog</a>
        <a class="brand-link" href="/" aria-label="Ir para a página inicial">Eu + IA</a>
      </header>
      <main id="main-content">
        <article class="article-reader" aria-live="polite">
          <header class="article-hero">
            <p class="article-kicker">Making-of publicado</p>
            <h1 id="article-title">${escapeHtml(post.title)}</h1>
            <p id="article-description" class="article-description">${escapeHtml(post.description)}</p>
            <p id="article-meta" class="article-meta">${formatLongDate(post.date)} · ~${post.readingMinutes || 1} min de leitura</p>
          </header>
          <div id="article-content" class="article-content">${content}</div>
          ${renderArticleFooter(post, index)}
        </article>
      </main>
      ${renderFooter()}
    </div>
  </body>
</html>`
    );
  }
}

function writeAbout() {
  const canonicalPath = '/sobre/';
  const description =
    'Conheça o Eu + IA, um diário de criação com inteligência artificial, prompts reais, decisões humanas e aprendizados práticos.';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Sobre o Eu + IA',
    url: absoluteUrl(canonicalPath),
    description,
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url
    }
  };
  const outDir = join(distDir, 'sobre');

  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, 'index.html'),
    `<!doctype html>
<html lang="pt-BR">
  <head>
${renderHead({
  title: 'Sobre o Eu + IA | Diário de criação com inteligência artificial',
  description,
  canonicalPath,
  image: site.image,
  imageAlt: site.imageAlt,
  jsonLd
})}
  </head>
  <body class="about-page">
    <div class="site-shell">
      <header class="article-topbar">
        <a class="back-link" href="/" aria-label="Voltar para a página inicial do blog"><span aria-hidden="true">←</span> Voltar para o blog</a>
        <a class="brand-link" href="/" aria-label="Ir para a página inicial">Eu + IA</a>
      </header>
      <main>
        <section class="about-hero" aria-labelledby="about-title">
          <p class="site-kicker">Sobre</p>
          <h1 id="about-title">Um diário de criação com inteligência artificial.</h1>
          <p>Este blog é meu espaço para documentar projetos reais, prompts, decisões, erros e aprendizados práticos. A IA aparece como parceira, mas a curadoria, o contexto e as escolhas continuam humanas.</p>
        </section>
        <section class="about-panel">
          <h2>O que você encontra aqui</h2>
          <p>Making-ofs de produtos digitais, bastidores de desenvolvimento, trechos de prompts, decisões de design, escolhas técnicas e reflexões sobre como transformar ideias em entregas reais.</p>
          <p>O objetivo é mostrar o processo com clareza: o que foi pedido, o que foi ajustado, o que funcionou e o que pode melhorar no próximo projeto.</p>
          <div class="hero-actions">
            <a class="button-link is-primary" href="/#artigos">Ler artigos</a>
            <a class="button-link is-secondary" href="${author.url}">LinkedIn</a>
            <a class="button-link is-secondary" href="https://github.com/ismaeldevweb-afk/Blog-Eu-IA">GitHub</a>
          </div>
        </section>
      </main>
      ${renderFooter()}
    </div>
  </body>
</html>`
  );
}

function writeSitemap() {
  const urls = [
    { loc: absoluteUrl('/'), lastmod: new Date().toISOString().slice(0, 10) },
    { loc: absoluteUrl('/sobre/'), lastmod: new Date().toISOString().slice(0, 10) },
    ...posts.map((post) => ({
      loc: absoluteUrl(blogUrl(post.slug)),
      lastmod: post.date
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  writeFileSync(join(distDir, 'sitemap.xml'), xml);
}

function writeRobots() {
  writeFileSync(
    join(distDir, 'robots.txt'),
    `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`
  );
}
