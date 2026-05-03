# Eu + IA

Blog editorial e estático sobre criação de projetos com apoio de inteligência artificial. A proposta é documentar o processo real de construção: ideias, prompts, decisões técnicas, telas, ajustes e aprendizados.

O projeto foi construído com HTML, CSS, TypeScript puro, Vite, Markdown e JSON. Não usa framework de UI.

## Links

- Repositório: <https://github.com/ismaeldevweb-afk/Blog-Eu-IA>
- Blog: configure a URL final em `SITE_URL` antes do deploy
- LinkedIn: <https://www.linkedin.com/in/ismael-nunes-dos-santos>

## Conceito

O Eu + IA funciona como um diário de criação. Cada artigo é um making-of de um produto, site, experimento ou solução criada com ajuda de IA.

A identidade visual segue a metáfora:

> folha de caderno digital + terminal amigável

Isso aparece em:

- fundo claro com textura de linhas;
- tipografia serifada para títulos;
- leitura em coluna única;
- cartões editoriais;
- blocos de prompt destacados;
- botão para copiar prompts;
- screenshots e gráficos dentro dos artigos.

## Stack

- HTML5 semântico
- CSS puro com variáveis customizadas
- TypeScript
- Vite
- Markdown
- JSON
- `marked` para converter Markdown em HTML

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

## Rodar em desenvolvimento

```bash
npm run dev
```

URL padrão:

```text
http://localhost:5173/
```

## Build de produção

```bash
npm run build
```

O resultado é gerado em:

```text
dist/
```

Além do build do Vite, esse comando executa `scripts/generate-static-pages.mjs`, que gera:

- home com lista de artigos no HTML inicial;
- artigos em `/blog/[slug]/`;
- página Sobre em `/sobre/`;
- `sitemap.xml`;
- `robots.txt`;
- canonical, Open Graph, Twitter Card e JSON-LD.

## Preview do build

```bash
npm run preview
```

## Scripts

| Script | Função |
| --- | --- |
| `npm run dev` | Inicia o servidor local do Vite. |
| `npm run build` | Executa TypeScript, Vite e geração estática SEO. |
| `npm run preview` | Serve a pasta `dist/` para conferência local. |

## Estrutura

```text
.
├── article.html
├── index.html
├── sobre.html
├── public
│   ├── data
│   │   └── posts.json
│   ├── images
│   │   └── articles
│   └── posts
│       ├── como-construi-ismael-dev-studio.md
│       └── making-of-blog-eu-ia.md
├── src
│   ├── article.ts
│   ├── components.ts
│   ├── html.ts
│   ├── main.ts
│   ├── posts.ts
│   ├── styles.css
│   └── types.ts
├── docs
├── scripts
│   └── generate-static-pages.mjs
├── RELATORIO_UI.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Como o blog funciona em desenvolvimento

A home (`index.html`) carrega `src/main.ts`.

Esse script:

1. Busca `public/data/posts.json`.
2. Ordena os artigos por data.
3. Renderiza os cards.
4. Aplica filtro por tag quando existe `?tag=`.

A página de artigo (`article.html`) carrega `src/article.ts`.

Esse script:

1. Lê o parâmetro `?slug=` ou a rota `/blog/[slug]/`.
2. Busca o post em `public/data/posts.json`.
3. Busca o Markdown em `public/posts/[slug].md`.
4. Converte Markdown para HTML com `marked`.
5. Gera IDs automáticos para títulos.
6. Transforma `blockquote` em bloco visual de prompt.
7. Adiciona botão de copiar aos prompts.
8. Renderiza navegação para artigos anterior/próximo.

No servidor local do Vite, `vite.config.ts` redireciona `/blog/[slug]/` para `article.html` e `/sobre/` para `sobre.html`.

## Como o blog funciona em produção

Depois de `npm run build`, o conteúdo principal fica pré-renderizado em HTML estático:

```text
dist/blog/making-of-blog-eu-ia/index.html
dist/blog/como-construi-ismael-dev-studio/index.html
dist/sobre/index.html
```

Essas páginas já nascem com `title`, `description`, `canonical`, Open Graph, Twitter Card e JSON-LD. A rota `article.html?slug=...` permanece apenas como fallback legado e está marcada com `noindex, follow`.

## Conteúdo

Os metadados dos posts ficam em:

```text
public/data/posts.json
```

Os artigos ficam em:

```text
public/posts/
```

Imagens usadas nos artigos ficam em:

```text
public/images/articles/
```

Guia detalhado: [docs/GUIA_DE_CONTEUDO.md](docs/GUIA_DE_CONTEUDO.md)

## Documentação complementar

- [Arquitetura técnica](docs/ARQUITETURA.md)
- [Guia de conteúdo](docs/GUIA_DE_CONTEUDO.md)
- [Deploy](docs/DEPLOY.md)
- [Relatório de UI/UX](RELATORIO_UI.md)

## Validação recomendada

Antes de publicar mudanças:

```bash
npm run build
npm audit --audit-level=moderate
```

## Deploy

O projeto é estático e pode ser publicado em Vercel, Netlify, GitHub Pages ou qualquer hospedagem que sirva arquivos estáticos.

Para Vercel/Netlify:

- build command: `npm run build`
- output directory: `dist`

Configure `SITE_URL` com o domínio público final para que canonical, sitemap e dados estruturados saiam corretos.

## Licença

Projeto pessoal. Defina uma licença antes de distribuir, reutilizar comercialmente ou aceitar contribuições externas.
