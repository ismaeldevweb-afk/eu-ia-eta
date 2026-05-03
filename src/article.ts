import { marked } from 'marked';
import { renderTagBadge } from './components';
import { escapeHtml } from './html';
import { estimateReadingMinutes, formatLongDate, loadPosts } from './posts';

const articleTitle = document.querySelector<HTMLHeadingElement>('#article-title');
const articleMeta = document.querySelector<HTMLParagraphElement>('#article-meta');
const articleDescription = document.querySelector<HTMLParagraphElement>('#article-description');
const articleContent = document.querySelector<HTMLDivElement>('#article-content');
const articleFooter = document.querySelector<HTMLElement>('#article-footer');

function getSlug(): string | undefined {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug')?.trim();

  if (slug) {
    return slug;
  }

  const pathMatch = window.location.pathname.match(/\/blog\/([^/]+)\/?$/);

  return pathMatch?.[1] ? decodeURIComponent(pathMatch[1]) : undefined;
}

function setArticleError(message: string): void {
  if (articleTitle) {
    articleTitle.textContent = 'Artigo não encontrado';
  }

  if (articleContent) {
    articleContent.innerHTML = `<p class="empty-state">${message}</p>`;
  }

  if (articleDescription) {
    articleDescription.textContent = '';
  }
}

async function loadMarkdown(slug: string): Promise<string> {
  const response = await fetch(`/posts/${encodeURIComponent(slug)}.md`);

  if (!response.ok) {
    throw new Error('Markdown não encontrado.');
  }

  return response.text();
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.inset = '-999px auto auto -999px';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function enhancePromptBlocks(root: HTMLElement): void {
  root.querySelectorAll<HTMLQuoteElement>('blockquote').forEach((blockquote) => {
    const promptText = blockquote.textContent?.trim() ?? '';
    const button = document.createElement('button');

    blockquote.classList.add('prompt');
    blockquote.setAttribute('aria-label', 'Bloco de prompt');

    button.type = 'button';
    button.className = 'copy-prompt';
    button.title = 'Copiar prompt';
    button.setAttribute('aria-label', 'Copiar prompt');
    button.innerHTML = '<span class="copy-icon" aria-hidden="true"></span>';

    button.addEventListener('click', async () => {
      try {
        await copyText(promptText);
        button.classList.add('is-copied');
        button.setAttribute('aria-label', 'Prompt copiado');
        window.setTimeout(() => {
          button.classList.remove('is-copied');
          button.setAttribute('aria-label', 'Copiar prompt');
        }, 1800);
      } catch (error) {
        button.classList.add('is-error');
        button.setAttribute('aria-label', 'Não foi possível copiar');
        window.setTimeout(() => {
          button.classList.remove('is-error');
          button.setAttribute('aria-label', 'Copiar prompt');
        }, 1800);
        console.error(error);
      }
    });

    blockquote.append(button);
  });
}

function slugifyHeading(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'secao'
  );
}

function enhanceArticleHeadings(root: HTMLElement): void {
  const usedIds = new Map<string, number>();

  root.querySelectorAll<HTMLHeadingElement>('h2, h3').forEach((heading) => {
    const baseId = slugifyHeading(heading.textContent ?? '');
    const count = usedIds.get(baseId) ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    usedIds.set(baseId, count + 1);
    heading.id = id;
  });
}

function scrollToHashTarget(): void {
  const hash = window.location.hash.slice(1);

  if (!hash) {
    return;
  }

  window.requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView();
  });
}

async function initArticle(): Promise<void> {
  const slug = getSlug();

  if (!slug) {
    setArticleError('Abra um artigo a partir da pagina inicial.');
    return;
  }

  try {
    const [posts, markdown] = await Promise.all([loadPosts(), loadMarkdown(slug)]);
    const post = posts.find((item) => item.slug === slug);

    if (!post) {
    setArticleError('Não encontramos os metadados desse artigo.');
      return;
    }

    const postIndex = posts.findIndex((item) => item.slug === slug);
    const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
    const nextPost = postIndex >= 0 ? posts[postIndex + 1] : undefined;
    const readingMinutes = post.readingMinutes ?? estimateReadingMinutes(markdown);
    const dateLabel = `${formatLongDate(post.date)} · ~${readingMinutes} min de leitura`;

    document.title = `${post.title} | Eu + IA`;

    if (articleTitle) {
      articleTitle.textContent = post.title;
    }

    if (articleMeta) {
      articleMeta.textContent = dateLabel;
    }

    if (articleDescription) {
      articleDescription.textContent = post.description;
    }

    if (articleContent) {
      articleContent.innerHTML = await marked.parse(markdown, {
        gfm: true
      });
      enhanceArticleHeadings(articleContent);
      enhancePromptBlocks(articleContent);
      scrollToHashTarget();
    }

    if (articleFooter) {
      articleFooter.innerHTML = `
        <p>Publicado em ${formatLongDate(post.date)} no Eu + IA</p>
        <div class="tag-list is-centered" aria-label="Tags do artigo">
          ${post.tags.map((tag) => renderTagBadge(tag)).join('')}
        </div>
        <nav class="article-nav" aria-label="Navegação entre artigos">
          ${
            previousPost
              ? `<a href="/blog/${encodeURIComponent(previousPost.slug)}/"><span>Artigo mais recente</span><strong>${escapeHtml(previousPost.title)}</strong></a>`
              : '<span></span>'
          }
          ${
            nextPost
              ? `<a href="/blog/${encodeURIComponent(nextPost.slug)}/"><span>Próximo artigo</span><strong>${escapeHtml(nextPost.title)}</strong></a>`
              : '<span></span>'
          }
        </nav>
        <a class="button-link is-secondary" href="/">Voltar para a home</a>
      `;
    }
  } catch (error) {
    setArticleError('Não foi possível carregar este artigo agora.');
    console.error(error);
  }
}

void initArticle();
