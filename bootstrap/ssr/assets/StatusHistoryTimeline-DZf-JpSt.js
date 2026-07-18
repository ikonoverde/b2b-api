import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { g as getStatusColor } from "./helpers-tCu_W-gk.js";
import { s as statusLabels } from "./order-BWzUrFgY.js";
import { b as formatDate } from "./date-CuQtAuCG.js";
function StatusHistoryTimeline({ order }) {
  if (order.status_histories.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Historial de Estado" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: order.status_histories.map((entry) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-primary mt-1.5" }),
        /* @__PURE__ */ jsx("div", { className: "w-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 pb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          entry.from_status && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.from_status)}`, children: statusLabels[entry.from_status] || entry.from_status }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "→" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.to_status)}`, children: statusLabels[entry.to_status] || entry.to_status })
        ] }),
        entry.note && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: entry.note }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: formatDate(entry.created_at) }),
          entry.admin_name && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "por ",
            entry.admin_name
          ] })
        ] })
      ] })
    ] }, entry.id)) }) })
  ] });
}
export {
  StatusHistoryTimeline as default
};
