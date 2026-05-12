Este artigo é uma continuação direta do making-of do Blog Eu + IA. A primeira parte mostrou como o blog nasceu: Markdown, metadados em JSON, interface editorial, blocos de prompt e páginas pensadas para leitura. Esta segunda parte fala de uma etapa menos bonita, mas muito mais real: colocar o projeto no ar, ajustar detalhes públicos e lidar com o Google Search Console quando o sitemap parece não ser lido.

O problema começou depois do deploy. O blog já estava funcionando, os artigos abriam corretamente e o domínio da Vercel respondia. Mesmo assim, a parte de indexação levantou dúvidas. O sitemap existia, o `robots.txt` apontava para ele, mas a leitura pelo Google não parecia acontecer como esperado.

Esse tipo de problema é comum em projetos pequenos porque o site parece pronto para o usuário, mas ainda pode ter inconsistências para buscadores: domínio antigo em links, canonical apontando para outro lugar, sitemap manual desatualizado, redirecionamento com barra final, rota servindo HTML no lugar de XML ou Search Console usando uma URL diferente da publicada.

## O contexto da mudança

Antes de mexer no sitemap, fiz uma mudança de identidade no projeto. O pacote e os links do repositório ainda carregavam o nome antigo:

```text
blog-eu-ia
Blog-Eu-IA
```

Depois da organização, o projeto passou a usar:

```text
eu-ia-eta
https://github.com/ismaeldevweb-afk/eu-ia-eta
```

Essa troca parece simples, mas é importante para consistência pública. Um blog usado como portfólio precisa ter o mesmo nome no pacote, no GitHub, no rodapé, na página Sobre e nos artigos. Se cada lugar aponta para um nome ou URL diferente, o projeto fica com aparência de rascunho.

A primeira correção foi alinhar:

- `package.json`;
- `package-lock.json`;
- link do GitHub no rodapé;
- link do GitHub na página Sobre;
- link do repositório dentro do artigo de making-of.

Foi uma etapa pequena, mas ajudou a deixar o projeto mais coerente antes de olhar para SEO.

## O problema com o sitemap

Depois disso, apareceu a questão principal: o sitemap não estava sendo lido pelo Google.

O projeto tinha arquivos manuais dentro de `public/`:

```text
public/
  robots.txt
  sitemap.xml
```

O `robots.txt` apontava para:

```text
Sitemap: https://eu-ia-eta.vercel.app/sitemap.xml
```

E o sitemap listava as URLs principais do site. Em teoria, isso já deveria funcionar. Então a investigação não podia parar em "o arquivo existe".

O primeiro passo foi conferir a resposta pública da Vercel. O sitemap publicado respondia `200`, com `content-type: application/xml`. Isso descartou os problemas mais básicos: o arquivo não estava retornando `404`, não estava bloqueado e não estava sendo servido como uma página HTML.

Mesmo assim, havia um detalhe importante: a variação com barra final, `https://eu-ia-eta.vercel.app/sitemap.xml/`, respondia com redirect `308` para `/sitemap.xml`.

Esse redirect não deveria impedir o Google de ler o sitemap, mas ele cria uma possibilidade prática: se a URL enviada no Search Console estiver com barra final, o Google pode mostrar alerta, demorar mais para reprocessar ou registrar uma leitura diferente da esperada.

Por isso, a URL correta para envio ficou clara:

```text
https://eu-ia-eta.vercel.app/sitemap.xml
```

Sem barra final.

## Primeira tentativa: deixar o Next.js gerar

A primeira solução técnica foi tirar os arquivos manuais de `public/` e usar as rotas oficiais do App Router:

```text
src/app/sitemap.ts
src/app/robots.ts
```

Essa abordagem tem uma vantagem forte: o sitemap pode nascer dos metadados reais dos posts. Se um novo artigo entra em `public/data/posts.json`, ele também pode aparecer em `/sitemap.xml` sem precisar editar XML na mão.

A rota ficou responsável por montar URLs como:

```text
/
/sobre/
/blog/como-construi-ismael-dev-studio/
/blog/making-of-blog-eu-ia/
```

E o `robots.ts` passou a apontar para o sitemap canônico.

O build confirmou que o Next.js estava gerando:

```text
/sitemap.xml
/robots.txt
```

Isso deixou o projeto tecnicamente mais limpo. Em vez de manter arquivos estáticos que poderiam ficar desatualizados, o sitemap passou a fazer parte da aplicação.

## O problema real: o formato que eu queria testar

Depois veio outra decisão: testar um XML específico, gerado por uma ferramenta externa.

O sitemap desejado tinha este formato:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!--  created with Free Online Sitemap Generator www.xml-sitemaps.com  -->
<url>
<loc>https://eu-ia-eta.vercel.app/</loc>
<lastmod>2026-05-12T15:55:09+00:00</lastmod>
<priority>1.00</priority>
</url>
</urlset>
```

O problema é que `src/app/sitemap.ts` usa o formato padronizado do Next.js. Ele é correto, mas não dá controle total sobre cada detalhe textual do XML, como o comentário, o `schemaLocation`, o formato exato de `lastmod` ou o campo `priority` do jeito enviado.

A solução foi trocar a rota de metadata por uma rota customizada:

```text
src/app/sitemap.xml/route.ts
```

Com isso, o endpoint `/sitemap.xml` passou a responder um XML escrito manualmente pelo código, mantendo o `content-type` correto:

```ts
export function GET(): Response {
  return new Response(buildSitemapXml(), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
```

Essa mudança devolveu controle total sobre o sitemap, sem voltar para um arquivo estático solto em `public/`.

## O cuidado com sitemap manual

A troca resolveu o controle do formato, mas trouxe uma responsabilidade: um sitemap customizado não se atualiza sozinho.

Se um novo artigo for publicado e a URL não entrar em `src/app/sitemap.xml/route.ts`, o post aparece na home, abre normalmente e pode até ser encontrado por links internos, mas não fica declarado diretamente no sitemap.

Esse foi um aprendizado importante da mudança:

- sitemap automático reduz manutenção;
- sitemap manual dá mais controle;
- controle manual exige disciplina;
- Search Console precisa receber a URL exata;
- deploy e cache podem atrasar a leitura do Google.

Neste artigo, por exemplo, a URL também precisa entrar no sitemap:

```text
https://eu-ia-eta.vercel.app/blog/corrigindo-sitemap-google-search-console-blog-eu-ia/
```

Caso contrário, eu estaria escrevendo sobre um problema de indexação enquanto criava outro.

## O que eu conferi na validação

Para não trabalhar no escuro, a validação ficou dividida em três partes.

Primeiro, a validação de TypeScript:

```bash
npm run typecheck
```

Depois, o build de produção:

```bash
npm run build
```

Aqui apareceu outro problema real do ambiente local: o terminal estava usando Node `18.19.1`, mas a versão atual do Next.js exigia Node `>=20.9.0`.

O projeto já tinha Node 20 instalado via `nvm`, então o build foi rodado apontando para essa versão. A Vercel também usa Node 20 por causa do campo `engines` no `package.json`:

```json
{
  "engines": {
    "node": "20.x"
  }
}
```

Por fim, a saída gerada em `.next` confirmou que o sitemap estava sendo criado como XML e o robots como texto.

## O que isso ensina sobre SEO técnico

SEO técnico não é só colocar um `sitemap.xml` no ar. O arquivo precisa conversar com o resto do projeto.

No caso do Eu + IA, os pontos que mais importaram foram:

- canonical usando o domínio certo;
- `robots.txt` apontando para a URL certa do sitemap;
- sitemap respondendo `200`;
- `content-type` correto;
- evitar enviar no Search Console a URL com barra final;
- manter o sitemap sincronizado com os posts publicados;
- garantir que o build de produção realmente gera as rotas.

Também ficou claro que o Search Console pode demorar. Às vezes a resposta pública já está correta, mas a interface do Google ainda mostra um estado antigo. Nesses casos, a melhor postura é validar tecnicamente, reenviar a URL exata e esperar o reprocessamento.

## Prompt usado para orientar a correção

O prompt mais importante dessa etapa foi curto, mas direto:

> O sitemap não está sendo lido pelo Google. Verifique o robots.txt, o sitemap publicado, os headers HTTP, os redirects e ajuste o projeto para servir um sitemap correto em Next.js.

Esse pedido funcionou porque não focou apenas no arquivo. Ele abriu a investigação para o caminho inteiro: código, build, deploy, headers e Search Console.

Depois, a decisão mudou:

> Use este XML como sitemap.

Esse segundo pedido mudou a solução. Em vez de deixar o Next.js gerar o XML automaticamente, o projeto passou a servir uma rota customizada para respeitar exatamente o formato enviado.

## O estado atual do blog

Depois dessas mudanças, o blog ficou com uma base mais madura:

- nome do projeto alinhado com o repositório;
- links públicos corrigidos;
- `robots.txt` gerado pelo App Router;
- `/sitemap.xml` servido por rota customizada;
- documentação atualizada;
- build validado com Node 20;
- fluxo de publicação mais claro.

Ainda existem pontos para melhorar. O sitemap customizado precisa ser mantido com atenção. As páginas por tag precisam ser avaliadas, porque uma URL com query string como `/?tag=prompt%20engineering` pode ser útil para navegação, mas nem sempre é a melhor escolha para indexação. Também vale considerar imagens sociais específicas para cada artigo e um RSS no futuro.

## Conclusão

Essa continuação mostra uma parte menos visível do projeto: a fase em que o blog deixa de ser apenas uma interface bonita e passa a ser um site público que precisa conversar com buscadores.

O principal aprendizado foi simples: quando o Google não lê algo, não adianta adivinhar. É preciso olhar a resposta real do servidor, o tipo do conteúdo, os redirects, o domínio canônico, o robots e o build de produção.

O Eu + IA continua com a mesma proposta do início: mostrar o processo. E o processo também inclui esses ajustes pequenos, erros de configuração, testes, commits e decisões que transformam um projeto em algo mais confiável.
