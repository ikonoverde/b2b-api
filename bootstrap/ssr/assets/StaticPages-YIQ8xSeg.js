import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { b as formatDate } from "./date-CuQtAuCG.js";
import "./sidebar-DK9OU6Q6.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function StaticPages({ pages }) {
  const { flash } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Páginas Estáticas", active: "static-pages", children: /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Páginas Estáticas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Administra el contenido de las páginas del sitio" })
    ] }),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-lg text-sm", children: flash.success }),
    /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border bg-background", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Título" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Slug" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Estado" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Actualizado" }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: pages.map((page) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: page.title }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("code", { className: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded", children: [
          "/",
          page.slug
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex px-2 py-1 rounded-full text-xs font-medium ${page.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
            children: page.is_published ? "Publicada" : "Borrador"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: page.updated_at ? formatDate(page.updated_at) : "—" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/admin/static-pages/${page.id}/edit`,
            className: "inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline",
            children: [
              /* @__PURE__ */ jsx(Pencil, { className: "w-3.5 h-3.5" }),
              "Editar"
            ]
          }
        ) })
      ] }, page.id)) })
    ] }) })
  ] }) }) });
}
export {
  StaticPages as default
};
