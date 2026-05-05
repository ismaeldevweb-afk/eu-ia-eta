# Arquitetura técnica

Este documento descreve como o blog Eu + IA está organizado e como os arquivos se conectam.

## Visão geral

O projeto é uma aplicação estática multipágina com geração SEO no build:

- `index.html`: página inicial.
- `article.html`: fallback legado e rota de desenvolvimento para artigo.
- `sobre.html`: página Sobre usada no desenvolvimento local.
- `public/data/posts.json`: índice de posts.
- `public/posts/*.md`: conteúdo dos artigos.
- `src/*.ts`: renderização, carregamento e comportamento.
- `src/styles.css`: design system e estilos globais.
- `scripts/generate-static-pages.mjs`: gera HTML estático SEO em `dist/`.

O Vite empacota as páginas base e, em seguida, o script de geração cria as rotas públicas finais:

```text
/blog/[slug]/
/sobre/
/sitemap.xml
/robots.txt
```

## Entrada da home

Arquivo:

```text
src/main.ts
```

Responsabilidades:

- ler o filtro `?tag=`;
- buscar posts via `loadPosts()`;
- filtrar por tag quando necessário;
- renderizar cada card com `renderPostCard()`;
- exibir estado vazio ou erro.

## Entrada do artigo

Arquivo:

```text
src/article.ts
```

Responsabilidades:

- ler o parâmetro `?slug=` ou a rota `/blog/[slug]/`;
- buscar metadados no JSON;
- buscar Markdown em `public/posts`;
- converter Markdown para HTML com `marked`;
- gerar IDs automáticos para `h2` e `h3`;
- transformar blockquotes em blocos de prompt;
- adicionar botão de copiar prompt;
- renderizar rodapé com tags e navegação anterior/próximo.

No build de produção, essa mesma lógica continua disponível no cliente, mas o HTML inicial do artigo já é gerado por `scripts/generate-static-pages.mjs`.

## Componentes HTML

Arquivo:

```text
src/components.ts
```

Componentes:

- `renderTagBadge(tag, selectedTag)`;
- `renderPostCard(post, selectedTag, index)`.

Os componentes retornam strings HTML. Como os dados vêm de JSON/Markdown, os campos renderizados em strings passam por escape via `src/html.ts`.

## Utilitários de posts

Arquivo:

```text
src/posts.ts
```

Funções:

- `loadPosts()`: busca e ordena os posts por data decrescente.
- `formatLongDate(date)`: formata data em `pt-BR`.
- `estimateReadingMinutes(markdown)`: calcula tempo estimado quando necessário.

## Tipos

Arquivo:

```text
src/types.ts
```

Tipo principal:

```ts
export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes?: number;
}
```

## CSS

Arquivo:

```text
src/styles.css
```

O CSS concentra:

- tokens visuais;
- layout da home;
- cards;
- página de artigo;
- blocos de prompt;
- figuras e imagens;
- responsividade;
- estados de foco e hover.

Principais tokens:

```css
--bg: #fdfbf7;
--bg-secondary: #f3f0eb;
--text: #1e1e1e;
--text-muted: #5c5c5c;
--accent: #2b6cb0;
--accent-soft: #e2eff9;
--prompt-bg: #eef2f5;
--prompt-border: #a0c4e8;
```

## Fluxo de renderização

Home:

```text
index.html
  -> src/main.ts
    -> public/data/posts.json
    -> src/components.ts
    -> HTML dos cards
```

Artigo:

```text
/blog/[slug]/index.html
  -> gerado por scripts/generate-static-pages.mjs
    -> public/data/posts.json
    -> public/posts/[slug].md
    -> marked.parse()
    -> HTML estático do artigo
    -> canonical + OG + Twitter Card + JSON-LD BlogPosting
```

Fallback de desenvolvimento:

```text
/blog/[slug]/
  -> vite.config.ts reescreve para article.html
    -> src/article.ts
    -> renderização no cliente
```

## Rotas

Home:

```text
/
```

Filtro por tag:

```text
/?tag=typescript
```

Artigo:

```text
/blog/making-of-blog-eu-ia/
```

Seção específica:

```text
/blog/making-of-blog-eu-ia/#o-prompt-inicial
```

Rota legada:

```text
/article.html?slug=making-of-blog-eu-ia
```

Essa rota permanece funcional, mas o HTML base tem `noindex, follow`.

## Geração estática e SEO

Arquivo:

```text
scripts/generate-static-pages.mjs
```

Responsabilidades:

- ler `public/data/posts.json`;
- ler cada Markdown em `public/posts`;
- converter Markdown em HTML;
- gerar `dist/blog/[slug]/index.html`;
- gerar `dist/sobre/index.html`;
- reescrever `dist/index.html` com cards estáticos;
- copiar `public/sitemap.xml` para `dist/sitemap.xml`;
- copiar `public/robots.txt` para `dist/robots.txt`;
- injetar canonical, Open Graph, Twitter Card e JSON-LD.

A URL pública é definida por `SITE_URL`. Sem essa variável, o fallback é `https://blog-eu-ia.vercel.app`.

## Segurança básica

Os dados vindos de `posts.json` são escapados antes de entrarem em strings HTML.

O Markdown é convertido com `marked`. Como os arquivos Markdown fazem parte do próprio repositório, o risco é controlado pelo fluxo editorial. Se o blog passar a aceitar conteúdo externo, será necessário adicionar sanitização HTML.

## Pontos de extensão

Possíveis evoluções:

- modo escuro;
- busca local;
- RSS;
- páginas estáticas de tag;
- imagens sociais 1200x630 por artigo;
- comentários via Giscus;
- paginação.
