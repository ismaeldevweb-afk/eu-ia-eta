## Por que este blog existe

O Eu + IA nasceu de uma pergunta simples: como mostrar, com transparência, que prompts podem virar produtos reais? Eu não queria criar apenas uma lista de textos sobre inteligência artificial. A ideia era construir um diário de criação: cada artigo deveria mostrar o problema, os prompts usados, as decisões tomadas, o que funcionou e o que precisou ser ajustado.

O conceito principal foi tratar o blog como um laboratório aberto. Em vez de esconder o processo por trás de uma interface pronta, o site coloca a construção no centro da narrativa. Isso muda o papel do artigo: ele não é só uma publicação final, mas um registro do caminho até chegar ao produto.

Essa decisão também guiou a identidade visual. O blog precisava parecer uma mistura de folha de caderno digital com terminal amigável: claro, editorial, confortável para ler e com pequenos sinais de tecnologia.

<figure class="article-figure">
  <img src="/images/articles/blog-eu-ia/home-desktop.png" alt="Print da página inicial do blog Eu + IA em desktop." loading="lazy" />
  <figcaption>Primeira dobra da home: editorial, simples e focada na proposta do blog.</figcaption>
</figure>

## O prompt inicial

O primeiro prompt definiu o produto, o tom e o stack. Ele não pedia só uma tela bonita; pedia uma estrutura de publicação que pudesse crescer com novos artigos em Markdown.

> Quero criar um blog pessoal chamado Eu + IA. Ele deve parecer um diário de criação onde cada artigo mostra como um projeto nasceu a partir de prompts, decisões humanas e ajustes feitos com inteligência artificial. Use HTML, CSS e TypeScript puro, com conteúdo em Markdown e metadados em JSON.

Esse pedido deixou claras algumas restrições importantes:

- o blog deveria ser estático e leve;
- os artigos deveriam morar em arquivos Markdown;
- os metadados deveriam ficar em JSON;
- a experiência principal deveria ser leitura;
- os prompts precisariam ter destaque visual próprio;
- a interface deveria funcionar bem no celular e no desktop.

A partir disso, a primeira versão foi desenhada como um MVP editorial: uma home com lista de artigos, uma página individual para leitura e um sistema de destaque para prompts.

## O fluxo de criação

O processo ficou dividido em cinco etapas. Primeiro veio a intenção editorial. Depois, os prompts ajudaram a transformar essa intenção em requisitos. Em seguida, o conteúdo foi organizado em Markdown e JSON. O TypeScript ficou responsável por buscar os arquivos, converter o Markdown e renderizar a tela. Por fim, a interface foi refinada para parecer um produto real, não apenas um protótipo.

<figure class="article-figure is-wide">
  <img src="/images/articles/blog-eu-ia/fluxo-criacao-blog.svg" alt="Gráfico mostrando o fluxo de criação do blog: ideia, prompt, conteúdo, renderização e artigo." loading="lazy" />
  <figcaption>Fluxo editorial do Eu + IA: cada post nasce de uma ideia, passa por prompts e vira uma peça documentada.</figcaption>
</figure>

Esse fluxo é importante porque mantém o blog simples de atualizar. Para publicar um novo texto, basta criar um arquivo em `public/posts` e adicionar seus metadados em `public/data/posts.json`.

```text
public/
  data/
    posts.json
  posts/
    making-of-blog-eu-ia.md
    como-construi-ismael-dev-studio.md
```

## Arquitetura técnica

O projeto foi construído com Vite, TypeScript puro, HTML semântico, CSS com variáveis e a biblioteca `marked` para converter Markdown em HTML.

A estrutura principal ficou assim:

```text
index.html
article.html
src/
  main.ts
  article.ts
  components.ts
  posts.ts
  styles.css
public/
  data/posts.json
  posts/*.md
```

A home usa `src/main.ts` para buscar a lista de posts em JSON, ordenar por data e renderizar cada card durante o desenvolvimento. A página individual usa `src/article.ts` para ler o slug, buscar o Markdown correspondente e convertê-lo para HTML.

Essa separação evita que o conteúdo fique preso no código. O blog pode crescer sem precisar duplicar HTML manualmente para cada artigo.

```ts
const produto = {
  nome: 'Eu + IA',
  formato: 'blog estatico',
  conteudo: ['prompts', 'making-of', 'decisoes de design']
};
```

## A virada para SEO técnico

Depois da primeira versão visual, veio uma decisão importante: transformar cada artigo em uma página real, não apenas em uma tela carregada por JavaScript.

Na primeira implementação, a leitura funcionava bem para pessoas, mas a URL tinha este formato:

```text
/article.html?slug=making-of-blog-eu-ia
```

Isso é suficiente para um MVP, mas não é o melhor formato para um blog que precisa crescer no Google. A evolução foi criar rotas estáticas e editoriais:

```text
/blog/making-of-blog-eu-ia/
/blog/como-construi-ismael-dev-studio/
```

Para isso, adicionei um script de geração estática no build. Ele lê o JSON de posts, abre cada arquivo Markdown, converte o conteúdo para HTML e grava uma página completa em `dist/blog/[slug]/index.html`.

O mesmo processo também gera:

- canonical por página;
- Open Graph;
- Twitter Card;
- JSON-LD `BlogPosting`;
- `sitemap.xml`;
- `robots.txt`;
- página Sobre em `/sobre/`.

Com isso, o artigo deixa de depender apenas do JavaScript para existir. O conteúdo, o título, a descrição e os dados estruturados já aparecem no HTML inicial.

## Links do projeto

Para deixar o making-of mais útil como portfólio, deixei os links principais reunidos aqui:

- [Repositório do Blog Eu + IA no GitHub](https://github.com/ismaeldevweb-afk/eu-ia-eta);
- [Página inicial do Blog Eu + IA](/);
- [Meu perfil no LinkedIn](https://www.linkedin.com/in/ismael-nunes-dos-santos).

Esses links ajudam quem está lendo a sair do artigo e conferir tanto o código quanto o resultado visual do projeto. O GitHub mostra a estrutura real do blog, a home mostra a experiência publicada dentro do próprio site e o LinkedIn conecta o projeto à minha presença profissional.

## Decisões de interface

A primeira versão da home era bem minimalista. Depois, a interface evoluiu para parecer mais editorial e mais madura. A hero ganhou uma abertura mais forte, com chamada principal, botões e indicadores rápidos do conceito: prompts reais, making-of aberto e HTML + TypeScript.

Os cards dos artigos também foram redesenhados. Em vez de uma listagem muito simples, cada card passou a ter numeração, data, tempo de leitura, título com sublinhado animado, descrição, tags e link explícito para leitura. Isso ajuda o leitor a escanear a página e entender que existe uma sequência de bastidores publicados.

Também criei a seção "Comece por aqui", que funciona como onboarding editorial. Ela mostra três caminhos:

- ler o making-of;
- ver os prompts;
- explorar por tema.

<figure class="article-figure">
  <img src="/images/articles/blog-eu-ia/home-mobile.png" alt="Print da página inicial do blog Eu + IA em viewport mobile." loading="lazy" />
  <figcaption>Versão mobile da home: os cards e botões foram ajustados para leitura em telas estreitas.</figcaption>
</figure>

## Paleta e tipografia

A paleta usa um fundo quase branco em tom papiro, com azuis suaves para sinalizar tecnologia e interação. Essa escolha evita um visual corporativo demais e aproxima o blog de uma publicação pessoal.

Os títulos usam Georgia porque trazem uma sensação de caderno, ensaio e texto autoral. Já o corpo e a interface usam fontes do sistema para manter a leitura limpa e o carregamento rápido.

As principais variáveis visuais ficaram centralizadas no CSS:

```css
:root {
  --bg: #fdfbf7;
  --text: #1e1e1e;
  --text-muted: #5c5c5c;
  --accent: #2b6cb0;
  --accent-soft: #e2eff9;
  --prompt-bg: #eef2f5;
  --prompt-border: #a0c4e8;
}
```

Essa decisão facilita a evolução do design. Se o blog ganhar modo escuro ou uma paleta alternativa no futuro, a base já está preparada.

## Como os prompts entram na narrativa

O elemento mais importante do blog é o bloco de prompt. Em Markdown, ele é escrito como `blockquote`. Na renderização, todo `blockquote` recebe a classe `prompt`, ganha um label visual e um botão de copiar.

> Nome do produto: Eu + IA
>
> Descrição curta: Um blog pessoal onde cada artigo é um making-of de projetos criados com ajuda de IA, mostrando prompts reais e o passo a passo da cocriação humano-máquina.
>
> Resultado esperado: Um produto digital real, online, que sirva como portfólio vivo e prova de que prompts viram produtos reais.

Essa regra transforma uma sintaxe simples do Markdown em um componente editorial próprio. O leitor identifica rapidamente o que é prompt, pode copiar o texto e entende que aquele bloco faz parte da história da construção.

<figure class="article-figure">
  <img src="/images/articles/blog-eu-ia/prompt-block.png" alt="Print da página de artigo mostrando um bloco de prompt com botão de copiar." loading="lazy" />
  <figcaption>Bloco de prompt dentro do artigo: destaque visual, fonte monoespaçada e botão de cópia.</figcaption>
</figure>

## Melhorias na página do artigo

A página individual precisava ser mais do que uma área onde o Markdown aparece. Ela ganhou um cabeçalho próprio com:

- link de volta para a home;
- marca do blog;
- etiqueta "Making-of publicado";
- título grande;
- descrição curta do post;
- data e tempo estimado de leitura.

Também adicionei IDs automáticos nos títulos `h2` e `h3`. Isso permite criar links diretos para seções específicas do artigo, como `#o-prompt-inicial`.

<figure class="article-figure">
  <img src="/images/articles/blog-eu-ia/article-desktop.png" alt="Print da página individual de artigo do blog Eu + IA em desktop." loading="lazy" />
  <figcaption>Página individual com cabeçalho editorial, metadados e ritmo de leitura mais claro.</figcaption>
</figure>

## Responsividade e ajustes finos

Durante a revisão visual, um problema apareceu nos screenshots mobile: alguns elementos decorativos e textos longos causavam overflow horizontal. O ajuste foi trocar a estratégia da largura principal para uma `site-shell` com `width: 100%`, `max-width` e padding interno. Também adicionei `overflow-wrap` em títulos, badges, descrições e textos do artigo.

Esse tipo de ajuste parece pequeno, mas faz diferença na sensação de produto. Um blog de leitura precisa ser previsível: nada pode cortar texto, criar barra horizontal inesperada ou quebrar a hierarquia em telas pequenas.

## O que aprendi construindo o blog

Construir o Eu + IA reforçou uma ideia importante: prompts ajudam, mas produto nasce das decisões. O prompt inicial apontou a direção, mas a interface só ficou boa depois de várias escolhas humanas:

- reduzir distrações;
- priorizar leitura;
- criar uma identidade visual própria;
- destacar prompts sem transformar o blog em documentação técnica;
- manter o conteúdo fácil de publicar;
- validar a interface com screenshots;
- corrigir problemas de responsividade.

O blog também virou uma estrutura reaproveitável. O artigo sobre o Ismael Dev Studio, por exemplo, entrou no projeto apenas com um novo arquivo Markdown e uma nova entrada no JSON.

## O que vem depois

O MVP já permite publicar artigos reais, documentar prompts e mostrar o processo de criação. As próximas evoluções naturais são:

- modo escuro;
- busca por título, resumo e tag;
- lista global de tags;
- RSS;
- imagens sociais específicas para cada artigo;
- comentários com GitHub Discussions;
- newsletter;
- páginas estáticas por tag.

O ponto principal permanece o mesmo: humano acima de tudo, IA como parceira e processo criativo tratado como parte do produto.
