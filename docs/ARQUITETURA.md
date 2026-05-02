# Arquitetura técnica

Este documento descreve como o blog Eu + IA está organizado e como os arquivos se conectam.

## Visão geral

O projeto é uma aplicação estática multipágina:

- `index.html`: página inicial.
- `article.html`: página individual de artigo.
- `public/data/posts.json`: índice de posts.
- `public/posts/*.md`: conteúdo dos artigos.
- `src/*.ts`: renderização, carregamento e comportamento.
- `src/styles.css`: design system e estilos globais.

O Vite empacota as duas páginas no build final usando a configuração em `vite.config.ts`.

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

- ler o parâmetro `?slug=`;
- buscar metadados no JSON;
- buscar Markdown em `public/posts`;
- converter Markdown para HTML com `marked`;
- gerar IDs automáticos para `h2` e `h3`;
- transformar blockquotes em blocos de prompt;
- adicionar botão de copiar prompt;
- renderizar rodapé com tags.

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
article.html
  -> src/article.ts
    -> public/data/posts.json
    -> public/posts/[slug].md
    -> marked.parse()
    -> HTML do artigo
    -> enhanceArticleHeadings()
    -> enhancePromptBlocks()
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
/article.html?slug=making-of-blog-eu-ia
```

Seção específica:

```text
/article.html?slug=making-of-blog-eu-ia#o-prompt-inicial
```

## Segurança básica

Os dados vindos de `posts.json` são escapados antes de entrarem em strings HTML.

O Markdown é convertido com `marked`. Como os arquivos Markdown fazem parte do próprio repositório, o risco é controlado pelo fluxo editorial. Se o blog passar a aceitar conteúdo externo, será necessário adicionar sanitização HTML.

## Pontos de extensão

Possíveis evoluções:

- modo escuro;
- busca local;
- página Sobre;
- geração de metadados por post;
- RSS;
- sitemap automatizado;
- comentários via Giscus;
- paginação.
