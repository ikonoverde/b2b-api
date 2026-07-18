import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, router, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { Download, Loader2, Play, Search, MapPin, Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const statusLabels = {
  pending: "Pendiente",
  running: "En progreso",
  collecting: "Recopilando datos",
  completed: "Completado",
  failed: "Error"
};
const statusColors = {
  pending: "bg-muted text-muted-foreground",
  running: "bg-accent text-accent-foreground",
  collecting: "bg-accent text-accent-foreground",
  completed: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive"
};
function ActiveRunBanner({ run }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-3 bg-accent border border-border rounded-xl", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-accent-foreground animate-spin" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent-foreground", children: "Scrape en progreso" }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-accent-foreground", children: [
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
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 px-5 py-3 bg-background border border-border rounded-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Ultimo scrape" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: date || "N/A" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Encontrados" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: run.total_found })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Nuevos" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: run.total_imported })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Actualizados" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: run.total_updated })
    ] }),
    /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[run.status] || "bg-muted text-foreground"}`, children: statusLabels[run.status] || run.status }),
    run.error_message && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive truncate max-w-xs", title: run.error_message, children: run.error_message })
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
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Buscar por nombre, categoria, direccion...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full h-10 pl-10 pr-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        className: "h-10 px-4 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors",
        children: "Buscar"
      }
    )
  ] });
}
function BusinessRow({ business }) {
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-border hover:bg-muted", children: [
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: business.name }),
      business.google_maps_url && /* @__PURE__ */ jsxs(
        "a",
        {
          href: business.google_maps_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-1 text-xs text-primary hover:underline",
          children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
            "Ver en Maps"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: business.category_name || "-" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground line-clamp-2", children: business.address || "-" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: business.phone || "-" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: business.rating !== null ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-muted-foreground fill-yellow-500" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: Number(business.rating).toFixed(1) })
    ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "-" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: business.reviews_count }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: business.website && /* @__PURE__ */ jsxs(
      "a",
      {
        href: business.website,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-1 text-xs text-primary hover:underline",
        children: [
          /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" }),
          "Sitio"
        ]
      }
    ) })
  ] });
}
function Pagination({ businesses }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-border", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
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
          className: `p-2 rounded-lg border border-border ${businesses.current_page === 1 ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground", children: [
        businesses.current_page,
        " / ",
        businesses.last_page
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: `?page=${businesses.current_page + 1}`,
          className: `p-2 rounded-lg border border-border ${businesses.current_page === businesses.last_page ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })
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
        /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: "Negocios" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Negocios de spa y masajes en Merida, Yucatan" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: exportUrl,
            className: "flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-background transition-colors",
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
            className: `flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-white transition-colors ${scraping || activeRun ? "bg-muted-foreground cursor-not-allowed" : "bg-primary hover:bg-primary cursor-pointer"}`,
            children: [
              scraping ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Play, { className: "w-4 h-4" }),
              "Iniciar Scrape"
            ]
          }
        )
      ] })
    ] }),
    flash.success && /* @__PURE__ */ jsx("div", { className: "px-5 py-3 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary", children: flash.success }),
    flash.error && /* @__PURE__ */ jsx("div", { className: "px-5 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive", children: flash.error }),
    activeRun && /* @__PURE__ */ jsx(ActiveRunBanner, { run: activeRun }),
    latestRun && latestRun.status !== "pending" && latestRun.status !== "running" && latestRun.status !== "collecting" && /* @__PURE__ */ jsx(LastRunInfo, { run: latestRun }),
    /* @__PURE__ */ jsx(SearchBar, { filters }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Nombre" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Categoria" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Direccion" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Telefono" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Rating" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Reviews" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Web" }) })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: businesses.data.map((business) => /* @__PURE__ */ jsx(BusinessRow, { business }, business.id)) })
      ] }),
      businesses.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No hay negocios registrados. Inicia un scrape para importar datos." }) }),
      businesses.last_page > 1 && /* @__PURE__ */ jsx(Pagination, { businesses })
    ] })
  ] }) });
}
export {
  BusinessesIndex as default
};
