import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { RefreshCw } from "lucide-react";
import { A as AccountShell } from "./AccountShell-BEtaQOIT.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import { f as formatDateShort } from "./date-31wqykji.js";
import { s as statusLabels } from "./order-BWzUrFgY.js";
import "./CustomerShell-D8_I-KnY.js";
import "./SiteFooter-DIt_Mg7v.js";
const TERMINAL_STATUSES = /* @__PURE__ */ new Set(["delivered"]);
const ALERT_STATUSES = /* @__PURE__ */ new Set(["cancelled", "payment_pending"]);
function OrdersIndex() {
  const { orders, flash } = usePage().props;
  return /* @__PURE__ */ jsxs(
    AccountShell,
    {
      title: "Pedidos",
      eyebrow: "Cuenta · Pedidos",
      headline: "Historial de pedidos",
      sub: "Revisa el estado de tus pedidos y reordena formatos habituales en un paso.",
      section: "orders",
      children: [
        flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]", children: flash.success }),
        flash?.error && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]", children: flash.error }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
            String(orders.total).padStart(2, "0"),
            " ",
            orders.total === 1 ? "pedido" : "pedidos en total"
          ] }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/catalog",
              className: "inline-flex h-11 items-center bg-[var(--iko-accent)] px-5 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]",
              children: "Hacer un pedido"
            }
          )
        ] }),
        orders.data.length === 0 ? /* @__PURE__ */ jsx(EmptyOrders, {}) : /* @__PURE__ */ jsx("ol", { className: "divide-y divide-[var(--iko-stone-hairline)] border-b border-[var(--iko-stone-hairline)]", children: orders.data.map((order) => /* @__PURE__ */ jsx(OrderRow, { order }, order.id)) }),
        /* @__PURE__ */ jsx(Pagination, { orders })
      ]
    }
  );
}
function OrderRow({ order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const statusTone = statusToneFor(order.status);
  return /* @__PURE__ */ jsxs("li", { children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: `/account/orders/${order.id}`,
        className: "grid grid-cols-1 gap-4 py-6 transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset md:grid-cols-[8rem_1fr_8rem_8rem] md:items-center md:gap-6",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 px-1", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)] uppercase", children: [
              "Pedido · ",
              String(order.id).padStart(5, "0")
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-stone-whisper)]", children: formatDateShort(order.created_at) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-1", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex -space-x-2", children: [
              order.items.slice(0, 3).map((item) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "h-10 w-10 overflow-hidden border border-[var(--iko-stone-paper)] bg-[var(--iko-stone-mid)]/40",
                  children: item.image ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: item.image,
                      alt: "",
                      className: "h-full w-full object-cover",
                      loading: "lazy"
                    }
                  ) : null
                },
                item.id
              )),
              order.items.length > 3 && /* @__PURE__ */ jsxs("span", { className: "flex h-10 w-10 items-center justify-center border border-[var(--iko-stone-paper)] bg-[var(--iko-stone-mid)]/30 font-spec text-[10px] tabular-nums text-[var(--iko-stone-ink)]", children: [
                "+",
                order.items.length - 3
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-spec text-[12px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]", children: [
              itemCount,
              " ",
              itemCount === 1 ? "unidad" : "unidades"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-1", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: `inline-block h-1.5 w-1.5 rounded-full ${statusTone === "success" ? "bg-[var(--iko-accent)]" : statusTone === "alert" ? "bg-[var(--iko-error)]" : "bg-[var(--iko-stone-mid)]"}`
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] text-[var(--iko-stone-ink)]", children: statusLabels[order.status] ?? order.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-3 px-1 md:justify-end", children: [
            /* @__PURE__ */ jsx("span", { className: "font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)] md:hidden", children: formatCurrency(order.total_amount) }),
            /* @__PURE__ */ jsx("span", { className: "hidden font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)] md:inline", children: formatCurrency(order.total_amount) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-5 px-1 pb-4 md:pb-2", children: [
      /* @__PURE__ */ jsx(ReorderButton, { orderId: order.id }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: `/account/orders/${order.id}`,
          className: "font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase hover:text-[var(--iko-accent)]",
          children: "Ver detalle →"
        }
      )
    ] })
  ] });
}
function statusToneFor(status) {
  if (TERMINAL_STATUSES.has(status)) {
    return "success";
  }
  if (ALERT_STATUSES.has(status)) {
    return "alert";
  }
  return "neutral";
}
function ReorderButton({ orderId }) {
  const [processing, setProcessing] = useState(false);
  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setProcessing(true);
    router.post(
      `/account/orders/${orderId}/reorder`,
      {},
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false)
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: handleClick,
      disabled: processing,
      className: "inline-flex items-center gap-1.5 font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent)] uppercase hover:text-[var(--iko-accent-hover)] disabled:opacity-60",
      children: [
        /* @__PURE__ */ jsx(
          RefreshCw,
          {
            className: `h-3.5 w-3.5 ${processing ? "animate-spin" : ""}`,
            strokeWidth: 1.5
          }
        ),
        processing ? "Procesando…" : "Reordenar"
      ]
    }
  );
}
function EmptyOrders() {
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-5 border-y border-[var(--iko-stone-hairline)] py-16", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Sin pedidos" }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[42ch] font-display text-[1.5rem] leading-[1.15] text-[var(--iko-stone-ink)]", children: "Aún no has hecho un pedido." }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: "Explora el catálogo para hacer tu primer pedido. Una vez confirmado podrás reordenar con un solo clic desde aquí." }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Link,
      {
        href: "/catalog",
        className: "inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]",
        children: "Ver catálogo"
      }
    ) })
  ] });
}
function Pagination({ orders }) {
  if (orders.last_page <= 1) {
    return null;
  }
  function go(page) {
    router.get("/account/orders", { page }, { preserveState: true, preserveScroll: false });
  }
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      "aria-label": "Paginación",
      className: "mt-10 flex items-center justify-between border-t border-[var(--iko-stone-hairline)] pt-6",
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => go(orders.current_page - 1),
            disabled: orders.current_page === 1,
            className: "font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase hover:text-[var(--iko-stone-ink)] disabled:opacity-30",
            children: "← Anterior"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
          "Página ",
          String(orders.current_page).padStart(2, "0"),
          " ·",
          " ",
          String(orders.last_page).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => go(orders.current_page + 1),
            disabled: orders.current_page === orders.last_page,
            className: "font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase hover:text-[var(--iko-stone-ink)] disabled:opacity-30",
            children: "Siguiente →"
          }
        )
      ]
    }
  );
}
export {
  OrdersIndex as default
};
