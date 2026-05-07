# Deploy

O Eu + IA agora roda em Next.js com App Router. A Vercel deve usar o preset de Next.js e o output padrão do framework.

## Rotas públicas

```text
/
/sobre/
/blog/making-of-blog-eu-ia/
/blog/como-construi-ismael-dev-studio/
/sitemap.xml
/robots.txt
```

## Build

```bash
npm run build
```

## Preview local

```bash
npm run build
npm run start
```

Com porta específica:

```bash
npm run start -- -p 3001
```

## Vercel

| Campo | Valor |
| --- | --- |
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output | Padrão do Next.js |

## Variáveis

Use `NEXT_PUBLIC_SITE_URL` se o domínio público mudar. Essa variável alimenta canonical, Open Graph e JSON-LD.

```bash
NEXT_PUBLIC_SITE_URL=https://eu-ia-eta.vercel.app
```

O sitemap em `public/sitemap.xml` é manual. Se o domínio mudar ou novas páginas forem criadas, atualize o arquivo.

## Checklist

- `npm run typecheck`
- `npm run build`
- `/sitemap.xml` retorna `200`
- `/robots.txt` aponta para o sitemap
- canonical das páginas aponta para a URL pública correta
