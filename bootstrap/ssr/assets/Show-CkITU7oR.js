import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ArrowLeft, FileText } from "lucide-react";
import { g as formatDate, p as paidGateLabels, d as agentLabels, s as statusLabels, h as statusPillClasses } from "./helpers-3EV6n2dZ.js";
import "./sidebar-DK9OU6Q6.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function GrowthPlanShow() {
  const { plan, touchedTasks } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: `Plan del ${plan.planned_on}`, active: "growth-plan", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/admin/growth-plan",
          className: "inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Plan de crecimiento"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("h1", { className: "text-[28px] font-semibold text-foreground", children: [
        "Plan del ",
        formatDate(plan.planned_on)
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Razonado desde el reporte del",
        " ",
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/admin/marketing-reports/${plan.source_report.id}`,
            className: "text-primary hover:underline",
            children: formatDate(plan.source_report.reported_on)
          }
        ),
        ". Todo lo que se propone aquí sale de esos números."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-3 rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-muted-foreground", children: "La recomendación, como la escribió el agente" })
      ] }),
      /* @__PURE__ */ jsx("pre", { className: "max-w-[80ch] text-sm leading-relaxed whitespace-pre-wrap text-foreground", children: plan.body })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-3 rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-sm font-medium text-muted-foreground", children: [
        "Veredicto de pauta: ",
        paidGateLabels[plan.paid_gate]
      ] }),
      /* @__PURE__ */ jsx("p", { className: "max-w-[75ch] text-sm leading-relaxed whitespace-pre-line text-foreground", children: plan.paid_gate_reason }),
      plan.paid_gate_preconditions.length > 0 && /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1", children: plan.paid_gate_preconditions.map((precondition) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-muted-foreground", children: [
        "• ",
        precondition
      ] }, precondition)) })
    ] }),
    touchedTasks.length > 0 && /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
      /* @__PURE__ */ jsx("header", { className: "border-b border-border px-6 py-4", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium text-muted-foreground", children: "Lo que esta corrida tocó" }) }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-col", children: touchedTasks.map((task) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4 last:border-b-0",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: task.name }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                task.action_name,
                " · ",
                agentLabels[task.agent],
                " ·",
                " ",
                task.created_here ? "nueva" : "actualizada"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
              task.closure_proposed && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground", children: "Cierre propuesto" }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[task.status]}`,
                  children: statusLabels[task.status]
                }
              )
            ] })
          ]
        },
        task.id
      )) })
    ] })
  ] }) });
}
export {
  GrowthPlanShow as default
};
