import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import GoogleAdPreview from "./GoogleAdPreview-D2cq6P51.js";
import MetaAdPreview from "./MetaAdPreview-B7MpqyLh.js";
import { DetailCard } from "./JsonDetails-BjFJ6juK.js";
import { P as PlatformBadge, s as statusLabels, f as formatBudget, a as formatDate } from "./PlatformBadge-D3sSKl7E.js";
import "./sidebar-DK9OU6Q6.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function SummaryRow({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: value ?? "—" })
  ] });
}
function DateRange({ proposal }) {
  if (!proposal.start_date && !proposal.end_date) {
    return /* @__PURE__ */ jsx(Fragment, { children: "Sin definir" });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    proposal.start_date ? formatDate(proposal.start_date) : "Sin inicio",
    " —",
    " ",
    proposal.end_date ? formatDate(proposal.end_date) : "Sin fin"
  ] });
}
function AdProposalShow() {
  const { proposal, preview } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: proposal.name, active: "ad-proposals", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/admin/ad-proposals",
        className: "flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Propuestas de anuncios"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: proposal.name }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx(PlatformBadge, { platform: proposal.platform }),
          /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground", children: statusLabels[proposal.status] ?? proposal.status }),
          proposal.created_by_agent && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
            "Generado por agente"
          ] })
        ] })
      ] }),
      proposal.landing_page_url && /* @__PURE__ */ jsxs(
        "a",
        {
          href: proposal.landing_page_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-primary transition-colors hover:bg-muted",
          children: [
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }),
            "Landing page"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Vista previa del anuncio" }),
          proposal.platform === "meta" ? /* @__PURE__ */ jsx(MetaAdPreview, { creatives: preview.meta, brand: preview.brand }) : /* @__PURE__ */ jsx(GoogleAdPreview, { creatives: preview.google }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Simulación con fines internos. Las plataformas pueden recortar textos y rotar combinaciones de forma distinta." })
        ] }),
        /* @__PURE__ */ jsx(DetailCard, { title: "Estructura de campaña", value: proposal.campaign_structure }),
        /* @__PURE__ */ jsx(DetailCard, { title: "Grupos de anuncios", value: proposal.ad_groups }),
        /* @__PURE__ */ jsx(DetailCard, { title: "Palabras clave negativas", value: proposal.negative_keywords }),
        /* @__PURE__ */ jsx(DetailCard, { title: "Plan de medición", value: proposal.tracking_plan }),
        /* @__PURE__ */ jsx(DetailCard, { title: "Métricas de éxito", value: proposal.success_metrics }),
        /* @__PURE__ */ jsx(DetailCard, { title: "Supuestos", value: proposal.assumptions }),
        /* @__PURE__ */ jsx(DetailCard, { title: "Notas", value: proposal.notes })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "flex flex-col gap-5 self-start rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsx(SummaryRow, { label: "Objetivo", value: proposal.objective }),
        /* @__PURE__ */ jsx(
          SummaryRow,
          {
            label: "Presupuesto",
            value: formatBudget(
              proposal.budget_amount,
              proposal.currency,
              proposal.budget_period
            )
          }
        ),
        /* @__PURE__ */ jsx(SummaryRow, { label: "Periodo", value: /* @__PURE__ */ jsx(DateRange, { proposal }) }),
        /* @__PURE__ */ jsx(SummaryRow, { label: "Geografía", value: proposal.geography }),
        /* @__PURE__ */ jsx(SummaryRow, { label: "Audiencia", value: proposal.audience }),
        /* @__PURE__ */ jsx(SummaryRow, { label: "Oferta", value: proposal.offer }),
        /* @__PURE__ */ jsx(SummaryRow, { label: "Creada", value: formatDate(proposal.created_at) })
      ] })
    ] })
  ] }) });
}
export {
  AdProposalShow as default
};
