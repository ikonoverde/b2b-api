import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { RefreshCw, FileText } from "lucide-react";
import { useState } from "react";
import { A as AccountShell } from "./AccountShell-DCPdI3sW.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import { d as formatDateTimeLong } from "./date-CuQtAuCG.js";
import { s as statusLabels } from "./order-BWzUrFgY.js";
import "./CustomerShell-BPYHgCcv.js";
import "./SiteFooter-BfzQHT4y.js";
const STATUS_ORDER = ["payment_pending", "pending", "processing", "shipped", "delivered"];
const PAYMENT_STATUS_LABELS = {
  pending: "Pago pendiente",
  completed: "Pago confirmado",
  failed: "Pago fallido",
  refunded: "Reembolsado",
  partially_refunded: "Reembolso parcial"
};
const TONE_STYLES = {
  success: {
    bg: "bg-[var(--iko-accent-mist)]",
    border: "border-[var(--iko-accent-line)]",
    dot: "bg-[var(--iko-accent)]",
    ring: "ring-[var(--iko-accent-line)]",
    text: "text-[var(--iko-accent-ink)]"
  },
  warning: {
    bg: "bg-[var(--iko-caution-soft)]",
    border: "border-[var(--iko-caution-line)]",
    dot: "bg-[var(--iko-caution)]",
    ring: "ring-[var(--iko-caution-line)]",
    text: "text-[var(--iko-caution-ink)]"
  },
  danger: {
    bg: "bg-[var(--iko-error-soft)]",
    border: "border-[var(--iko-error-line)]",
    dot: "bg-[var(--iko-error)]",
    ring: "ring-[var(--iko-error-line)]",
    text: "text-[var(--iko-error-ink)]"
  },
  neutral: {
    bg: "bg-[var(--iko-stone-surface)]",
    border: "border-[var(--iko-stone-hairline)]",
    dot: "bg-[var(--iko-stone-mid)]",
    ring: "ring-[var(--iko-stone-hairline)]",
    text: "text-[var(--iko-stone-whisper)]"
  }
};
const CARRIER_TRACKING_URLS = {
  dhl: (id) => `https://www.dhl.com/mx-es/home/tracking/tracking-parcel.html?submit=1&tracking-id=${id}`,
  fedex: (id) => `https://www.fedex.com/apps/fedextrack/?tracknumbers=${id}`,
  ups: (id) => `https://www.ups.com/track?tracknum=${id}`,
  estafeta: (id) => `https://www.estafeta.com/rastrear-pedido?gui=${id}`,
  redpack: (id) => `https://www.redpack.com.mx/es/rastreo/?guia=${id}`,
  paquetexpress: (id) => `https://www.paquetexpress.com.mx/rastreo/?guia=${id}`
};
function getCarrierTrackingUrl(carrier, trackingNumber) {
  if (!carrier || !trackingNumber) {
    return null;
  }
  const lower = carrier.toLowerCase();
  const matched = Object.keys(CARRIER_TRACKING_URLS).find((key) => lower.includes(key));
  return matched ? CARRIER_TRACKING_URLS[matched](trackingNumber) : null;
}
function OrderShow() {
  const { order, flash } = usePage().props;
  return /* @__PURE__ */ jsxs(
    AccountShell,
    {
      title: `Pedido #${order.id}`,
      eyebrow: `Pedido · ${String(order.id).padStart(5, "0")}`,
      headline: "Detalle del pedido",
      sub: `Realizado el ${formatDateTimeLong(order.created_at)}`,
      section: "orders",
      children: [
        flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]", children: flash.success }),
        flash?.error && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]", children: flash.error }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/account/orders",
              className: "font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase hover:text-[var(--iko-stone-ink)]",
              children: "← Volver a pedidos"
            }
          ),
          /* @__PURE__ */ jsx(StatusPill, { status: order.status })
        ] }),
        /* @__PURE__ */ jsx(OrderFacts, { order }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-12", children: [
            /* @__PURE__ */ jsx(OrderItemsBlock, { order }),
            /* @__PURE__ */ jsx(OrderTimeline, { order })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
            /* @__PURE__ */ jsx(ActionsBlock, { orderId: order.id }),
            /* @__PURE__ */ jsx(ShippingBlock, { order })
          ] })
        ] })
      ]
    }
  );
}
function orderToneFor(status) {
  if (status === "cancelled") {
    return "danger";
  }
  if (status === "payment_pending") {
    return "warning";
  }
  if (STATUS_ORDER.includes(status)) {
    return "success";
  }
  return "neutral";
}
function paymentToneFor(status) {
  if (status === "completed") {
    return "success";
  }
  if (status === "pending") {
    return "warning";
  }
  if (status === "failed" || status === "cancelled") {
    return "danger";
  }
  return "neutral";
}
function StatusPill({ status }) {
  const styles = TONE_STYLES[orderToneFor(status)];
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `inline-flex items-center gap-2 border px-3 py-1.5 ${styles.bg} ${styles.border}`,
      children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: `inline-block h-1.5 w-1.5 rounded-full ${styles.dot}` }),
        /* @__PURE__ */ jsx("span", { className: `font-spec text-[12px] tracking-[0.04em] uppercase ${styles.text}`, children: statusLabels[status] ?? status })
      ]
    }
  );
}
function OrderFacts({ order }) {
  const paymentTone = paymentToneFor(order.payment_status);
  const paymentStyles = TONE_STYLES[paymentTone];
  return /* @__PURE__ */ jsxs(
    "dl",
    {
      "aria-label": "Resumen operativo del pedido",
      className: "mt-6 grid grid-cols-1 divide-y divide-[var(--iko-stone-hairline)] border-y border-[var(--iko-stone-hairline)] sm:grid-cols-3 sm:divide-x sm:divide-y-0",
      children: [
        /* @__PURE__ */ jsx(OrderFact, { label: "Total", children: /* @__PURE__ */ jsx("span", { className: "font-spec text-[1rem] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(order.total_amount) }) }),
        /* @__PURE__ */ jsx(OrderFact, { label: "Pago", children: /* @__PURE__ */ jsxs(
          "span",
          {
            className: `inline-flex items-center gap-2 border px-2.5 py-1 ${paymentStyles.bg} ${paymentStyles.border}`,
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: `inline-block h-1.5 w-1.5 rounded-full ${paymentStyles.dot}` }),
              /* @__PURE__ */ jsx("span", { className: `font-spec text-[11px] tracking-[0.04em] uppercase ${paymentStyles.text}`, children: PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(OrderFact, { label: "Seguimiento", children: order.tracking_number ? /* @__PURE__ */ jsxs("span", { className: "font-spec text-[12px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-ink)]", children: [
          order.shipping_carrier ?? "Guía",
          " · ",
          order.tracking_number
        ] }) : /* @__PURE__ */ jsx("span", { className: "text-[13px] text-[var(--iko-stone-whisper)]", children: "Pendiente de envío" }) })
      ]
    }
  );
}
function OrderFact({ label, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-24 flex-col justify-between gap-4 px-1 py-4 sm:px-5", children: [
    /* @__PURE__ */ jsx("dt", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: label }),
    /* @__PURE__ */ jsx("dd", { children })
  ] });
}
function OrderItemsBlock({ order }) {
  const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "items-heading", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] pb-3", children: [
      /* @__PURE__ */ jsx(
        "h2",
        {
          id: "items-heading",
          className: "font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]",
          children: "Productos"
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
        order.items.length,
        " ",
        order.items.length === 1 ? "producto" : "productos"
      ] })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "divide-y divide-[var(--iko-stone-hairline)] border-b border-[var(--iko-stone-hairline)]", children: order.items.map((item, idx) => /* @__PURE__ */ jsxs(
      "li",
      {
        className: "grid grid-cols-[2.5rem_4rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[3rem_5rem_1fr_auto] sm:gap-6",
        children: [
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-accent)]", children: String(idx + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx(ItemImage, { item }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-1", children: [
            /* @__PURE__ */ jsx(ItemName, { item }),
            /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]", children: [
              item.quantity,
              " × ",
              formatCurrency(item.unit_price)
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(item.subtotal) })
        ]
      },
      item.id
    )) }),
    /* @__PURE__ */ jsxs("dl", { className: "mt-3 px-1", children: [
      /* @__PURE__ */ jsx(SummaryRow, { label: "Subtotal", value: formatCurrency(subtotal) }),
      /* @__PURE__ */ jsx(SummaryRow, { label: "Envío", value: formatCurrency(order.shipping_cost) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] py-4", children: [
      /* @__PURE__ */ jsx("dt", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Total" }),
      /* @__PURE__ */ jsx("dd", { className: "font-spec text-[1.25rem] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(order.total_amount) })
    ] })
  ] });
}
function ItemName({ item }) {
  if (item.product) {
    return /* @__PURE__ */ jsx(
      Link,
      {
        href: `/products/${item.product.slug}`,
        className: "font-display text-[1rem] leading-tight text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)]",
        children: item.product_name
      }
    );
  }
  return /* @__PURE__ */ jsx("span", { className: "font-display text-[1rem] leading-tight text-[var(--iko-stone-ink)]", children: item.product_name });
}
function ItemImage({ item }) {
  const inner = /* @__PURE__ */ jsx("div", { className: "h-14 w-14 overflow-hidden bg-[var(--iko-stone-mid)]/40 sm:h-16 sm:w-16", children: item.image ? /* @__PURE__ */ jsx(
    "img",
    {
      src: item.image,
      alt: "",
      className: "h-full w-full object-cover",
      loading: "lazy"
    }
  ) : null });
  if (item.product) {
    return /* @__PURE__ */ jsx(Link, { href: `/products/${item.product.slug}`, className: "shrink-0", children: inner });
  }
  return inner;
}
function SummaryRow({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between py-2", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-[13px] text-[var(--iko-stone-whisper)]", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "font-spec text-[13px] tabular-nums text-[var(--iko-stone-ink)]", children: value })
  ] });
}
function OrderTimeline({ order }) {
  const isCancelled = order.status === "cancelled";
  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const steps = STATUS_ORDER.map((status, index) => {
    const historyEntry = order.status_histories.find((h) => h.to_status === status);
    return {
      status,
      label: statusLabels[status] ?? status,
      isCompleted: !isCancelled && index <= currentIndex,
      isCurrent: !isCancelled && index === currentIndex,
      date: historyEntry ? formatDateTimeLong(historyEntry.created_at) : null
    };
  });
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "timeline-heading", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-[var(--iko-stone-hairline)] pb-3", children: /* @__PURE__ */ jsx(
      "h2",
      {
        id: "timeline-heading",
        className: "font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]",
        children: "Estado"
      }
    ) }),
    isCancelled ? /* @__PURE__ */ jsxs("div", { className: "mt-6 border border-[var(--iko-error-line)] bg-[var(--iko-error-soft)] px-5 py-4", children: [
      /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-error-ink)] uppercase", children: "Pedido cancelado" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-[13px] leading-[1.55] text-[var(--iko-error-ink)]", children: "Este pedido fue cancelado y no se procesará. Si crees que es un error, contacta al equipo comercial." })
    ] }) : /* @__PURE__ */ jsx("ol", { className: "mt-4 border-b border-[var(--iko-stone-hairline)]", children: steps.map((step, index) => /* @__PURE__ */ jsx(
      TimelineRow,
      {
        step,
        index: index + 1
      },
      step.status
    )) })
  ] });
}
function TimelineRow({
  step,
  index
}) {
  const tone = step.isCurrent ? "current" : step.isCompleted ? "completed" : "pending";
  const styles = TONE_STYLES[tone === "pending" ? "neutral" : orderToneFor(step.status)];
  return /* @__PURE__ */ jsxs(
    "li",
    {
      className: `grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-t border-[var(--iko-stone-hairline)] px-4 py-4 first:border-t-0 sm:gap-6 ${tone === "current" ? `${styles.bg} ring-1 ring-inset ${styles.ring}` : ""}`,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `flex h-7 w-7 items-center justify-center border font-spec text-[11px] tabular-nums ${tone === "completed" || tone === "current" ? `${styles.border} ${styles.text}` : "border-[var(--iko-stone-hairline)] text-[var(--iko-stone-mid)]"}`,
            children: String(index).padStart(2, "0")
          }
        ),
        /* @__PURE__ */ jsxs(
          "span",
          {
            className: `text-[14px] ${tone === "pending" ? "text-[var(--iko-stone-whisper)]" : "text-[var(--iko-stone-ink)]"}`,
            children: [
              step.label,
              tone === "current" && /* @__PURE__ */ jsx("span", { className: `ml-3 font-spec text-[10px] tracking-[0.08em] uppercase ${styles.text}`, children: "· Actual" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-stone-whisper)]", children: step.date ?? "—" })
      ]
    }
  );
}
function ActionsBlock({ orderId }) {
  const [reordering, setReordering] = useState(false);
  function reorder() {
    setReordering(true);
    router.post(
      `/account/orders/${orderId}/reorder`,
      {},
      {
        preserveScroll: true,
        onFinish: () => setReordering(false)
      }
    );
  }
  function downloadInvoice() {
    window.open(`/account/orders/${orderId}/invoice`, "_blank");
  }
  return /* @__PURE__ */ jsxs("aside", { className: "border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-surface)]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[var(--iko-stone-hairline)] px-5 py-4", children: /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Acciones" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 p-5", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: reorder,
          disabled: reordering,
          className: "flex h-12 w-full items-center justify-center gap-2 bg-[var(--iko-accent)] text-[14px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-surface)] disabled:opacity-60",
          children: [
            /* @__PURE__ */ jsx(
              RefreshCw,
              {
                className: `h-4 w-4 ${reordering ? "animate-spin" : ""}`,
                strokeWidth: 1.5
              }
            ),
            reordering ? "Procesando…" : "Volver a ordenar"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: downloadInvoice,
          className: "flex h-12 w-full items-center justify-center gap-2 border border-[var(--iko-stone-hairline)] text-[14px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-surface)]",
          children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4", strokeWidth: 1.5 }),
            "Descargar factura"
          ]
        }
      )
    ] })
  ] });
}
function ShippingBlock({ order }) {
  const trackingUrl = order.tracking_url ?? getCarrierTrackingUrl(order.shipping_carrier, order.tracking_number);
  return /* @__PURE__ */ jsxs("aside", { className: "border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-surface)]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[var(--iko-stone-hairline)] px-5 py-4", children: /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Envío" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 p-5", children: [
      order.shipping_address ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Dirección" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[13px] leading-[1.6] text-[var(--iko-stone-ink)]", children: [
          order.shipping_address.name && /* @__PURE__ */ jsxs(Fragment, { children: [
            order.shipping_address.name,
            /* @__PURE__ */ jsx("br", {})
          ] }),
          order.shipping_address.address_line_1 ?? order.shipping_address.street,
          order.shipping_address.address_line_2 && `, ${order.shipping_address.address_line_2}`,
          /* @__PURE__ */ jsx("br", {}),
          order.shipping_address.city,
          ", ",
          order.shipping_address.state,
          " ",
          order.shipping_address.postal_code ?? order.shipping_address.zip
        ] })
      ] }) : null,
      order.tracking_number ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Rastreo" }),
        /* @__PURE__ */ jsxs("p", { className: "font-spec text-[13px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-ink)]", children: [
          order.shipping_carrier,
          " · ",
          order.tracking_number
        ] }),
        trackingUrl && /* @__PURE__ */ jsxs(
          "a",
          {
            href: trackingUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-baseline gap-2 text-[13px] text-[var(--iko-accent)] hover:text-[var(--iko-accent-hover)]",
            children: [
              "Rastrear envío",
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Rastreo" }),
        /* @__PURE__ */ jsx("p", { className: "text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]", children: "La información estará disponible una vez enviado el pedido." })
      ] })
    ] })
  ] });
}
export {
  OrderShow as default
};
