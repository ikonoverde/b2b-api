import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ArrowLeft, GripVertical, User, CheckCircle2 } from "lucide-react";
import { B as Badge } from "./badge-m_d48R8i.js";
import { B as Button } from "./sidebar-DK9OU6Q6.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-DsKuAE3q.js";
import { b as boardColumnDescriptions, a as boardColumnLabels, c as closedByLabels, d as agentLabels, e as agentChipClasses, f as agentDescriptions, g as formatDate } from "./helpers-3EV6n2dZ.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const columnOrder = ["todo", "in_progress", "review", "done"];
function TaskBoardCard({
  task,
  column,
  onDragStart,
  onDragEnd
}) {
  return /* @__PURE__ */ jsxs(
    Card,
    {
      draggable: true,
      onDragStart: (event) => {
        event.dataTransfer.setData("text/plain", String(task.id));
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      },
      onDragEnd,
      onClick: () => router.visit(`/admin/growth-plan/tasks/${task.id}`),
      role: "button",
      tabIndex: 0,
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.visit(`/admin/growth-plan/tasks/${task.id}`);
        }
      },
      className: "cursor-pointer gap-3 border-border bg-card shadow-none transition-shadow select-none hover:shadow-sm active:cursor-grabbing",
      children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1.5", children: [
            /* @__PURE__ */ jsx(GripVertical, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-border" }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-foreground", children: task.name })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs text-muted-foreground", children: task.action })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-2.5", children: [
          /* @__PURE__ */ jsx("p", { className: "line-clamp-3 text-xs leading-relaxed whitespace-pre-line text-muted-foreground", children: task.body }),
          column === "review" && task.closure_proposal_reason !== null && /* @__PURE__ */ jsx("p", { className: "rounded-md border border-border bg-muted px-2.5 py-2 text-xs text-muted-foreground", children: task.closure_proposal_reason }),
          column === "done" && task.closed_by !== null && /* @__PURE__ */ jsxs("p", { className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            task.closed_by === "human" ? /* @__PURE__ */ jsx(User, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }),
            closedByLabels[task.closed_by]
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(
              Badge,
              {
                variant: "outline",
                title: agentDescriptions[task.agent],
                className: `${agentChipClasses[task.agent]}`,
                children: agentLabels[task.agent]
              }
            ),
            task.source_report !== null && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Reporte del ",
              formatDate(task.source_report)
            ] })
          ] })
        ] })
      ]
    }
  );
}
function BoardColumn({
  column,
  tasks,
  isDragging,
  onDragStart,
  onDragEnd
}) {
  const [isOver, setIsOver] = useState(false);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      onDragOver: (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsOver(true);
      },
      onDragLeave: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOver(false);
        }
      },
      onDrop: (event) => {
        event.preventDefault();
        setIsOver(false);
        const taskId = Number(event.dataTransfer.getData("text/plain"));
        if (!Number.isNaN(taskId) && taskId > 0) {
          router.post(
            `/admin/growth-plan/tasks/${taskId}/move`,
            { column },
            { preserveScroll: true }
          );
        }
      },
      className: `flex min-h-[320px] flex-col gap-3 rounded-xl border p-3 transition-colors ${isOver ? "border-primary bg-muted" : isDragging ? "border-dashed border-muted bg-background" : "border-border bg-background"}`,
      children: [
        /* @__PURE__ */ jsxs(
          "header",
          {
            title: boardColumnDescriptions[column],
            className: "flex items-center justify-between gap-2 px-1",
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: boardColumnLabels[column] }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-card text-muted-foreground", children: tasks.length })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex flex-1 flex-col gap-3", children: tasks.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-center rounded-lg border border-dashed border-border", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nada aquí." }) }) : tasks.map((task) => /* @__PURE__ */ jsx(
          TaskBoardCard,
          {
            task,
            column,
            onDragStart,
            onDragEnd
          },
          task.id
        )) })
      ]
    }
  );
}
function GrowthPlanBoard() {
  const { columns } = usePage().props;
  const [isDragging, setIsDragging] = useState(false);
  return /* @__PURE__ */ jsx(AppLayout, { title: "Tablero de tareas", active: "growth-plan", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: "Tablero de tareas" }),
        /* @__PURE__ */ jsx("p", { className: "max-w-2xl text-sm text-muted-foreground", children: "Arrastra una tarjeta para cambiar el estado de la tarea. Soltarla en Hecha la cierra a tu nombre, igual que confirmarla en el plan." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "", children: /* @__PURE__ */ jsxs(Link, { href: "/admin/growth-plan", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { "data-icon": "inline-start" }),
        "Ver el plan"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4", children: columnOrder.map((column) => /* @__PURE__ */ jsx(
      BoardColumn,
      {
        column,
        tasks: columns[column],
        isDragging,
        onDragStart: () => setIsDragging(true),
        onDragEnd: () => setIsDragging(false)
      },
      column
    )) })
  ] }) });
}
export {
  GrowthPlanBoard as default
};
