"use client";

import { useEffect } from "react";

export default function PromptCopyEnhancer() {
  useEffect(() => {
    const handlers: Array<{ button: HTMLButtonElement; handler: () => void }> = [];

    document.querySelectorAll<HTMLQuoteElement>("blockquote.prompt").forEach((blockquote) => {
      const button = blockquote.querySelector<HTMLButtonElement>("button.copy-prompt");

      if (!button) {
        return;
      }

      const promptText = blockquote.textContent?.trim() ?? "";
      const handler = async () => {
        try {
          await navigator.clipboard.writeText(promptText);
          button.classList.add("is-copied");
          button.setAttribute("aria-label", "Prompt copiado");
          window.setTimeout(() => {
            button.classList.remove("is-copied");
            button.setAttribute("aria-label", "Copiar prompt");
          }, 1800);
        } catch {
          button.classList.add("is-error");
          button.setAttribute("aria-label", "Não foi possível copiar");
          window.setTimeout(() => {
            button.classList.remove("is-error");
            button.setAttribute("aria-label", "Copiar prompt");
          }, 1800);
        }
      };

      button.addEventListener("click", handler);
      handlers.push({ button, handler });
    });

    return () => {
      handlers.forEach(({ button, handler }) => {
        button.removeEventListener("click", handler);
      });
    };
  }, []);

  return null;
}
