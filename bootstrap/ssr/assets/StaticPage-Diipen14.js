import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { P as PublicShell } from "./PublicShell-BP7kSiNp.js";
import { d as formatDateMonthYear } from "./date-ClVPp3mI.js";
import "./SiteFooter-Cn_4a6rU.js";
const SLUG_LABEL = {
  terms: "Documento legal",
  privacy: "Documento legal",
  about: "La marca",
  faq: "Preguntas frecuentes"
};
const RELATED = {
  terms: [
    { href: "/privacy", label: "Política de privacidad" },
    { href: "/faq", label: "Preguntas frecuentes" }
  ],
  privacy: [
    { href: "/terms", label: "Términos y condiciones" },
    { href: "/faq", label: "Preguntas frecuentes" }
  ],
  about: [
    { href: "/catalog", label: "Catálogo" },
    { href: "/faq", label: "Preguntas frecuentes" }
  ],
  faq: [
    { href: "/terms", label: "Términos y condiciones" },
    { href: "/privacy", label: "Política de privacidad" }
  ]
};
function StaticPage({ page }) {
  const eyebrow = SLUG_LABEL[page.slug] ?? "Documento";
  const related = RELATED[page.slug] ?? [];
  return /* @__PURE__ */ jsx(PublicShell, { title: page.title, children: /* @__PURE__ */ jsxs("article", { children: [
    /* @__PURE__ */ jsxs("header", { className: "pt-16 pb-12 sm:pt-24 sm:pb-16", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: [
        "Ikonoverde · ",
        eyebrow
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 max-w-[28ch] font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: page.title }),
      page.updated_at && /* @__PURE__ */ jsxs("p", { className: "mt-8 font-spec text-[11px] tabular-nums tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: [
        "Última actualización · ",
        formatDateMonthYear(page.updated_at)
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--iko-stone-hairline)] pt-12 pb-16", children: /* @__PURE__ */ jsx("div", { className: "font-sans text-[var(--iko-stone-ink)]", children: /* @__PURE__ */ jsx(Markdown, { remarkPlugins: [remarkGfm], components: MARKDOWN_COMPONENTS, children: page.content }) }) }),
    related.length > 0 && /* @__PURE__ */ jsxs("footer", { className: "border-t border-[var(--iko-stone-hairline)] pt-10 pb-4", children: [
      /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Documentos relacionados" }),
      /* @__PURE__ */ jsx("ul", { className: "mt-6 grid gap-px bg-[var(--iko-stone-hairline)] sm:grid-cols-2", children: related.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: item.href,
          className: "group flex items-baseline justify-between gap-4 bg-[var(--iko-stone-paper)] py-5 pr-4 text-[15px] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]", children: item.label }),
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent)] uppercase transition-transform group-hover:translate-x-0.5",
                children: "Ver →"
              }
            )
          ]
        }
      ) }, item.href)) })
    ] })
  ] }) });
}
const MARKDOWN_COMPONENTS = {
  h1: ({ children }) => /* @__PURE__ */ jsx("h2", { className: "mt-14 mb-6 border-t border-[var(--iko-stone-hairline)] pt-10 font-display text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)] first:mt-0 first:border-t-0 first:pt-0", children }),
  h2: ({ children }) => /* @__PURE__ */ jsx("h2", { className: "mt-14 mb-6 border-t border-[var(--iko-stone-hairline)] pt-10 font-display text-[clamp(1.5rem,2.5vw,1.875rem)] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)] first:mt-0 first:border-t-0 first:pt-0", children }),
  h3: ({ children }) => /* @__PURE__ */ jsx("h3", { className: "mt-10 mb-3 font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]", children }),
  h4: ({ children }) => /* @__PURE__ */ jsx("h4", { className: "mt-8 mb-2 font-sans text-[14px] font-medium tracking-[0.04em] text-[var(--iko-stone-ink)] uppercase", children }),
  p: ({ children }) => /* @__PURE__ */ jsx("p", { className: "mb-5 max-w-[65ch] text-[16px] leading-[1.65] text-[var(--iko-stone-ink)]/85", children }),
  ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "mb-6 max-w-[65ch] list-none space-y-2 pl-0", children }),
  ol: ({ children }) => /* @__PURE__ */ jsx("ol", { className: "mb-6 max-w-[65ch] list-none space-y-2 pl-0 [counter-reset:iko]", children }),
  li: ({ children, ...rest }) => {
    const { ordered: _ordered, ...domProps } = rest;
    return /* @__PURE__ */ jsx(
      "li",
      {
        ...domProps,
        className: "relative pl-6 text-[15.5px] leading-[1.65] text-[var(--iko-stone-ink)]/85 before:absolute before:left-0 before:top-[0.5em] before:h-px before:w-3 before:bg-[var(--iko-accent)]",
        children
      }
    );
  },
  a: ({ children, href, ...rest }) => /* @__PURE__ */ jsx(
    "a",
    {
      ...rest,
      href,
      className: "text-[var(--iko-accent)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] rounded-sm",
      children
    }
  ),
  strong: ({ children }) => /* @__PURE__ */ jsx("strong", { className: "font-medium text-[var(--iko-stone-ink)]", children }),
  em: ({ children }) => /* @__PURE__ */ jsx("em", { className: "not-italic text-[var(--iko-stone-ink)]", children }),
  code: ({ children }) => /* @__PURE__ */ jsx("code", { className: "rounded-sm bg-[var(--iko-accent-soft)] px-1.5 py-0.5 font-spec text-[0.9em] text-[var(--iko-stone-ink)]", children }),
  blockquote: ({ children }) => /* @__PURE__ */ jsx("blockquote", { className: "my-8 max-w-[60ch] border-l-0 pl-0", children: /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--iko-stone-hairline)] pt-6 font-display text-[1.25rem] leading-[1.45] text-[var(--iko-stone-ink)]", children }) }),
  hr: () => /* @__PURE__ */ jsx("hr", { className: "my-12 border-0 border-t border-[var(--iko-stone-hairline)]" }),
  table: ({ children }) => /* @__PURE__ */ jsx("div", { className: "my-8 overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: "w-full border-collapse text-left text-[14px]", children }) }),
  thead: ({ children }) => /* @__PURE__ */ jsx("thead", { className: "border-b border-[var(--iko-stone-ink)]", children }),
  th: ({ children }) => /* @__PURE__ */ jsx("th", { className: "py-3 pr-6 font-spec text-[11px] tracking-[0.06em] text-[var(--iko-stone-whisper)] uppercase", children }),
  td: ({ children }) => /* @__PURE__ */ jsx("td", { className: "border-b border-[var(--iko-stone-hairline)] py-3 pr-6 text-[var(--iko-stone-ink)]", children })
};
export {
  StaticPage as default
};
