import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { B as Button } from "./sidebar-DK9OU6Q6.js";
import { Kanban, AlertCircle, TrendingUp, Compass, ArrowRight } from "lucide-react";
import { p as paidGateLabels, g as formatDate, s as statusLabels, h as statusPillClasses } from "./helpers-3EV6n2dZ.js";
import { TaskCard } from "./TaskCard-D6i-6OCc.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function PaidGateBanner({ gate }) {
  const closed = gate.verdict === "closed";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex flex-col gap-3 rounded-xl border p-6 ${closed ? "border-border bg-muted" : "border-muted bg-muted"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: `h-4 w-4 ${closed ? "text-muted-foreground" : "text-primary"}` }),
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: `text-sm font-semibold ${closed ? "text-muted-foreground" : "text-primary"}`,
              children: paidGateLabels[gate.verdict]
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Decidido el ",
            formatDate(gate.decided_on)
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: `max-w-[75ch] text-sm leading-relaxed whitespace-pre-line ${closed ? "text-muted-foreground" : "text-primary"}`,
            children: gate.reason
          }
        ),
        gate.preconditions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-xs font-medium ${closed ? "text-muted-foreground" : "text-primary"}`,
              children: closed ? "Para abrir la pauta:" : "Condiciones del gasto:"
            }
          ),
          /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1", children: gate.preconditions.map((precondition) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: `text-sm ${closed ? "text-muted-foreground" : "text-primary"}`,
              children: [
                "• ",
                precondition
              ]
            },
            precondition
          )) })
        ] })
      ]
    }
  );
}
function ActionCard({ action }) {
  return /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: action.name }),
        action.summary !== null && /* @__PURE__ */ jsx("p", { className: "max-w-[75ch] text-sm text-muted-foreground", children: action.summary })
      ] }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[action.status]}`,
          children: statusLabels[action.status]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: action.tasks.map((task) => /* @__PURE__ */ jsx(TaskCard, { task }, task.id)) })
  ] });
}
function EmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-16 text-center", children: [
    /* @__PURE__ */ jsx(Compass, { className: "h-6 w-6 text-border" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Todavía no hay un plan." }),
    /* @__PURE__ */ jsxs("p", { className: "max-w-md text-sm text-muted-foreground", children: [
      "El plan se escribe a partir de un reporte de marketing observado. Genera uno con",
      " ",
      /* @__PURE__ */ jsx("code", { className: "rounded bg-muted px-1.5 py-0.5 font-mono text-xs", children: "php artisan growth:plan" }),
      ", y el agente leerá el último reporte y propondrá el trabajo."
    ] })
  ] });
}
function RunsTable({ runs }) {
  return /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-border px-6 py-4", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-muted-foreground", children: "Cómo se llegó hasta aquí" }) }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[720px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border", children: ["Plan", "Reporte base", "Pauta", "Creó", ""].map((label, index) => /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label }) }, label || index)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: runs.map((run) => /* @__PURE__ */ jsxs(
        "tr",
        {
          className: "border-b border-border last:border-b-0 hover:bg-muted",
          children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: formatDate(run.planned_on) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: formatDate(run.source_report) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: paidGateLabels[run.paid_gate] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
              run.created_tasks_count,
              " tareas"
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: `/admin/growth-plan/runs/${run.id}`,
                className: "inline-flex items-center gap-1.5 text-sm text-primary hover:underline",
                children: [
                  "Leer",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                ]
              }
            ) })
          ]
        },
        run.id
      )) })
    ] }) })
  ] });
}
function GrowthPlanIndex() {
  const { paidGate, actions, runs, awaitingDecisionCount } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Plan de crecimiento", active: "growth-plan", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: "Plan de crecimiento" }),
        /* @__PURE__ */ jsx("p", { className: "max-w-2xl text-sm text-muted-foreground", children: "El trabajo que el agente propone a partir del último reporte observado. Nada de esto se ejecuta solo: son tareas para que alguien las tome." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "", children: /* @__PURE__ */ jsxs(Link, { href: "/admin/growth-plan/board", children: [
        /* @__PURE__ */ jsx(Kanban, { "data-icon": "inline-start" }),
        "Tablero de tareas"
      ] }) })
    ] }),
    awaitingDecisionCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-muted px-6 py-4", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: awaitingDecisionCount === 1 ? "Una tarea espera tu decisión: el agente cree que ya está hecha y no pudo probarlo." : `${awaitingDecisionCount} tareas esperan tu decisión: el agente cree que ya están hechas y no pudo probarlo.` })
    ] }),
    paidGate !== null && /* @__PURE__ */ jsx(PaidGateBanner, { gate: paidGate }),
    actions.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {}) : actions.map((action) => /* @__PURE__ */ jsx(ActionCard, { action }, action.id)),
    runs.length > 0 && /* @__PURE__ */ jsx(RunsTable, { runs })
  ] }) });
}
export {
  GrowthPlanIndex as default
};
