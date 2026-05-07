# Eu + IA

Blog editorial em Next.js para documentar projetos criados com apoio de IA, mostrando prompts, decisões humanas, bastidores de desenvolvimento e aprendizados práticos.

## Stack

- Next.js 14
- React 18
- TypeScript
- CSS global
- Markdown com `marked`
- JSON para metadados dos posts

## Scripts

| Script | Função |
| --- | --- |
| `npm run dev` | Inicia o servidor local do Next.js. |
| `npm run build` | Gera a build de produção. |
| `npm run start` | Serve a build de produção. |
| `npm run typecheck` | Valida TypeScript sem emitir arquivos. |

## Desenvolvimento

```bash
npm install
npm run dev
```

Para usar uma porta específica:

```bash
npm run dev -- -p 3001
```

## Estrutura

```text
src/
  app/
    page.tsx                 Home
    sobre/page.tsx           Página Sobre
    blog/[slug]/page.tsx     Artigos estáticos
    layout.tsx               Metadados globais
  lib/
    posts.ts                 Leitura e renderização de Markdown
    site.ts                  Configuração pública do site
  styles.css                 Estilos globais reaproveitados
public/
  data/posts.json            Metadados dos artigos
  posts/*.md                 Conteúdo em Markdown
  sitemap.xml                Sitemap manual conservador
  robots.txt                 Robots apontando para o sitemap
```

## Conteúdo

Para publicar um artigo:

1. Crie o Markdown em `public/posts/slug-do-artigo.md`.
2. Adicione os metadados em `public/data/posts.json`.
3. Atualize `public/sitemap.xml` com a URL canônica do artigo.
4. Rode `npm run build`.

As URLs públicas seguem o padrão:

```text
/
/sobre/
/blog/[slug]/
```

## SEO

O App Router gera HTML inicial completo para home, Sobre e artigos. Cada artigo tem metadata própria, canonical, Open Graph, Twitter Card e JSON-LD `BlogPosting`.

O sitemap é manual e lista apenas URLs canônicas, evitando páginas filtradas por query string.

## Deploy

Configuração recomendada na Vercel:

| Campo | Valor |
| --- | --- |
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output | Padrão do Next.js |

Configure `NEXT_PUBLIC_SITE_URL` se o domínio público mudar:

```bash
NEXT_PUBLIC_SITE_URL=https://eu-ia-eta.vercel.app
```
