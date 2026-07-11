import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, router, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-Q3nFYZ7E.js";
import { Download, Loader2, Play, Search, MapPin, Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
const statusLabels = {
  pending: "Pendiente",
  running: "En progreso",
  collecting: "Recopilando datos",
  completed: "Completado",
  failed: "Error"
};
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  running: "bg-blue-100 text-blue-800",
  collecting: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800"
};
function ActiveRunBanner({ run }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-200 rounded-xl", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-blue-600 animate-spin" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-blue-900 font-[Outfit]", children: "Scrape en progreso" }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-blue-600 font-[Outfit]", children: [
        "Estado: ",
        statusLabels[run.status] || run.status,
        " · ",
        run.search_terms,
        " · ",
        run.location
      ] })
    ] })
  ] });
}
function LastRunInfo({ run }) {
  const date = run.completed_at ? new Date(run.completed_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : null;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 px-5 py-3 bg-[#FBF9F7] border border-[#E5E5E5] rounded-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Ultimo scrape" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: date || "N/A" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Encontrados" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: run.total_found })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Nuevos" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: run.total_imported })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Actualizados" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: run.total_updated })
    ] }),
    /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[run.status] || "bg-gray-100 text-gray-800"}`, children: statusLabels[run.status] || run.status }),
    run.error_message && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-600 font-[Outfit] truncate max-w-xs", title: run.error_message, children: run.error_message })
  ] });
}
function SearchBar({ filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const handleSubmit = (e) => {
    e.preventDefault();
    router.get("/admin/businesses", { search }, { preserveState: true });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-sm", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Buscar por nombre, categoria, direccion...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full h-10 pl-10 pr-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        className: "h-10 px-4 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors",
        children: "Buscar"
      }
    )
  ] });
}
function BusinessRow({ business }) {
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5] hover:bg-gray-50", children: [
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: business.name }),
      business.google_maps_url && /* @__PURE__ */ jsxs(
        "a",
        {
          href: business.google_maps_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-1 text-xs text-[#4A5D4A] hover:underline font-[Outfit]",
          children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
            "Ver en Maps"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: business.category_name || "-" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit] line-clamp-2", children: business.address || "-" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: business.phone || "-" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: business.rating !== null ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-yellow-500 fill-yellow-500" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: Number(business.rating).toFixed(1) })
    ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-[#999999] font-[Outfit]", children: "-" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: business.reviews_count }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: business.website && /* @__PURE__ */ jsxs(
      "a",
      {
        href: business.website,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-1 text-xs text-[#4A5D4A] hover:underline font-[Outfit]",
        children: [
          /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" }),
          "Sitio"
        ]
      }
    ) })
  ] });
}
function Pagination({ businesses }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-[#666666] font-[Outfit]", children: [
      "Mostrando ",
      businesses.from,
      " a ",
      businesses.to,
      " de ",
      businesses.total,
      " negocios"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: `?page=${businesses.current_page - 1}`,
          className: `p-2 rounded-lg border border-[#E5E5E5] ${businesses.current_page === 1 ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-gray-50"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 text-[#666666]" })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: [
        businesses.current_page,
        " / ",
        businesses.last_page
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: `?page=${businesses.current_page + 1}`,
          className: `p-2 rounded-lg border border-[#E5E5E5] ${businesses.current_page === businesses.last_page ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-gray-50"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-[#666666]" })
        }
      )
    ] })
  ] });
}
function BusinessesIndex() {
  const { businesses, latestRun, activeRun, filters, flash } = usePage().props;
  const [scraping, setScraping] = useState(false);
  const exportUrl = filters.search ? `/admin/businesses/export?${new URLSearchParams({ search: filters.search }).toString()}` : "/admin/businesses/export";
  const handleStartScrape = () => {
    setScraping(true);
    router.post("/admin/businesses/scrape", {}, {
      preserveState: true,
      onFinish: () => setScraping(false)
    });
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Negocios", active: "businesses", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]", children: "Negocios" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666] font-[Outfit]", children: "Negocios de spa y masajes en Merida, Yucatan" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: exportUrl,
            className: "flex items-center gap-2 h-10 px-5 rounded-lg border border-[#D6D0C8] text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-[#FBF9F7] transition-colors",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
              "Exportar Meta CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleStartScrape,
            disabled: scraping || !!activeRun,
            className: `flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-white font-[Outfit] transition-colors ${scraping || activeRun ? "bg-gray-400 cursor-not-allowed" : "bg-[#4A5D4A] hover:bg-[#3d4d3d] cursor-pointer"}`,
            children: [
              scraping ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Play, { className: "w-4 h-4" }),
              "Iniciar Scrape"
            ]
          }
        )
      ] })
    ] }),
    flash.success && /* @__PURE__ */ jsx("div", { className: "px-5 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 font-[Outfit]", children: flash.success }),
    flash.error && /* @__PURE__ */ jsx("div", { className: "px-5 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 font-[Outfit]", children: flash.error }),
    activeRun && /* @__PURE__ */ jsx(ActiveRunBanner, { run: activeRun }),
    latestRun && latestRun.status !== "pending" && latestRun.status !== "running" && latestRun.status !== "collecting" && /* @__PURE__ */ jsx(LastRunInfo, { run: latestRun }),
    /* @__PURE__ */ jsx(SearchBar, { filters }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-[#E5E5E5] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5]", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Nombre" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Categoria" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Direccion" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Telefono" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Rating" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Reviews" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Web" }) })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: businesses.data.map((business) => /* @__PURE__ */ jsx(BusinessRow, { business }, business.id)) })
      ] }),
      businesses.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666] font-[Outfit]", children: "No hay negocios registrados. Inicia un scrape para importar datos." }) }),
      businesses.last_page > 1 && /* @__PURE__ */ jsx(Pagination, { businesses })
    ] })
  ] }) });
}
export {
  BusinessesIndex as default
};
