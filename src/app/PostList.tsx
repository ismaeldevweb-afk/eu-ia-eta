"use client";

import { useSearchParams } from "next/navigation";
import { PostCard } from "@/app/_components";
import type { Post } from "@/types";

export default function PostList({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag")?.trim() || undefined;
  const visiblePosts = selectedTag
    ? posts.filter((post) => post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()))
    : posts;

  return (
    <>
      {selectedTag ? (
        <div id="filter-state" className="filter-state">
          <span>
            Filtrando por <strong>#{selectedTag}</strong>
          </span>
          <a href="/" aria-label="Limpar filtro de tags">
            Limpar
          </a>
        </div>
      ) : null}
      <div id="posts-list" className="post-list" aria-live="polite">
        {visiblePosts.length ? (
          visiblePosts.map((post, index) => (
            <PostCard key={post.slug} post={post} selectedTag={selectedTag} index={index} />
          ))
        ) : (
          <p className="empty-state">Nenhum artigo encontrado para essa tag.</p>
        )}
      </div>
    </>
  );
}
