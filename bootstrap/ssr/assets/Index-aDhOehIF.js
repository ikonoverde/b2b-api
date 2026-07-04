import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-ca4ZqyB9.js";
import { b as formatDate, a as formatDateShort } from "./date-ClVPp3mI.js";
const statusConfig = {
  draft: { label: "Borrador", className: "bg-gray-100 text-gray-600" },
  scheduled: { label: "Programada", className: "bg-blue-50 text-blue-700" },
  published: { label: "Publicada", className: "bg-green-50 text-green-700" }
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
        /* @__PURE__ */ jsx("h1", { className: "font-[Outfit] text-2xl font-bold text-[#1A1A1A]", children: "Blog" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-[Outfit] text-sm text-[#666666]", children: "Crea y administra entradas publicadas en /blog" })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/admin/blog-posts/create",
          className: "inline-flex items-center gap-2 rounded-lg bg-[#4A5D4A] px-4 py-2.5 font-[Outfit] text-sm font-medium text-white hover:bg-[#3d4e3d]",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Nueva Entrada"
          ]
        }
      )
    ] }),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-[Outfit] text-sm text-green-700", children: flash.success }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "mb-6 flex max-w-md gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#999999]" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar por título o slug...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "h-11 w-full rounded-xl border border-[#E5E5E5] bg-white pl-10 pr-4 font-[Outfit] text-sm outline-none transition-colors focus:border-[#4A5D4A]"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "rounded-xl bg-[#4A5D4A] px-5 font-[Outfit] text-sm font-medium text-white hover:bg-[#3d4e3d]",
          children: "Buscar"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-[#E5E5E5] bg-white", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5] bg-[#FAFAFA]", children: [
          /* @__PURE__ */ jsx(TableHeading, { children: "Título" }),
          /* @__PURE__ */ jsx(TableHeading, { children: "Estado" }),
          /* @__PURE__ */ jsx(TableHeading, { children: "Publicación" }),
          /* @__PURE__ */ jsx(TableHeading, { children: "Actualizado" }),
          /* @__PURE__ */ jsx(TableHeading, { alignRight: true, children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#E5E5E5]", children: posts.data.map((post) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm font-medium text-[#1A1A1A]", children: post.title }),
            /* @__PURE__ */ jsxs("code", { className: "w-fit rounded bg-[#F5F3F0] px-2 py-1 text-xs text-[#666666]", children: [
              "/blog/",
              post.slug
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex rounded-full px-2 py-1 font-[Outfit] text-xs font-medium ${statusConfig[post.status].className}`, children: statusConfig[post.status].label }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4 font-[Outfit] text-xs text-[#666666]", children: post.published_at ? formatDate(post.published_at) : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4 font-[Outfit] text-xs text-[#999999]", children: formatDateShort(post.updated_at) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: `/admin/blog-posts/${post.id}/edit`,
                className: "inline-flex items-center gap-1.5 font-[Outfit] text-sm font-medium text-[#4A5D4A] hover:underline",
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
                className: "inline-flex cursor-pointer items-center gap-1.5 font-[Outfit] text-sm font-medium text-red-600 hover:underline",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  "Eliminar"
                ]
              }
            )
          ] }) })
        ] }, post.id)) })
      ] }),
      posts.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-6 py-12 text-center font-[Outfit] text-sm text-[#666666]", children: "No hay entradas de blog para mostrar." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-[#E5E5E5] px-6 py-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-sm text-[#666666]", children: [
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
          /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-sm text-[#1A1A1A]", children: [
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
  return /* @__PURE__ */ jsx("th", { className: `px-4 py-3 font-[Outfit] text-xs font-medium uppercase tracking-wider text-[#999999] ${alignRight ? "text-right" : "text-left"}`, children });
}
function PaginationButton({ href, children }) {
  if (!href) {
    return /* @__PURE__ */ jsx("span", { className: "rounded-lg border border-[#E5E5E5] px-3 py-2 font-[Outfit] text-sm text-[#999999] opacity-50", children });
  }
  return /* @__PURE__ */ jsx(
    Link,
    {
      href,
      preserveScroll: true,
      className: "rounded-lg border border-[#E5E5E5] px-3 py-2 font-[Outfit] text-sm text-[#666666] hover:bg-gray-50",
      children
    }
  );
}
export {
  BlogPostsIndex as default
};
