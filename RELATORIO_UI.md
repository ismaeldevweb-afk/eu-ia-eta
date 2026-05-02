# Relatorio de UI/UX - Blog Eu + IA

## 1. Visao geral

O blog Eu + IA foi criado como uma experiencia editorial simples, leve e focada em leitura. A proposta visual segue a metafora de uma folha de caderno digital combinada com um terminal amigavel, reforcando a ideia de um diario de criacao onde prompts, decisoes humanas e inteligencia artificial aparecem como parte do processo.

O MVP foi implementado com HTML semantico, CSS puro, TypeScript, Vite, conteudo em Markdown e metadados em JSON.

## 2. Conceito visual

A interface evita um aspecto corporativo e prioriza uma atmosfera pessoal, clara e acolhedora. O fundo quase branco em tom papiro, as linhas discretas e os titulos serifados criam sensacao de publicacao autoral. Os detalhes em azul adicionam o componente tecnologico sem pesar a leitura.

Principais diretrizes aplicadas:

- Layout centralizado com largura maxima de 720px.
- Foco total em texto, sem imagens de capa na listagem.
- Separacao dos artigos por linhas finas.
- Destaques de prompt com estilo de terminal leve.
- Microinteracoes discretas para links, tags e botoes.

## 3. Identidade visual

### Paleta

Foram implementadas variaveis CSS para manter consistencia visual:

- `--bg: #fdfbf7` para o fundo principal.
- `--bg-secondary: #f3f0eb` para superficies secundarias.
- `--text: #1e1e1e` para texto principal.
- `--text-muted: #5c5c5c` para metadados e textos secundarios.
- `--accent: #2b6cb0` para links e interacoes.
- `--accent-soft: #e2eff9` para badges e divisorias suaves.
- `--prompt-bg: #eef2f5` para blocos de prompt.
- `--prompt-border: #a0c4e8` para a borda lateral dos prompts.
- `--code-bg: #f4f4f4` para codigo inline e blocos de codigo.
- `--success: #2e7d32` para feedback positivo do botao de copiar.

### Tipografia

A tipografia segue a especificacao do projeto:

- Titulos com `Georgia, "Times New Roman", serif`.
- Interface e corpo com `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Titulos responsivos usando `clamp()`.
- Corpo com `line-height: 1.7`, favorecendo leitura confortavel.

## 4. Estrutura da UI

### Pagina inicial

A home apresenta:

- Cabecalho com nome do blog, assinatura e linha decorativa.
- Lista de artigos ordenada por data decrescente.
- Card de artigo com data, tempo estimado de leitura, titulo, resumo e tags.
- Tags clicaveis com filtro por query string.
- Rodape simples com credito tecnico.

O foco da pagina inicial e editorial. A ausencia de imagens de capa ajuda a manter a atencao nos textos e no processo criativo.

### Pagina de artigo

A pagina de artigo apresenta:

- Link de retorno para a home.
- Metadados do artigo com data e tempo estimado de leitura.
- Conteudo carregado a partir de Markdown.
- Estilizacao de `h2`, `h3`, paragrafos, codigo inline e blocos `pre`.
- Rodape com data de publicacao e tags centralizadas.

## 5. Blocos de prompt

Todo `blockquote` vindo do Markdown e convertido visualmente em um bloco de prompt.

Caracteristicas implementadas:

- Fundo azul acinzentado suave.
- Borda esquerda azul.
- Fonte monoespacada.
- Label visual `Prompt` inserido via CSS.
- Botao de copiar no canto superior direito.
- Feedback visual quando o prompt e copiado.
- Fallback de copia para navegadores sem `navigator.clipboard`.

Essa escolha reforca a narrativa central do blog: prompts nao sao anexos, sao parte principal do making-of.

## 6. Interacoes

As principais microinteracoes implementadas foram:

- Hover nos titulos dos artigos com mudanca de cor e sublinhado animado.
- Hover nas tags com mudanca de fundo, cor e sombra leve.
- Estado ativo para tags filtradas.
- Botao de copiar prompt com estado de sucesso e erro.
- Estilos de foco visiveis para navegacao por teclado.

## 7. Responsividade

A UI foi construida com abordagem mobile-first:

- Conteudo limitado a 720px em telas grandes.
- Padding lateral reduzido em telas pequenas.
- Titulos com tamanho fluido via `clamp()`.
- Quebra segura de palavras longas com `overflow-wrap`.
- Tags com `flex-wrap` para evitar sobreposicao.
- Blocos de prompt com comportamento adequado em largura reduzida.

## 8. Acessibilidade

Recursos aplicados:

- Uso de tags semanticas: `header`, `main`, `article`, `footer`.
- Links e botoes acessiveis por teclado.
- `aria-label` em links e botoes quando necessario.
- `aria-live` nas areas carregadas dinamicamente.
- Contraste adequado entre texto, fundo e elementos interativos.
- Estados de foco visiveis com outline.
- `blockquote` de prompt marcado com `aria-label`.

## 9. Arquitetura tecnica

Arquivos principais:

- `index.html`: estrutura da pagina inicial.
- `article.html`: estrutura da pagina de artigo.
- `src/styles.css`: design system, layout e estilos responsivos.
- `src/main.ts`: carregamento e renderizacao da lista de posts.
- `src/article.ts`: carregamento do artigo, conversao Markdown e copia de prompts.
- `src/components.ts`: componentes de card e badge.
- `src/posts.ts`: carregamento, ordenacao e formatacao de posts.
- `src/html.ts`: escape de HTML para renderizacao segura.
- `public/data/posts.json`: metadados dos artigos.
- `public/posts/*.md`: conteudo dos artigos em Markdown.

## 10. Validacoes realizadas

Foram executadas as seguintes verificacoes:

- `npm run build`: build de producao gerado com sucesso.
- `npm audit --audit-level=moderate`: nenhuma vulnerabilidade encontrada.
- Verificacao manual via servidor Vite local.
- Capturas em viewport mobile e desktop para revisar hierarquia visual e comportamento responsivo.

## 11. Pontos fortes da UI

- Identidade visual coerente com o conceito do produto.
- Leitura confortavel e sem distracoes.
- Estrutura simples, facil de manter e expandir.
- Prompts destacados como elemento narrativo central.
- Boa base para SEO e deploy estatico.
- Implementacao sem framework, com baixa complexidade.

## 12. Melhorias futuras recomendadas

- Adicionar pagina Sobre com avatar e texto pessoal.
- Criar modo escuro com preferencia automatica do sistema.
- Exibir lista de tags globais na home.
- Adicionar campo de busca por titulo, resumo e tag.
- Integrar comentarios com GitHub Discussions via Giscus.
- Adicionar newsletter.
- Gerar metadados dinamicos por artigo para SEO e compartilhamento social.

## 13. Conclusao

A UI criada entrega um MVP consistente com a proposta do Blog Eu + IA: um produto editorial leve, humano e transparente, onde prompts viram parte visivel do processo criativo. A base visual e tecnica esta pronta para receber novos artigos e evoluir gradualmente sem comprometer simplicidade, performance ou clareza.
