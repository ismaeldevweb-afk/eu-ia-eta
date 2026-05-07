export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://eu-ia-eta.vercel.app").replace(
  /\/+$/,
  ""
);

export const site = {
  name: "Eu + IA",
  title: "Eu + IA | Prompts, IA e bastidores de projetos reais",
  description:
    "Um diário de criação onde prompts, inteligência artificial e decisões humanas viram produtos digitais reais.",
  image: "/images/articles/blog-eu-ia/home-desktop.png",
  imageAlt: "Página inicial do blog Eu + IA em desktop, com hero editorial e lista de artigos.",
};

export const author = {
  name: "Ismael Nunes dos Santos",
  url: "https://www.linkedin.com/in/ismael-nunes-dos-santos",
};

export function absoluteUrl(pathname: string): string {
  if (pathname.startsWith("http")) {
    return pathname;
  }

  return `${siteUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function blogPath(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}/`;
}
