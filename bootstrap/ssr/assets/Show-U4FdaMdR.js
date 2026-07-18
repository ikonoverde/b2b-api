import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ArrowLeft, User, Calendar, FileText } from "lucide-react";
import { B as Badge } from "./badge-m_d48R8i.js";
import "./sidebar-DK9OU6Q6.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
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
function ReportShow() {
  const { report, task } = usePage().props;
  const backHref = task === null ? "/admin/growth-plan/board" : `/admin/growth-plan/tasks/${task.id}`;
  const backLabel = task === null ? "Tablero de tareas" : task.name;
  return /* @__PURE__ */ jsx(AppLayout, { title: report.title, active: "growth-plan", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: backHref,
        className: "inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          backLabel
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsx("h1", { className: "max-w-[70ch] text-[28px] font-semibold text-foreground", children: report.title }),
        /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "outline",
            className: "shrink-0 border-muted bg-muted text-primary",
            children: report.type_label
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground", children: [
        report.agent !== null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          report.agent
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          formatDateTime(report.created_at)
        ] })
      ] })
    ] }),
    report.summary !== null && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-background px-6 py-4", children: /* @__PURE__ */ jsx("p", { className: "max-w-[80ch] text-sm leading-relaxed text-muted-foreground", children: report.summary }) }),
    /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: "El reporte" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card px-8 py-7", children: /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-[70ch] prose-headings:prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:font-mono prose-code:text-primary prose-a:text-primary", children: /* @__PURE__ */ jsx(Markdown, { remarkPlugins: [remarkGfm], children: report.body }) }) })
    ] })
  ] }) });
}
export {
  ReportShow as default
};
