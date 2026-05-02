# Eu + IA

Blog editorial e estático sobre criação de projetos com apoio de inteligência artificial. A proposta é documentar o processo real de construção: ideias, prompts, decisões técnicas, telas, ajustes e aprendizados.

O projeto foi construído com HTML, CSS, TypeScript puro, Vite, Markdown e JSON. Não usa framework de UI.

## Links

- Repositório: <https://github.com/ismaeldevweb-afk/Blog-Eu-IA>
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

## Preview do build

```bash
npm run preview
```

## Scripts

| Script | Função |
| --- | --- |
| `npm run dev` | Inicia o servidor local do Vite. |
| `npm run build` | Executa TypeScript e gera o build final. |
| `npm run preview` | Serve a pasta `dist/` para conferência local. |

## Estrutura

```text
.
├── article.html
├── index.html
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
├── RELATORIO_UI.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Como o blog funciona

A home (`index.html`) carrega `src/main.ts`.

Esse script:

1. Busca `public/data/posts.json`.
2. Ordena os artigos por data.
3. Renderiza os cards.
4. Aplica filtro por tag quando existe `?tag=`.

A página de artigo (`article.html`) carrega `src/article.ts`.

Esse script:

1. Lê o parâmetro `?slug=`.
2. Busca o post em `public/data/posts.json`.
3. Busca o Markdown em `public/posts/[slug].md`.
4. Converte Markdown para HTML com `marked`.
5. Gera IDs automáticos para títulos.
6. Transforma `blockquote` em bloco visual de prompt.
7. Adiciona botão de copiar aos prompts.

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

## Licença

Projeto pessoal. Defina uma licença antes de distribuir, reutilizar comercialmente ou aceitar contribuições externas.
