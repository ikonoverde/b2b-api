import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { Send, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { s as statusLabels, t as truncate, p as platformLabels, S as StatusPill, f as formatDateTime } from "./StatusPill-DNvEWD1S.js";
import "./sidebar-DK9OU6Q6.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const filters = [
  { value: "", label: "Todos" },
  { value: "pending", label: statusLabels.pending },
  { value: "published", label: statusLabels.published },
  { value: "rejected", label: statusLabels.rejected },
  { value: "failed", label: statusLabels.failed }
];
function buildUrl(status, page) {
  const params = new URLSearchParams();
  if (status !== "") {
    params.set("status", status);
  }
  if (page !== void 0) {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query === "" ? "/admin/social-posts" : `/admin/social-posts?${query}`;
}
function DraftRow({ draft }) {
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-border last:border-b-0 hover:bg-muted", children: [
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs(Link, { href: `/admin/social-posts/${draft.id}`, className: "flex items-start gap-3", children: [
      draft.image_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: draft.image_url,
          alt: "",
          className: "h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
        }
      ) : /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground", children: "Sin imagen" }),
      /* @__PURE__ */ jsxs("span", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground hover:underline", children: truncate(draft.caption) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: platformLabels[draft.platform] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusPill, { status: draft.status }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: draft.reviewer ?? "" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: formatDateTime(draft.created_at) }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: draft.remote_permalink ? /* @__PURE__ */ jsxs(
      "a",
      {
        href: draft.remote_permalink,
        target: "_blank",
        rel: "noreferrer",
        className: "inline-flex items-center gap-1.5 text-sm text-primary hover:underline",
        children: [
          "Ver publicación",
          /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
        ]
      }
    ) : /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "—" }) })
  ] });
}
function EmptyState({ filtered }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 px-6 py-16 text-center", children: [
    /* @__PURE__ */ jsx(Send, { className: "h-6 w-6 text-border" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: filtered ? "Ningún borrador en este estado." : "Todavía no hay borradores." }),
    /* @__PURE__ */ jsx("p", { className: "max-w-md text-sm text-muted-foreground", children: "El agente de redes propone publicaciones aquí. Nada llega a Facebook o Instagram hasta que una persona lo aprueba en esta pantalla." })
  ] });
}
function Pagination({ drafts, status }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border px-6 py-4", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
      "Mostrando ",
      drafts.from,
      " a ",
      drafts.to,
      " de ",
      drafts.total,
      " borradores"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildUrl(status, drafts.current_page - 1),
          "aria-label": "Página anterior",
          className: `rounded-lg border border-border p-2 ${drafts.current_page === 1 ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm tabular-nums text-foreground", children: [
        drafts.current_page,
        " / ",
        drafts.last_page
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildUrl(status, drafts.current_page + 1),
          "aria-label": "Página siguiente",
          className: `rounded-lg border border-border p-2 ${drafts.current_page === drafts.last_page ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
        }
      )
    ] })
  ] });
}
function SocialPostsIndex() {
  const { drafts, filters: active, pendingCount } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Publicaciones sociales", active: "social-posts", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: "Publicaciones sociales" }),
      /* @__PURE__ */ jsxs("p", { className: "max-w-2xl text-sm text-muted-foreground", children: [
        "Lo que el agente propone publicar en Facebook e Instagram. Nada se publica solo: Meta no tiene borradores ni deshacer, así que el borrador vive aquí y una persona decide.",
        pendingCount > 0 && ` ${pendingCount} en revisión.`
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: filters.map((filter) => /* @__PURE__ */ jsx(
      Link,
      {
        href: buildUrl(filter.value),
        className: `h-9 rounded-lg border px-4 text-sm leading-[2rem] transition-colors ${active.status === filter.value ? "border-primary bg-primary font-medium text-white" : "border-border text-muted-foreground hover:bg-muted"}`,
        preserveScroll: true,
        children: filter.label
      },
      filter.value || "all"
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
      drafts.data.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { filtered: active.status !== "" }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[900px]", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border", children: ["Borrador", "Estado", "Revisó", "Creado", "Meta"].map((label) => /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: label }) }, label)) }) }),
        /* @__PURE__ */ jsx("tbody", { children: drafts.data.map((draft) => /* @__PURE__ */ jsx(DraftRow, { draft }, draft.id)) })
      ] }) }),
      drafts.last_page > 1 && /* @__PURE__ */ jsx(Pagination, { drafts, status: active.status })
    ] })
  ] }) });
}
export {
  SocialPostsIndex as default
};
