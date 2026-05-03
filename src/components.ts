import { escapeAttribute, escapeHtml } from './html';
import { formatLongDate } from './posts';
import type { Post } from './types';

export function renderTagBadge(tag: string, selectedTag?: string): string {
  const encodedTag = encodeURIComponent(tag);
  const isActive = tag.toLowerCase() === selectedTag?.toLowerCase();

  return `
    <a
      class="badge${isActive ? ' is-active' : ''}"
      href="/?tag=${encodedTag}"
      aria-label="Ver artigos com a tag ${escapeAttribute(tag)}"
    >#${escapeHtml(tag)}</a>
  `;
}

export function renderPostCard(post: Post, selectedTag?: string, index = 0): string {
  const metaParts = [formatLongDate(post.date)];
  const postNumber = String(index + 1).padStart(2, '0');

  if (post.readingMinutes) {
    metaParts.push(`~${post.readingMinutes} min de leitura`);
  }

  return `
    <article class="post-card">
      <div class="post-index" aria-hidden="true">${postNumber}</div>
      <div class="post-card-body">
        <div class="post-card-meta">
          <time datetime="${escapeAttribute(post.date)}">${escapeHtml(metaParts[0])}</time>
          ${post.readingMinutes ? `<span>${escapeHtml(metaParts[1])}</span>` : ''}
        </div>
        <h2>
          <a class="post-title-link" href="/blog/${encodeURIComponent(post.slug)}/">
            ${escapeHtml(post.title)}
          </a>
        </h2>
        <p>${escapeHtml(post.description)}</p>
        <div class="post-card-footer">
          <div class="tag-list" aria-label="Tags do artigo">
            ${post.tags.map((tag) => renderTagBadge(tag, selectedTag)).join('')}
          </div>
          <a
            class="read-link"
            href="/blog/${encodeURIComponent(post.slug)}/"
            aria-label="Ler artigo ${escapeAttribute(post.title)}"
          >Ler artigo</a>
        </div>
      </div>
    </article>
  `;
}
