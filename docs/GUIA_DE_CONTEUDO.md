# Guia de conteúdo

Este guia explica como adicionar, editar e organizar artigos no blog Eu + IA.

## Onde ficam os artigos

Artigos em Markdown:

```text
public/posts/
```

Metadados:

```text
public/data/posts.json
```

Imagens:

```text
public/images/articles/
```

## Criar um novo artigo

1. Crie um arquivo Markdown em `public/posts`.
2. Use um slug curto e estável.
3. Adicione uma entrada no JSON.
4. Rode `npm run build`.

Exemplo de arquivo:

```text
public/posts/meu-novo-artigo.md
```

Exemplo de metadados:

```json
{
  "slug": "meu-novo-artigo",
  "title": "Meu novo artigo",
  "description": "Resumo curto que aparece no card e no cabeçalho do artigo.",
  "date": "2026-05-02",
  "tags": ["typescript", "prompt engineering"],
  "readingMinutes": 6
}
```

## Regras do slug

Use:

- letras minúsculas;
- números;
- hífens;
- sem acentos;
- sem espaços.

Bom:

```text
como-construi-ismael-dev-studio
```

Evite:

```text
Como Construí o Site!!
```

## Datas

Use formato ISO:

```text
YYYY-MM-DD
```

Exemplo:

```text
2026-05-02
```

A interface formata automaticamente para português:

```text
2 de maio de 2026
```

## Título no Markdown

Não coloque `# Título principal` no Markdown do artigo.

O título principal vem de `posts.json` e é renderizado pela rota `src/app/blog/[slug]/page.tsx`.

Comece o conteúdo com `##`.

Exemplo:

```md
## Por que este projeto existe

Texto de abertura...
```

## Blocos de prompt

Use `blockquote` no Markdown:

```md
> Quero criar uma landing page para um serviço local...
```

O blog transforma automaticamente esse bloco em um componente visual de prompt com:

- label;
- fundo destacado;
- fonte monoespaçada;
- botão de copiar.

## Código

Código inline:

```md
Use `npm run build` antes do deploy.
```

Bloco de código:

````md
```ts
const post = {
  title: 'Eu + IA'
};
```
````

## Imagens

Coloque imagens em uma pasta por artigo:

```text
public/images/articles/nome-do-artigo/
```

Use HTML com `figure` quando quiser legenda:

```html
<figure class="article-figure">
  <img src="/images/articles/nome-do-artigo/print.png" alt="Descrição objetiva da imagem." loading="lazy" />
  <figcaption>Legenda curta explicando o contexto da imagem.</figcaption>
</figure>
```

Para gráficos ou imagens mais largas:

```html
<figure class="article-figure is-wide">
  <img src="/images/articles/nome-do-artigo/fluxo.svg" alt="Descrição do gráfico." loading="lazy" />
  <figcaption>Legenda do gráfico.</figcaption>
</figure>
```

## Tags

Use tags curtas e consistentes:

- `html`
- `css`
- `typescript`
- `nextjs`
- `seo`
- `vercel`
- `prompt engineering`

As tags viram links filtráveis na home.

## URL pública do artigo

Depois do build, cada artigo fica disponível em:

```text
/blog/SLUG/
```

Exemplo:

```text
/blog/como-construi-ismael-dev-studio/
```

URLs antigas com `article.html?slug=` não fazem mais parte da aplicação após a migração para Next.js.

## Tempo de leitura

Você pode preencher manualmente:

```json
"readingMinutes": 7
```

Se o campo for removido, o código tem uma função para estimar o tempo a partir do Markdown, mas o valor manual dá mais controle editorial.

## Checklist antes de publicar

- O slug do JSON corresponde ao nome do Markdown.
- O título está no JSON, não no Markdown.
- A descrição tem no máximo duas linhas no card.
- As imagens têm `alt`.
- Os prompts estão em `blockquote`.
- O build passa com `npm run build`.
- A rota `/blog/slug-do-artigo/` abre corretamente.
- Se o artigo precisar entrar no sitemap, adicione a URL em `src/app/sitemap.xml/route.ts`.
- Os links internos foram testados.
