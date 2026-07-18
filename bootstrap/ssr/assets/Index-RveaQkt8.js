import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ClipboardList, History, ChevronLeft, ChevronRight } from "lucide-react";
import { f as formatWindow, a as formatDate, H as HeadlineValue, b as formatDateTime } from "./Provenance-Cegn9t_l.js";
import "./sidebar-DK9OU6Q6.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const columns = [
  { key: "report", label: "Reporte", align: "text-left" },
  { key: "sessions", label: "Sesiones", align: "text-right" },
  { key: "users", label: "Usuarios", align: "text-right" },
  { key: "purchases", label: "Compras", align: "text-right" },
  { key: "followers", label: "Seguidores IG", align: "text-right" },
  { key: "generated", label: "Generado", align: "text-left" }
];
function buildPageUrl(page, filters) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (filters.superseded) {
    params.set("superseded", "1");
  }
  return `/admin/marketing-reports?${params.toString()}`;
}
function ReportRow({ report }) {
  const window = formatWindow(report.window_start, report.window_end);
  const isSuperseded = report.superseded_at !== null;
  return /* @__PURE__ */ jsxs("tr", { className: `border-b border-border hover:bg-muted ${isSuperseded ? "bg-background" : ""}`, children: [
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs(Link, { href: `/admin/marketing-reports/${report.id}`, className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `font-mono text-sm tabular-nums hover:underline ${isSuperseded ? "text-muted-foreground line-through" : "font-medium text-foreground"}`,
            children: formatDate(report.reported_on)
          }
        ),
        isSuperseded && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsx(History, { className: "h-3 w-3" }),
          "Reemplazado"
        ] })
      ] }),
      window && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
        "Ventana: ",
        window
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(HeadlineValue, { value: report.ga4_sessions }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(HeadlineValue, { value: report.ga4_total_users }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(HeadlineValue, { value: report.ga4_purchase_events }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(HeadlineValue, { value: report.ig_followers }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: formatDateTime(report.created_at) }) })
  ] });
}
function EmptyState({ filtered }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 px-6 py-16 text-center", children: [
    /* @__PURE__ */ jsx(ClipboardList, { className: "h-6 w-6 text-border" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: filtered ? "Ningún reporte fue reemplazado." : "Todavía no hay reportes." }),
    /* @__PURE__ */ jsx("p", { className: "max-w-md text-sm text-muted-foreground", children: filtered ? "Cuando una corrida vuelva a escribir un día ya reportado, el reporte anterior se conserva aquí." : "El agente de marketing escribe uno cada día a las 07:00, hora de la tienda. Un reporte vacío no significa que algo falle: significa que no hubo nada que observar." })
  ] });
}
function Pagination({ reports, filters }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border px-6 py-4", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
      "Mostrando ",
      reports.from,
      " a ",
      reports.to,
      " de ",
      reports.total,
      " reportes"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildPageUrl(reports.current_page - 1, filters),
          "aria-label": "Página anterior",
          className: `rounded-lg border border-border p-2 ${reports.current_page === 1 ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm tabular-nums text-foreground", children: [
        reports.current_page,
        " / ",
        reports.last_page
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildPageUrl(reports.current_page + 1, filters),
          "aria-label": "Página siguiente",
          className: `rounded-lg border border-border p-2 ${reports.current_page === reports.last_page ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
        }
      )
    ] })
  ] });
}
function MarketingReportsIndex() {
  const { reports, filters, supersededCount } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Reportes de marketing", active: "marketing-reports", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: "Reportes de marketing" }),
      /* @__PURE__ */ jsx("p", { className: "max-w-2xl text-sm text-muted-foreground", children: "Lo que el agente observó cada día en GA4, Meta e Instagram. Un cero es una medición; «sin dato» significa que nadie pudo verlo." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/admin/marketing-reports",
          className: `h-9 rounded-lg border px-4 text-sm leading-[2rem] transition-colors ${filters.superseded ? "border-border text-muted-foreground hover:bg-muted" : "border-primary bg-primary font-medium text-white"}`,
          preserveScroll: true,
          children: "Vigentes"
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/admin/marketing-reports?superseded=1",
          className: `h-9 rounded-lg border px-4 text-sm leading-[2rem] transition-colors ${filters.superseded ? "border-primary bg-primary font-medium text-white" : "border-border text-muted-foreground hover:bg-muted"}`,
          preserveScroll: true,
          children: [
            "Incluir reemplazados",
            supersededCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-2 font-mono text-xs tabular-nums", children: supersededCount })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
      reports.data.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { filtered: filters.superseded }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[900px]", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border", children: columns.map((column) => /* @__PURE__ */ jsx("th", { className: `px-6 py-4 ${column.align}`, children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: column.label }) }, column.key)) }) }),
        /* @__PURE__ */ jsx("tbody", { children: reports.data.map((report) => /* @__PURE__ */ jsx(ReportRow, { report }, report.id)) })
      ] }) }),
      reports.last_page > 1 && /* @__PURE__ */ jsx(Pagination, { reports, filters })
    ] })
  ] }) });
}
export {
  MarketingReportsIndex as default
};
