import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import { A as AppLayout } from "./AppLayout-Q3nFYZ7E.js";
import { b as formatDate } from "./date-ClVPp3mI.js";
function StaticPages({ pages }) {
  const { flash } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Páginas Estáticas", active: "static-pages", children: /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1A1A1A] font-[Outfit]", children: "Páginas Estáticas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666] font-[Outfit] mt-1", children: "Administra el contenido de las páginas del sitio" })
    ] }),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-[Outfit] text-sm", children: flash.success }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border border-[#E5E5E5] overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5] bg-[#FAFAFA]", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Título" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Slug" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Estado" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Actualizado" }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#E5E5E5]", children: pages.map((page) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm font-medium text-[#1A1A1A]", children: page.title }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("code", { className: "text-xs text-[#666666] bg-[#F5F3F0] px-2 py-1 rounded", children: [
          "/",
          page.slug
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex px-2 py-1 rounded-full text-xs font-medium font-[Outfit] ${page.is_published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`,
            children: page.is_published ? "Publicada" : "Borrador"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-xs text-[#999999]", children: page.updated_at ? formatDate(page.updated_at) : "—" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/admin/static-pages/${page.id}/edit`,
            className: "inline-flex items-center gap-1.5 text-[#4A5D4A] font-[Outfit] text-sm font-medium hover:underline",
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
