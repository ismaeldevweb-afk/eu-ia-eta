# Arquitetura

O Eu + IA foi migrado para Next.js 14 com App Router. O objetivo da migração é simplificar indexação, remover o gerador estático próprio e deixar as páginas públicas em rotas nativas do framework.

## Camadas

```text
src/app/
  layout.tsx
  page.tsx
  sobre/page.tsx
  blog/[slug]/page.tsx
  sitemap.ts
  robots.ts
src/lib/
  site.ts
  posts.ts
public/
  data/posts.json
  posts/*.md
```

## Fluxo de conteúdo

1. `public/data/posts.json` define slug, título, descrição, data, tags e tempo de leitura.
2. `public/posts/*.md` guarda o conteúdo editorial.
3. `src/lib/posts.ts` lê os arquivos no servidor, converte Markdown com `marked`, gera IDs para headings e transforma blockquotes em blocos de prompt.
4. `src/app/blog/[slug]/page.tsx` cria páginas estáticas com `generateStaticParams`.

## Rotas

```text
/                      Home
/sobre/                Página Sobre
/blog/[slug]/          Artigo
/sitemap.xml           Sitemap gerado pelo App Router
/robots.txt            Robots gerado pelo App Router
```

`next.config.mjs` usa `trailingSlash: true` para preservar o padrão de URLs que o blog já usava antes da migração.

## SEO

- Metadata global em `src/app/layout.tsx`.
- Metadata por artigo em `src/app/blog/[slug]/page.tsx`.
- JSON-LD `WebSite`, `AboutPage` e `BlogPosting`.
- Sitemap em `src/app/sitemap.ts` com apenas URLs canônicas.
- `robots.txt` em `src/app/robots.ts` apontando para o sitemap canônico.

## Interatividade

O conteúdo principal é renderizado no servidor. A única hidratação específica do artigo é `PromptCopyEnhancer`, que ativa os botões de copiar prompt nos blockquotes.
