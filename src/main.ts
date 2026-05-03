import { renderPostCard } from './components';
import { escapeHtml } from './html';
import { loadPosts } from './posts';

const postsList = document.querySelector<HTMLDivElement>('#posts-list');
const filterState = document.querySelector<HTMLDivElement>('#filter-state');

function getSelectedTag(): string | undefined {
  const params = new URLSearchParams(window.location.search);
  const tag = params.get('tag')?.trim();

  return tag || undefined;
}

function renderFilterState(tag?: string): void {
  if (!filterState) {
    return;
  }

  if (!tag) {
    filterState.hidden = true;
    filterState.innerHTML = '';
    return;
  }

  filterState.hidden = false;
  filterState.innerHTML = `
    <span>Filtrando por <strong>#${escapeHtml(tag)}</strong></span>
    <a href="/" aria-label="Limpar filtro de tags">Limpar</a>
  `;
}

async function initHome(): Promise<void> {
  if (!postsList) {
    return;
  }

  try {
    const selectedTag = getSelectedTag();
    const posts = await loadPosts();
    const visiblePosts = selectedTag
      ? posts.filter((post) =>
          post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
        )
      : posts;

    renderFilterState(selectedTag);

    if (visiblePosts.length === 0) {
      postsList.innerHTML = `
        <p class="empty-state">Nenhum artigo encontrado para essa tag.</p>
      `;
      return;
    }

    postsList.innerHTML = visiblePosts
      .map((post, index) => renderPostCard(post, selectedTag, index))
      .join('');
  } catch (error) {
    postsList.innerHTML = `
      <p class="empty-state">Não foi possível carregar os artigos agora.</p>
    `;
    console.error(error);
  }
}

void initHome();
