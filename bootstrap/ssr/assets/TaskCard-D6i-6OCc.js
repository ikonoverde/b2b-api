import { jsxs, jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { CheckCircle2, CircleSlash, User, RotateCcw } from "lucide-react";
import { d as agentLabels, e as agentChipClasses, f as agentDescriptions, s as statusLabels, h as statusPillClasses, c as closedByLabels, i as closedByDescriptions } from "./helpers-3EV6n2dZ.js";
function ClosureProposal({ task }) {
  const confirm = useForm({});
  const reject = useForm({});
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-lg border border-border bg-muted p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "El agente cree que esta tarea ya está hecha, y no pudo probarlo." }),
      /* @__PURE__ */ jsx("p", { className: "text-sm whitespace-pre-line text-muted-foreground", children: task.closure_proposal_reason }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "La tarea sigue abierta. Solo una persona puede cerrarla desde aquí." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
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
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-background p-4", children: [
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
        onClick: () => reopen.post(`/admin/growth-plan/tasks/${task.id}/reopen`, { preserveScroll: true }),
        className: "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50",
        children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }),
          "Reabrir"
        ]
      }
    )
  ] });
}
function TaskCard({ task }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-b border-border px-6 py-5 last:border-b-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-medium text-foreground", children: task.name }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: task.source_report ? `Razonada desde el reporte del ${task.source_report}` : "Sin reporte de origen" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            title: agentDescriptions[task.agent],
            className: `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${agentChipClasses[task.agent]}`,
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
    ] }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[75ch] text-sm leading-relaxed whitespace-pre-line text-muted-foreground", children: task.body }),
    task.closure_proposed && /* @__PURE__ */ jsx(ClosureProposal, { task }),
    task.status !== "open" && /* @__PURE__ */ jsx(ClosedNote, { task })
  ] });
}
export {
  TaskCard
};
