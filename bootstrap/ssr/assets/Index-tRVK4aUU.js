import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { b as formatDate, a as formatDateShort } from "./date-CuQtAuCG.js";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const statusConfig = {
  draft: { label: "Borrador", className: "bg-muted text-muted-foreground" },
  scheduled: { label: "Programada", className: "bg-accent text-accent-foreground" },
  published: { label: "Publicada", className: "bg-primary/10 text-primary" }
};
function BlogPostsIndex() {
  const { posts, filters, flash } = usePage().props;
  const [searchQuery, setSearchQuery] = useState(filters.search ?? "");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/admin/blog-posts", { search: searchQuery }, { preserveState: true });
  };
  const deletePost = (post) => {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    router.delete(`/admin/blog-posts/${post.id}`);
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Blog", active: "blog-posts", children: /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Blog" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Crea y administra entradas publicadas en /blog" })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/admin/blog-posts/create",
          className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Nueva Entrada"
          ]
        }
      )
    ] }),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary", children: flash.success }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "mb-6 flex max-w-md gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar por título o slug...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary",
          children: "Buscar"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border bg-background", children: [
          /* @__PURE__ */ jsx(TableHeading, { children: "Título" }),
          /* @__PURE__ */ jsx(TableHeading, { children: "Estado" }),
          /* @__PURE__ */ jsx(TableHeading, { children: "Publicación" }),
          /* @__PURE__ */ jsx(TableHeading, { children: "Actualizado" }),
          /* @__PURE__ */ jsx(TableHeading, { alignRight: true, children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: posts.data.map((post) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: post.title }),
            /* @__PURE__ */ jsxs("code", { className: "w-fit rounded bg-muted px-2 py-1 text-xs text-muted-foreground", children: [
              "/blog/",
              post.slug
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusConfig[post.status].className}`, children: statusConfig[post.status].label }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-xs text-muted-foreground", children: post.published_at ? formatDate(post.published_at) : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-xs text-muted-foreground", children: formatDateShort(post.updated_at) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: `/admin/blog-posts/${post.id}/preview`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline",
                children: [
                  /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }),
                  "Vista previa"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: `/admin/blog-posts/${post.id}/edit`,
                className: "inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline",
                children: [
                  /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }),
                  "Editar"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => deletePost(post),
                className: "inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-destructive hover:underline",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  "Eliminar"
                ]
              }
            )
          ] }) })
        ] }, post.id)) })
      ] }),
      posts.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-6 py-12 text-center text-sm text-muted-foreground", children: "No hay entradas de blog para mostrar." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border px-6 py-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "Mostrando ",
          posts.from ?? 0,
          " a ",
          posts.to ?? 0,
          " de ",
          posts.total,
          " entradas"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(PaginationButton, { href: posts.prev_page_url, children: "Anterior" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground", children: [
            posts.current_page,
            " / ",
            posts.last_page
          ] }),
          /* @__PURE__ */ jsx(PaginationButton, { href: posts.next_page_url, children: "Siguiente" })
        ] })
      ] })
    ] })
  ] }) });
}
function TableHeading({ children, alignRight = false }) {
  return /* @__PURE__ */ jsx("th", { className: `px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground ${alignRight ? "text-right" : "text-left"}`, children });
}
function PaginationButton({ href, children }) {
  if (!href) {
    return /* @__PURE__ */ jsx("span", { className: "rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground opacity-50", children });
  }
  return /* @__PURE__ */ jsx(
    Link,
    {
      href,
      preserveScroll: true,
      className: "rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted",
      children
    }
  );
}
export {
  BlogPostsIndex as default
};
