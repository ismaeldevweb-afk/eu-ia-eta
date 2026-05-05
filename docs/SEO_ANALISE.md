# Relatório SEO Completo - Blog Eu + IA

Data da análise: 2026-05-03  
Projeto analisado: Blog Eu + IA  
Stack: HTML, CSS, TypeScript, Vite, Markdown, JSON e `marked`  
Status: pós-redesign, com geração estática SEO no build

## Resumo executivo

O blog está em bom estado para um MVP editorial estático. A principal evolução já foi implementada: os artigos deixaram de depender apenas de `article.html?slug=...` e passaram a ser gerados como páginas reais em `/blog/[slug]/`, com conteúdo HTML no carregamento inicial.

Isso resolve o maior gargalo de SEO técnico. Agora a home, os artigos e a página Sobre recebem `title`, `description`, canonical, Open Graph, Twitter Card e JSON-LD. O build também gera `sitemap.xml` e `robots.txt`.

Nota estimada atual: **8.2/10**

O projeto já está preparado para indexação básica e compartilhamento social, mas ainda precisa de três ajustes antes de ser tratado como pronto para crescimento orgânico: confirmar domínio final em `SITE_URL`, criar imagens sociais dedicadas e adicionar RSS/páginas de tags quando o volume de conteúdo crescer.

## Verificações executadas

```bash
npm run build
npm audit --audit-level=moderate
```

Resultado:

- build passou;
- TypeScript passou;
- geração estática passou;
- `npm audit` retornou `0 vulnerabilities`.

Tamanho dos principais assets no build:

| Asset | Tamanho gzip |
| --- | ---: |
| `dist/index.html` | 1.76 kB |
| `dist/article.html` | 1.10 kB |
| `dist/sobre.html` | 1.35 kB |
| CSS principal | 4.23 kB |
| JS da home | 0.56 kB |
| JS compartilhado | 1.28 kB |
| JS do artigo | 12.66 kB |

## Arquitetura SEO atual

O comando `npm run build` executa:

```text
tsc
vite build
node scripts/generate-static-pages.mjs
```

O gerador estático cria:

```text
dist/index.html
dist/sobre/index.html
dist/blog/como-construi-ismael-dev-studio/index.html
dist/blog/making-of-blog-eu-ia/index.html
dist/sitemap.xml
dist/robots.txt
```

A rota antiga ainda existe:

```text
/article.html?slug=making-of-blog-eu-ia
```

Ela está marcada com:

```html
<meta name="robots" content="noindex, follow" />
```

Isso é correto para evitar indexação da versão genérica enquanto permite que links internos continuem sendo seguidos.

## Inventário de páginas indexáveis

| Página | URL | Status | JSON-LD | Observação |
| --- | --- | --- | --- | --- |
| Home | `/` | Indexável | `WebSite` | Lista artigos no HTML inicial. |
| Sobre | `/sobre/` | Indexável | `AboutPage` | Página institucional simples. |
| Artigo 1 | `/blog/como-construi-ismael-dev-studio/` | Indexável | `BlogPosting` | Título um pouco longo. |
| Artigo 2 | `/blog/making-of-blog-eu-ia/` | Indexável | `BlogPosting` | Conteúdo forte, com imagens e prompts. |

## Metadados por página

| Página | Title | Title chars | Description chars | Diagnóstico |
| --- | --- | ---: | ---: | --- |
| Home | `Eu + IA | Prompts, IA e bastidores de projetos reais` | 52 | 108 | Bom. Claro e direto. |
| Sobre | `Sobre o Eu + IA | Diário de criação com inteligência artificial` | 63 | 125 | Bom, mas no limite superior. |
| Ismael Dev Studio | `Como construí o Ismael Dev Studio: do código à presença profissional online | Eu + IA` | 85 | 110 | Longo. Pode ser encurtado para melhorar SERP. |
| Making-of Blog | `O making-of da criação do blog Eu + IA | Eu + IA` | 48 | 136 | Bom. Descrição completa. |

Recomendação: encurtar o título do artigo `como-construi-ismael-dev-studio`. Exemplo:

```text
Como construí o Ismael Dev Studio | Eu + IA
```

O título visual do artigo pode continuar mais longo no `h1`; o `<title>` pode ser mais objetivo.

## Canonical

Status: **bom**

Cada página gerada possui canonical absoluto:

```html
<link rel="canonical" href="https://eu-ia-eta.vercel.app/blog/making-of-blog-eu-ia/" />
```

Risco atual: o domínio é definido por `SITE_URL`, com fallback para:

```text
https://eu-ia-eta.vercel.app
```

Se a URL pública real for outra, canonical, sitemap, Open Graph e JSON-LD ficarão apontando para o domínio errado.

Prioridade: **alta antes do deploy**

## Sitemap

Status: **bom**

O build gera:

```text
dist/sitemap.xml
```

Conteúdo atual:

```text
https://eu-ia-eta.vercel.app/
https://eu-ia-eta.vercel.app/sobre/
https://eu-ia-eta.vercel.app/blog/como-construi-ismael-dev-studio/
https://eu-ia-eta.vercel.app/blog/making-of-blog-eu-ia/
```

O sitemap inclui `lastmod`, o que é adequado para páginas estáticas.

## Robots.txt

Status: **bom**

O build gera:

```text
User-agent: *
Allow: /

Sitemap: https://eu-ia-eta.vercel.app/sitemap.xml
```

Isso está correto para um blog público.

## Open Graph e Twitter Card

Status: **bom com oportunidade de melhoria**

Implementado:

- `og:locale`;
- `og:site_name`;
- `og:type`;
- `og:title`;
- `og:description`;
- `og:url`;
- `og:image`;
- `twitter:card=summary_large_image`;
- `twitter:title`;
- `twitter:description`;
- `twitter:image`.

Oportunidades:

- adicionar `og:image:width` e `og:image:height`;
- adicionar `og:image:alt`;
- adicionar `twitter:image:alt`;
- criar imagem social dedicada em 1200x630;
- permitir imagem social por artigo no `posts.json`.

Hoje os artigos usam a primeira imagem encontrada no Markdown ou o fallback:

```text
/images/articles/blog-eu-ia/home-desktop.png
```

Isso funciona, mas não é ideal para LinkedIn, WhatsApp e X, porque screenshot de página nem sempre gera uma prévia forte.

## Dados estruturados

Status: **bom**

Implementado:

- Home: `WebSite`;
- Sobre: `AboutPage`;
- Artigos: `BlogPosting`.

Campos presentes nos artigos:

- `mainEntityOfPage`;
- `headline`;
- `description`;
- `image`;
- `datePublished`;
- `dateModified`;
- `inLanguage`;
- `author`;
- `publisher`;
- `keywords`.

Oportunidades:

- adicionar `wordCount`;
- adicionar `articleSection`;
- adicionar `thumbnailUrl` ou `ImageObject` com largura e altura;
- separar `dateModified` de `datePublished` quando um artigo for atualizado;
- adicionar `sameAs` para GitHub e LinkedIn no autor.

## Conteúdo editorial

Status: **bom**

Artigos atuais:

| Artigo | Palavras aproximadas | Tempo declarado |
| --- | ---: | ---: |
| `como-construi-ismael-dev-studio` | 1318 | 7 min |
| `making-of-blog-eu-ia` | 1724 | 11 min |

Pontos fortes:

- conteúdo original;
- tom pessoal;
- bastidores reais;
- prompts documentados;
- decisões técnicas explicadas;
- links para GitHub e LinkedIn;
- imagens com `alt` no artigo principal;
- headings com IDs para links internos.

O artigo `making-of-blog-eu-ia` é o mais forte do ponto de vista editorial porque combina narrativa, screenshots, gráfico, prompt e decisões técnicas.

O artigo `como-construi-ismael-dev-studio` tem boa estrutura, mas poderia ganhar imagens próprias do projeto para aumentar valor visual e melhorar compartilhamento.

## Headings e estrutura semântica

Status: **bom**

Cada página indexável tem um único `h1`. Os artigos usam múltiplos `h2`, e o gerador cria IDs automáticos para seções.

Contagem atual:

| Página | H1 | H2 |
| --- | ---: | ---: |
| Home | 1 | 4 |
| Sobre | 1 | 1 |
| Ismael Dev Studio | 1 | 13 |
| Making-of Blog | 1 | 13 |

Isso está coerente para uma publicação editorial.

## Imagens

Status: **bom para MVP**

Imagens atuais:

| Imagem | Tamanho |
| --- | ---: |
| `home-mobile.png` | 68 KB |
| `home-desktop.png` | 92 KB |
| `article-desktop.png` | 116 KB |
| `prompt-block.png` | 156 KB |
| `fluxo-criacao-blog.svg` | 8 KB |

Diagnóstico:

- tamanhos aceitáveis;
- imagens no artigo têm `alt`;
- `loading="lazy"` está presente nas imagens de conteúdo;
- ainda não há WebP/AVIF;
- ainda não há dimensões explícitas `width`/`height`;
- ainda não há imagem social dedicada.

Recomendação futura:

- converter screenshots para WebP;
- manter PNG apenas quando a nitidez do texto for essencial;
- criar `/images/og/eu-ia-default.png` em 1200x630;
- criar campo `image` e `imageAlt` no `posts.json`.

## Links internos

Status: **bom**

Os links principais usam `<a href="...">`, o que é rastreável:

- home para artigos;
- seção "Comece por aqui";
- tags com `?tag=`;
- navegação anterior/próximo em artigos;
- rodapé com links para home, Sobre e artigos.

Risco baixo:

- tags ainda são filtros por query string, não páginas estáticas próprias.

Quando houver mais artigos, criar páginas de tags pode melhorar a arquitetura:

```text
/tags/typescript/
/tags/seo/
/tags/prompt-engineering/
```

## Performance

Status: **bom**

Pontos positivos:

- CSS pequeno;
- JS pequeno na home;
- HTML pré-renderizado;
- sem framework de UI;
- fontes do sistema;
- imagens com tamanhos moderados;
- Vite gera assets com hash.

Risco:

- `article` carrega JS de aproximadamente 12.66 kB gzip, aceitável;
- imagens futuras podem virar gargalo se forem muitos screenshots em PNG.

## Acessibilidade relacionada a SEO

Status: **bom**

Pontos fortes:

- `lang="pt-BR"`;
- HTML semântico;
- foco visível;
- links com texto legível;
- imagens com `alt` nos artigos;
- botões de copiar com `aria-label`;
- navegação de rodapé com `aria-label`.

Oportunidade:

- adicionar `aria-current="page"` em links de navegação quando aplicável;
- adicionar `alt` social via `og:image:alt` e `twitter:image:alt`.

## Riscos prioritários

### Alta prioridade

1. Confirmar domínio final em `SITE_URL`.
2. Encurtar `<title>` do artigo `como-construi-ismael-dev-studio`.
3. Criar imagem social padrão 1200x630.

### Média prioridade

1. Adicionar `og:image:alt` e `twitter:image:alt`.
2. Adicionar `width` e `height` nas imagens de conteúdo.
3. Adicionar `wordCount` no JSON-LD `BlogPosting`.
4. Criar RSS.
5. Criar campo `updatedAt` no `posts.json`.

### Baixa prioridade

1. Criar páginas estáticas de tags.
2. Converter imagens para WebP/AVIF.
3. Criar busca local.
4. Adicionar breadcrumbs visuais e `BreadcrumbList`.

## Plano de ação recomendado

### Etapa 1, antes do deploy

- Definir URL pública final.
- Configurar `SITE_URL` no ambiente da Vercel/Netlify.
- Rodar `npm run build`.
- Conferir `dist/sitemap.xml`.
- Conferir `dist/robots.txt`.
- Testar uma URL de artigo no preview.

### Etapa 2, compartilhamento social

- Criar imagem `og-default.png` em 1200x630.
- Adicionar `og:image:width`.
- Adicionar `og:image:height`.
- Adicionar `og:image:alt`.
- Adicionar `twitter:image:alt`.

### Etapa 3, crescimento editorial

- Criar RSS.
- Criar páginas de tags.
- Adicionar campo `updatedAt`.
- Publicar pelo menos 5 a 8 artigos iniciais.
- Criar links internos entre artigos relacionados.

## Checklist SEO

### Técnico

- [x] HTML estático por artigo.
- [x] URL amigável em `/blog/[slug]/`.
- [x] Canonical por página.
- [x] Sitemap.
- [x] Robots.txt.
- [x] Rota legada com `noindex, follow`.
- [x] Links internos rastreáveis.
- [x] Build validado.
- [x] Dependências sem vulnerabilidades moderadas.
- [ ] Domínio final confirmado em `SITE_URL`.

### On-page

- [x] H1 único por página.
- [x] Títulos específicos.
- [x] Descrições específicas.
- [x] Headings bem distribuídos.
- [x] Conteúdo editorial original.
- [x] Imagens com `alt` nos artigos.
- [ ] Título longo do artigo Ismael Dev Studio revisado.

### Social

- [x] Open Graph básico.
- [x] Twitter Card básico.
- [x] Imagem social fallback.
- [ ] Imagem social dedicada 1200x630.
- [ ] `og:image:alt`.
- [ ] `twitter:image:alt`.

### Dados estruturados

- [x] `WebSite`.
- [x] `AboutPage`.
- [x] `BlogPosting`.
- [x] Autor definido.
- [x] Data de publicação.
- [x] Keywords por tags.
- [ ] `wordCount`.
- [ ] `articleSection`.
- [ ] `sameAs` do autor.
- [ ] `BreadcrumbList`.

## Pontuação detalhada

| Categoria | Nota | Comentário |
| --- | ---: | --- |
| Arquitetura de indexação | 9/10 | Páginas estáticas e URLs limpas. Falta confirmar domínio. |
| Metadados | 8/10 | Completo no básico. Falta imagem social enriquecida. |
| Conteúdo | 8/10 | Bom conteúdo autoral. Precisa crescer em volume. |
| Links internos | 8/10 | Boa navegação. Tags ainda não têm páginas próprias. |
| Performance | 8.5/10 | Build leve. Otimizar imagens no futuro. |
| Dados estruturados | 8/10 | Base boa. Pode enriquecer BlogPosting. |
| Social preview | 7/10 | Tags existem, mas imagem ainda é genérica. |
| Acessibilidade SEO | 8.5/10 | Boa base semântica e labels. |

Nota geral: **8.2/10**

## Conclusão

O Blog Eu + IA já tem uma base SEO sólida para um projeto estático. A mudança para `/blog/[slug]/` com HTML inicial completo foi a decisão mais importante e coloca o projeto em um patamar muito melhor para indexação.

O próximo salto não exige trocar tecnologia. O caminho mais pragmático é reforçar os detalhes de publicação: domínio correto, imagem social profissional, RSS, tags estáticas e metadados mais ricos por artigo.

## Referências consultadas

- Google Search Central, títulos: https://developers.google.com/search/docs/appearance/title-link
- Google Search Central, canonical: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central, robots meta: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google Search Central, links rastreáveis: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Schema.org, BlogPosting: https://schema.org/BlogPosting
- Schema.org, WebSite: https://schema.org/WebSite
- Open Graph Protocol: https://ogp.me/
- X Cards Markup: https://developer.x.com/cards/markup
