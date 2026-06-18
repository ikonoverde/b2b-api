import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { useEffect } from "react";
import { C as CustomerShell } from "./CustomerShell-D8_I-KnY.js";
import { C as CheckoutStepIndicator } from "./CheckoutStepIndicator-DNQd0npl.js";
import { O as OrderSummary } from "./OrderSummary-BxoV9fQN.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import { a as trackMetaPurchase, M as META_PIXEL_CURRENCY } from "./analytics-DfQx76hI.js";
import "lucide-react";
import "./SiteFooter-DIt_Mg7v.js";
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
    text: "text-[var(--iko-accent-ink)]"
  },
  warning: {
    bg: "bg-[var(--iko-caution-soft)]",
    border: "border-[var(--iko-caution-line)]",
    dot: "bg-[var(--iko-caution)]",
    text: "text-[var(--iko-caution-ink)]"
  },
  danger: {
    bg: "bg-[var(--iko-error-soft)]",
    border: "border-[var(--iko-error-line)]",
    dot: "bg-[var(--iko-error)]",
    text: "text-[var(--iko-error-ink)]"
  },
  neutral: {
    bg: "bg-[var(--iko-stone-surface)]",
    border: "border-[var(--iko-stone-hairline)]",
    dot: "bg-[var(--iko-stone-mid)]",
    text: "text-[var(--iko-stone-whisper)]"
  }
};
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
function headerCopyFor(status) {
  if (status === "pending") {
    return {
      eyebrow: "Compra · Procesando",
      title: "Procesando tu pago",
      body: "Tu pago está siendo confirmado. Te notificaremos cuando se complete y aparecerá en tu historial de pedidos."
    };
  }
  if (status === "failed" || status === "cancelled") {
    return {
      eyebrow: "Compra · Revisión",
      title: "Pago en revisión",
      body: "No pudimos confirmar el pago todavía. Conservamos el pedido para que puedas revisarlo o intentar nuevamente."
    };
  }
  return {
    eyebrow: "Compra · Confirmada",
    title: "Pedido confirmado",
    body: "Hemos recibido tu pedido. Te enviaremos los siguientes pasos por correo electrónico junto con la información de seguimiento."
  };
}
function ThankYou({ order }) {
  const headerCopy = headerCopyFor(order.payment_status);
  const paymentTone = paymentToneFor(order.payment_status);
  const paymentStyles = TONE_STYLES[paymentTone];
  const orderCode = String(order.id).padStart(5, "0");
  useEffect(() => {
    trackMetaPurchase(
      {
        value: order.total_amount,
        currency: META_PIXEL_CURRENCY,
        num_items: order.items.reduce((count, item) => count + item.quantity, 0)
      },
      `order_${order.id}`
    );
  }, [order.id, order.total_amount, order.items]);
  return /* @__PURE__ */ jsxs(CustomerShell, { title: headerCopy.title, children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: `font-spec text-[11px] tracking-[0.12em] uppercase ${paymentStyles.text}`, children: headerCopy.eyebrow }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: headerCopy.title }),
      /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: headerCopy.body })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsx(CheckoutStepIndicator, { currentStep: 3 }) }),
    /* @__PURE__ */ jsx(
      PaymentStatusPanel,
      {
        order,
        orderCode,
        paymentStyles
      }
    ),
    /* @__PURE__ */ jsxs(
      "section",
      {
        "aria-labelledby": "order-detail-heading",
        className: "mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] pb-3", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: "order-detail-heading",
                  className: "font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]",
                  children: "Detalle del pedido"
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
                "Pedido · ",
                orderCode
              ] })
            ] }),
            order.shipping_address && /* @__PURE__ */ jsx(ShippingAddressBlock, { address: order.shipping_address }),
            /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-stone-hairline)] px-5 py-2", children: /* @__PURE__ */ jsx(
              OrderSummary,
              {
                items: order.items,
                totalAmount: order.total_amount,
                shippingCost: order.shipping_cost,
                showCard: false
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/account/orders/${order.id}`,
                  className: "inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
                  children: "Ver pedido"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/catalog",
                  className: "inline-flex h-12 items-center border border-[var(--iko-stone-hairline)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
                  children: "Seguir comprando"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(NextStepsPanel, { paymentStatus: order.payment_status, paymentStyles })
        ]
      }
    )
  ] });
}
function PaymentStatusPanel({
  order,
  orderCode,
  paymentStyles
}) {
  const statusLabel = PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-label": "Estado del pago",
      "aria-live": order.payment_status === "pending" ? "polite" : "off",
      className: `mt-8 grid gap-5 border px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center ${paymentStyles.bg} ${paymentStyles.border}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: `font-spec text-[11px] tracking-[0.1em] uppercase ${paymentStyles.text}`, children: "Estado de la compra" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsx(PaymentStatusPill, { statusLabel, paymentStyles }),
            /* @__PURE__ */ jsxs("span", { className: "font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
              "Pedido · ",
              orderCode
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("dl", { className: "grid grid-cols-2 gap-x-7 gap-y-3 sm:min-w-72", children: [
          /* @__PURE__ */ jsx(StatusFact, { label: "Total", value: formatCurrency(order.total_amount) }),
          /* @__PURE__ */ jsx(StatusFact, { label: "Productos", value: String(order.items.length).padStart(2, "0") })
        ] })
      ]
    }
  );
}
function PaymentStatusPill({
  statusLabel,
  paymentStyles
}) {
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-2 border px-3 py-1.5 ${paymentStyles.bg} ${paymentStyles.border}`, children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: `inline-block h-1.5 w-1.5 rounded-full ${paymentStyles.dot}` }),
    /* @__PURE__ */ jsx("span", { className: `font-spec text-[12px] tracking-[0.04em] uppercase ${paymentStyles.text}`, children: statusLabel })
  ] });
}
function StatusFact({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsx("dt", { className: "font-spec text-[10px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]", children: value })
  ] });
}
function ShippingAddressBlock({ address }) {
  return /* @__PURE__ */ jsxs("div", { className: "border-y border-[var(--iko-stone-hairline)] py-5", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Dirección de envío" }),
    /* @__PURE__ */ jsxs("p", { className: "mt-3 text-[14px] leading-[1.7] text-[var(--iko-stone-ink)]", children: [
      address.name,
      /* @__PURE__ */ jsx("br", {}),
      address.address_line_1,
      address.address_line_2 && `, ${address.address_line_2}`,
      /* @__PURE__ */ jsx("br", {}),
      address.city,
      ", ",
      address.state,
      " ",
      address.postal_code,
      address.phone && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs("span", { className: "font-spec text-[12px] tabular-nums text-[var(--iko-stone-whisper)]", children: [
          "Tel · ",
          address.phone
        ] })
      ] })
    ] })
  ] });
}
function NextStepsPanel({
  paymentStatus,
  paymentStyles
}) {
  const steps = paymentStatus === "pending" ? [
    { eyebrow: "01", title: "Confirmación", body: "Confirmaremos el pago en los próximos minutos." },
    { eyebrow: "02", title: "Notificación", body: "Recibirás un correo con el detalle final del pedido." },
    { eyebrow: "03", title: "Envío", body: "Coordinaremos el envío al confirmar el pago." }
  ] : paymentStatus === "failed" || paymentStatus === "cancelled" ? [
    { eyebrow: "01", title: "Revisión", body: "Revisa el estado del pedido antes de intentar otro pago." },
    { eyebrow: "02", title: "Nuevo intento", body: "Puedes volver al pedido y completar el pago cuando lo necesites." },
    { eyebrow: "03", title: "Soporte", body: "Contáctanos si el cargo aparece en tu banco." }
  ] : [
    { eyebrow: "01", title: "Preparación", body: "Preparamos tu pedido en las próximas 24 horas hábiles." },
    { eyebrow: "02", title: "Envío", body: "Recibirás el número de seguimiento por correo electrónico." },
    { eyebrow: "03", title: "Reorden", body: "Vuelve a pedir con un clic desde tu historial." }
  ];
  return /* @__PURE__ */ jsxs("aside", { className: "border border-[var(--iko-stone-hairline)] lg:sticky lg:top-24", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[var(--iko-stone-hairline)] px-5 py-4", children: /* @__PURE__ */ jsx("span", { className: `font-spec text-[11px] tracking-[0.12em] uppercase ${paymentStyles.text}`, children: "Próximos pasos" }) }),
    /* @__PURE__ */ jsx("ol", { className: "divide-y divide-[var(--iko-stone-hairline)]", children: steps.map((step) => /* @__PURE__ */ jsxs(
      "li",
      {
        className: "grid grid-cols-[2rem_1fr] gap-4 px-5 py-4",
        children: [
          /* @__PURE__ */ jsx("span", { className: `font-spec text-[11px] tabular-nums ${paymentStyles.text}`, children: step.eyebrow }),
          /* @__PURE__ */ jsxs("span", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[14px] text-[var(--iko-stone-ink)]", children: step.title }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]", children: step.body })
          ] })
        ]
      },
      step.eyebrow
    )) })
  ] });
}
export {
  ThankYou as default
};
