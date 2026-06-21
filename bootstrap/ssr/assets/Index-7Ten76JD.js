import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { P as PublicShell } from "./PublicShell-BcEJPWWt.js";
import { f as formatDateLong } from "./date-ClVPp3mI.js";
import "./SiteFooter-Cn_4a6rU.js";
function BlogIndex({ posts }) {
  return /* @__PURE__ */ jsxs(PublicShell, { title: "Blog", children: [
    /* @__PURE__ */ jsxs("section", { className: "pt-16 pb-12 sm:pt-24 sm:pb-16", children: [
      /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Ikonoverde · Blog" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 max-w-[22ch] font-display text-[clamp(2.35rem,6vw,4.75rem)] font-normal leading-[0.98] tracking-[-0.025em] text-[var(--iko-stone-ink)]", children: "Notas para comprar, vender y cuidar mejor." }),
      /* @__PURE__ */ jsx("p", { className: "mt-8 max-w-[58ch] text-[16px] leading-[1.7] text-[var(--iko-stone-ink)]/75", children: "Guías breves sobre producto profesional, operación de negocio y cuidado corporal con enfoque práctico." })
    ] }),
    posts.data.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid gap-px bg-[var(--iko-stone-hairline)] md:grid-cols-2 lg:grid-cols-3", children: posts.data.map((post) => /* @__PURE__ */ jsx(ArticleCard, { post }, post.id)) }),
      (posts.prev_page_url || posts.next_page_url) && /* @__PURE__ */ jsxs("nav", { className: "mt-10 flex items-center justify-between border-t border-[var(--iko-stone-hairline)] pt-6 text-[13px]", children: [
        /* @__PURE__ */ jsx(PaginationLink, { href: posts.prev_page_url, label: "Anterior" }),
        /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: [
          "Página ",
          posts.current_page,
          " de ",
          posts.last_page
        ] }),
        /* @__PURE__ */ jsx(PaginationLink, { href: posts.next_page_url, label: "Siguiente", alignRight: true })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "border-y border-[var(--iko-stone-hairline)] py-16", children: [
      /* @__PURE__ */ jsx("p", { className: "font-display text-[1.75rem] text-[var(--iko-stone-ink)]", children: "Aún no hay entradas publicadas." }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-[48ch] text-[15px] leading-6 text-[var(--iko-stone-ink)]/70", children: "Vuelve pronto para leer nuevas guías y notas de Ikonoverde." })
    ] })
  ] });
}
function ArticleCard({ post }) {
  return /* @__PURE__ */ jsx("article", { className: "group bg-[var(--iko-stone-paper)]", children: /* @__PURE__ */ jsxs(
    Link,
    {
      href: `/blog/${post.slug}`,
      className: "flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
      children: [
        /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] overflow-hidden bg-[var(--iko-stone-mid)]/35", children: post.cover_image_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: post.cover_image_url,
            alt: "",
            className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex h-full items-end p-6", children: /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.1em] text-[var(--iko-stone-whisper)] uppercase", children: "Ikonoverde" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
          post.published_at && /* @__PURE__ */ jsx("time", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: formatDateLong(post.published_at) }),
          /* @__PURE__ */ jsx("h2", { className: "mt-5 font-display text-[1.55rem] leading-[1.12] tracking-[-0.01em] text-[var(--iko-stone-ink)]", children: post.title }),
          post.excerpt && /* @__PURE__ */ jsx("p", { className: "mt-4 line-clamp-3 text-[14.5px] leading-6 text-[var(--iko-stone-ink)]/70", children: post.excerpt }),
          /* @__PURE__ */ jsx("span", { className: "mt-8 font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: "Leer entrada" })
        ] })
      ]
    }
  ) });
}
function PaginationLink({ href, label, alignRight = false }) {
  if (!href) {
    return /* @__PURE__ */ jsx("span", { className: "min-w-24" });
  }
  return /* @__PURE__ */ jsx(
    Link,
    {
      href,
      preserveScroll: true,
      className: `min-w-24 rounded-sm text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] ${alignRight ? "text-right" : ""}`,
      children: label
    }
  );
}
export {
  BlogIndex as default
};
