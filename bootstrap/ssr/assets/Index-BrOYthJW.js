import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { Search, Filter, X, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { p as paymentStatusLabels, g as getStatusColor, a as getPaymentStatusColor } from "./helpers-tCu_W-gk.js";
import { s as statusLabels } from "./order-BWzUrFgY.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import { a as formatDateShort } from "./date-CuQtAuCG.js";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function SortableHeader({ field, label, currentFilters }) {
  const isActive = currentFilters.sort_by === field;
  const handleSort = () => {
    const newOrder = isActive && currentFilters.sort_order === "desc" ? "asc" : "desc";
    router.get("/admin/orders", {
      ...currentFilters,
      sort_by: field,
      sort_order: newOrder
    }, { preserveState: true });
  };
  return /* @__PURE__ */ jsx(
    "th",
    {
      className: "text-left px-6 py-4 cursor-pointer hover:bg-muted",
      onClick: handleSort,
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: label }),
        /* @__PURE__ */ jsx(ArrowUpDown, { className: `w-4 h-4 ${isActive ? "text-foreground" : "text-muted-foreground"}` })
      ] })
    }
  );
}
function FilterBar({ filters }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = filters.status || filters.payment_status || filters.date_from || filters.date_to || filters.customer || filters.amount_min || filters.amount_max;
  const applyFilters = (e) => {
    e.preventDefault();
    router.get("/admin/orders", {
      ...localFilters,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order
    }, { preserveState: true });
  };
  const clearFilters = () => {
    const cleared = {
      status: "",
      payment_status: "",
      date_from: "",
      date_to: "",
      customer: "",
      amount_min: "",
      amount_max: "",
      sort_by: filters.sort_by,
      sort_order: filters.sort_order
    };
    setLocalFilters(cleared);
    router.get("/admin/orders", cleared, { preserveState: true });
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: applyFilters, className: "flex items-center gap-3 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-sm", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Buscar por cliente...",
              value: localFilters.customer,
              onChange: (e) => setLocalFilters({ ...localFilters, customer: e.target.value }),
              className: "w-full h-10 pl-10 pr-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "h-10 px-4 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors",
            children: "Buscar"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowFilters(!showFilters),
            className: `flex items-center gap-2 h-10 px-4 rounded-lg border text-sm font-medium transition-colors ${hasActiveFilters ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:bg-muted"}`,
            children: [
              /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4" }),
              "Filtros",
              hasActiveFilters && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-primary" })
            ]
          }
        ),
        hasActiveFilters && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: clearFilters,
            className: "flex items-center gap-1 h-10 px-3 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors",
            children: [
              /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }),
              "Limpiar"
            ]
          }
        )
      ] })
    ] }),
    showFilters && /* @__PURE__ */ jsxs("form", { onSubmit: applyFilters, className: "px-6 pb-4 flex flex-wrap gap-4 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Estado" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: localFilters.status,
            onChange: (e) => setLocalFilters({ ...localFilters, status: e.target.value }),
            className: "h-9 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Todos" }),
              Object.entries(statusLabels).map(([value, label]) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Pago" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: localFilters.payment_status,
            onChange: (e) => setLocalFilters({ ...localFilters, payment_status: e.target.value }),
            className: "h-9 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Todos" }),
              Object.entries(paymentStatusLabels).map(([value, label]) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Desde" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value: localFilters.date_from,
            onChange: (e) => setLocalFilters({ ...localFilters, date_from: e.target.value }),
            className: "h-9 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Hasta" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value: localFilters.date_to,
            onChange: (e) => setLocalFilters({ ...localFilters, date_to: e.target.value }),
            className: "h-9 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Monto Mín" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            value: localFilters.amount_min,
            onChange: (e) => setLocalFilters({ ...localFilters, amount_min: e.target.value }),
            className: "h-9 w-28 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary",
            placeholder: "$0.00"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Monto Máx" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            value: localFilters.amount_max,
            onChange: (e) => setLocalFilters({ ...localFilters, amount_max: e.target.value }),
            className: "h-9 w-28 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary",
            placeholder: "$0.00"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "h-9 px-4 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors",
          children: "Aplicar"
        }
      ) })
    ] })
  ] });
}
function OrderRow({ order }) {
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-border hover:bg-muted", children: [
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs(
      Link,
      {
        href: `/admin/orders/${order.id}`,
        className: "text-sm text-foreground hover:underline font-medium",
        children: [
          "#",
          order.id
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: order.user?.name }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: order.user?.email })
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: formatCurrency(order.total_amount) }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`, children: statusLabels[order.status] || order.status }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`, children: paymentStatusLabels[order.payment_status] || order.payment_status }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: formatDateShort(order.created_at) }) })
  ] });
}
function Pagination({ orders }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-border", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
      "Mostrando ",
      orders.from,
      " a ",
      orders.to,
      " de ",
      orders.total,
      " pedidos"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: `?page=${orders.current_page - 1}`,
          className: `p-2 rounded-lg border border-border ${orders.current_page === 1 ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground", children: [
        orders.current_page,
        " / ",
        orders.last_page
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: `?page=${orders.current_page + 1}`,
          className: `p-2 rounded-lg border border-border ${orders.current_page === orders.last_page ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-muted"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })
        }
      )
    ] })
  ] });
}
function OrdersIndex() {
  const { orders, filters } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Pedidos", active: "orders", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: "Pedidos" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Gestiona los pedidos del sistema" })
    ] }) }),
    /* @__PURE__ */ jsx(FilterBar, { filters }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border", children: [
          /* @__PURE__ */ jsx(SortableHeader, { field: "created_at", label: "ID", currentFilters: filters }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Cliente" }) }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "total_amount", label: "Total", currentFilters: filters }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "status", label: "Estado", currentFilters: filters }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "payment_status", label: "Pago", currentFilters: filters }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Fecha" }) })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: orders.data.map((order) => /* @__PURE__ */ jsx(OrderRow, { order }, order.id)) })
      ] }),
      orders.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No hay pedidos registrados" }) }),
      orders.last_page > 1 && /* @__PURE__ */ jsx(Pagination, { orders })
    ] })
  ] }) });
}
export {
  OrdersIndex as default
};
