import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { usePage, Link, useForm } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ArrowLeft, FileText, Package, CheckCircle2, CircleSlash, User, RotateCcw, ExternalLink } from "lucide-react";
import { B as Badge } from "./badge-m_d48R8i.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, c as CardDescription } from "./card-DsKuAE3q.js";
import { Separator as Separator$1 } from "radix-ui";
import { n as cn } from "./sidebar-DK9OU6Q6.js";
import { d as agentLabels, e as agentChipClasses, f as agentDescriptions, s as statusLabels, h as statusPillClasses, a as boardColumnLabels, c as closedByLabels, i as closedByDescriptions } from "./helpers-3EV6n2dZ.js";
import "class-variance-authority";
import "react";
import "clsx";
import "tailwind-merge";
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Separator$1.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      ),
      ...props
    }
  );
}
function formatDateTime(value) {
  if (value === null) {
    return "—";
  }
  return new Date(value).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function MetaRow({ label, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-xs tracking-wide text-muted-foreground uppercase", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "text-sm text-foreground", children })
  ] });
}
function ClosureProposal({ task }) {
  const confirm = useForm({});
  const reject = useForm({});
  return /* @__PURE__ */ jsxs(Card, { className: "border-border bg-muted shadow-none", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "gap-1.5", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "El agente cree que esta tarea ya está hecha, y no pudo probarlo." }),
      task.closure_proposal_reason !== null && /* @__PURE__ */ jsx(CardDescription, { className: "text-sm whitespace-pre-line text-muted-foreground", children: task.closure_proposal_reason }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "La tarea sigue abierta. Solo una persona puede cerrarla desde aquí." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          disabled: confirm.processing,
          onClick: () => confirm.post(`/admin/growth-plan/tasks/${task.id}/confirm-closure`, {
            preserveScroll: true
          }),
          className: "inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
            "Sí, ya se hizo"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          disabled: reject.processing,
          onClick: () => reject.post(`/admin/growth-plan/tasks/${task.id}/reject-closure`, {
            preserveScroll: true
          }),
          className: "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx(CircleSlash, { className: "h-4 w-4" }),
            "No, sigue pendiente"
          ]
        }
      )
    ] })
  ] });
}
function ClosedNote({ task }) {
  const reopen = useForm({});
  const evidence = task.status === "dropped" ? task.drop_reason : task.close_evidence ?? "Sin evidencia registrada.";
  return /* @__PURE__ */ jsx(Card, { className: "border-border bg-background shadow-none", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-wrap items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      task.closed_by !== null && /* @__PURE__ */ jsxs(
        "span",
        {
          title: closedByDescriptions[task.closed_by],
          className: "inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground",
          children: [
            task.closed_by === "human" ? /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }),
            closedByLabels[task.closed_by]
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: evidence })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        disabled: reopen.processing,
        onClick: () => reopen.post(`/admin/growth-plan/tasks/${task.id}/reopen`, {
          preserveScroll: true
        }),
        className: "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50",
        children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }),
          "Reabrir"
        ]
      }
    )
  ] }) });
}
function ArtifactRow({ artifact }) {
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: artifact.title }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: formatDateTime(artifact.created_at) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Badge,
        {
          variant: "outline",
          className: "border-muted bg-muted text-primary",
          children: artifact.label
        }
      ),
      artifact.url !== null && /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-muted-foreground" })
    ] })
  ] });
  if (artifact.url !== null) {
    return /* @__PURE__ */ jsx(
      Link,
      {
        href: artifact.url,
        className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-background",
        children: content
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3", children: content });
}
function ArtifactsCard({ artifacts }) {
  return /* @__PURE__ */ jsxs(Card, { className: "border-border bg-card shadow-none", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Artefactos generados" })
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-xs text-muted-foreground", children: "Lo que el agente filó al ejecutar esta tarea. Cada uno sigue siendo un borrador o propuesta hasta que una persona lo apruebe." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { className: "flex flex-col gap-2", children: artifacts.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Este run todavía no ha generado nada." }) : artifacts.map((artifact) => /* @__PURE__ */ jsx(ArtifactRow, { artifact }, `${artifact.type}-${artifact.title}-${artifact.created_at}`)) })
  ] });
}
function GrowthTaskShow() {
  const { task } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: task.name, active: "growth-plan", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/admin/growth-plan/board",
          className: "inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Tablero de tareas"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: task.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: task.action })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "outline",
              title: agentDescriptions[task.agent],
              className: `${agentChipClasses[task.agent]}`,
              children: agentLabels[task.agent]
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[task.status]}`,
              children: statusLabels[task.status]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-border bg-card shadow-none", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "La tarea, como la escribió el agente" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsx("p", { className: "max-w-[80ch] text-sm leading-relaxed whitespace-pre-line text-foreground", children: task.body }),
        /* @__PURE__ */ jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxs("dl", { className: "grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsx(MetaRow, { label: "Columna", children: task.column !== null ? boardColumnLabels[task.column] : "Descartada" }),
          /* @__PURE__ */ jsx(MetaRow, { label: "Reporte de origen", children: task.source_report ?? "Sin reporte" }),
          /* @__PURE__ */ jsx(MetaRow, { label: "Tomada", children: formatDateTime(task.started_at) }),
          task.closed_at !== null && /* @__PURE__ */ jsx(MetaRow, { label: "Cerrada", children: formatDateTime(task.closed_at) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ArtifactsCard, { artifacts: task.artifacts }),
    task.closure_proposed && /* @__PURE__ */ jsx(ClosureProposal, { task }),
    task.status !== "open" && /* @__PURE__ */ jsx(ClosedNote, { task })
  ] }) });
}
export {
  GrowthTaskShow as default
};
