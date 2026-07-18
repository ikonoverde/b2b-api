import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ArrowLeft, History, CircleSlash } from "lucide-react";
import { f as formatWindow, a as formatDate, b as formatDateTime, m as metricLabels, P as ProvenancePill, c as formatNumber, d as delta, e as formatDelta } from "./Provenance-Cegn9t_l.js";
import "./sidebar-DK9OU6Q6.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function SupersededBanner({ supersededAt }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-border bg-muted px-5 py-4", children: [
    /* @__PURE__ */ jsx(History, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-muted-foreground", children: [
        "Este reporte fue reemplazado el ",
        formatDateTime(supersededAt),
        "."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/85", children: "Se conserva como registro de lo que esa corrida observó, pero ya no es la lectura de su día y no debe usarse para calcular cambios." })
    ] })
  ] });
}
function MetricValue({ metric }) {
  if (metric.provenance === "unknown") {
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(CircleSlash, { className: "h-3 w-3" }),
      "Sin dato"
    ] });
  }
  if (metric.numeric_value !== null) {
    return /* @__PURE__ */ jsx("span", { className: "font-mono text-sm tabular-nums text-foreground", children: formatNumber(Number(metric.numeric_value)) });
  }
  if (metric.text_value !== null) {
    return /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: metric.text_value });
  }
  return /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "—" });
}
function MetricDelta({
  metric,
  previous
}) {
  if (previous === null || metric.provenance !== "observed" || metric.numeric_value === null) {
    return null;
  }
  if (!(metric.key in previous.headlines)) {
    return null;
  }
  const movement = delta(Number(metric.numeric_value), previous.headlines[metric.key]);
  if (movement === null) {
    return /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
      "Sin comparación: el ",
      formatDate(previous.reported_on),
      " nadie lo observó"
    ] });
  }
  return /* @__PURE__ */ jsx("span", { className: "font-mono text-xs tabular-nums text-muted-foreground", children: formatDelta(movement) });
}
function MetricsTable({
  metrics,
  previous
}) {
  if (metrics.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "px-6 py-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Esta corrida no registró ninguna métrica." }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[760px]", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border", children: [
      { label: "Métrica", align: "text-left" },
      { label: "Valor", align: "text-right" },
      { label: "Procedencia", align: "text-left" },
      { label: "Cambio", align: "text-left" },
      { label: "Nota", align: "text-left" }
    ].map((column) => /* @__PURE__ */ jsx("th", { className: `px-6 py-4 ${column.align}`, children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: column.label }) }, column.label)) }) }),
    /* @__PURE__ */ jsx("tbody", { children: metrics.map((metric) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border last:border-b-0", children: [
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: metricLabels[metric.key] ?? metric.key }),
        metricLabels[metric.key] && /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-muted-foreground", children: metric.key })
      ] }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(MetricValue, { metric }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(ProvenancePill, { provenance: metric.provenance }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(MetricDelta, { metric, previous }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: metric.note ?? "" }) })
    ] }, metric.id)) })
  ] }) });
}
function CoverageRow({ label, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
function Coverage({ report }) {
  const comparedAgainst = report.compared_against ?? [];
  const reachability = Object.entries(report.reachability ?? {});
  return /* @__PURE__ */ jsxs("aside", { className: "flex flex-col gap-5 self-start rounded-xl border border-border bg-card p-6", children: [
    /* @__PURE__ */ jsx(CoverageRow, { label: "Agentes consultados", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: (report.agents_run ?? []).map((agent) => /* @__PURE__ */ jsx(
      "span",
      {
        className: "inline-flex rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground",
        children: agent
      },
      agent
    )) }) }),
    /* @__PURE__ */ jsx(CoverageRow, { label: "Alcance de las fuentes", children: /* @__PURE__ */ jsx("dl", { className: "flex flex-col gap-2", children: reachability.map(([source, state]) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsx("dt", { className: "font-mono text-xs text-foreground", children: source }),
      /* @__PURE__ */ jsx("dd", { className: "text-sm text-muted-foreground", children: state })
    ] }, source)) }) }),
    report.ga4_property_id && /* @__PURE__ */ jsx(CoverageRow, { label: "Propiedad GA4", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-sm text-foreground", children: report.ga4_property_id }) }),
    /* @__PURE__ */ jsx(CoverageRow, { label: "Comparado contra", children: comparedAgainst.length === 0 ? /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Nada: es la primera lectura." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: comparedAgainst.map((date) => /* @__PURE__ */ jsx("span", { className: "font-mono text-sm tabular-nums text-foreground", children: formatDate(date) }, date)) }) }),
    /* @__PURE__ */ jsx(CoverageRow, { label: "Generado", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: formatDateTime(report.created_at) }) })
  ] });
}
function MarketingReportShow() {
  const { report, previous } = usePage().props;
  const window = formatWindow(report.window_start, report.window_end);
  const isSuperseded = report.superseded_at !== null;
  return /* @__PURE__ */ jsx(AppLayout, { title: `Reporte · ${formatDate(report.reported_on)}`, active: "marketing-reports", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/admin/marketing-reports",
        className: "flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Reportes de marketing"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-[28px] font-semibold text-foreground", children: [
          "Reporte del ",
          formatDate(report.reported_on)
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          isSuperseded ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsx(History, { className: "h-3 w-3" }),
            "Reemplazado"
          ] }) : /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full border border-muted bg-muted px-2.5 py-1 text-xs font-medium text-primary", children: "Vigente" }),
          window && /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "Ventana: ",
            window
          ] })
        ] })
      ] }),
      previous && /* @__PURE__ */ jsxs(
        Link,
        {
          href: `/admin/marketing-reports/${previous.id}`,
          className: "inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-primary transition-colors hover:bg-muted",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Reporte anterior · ",
            formatDate(previous.reported_on)
          ]
        }
      )
    ] }),
    isSuperseded && /* @__PURE__ */ jsx(SupersededBanner, { supersededAt: report.superseded_at }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Métricas registradas" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Cada valor lleva su procedencia. Solo se calcula un cambio cuando el valor de hoy y el del reporte anterior fueron ambos observados." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsx(MetricsTable, { metrics: report.metrics, previous }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Narrativa del agente" }),
          /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card px-8 py-7", children: /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-[70ch] prose-headings:prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:font-mono prose-code:text-primary prose-a:text-primary", children: /* @__PURE__ */ jsx(Markdown, { remarkPlugins: [remarkGfm], children: report.body }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Coverage, { report })
    ] })
  ] }) });
}
export {
  MarketingReportShow as default
};
