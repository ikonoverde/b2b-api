import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { Search, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { p as platformLabels, s as statusLabels, P as PlatformBadge, f as formatBudget, a as formatDate } from "./PlatformBadge-D3sSKl7E.js";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function buildPageUrl(page, filters) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return `/admin/ad-proposals?${params.toString()}`;
}
function SearchAndFilters({ filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [platform, setPlatform] = useState(filters.platform || "");
  const [status, setStatus] = useState(filters.status || "");
  const handleSubmit = (event) => {
    event.preventDefault();
    router.get(
      "/admin/ad-proposals",
      { search, platform, status },
      { preserveState: true, preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-3 lg:flex-row lg:items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full lg:max-w-sm", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Buscar nombre, objetivo u oferta...",
          value: search,
          onChange: (event) => setSearch(event.target.value),
          className: "h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        value: platform,
        onChange: (event) => setPlatform(event.target.value),
        className: "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary",
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Todas las plataformas" }),
          Object.entries(platformLabels).map(([value, label]) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "select",
      {
        value: status,
        onChange: (event) => setStatus(event.target.value),
        className: "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary",
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Todos los estados" }),
          Object.entries(statusLabels).map(([value, label]) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        className: "h-10 rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary",
        children: "Filtrar"
      }
    )
  ] });
}
function ProposalRow({ proposal }) {
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-border hover:bg-muted", children: [
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs(
      Link,
      {
        href: `/admin/ad-proposals/${proposal.id}`,
        className: "flex flex-col gap-1",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground hover:underline", children: proposal.name }),
          proposal.created_by_agent && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
            "Generado por agente"
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(PlatformBadge, { platform: proposal.platform }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: proposal.objective }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: formatBudget(proposal.budget_amount, proposal.currency, proposal.budget_period) }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground", children: statusLabels[proposal.status] ?? proposal.status }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: formatDate(proposal.created_at) }) })
  ] });
}
function Pagination({ proposals, filters }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border px-6 py-4", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
      "Mostrando ",
      proposals.from,
      " a ",
      proposals.to,
      " de ",
      proposals.total,
      " propuestas"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildPageUrl(proposals.current_page - 1, filters),
          className: `rounded-lg border border-border p-2 ${proposals.current_page === 1 ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground", children: [
        proposals.current_page,
        " / ",
        proposals.last_page
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildPageUrl(proposals.current_page + 1, filters),
          className: `rounded-lg border border-border p-2 ${proposals.current_page === proposals.last_page ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
        }
      )
    ] })
  ] });
}
function AdProposalsIndex() {
  const { proposals, filters } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Propuestas de anuncios", active: "ad-proposals", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: "Propuestas de anuncios" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Borradores internos para Google Ads y Meta Ads. Nada se publica en las plataformas." })
    ] }),
    /* @__PURE__ */ jsx(SearchAndFilters, { filters }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[900px]", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border", children: ["Propuesta", "Plataforma", "Objetivo", "Presupuesto", "Estado", "Creada"].map(
          (heading) => /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: heading }) }, heading)
        ) }) }),
        /* @__PURE__ */ jsx("tbody", { children: proposals.data.map((proposal) => /* @__PURE__ */ jsx(ProposalRow, { proposal }, proposal.id)) })
      ] }) }),
      proposals.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No hay propuestas de anuncios con estos filtros." }) }),
      proposals.last_page > 1 && /* @__PURE__ */ jsx(Pagination, { proposals, filters })
    ] })
  ] }) });
}
export {
  AdProposalsIndex as default
};
