import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { P as PublicShell } from "./PublicShell-nawmX4QX.js";
import { f as formatDateLong } from "./date-CuQtAuCG.js";
import "./SiteFooter-BfzQHT4y.js";
function BlogShow({ post }) {
  return /* @__PURE__ */ jsx(PublicShell, { title: post.title, children: /* @__PURE__ */ jsxs("article", { children: [
    /* @__PURE__ */ jsxs("header", { className: "pt-12 pb-10 sm:pt-20 sm:pb-14", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/blog",
          className: "font-spec text-[11px] tracking-[0.1em] text-[var(--iko-accent)] uppercase hover:text-[var(--iko-accent-hover)]",
          children: "Blog"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 max-w-[24ch] font-display text-[clamp(2.2rem,5.6vw,4.5rem)] font-normal leading-[0.99] tracking-[-0.025em] text-[var(--iko-stone-ink)]", children: post.title }),
      post.excerpt && /* @__PURE__ */ jsx("p", { className: "mt-7 max-w-[58ch] text-[17px] leading-[1.7] text-[var(--iko-stone-ink)]/75", children: post.excerpt }),
      post.published_at && /* @__PURE__ */ jsxs("time", { className: "mt-8 block font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: [
        "Publicado · ",
        formatDateLong(post.published_at)
      ] })
    ] }),
    post.cover_image_url && /* @__PURE__ */ jsx("div", { className: "border-y border-[var(--iko-stone-hairline)] py-8", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: post.cover_image_url,
        alt: "",
        className: "aspect-[16/8] w-full object-cover"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "border-b border-[var(--iko-stone-hairline)] py-12 sm:py-16", children: /* @__PURE__ */ jsx(Markdown, { remarkPlugins: [remarkGfm], components: MARKDOWN_COMPONENTS, children: post.content }) })
  ] }) });
}
const MARKDOWN_COMPONENTS = {
  h1: ({ children }) => /* @__PURE__ */ jsx("h2", { className: "mt-14 mb-6 border-t border-[var(--iko-stone-hairline)] pt-10 font-display text-[2rem] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)] first:mt-0 first:border-t-0 first:pt-0", children }),
  h2: ({ children }) => /* @__PURE__ */ jsx("h2", { className: "mt-14 mb-6 border-t border-[var(--iko-stone-hairline)] pt-10 font-display text-[1.75rem] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)] first:mt-0 first:border-t-0 first:pt-0", children }),
  h3: ({ children }) => /* @__PURE__ */ jsx("h3", { className: "mt-10 mb-3 font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]", children }),
  p: ({ children }) => /* @__PURE__ */ jsx("p", { className: "mb-5 max-w-[66ch] text-[16px] leading-[1.72] text-[var(--iko-stone-ink)]/85", children }),
  ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "mb-6 flex max-w-[65ch] flex-col gap-2 pl-0", children }),
  ol: ({ children }) => /* @__PURE__ */ jsx("ol", { className: "mb-6 flex max-w-[65ch] flex-col gap-2 pl-0", children }),
  li: ({ children }) => /* @__PURE__ */ jsx("li", { className: "relative list-none pl-6 text-[15.5px] leading-[1.65] text-[var(--iko-stone-ink)]/85 before:absolute before:left-0 before:top-[0.5em] before:h-px before:w-3 before:bg-[var(--iko-accent)]", children }),
  a: ({ children, href, ...rest }) => /* @__PURE__ */ jsx(
    "a",
    {
      ...rest,
      href,
      className: "rounded-sm text-[var(--iko-accent)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)]",
      children
    }
  ),
  blockquote: ({ children }) => /* @__PURE__ */ jsx("blockquote", { className: "my-8 max-w-[60ch] border-t border-[var(--iko-stone-hairline)] pt-6 font-display text-[1.25rem] leading-[1.45] text-[var(--iko-stone-ink)]", children }),
  hr: () => /* @__PURE__ */ jsx("hr", { className: "my-12 border-0 border-t border-[var(--iko-stone-hairline)]" })
};
export {
  BlogShow as default
};
