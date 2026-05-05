# Deploy

O Eu + IA é um projeto estático gerado com Vite. Depois do build, a pasta `dist/` pode ser publicada em qualquer hospedagem de arquivos estáticos.

O build também pré-renderiza as páginas públicas do blog para SEO:

```text
/
/sobre/
/blog/[slug]/
/sitemap.xml
/robots.txt
```

O sitemap é mantido manualmente em `public/sitemap.xml` e copiado para `dist/sitemap.xml` pelo Vite durante o build.

## Build

```bash
npm run build
```

Saída:

```text
dist/
```

## Preview local

```bash
npm run preview
```

## Vercel

Configuração recomendada:

| Campo | Valor |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## Netlify

Configuração recomendada:

| Campo | Valor |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |

## GitHub Pages

Para GitHub Pages, o projeto pode precisar de ajuste de `base` no Vite caso seja publicado em subpath.

Exemplo:

```ts
export default defineConfig({
  base: '/Blog-Eu-IA/'
});
```

Use esse ajuste apenas se a URL final tiver o nome do repositório no caminho.

## Variáveis de ambiente

Use `SITE_URL` para informar o domínio público final do blog. Essa variável é usada em canonical, sitemap, Open Graph e JSON-LD.

Exemplo:

```bash
SITE_URL=https://blog-eu-ia.vercel.app npm run build
```

Se `SITE_URL` não for definida, o fallback é:

```text
https://blog-eu-ia.vercel.app
```

## Validação antes de publicar

```bash
npm run build
npm audit --audit-level=moderate
```

## Arquivos que não devem ir para produção

Já estão ignorados no `.gitignore`:

```text
node_modules
dist
.env
.DS_Store
```

## Pós-deploy

Depois de publicar, valide:

- home carrega;
- cards aparecem no HTML inicial;
- artigos abrem por `/blog/[slug]/`;
- `/sobre/` abre corretamente;
- `/sitemap.xml` abre corretamente;
- `/robots.txt` aponta para o sitemap;
- imagens dos artigos carregam;
- filtro por tag funciona;
- botões de copiar prompt funcionam em HTTPS;
- links externos abrem corretamente;
- canonical aponta para o domínio correto;
- previews sociais funcionam no LinkedIn/WhatsApp.
