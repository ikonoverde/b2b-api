import { jsxs, jsx } from "react/jsx-runtime";
import { CircleSlash, Sigma, Eye } from "lucide-react";
const provenanceLabels = {
  observed: "Observado",
  estimated: "Estimado",
  unknown: "Sin dato"
};
const provenanceDescriptions = {
  observed: "Una herramienta devolvió este valor en esta corrida.",
  estimated: "Un juicio del agente, no una medición. No se puede restar de una observación.",
  unknown: "Nadie pudo verlo: la cuenta no respondió o la herramienta no cargó. No es cero."
};
const provenancePillClasses = {
  observed: "border-muted bg-muted text-primary",
  estimated: "border-border bg-muted text-muted-foreground",
  unknown: "border-border bg-muted text-muted-foreground"
};
const metricLabels = {
  "ga4.sessions": "Sesiones",
  "ga4.total_users": "Usuarios",
  "ga4.screen_page_views": "Vistas de página",
  "ga4.purchase_events": "Compras (GA4)",
  "meta.Purchase.total": "Compras (Meta)",
  "fb.fans": "Seguidores Facebook",
  "ig.followers": "Seguidores Instagram"
};
function formatDate(value) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}
function formatDateTime(value) {
  return new Date(value).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatWindow(start, end) {
  if (!start && !end) {
    return null;
  }
  if (start && end) {
    return `${formatDate(start)} — ${formatDate(end)}`;
  }
  return formatDate(start ?? end);
}
function formatNumber(value) {
  return new Intl.NumberFormat("es-MX").format(value);
}
function delta(current, previous) {
  if (current === null || previous === null) {
    return null;
  }
  return current - previous;
}
function formatDelta(value) {
  if (value === 0) {
    return "sin cambio";
  }
  return `${value > 0 ? "+" : "−"}${formatNumber(Math.abs(value))}`;
}
const provenanceIcons = {
  observed: Eye,
  estimated: Sigma,
  unknown: CircleSlash
};
function ProvenancePill({ provenance }) {
  const Icon = provenanceIcons[provenance] ?? CircleSlash;
  const label = provenanceLabels[provenance] ?? provenance;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      title: provenanceDescriptions[provenance],
      className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${provenancePillClasses[provenance] ?? provenancePillClasses.unknown}`,
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
        label
      ]
    }
  );
}
function HeadlineValue({ value }) {
  if (value === null) {
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(CircleSlash, { className: "h-3 w-3" }),
      "Sin dato"
    ] });
  }
  return /* @__PURE__ */ jsx("span", { className: "font-mono text-sm tabular-nums text-foreground", children: formatNumber(value) });
}
const Provenance = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HeadlineValue,
  ProvenancePill
}, Symbol.toStringTag, { value: "Module" }));
export {
  HeadlineValue as H,
  ProvenancePill as P,
  formatDate as a,
  formatDateTime as b,
  formatNumber as c,
  delta as d,
  formatDelta as e,
  formatWindow as f,
  Provenance as g,
  metricLabels as m
};
