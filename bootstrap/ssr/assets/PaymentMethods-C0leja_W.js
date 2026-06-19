import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, router } from "@inertiajs/react";
import { Plus, Star, Trash2, X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect, useRef } from "react";
import { A as AccountShell } from "./AccountShell-B64sRR20.js";
import "./CustomerShell-BUXLAgvU.js";
import "./SiteFooter-Cn_4a6rU.js";
import "./currency-BiP3uvrU.js";
const BRAND_LABELS = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  jcb: "JCB",
  diners: "Diners Club",
  unionpay: "UnionPay"
};
function formatCardBrand(brand) {
  return BRAND_LABELS[brand.toLowerCase()] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
}
function PaymentMethods({
  stripe_key,
  payment_methods
}) {
  const { flash } = usePage().props;
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (flash?.success) {
      setSuccess(flash.success);
      const timer = setTimeout(() => setSuccess(""), 3e3);
      return () => clearTimeout(timer);
    }
  }, [flash?.success]);
  return /* @__PURE__ */ jsxs(
    AccountShell,
    {
      title: "Métodos de pago",
      eyebrow: "Cuenta · Métodos de pago",
      headline: "Métodos de pago",
      sub: "Tus tarjetas se guardan de forma segura en Stripe. La predeterminada se selecciona automáticamente al pagar.",
      section: "payment-methods",
      children: [
        success && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]", children: success }),
        (flash?.error || error) && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]", children: flash?.error || error }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
            String(payment_methods.length).padStart(2, "0"),
            " ",
            payment_methods.length === 1 ? "tarjeta guardada" : "tarjetas guardadas"
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setIsAdding(true),
              className: "inline-flex h-11 items-center gap-2 bg-[var(--iko-accent)] px-5 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4", strokeWidth: 1.5 }),
                "Nueva tarjeta"
              ]
            }
          )
        ] }),
        payment_methods.length === 0 ? /* @__PURE__ */ jsx(EmptyMethods, { onAdd: () => setIsAdding(true) }) : /* @__PURE__ */ jsx("ol", { className: "divide-y divide-[var(--iko-stone-hairline)] border-b border-[var(--iko-stone-hairline)]", children: payment_methods.map((method, idx) => /* @__PURE__ */ jsx(
          PaymentMethodRow,
          {
            method,
            index: idx + 1,
            onDelete: () => {
              if (confirm("¿Eliminar esta tarjeta?")) {
                router.delete(`/account/payment-methods/${method.id}`, {
                  preserveScroll: true
                });
              }
            },
            onSetDefault: () => router.patch(
              `/account/payment-methods/${method.id}/default`,
              {},
              { preserveScroll: true }
            )
          },
          method.id
        )) }),
        isAdding && /* @__PURE__ */ jsx(
          AddCardModal,
          {
            stripeKey: stripe_key,
            onClose: () => {
              setIsAdding(false);
              setError("");
            },
            onError: setError
          }
        )
      ]
    }
  );
}
function PaymentMethodRow({
  method,
  index,
  onDelete,
  onSetDefault
}) {
  return /* @__PURE__ */ jsxs("li", { className: "grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 py-6 sm:grid-cols-[3rem_1fr_auto] sm:gap-6", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-accent)]", children: String(index).padStart(2, "0") }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]", children: formatCardBrand(method.card.brand) }),
        /* @__PURE__ */ jsxs("span", { className: "font-spec text-[13px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)]", children: [
          "····",
          " ",
          method.card.last4
        ] }),
        method.is_default && /* @__PURE__ */ jsx("span", { className: "font-spec text-[10px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: "· Predeterminada" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
        "Vence",
        " ",
        String(method.card.exp_month).padStart(2, "0"),
        "/",
        String(method.card.exp_year).slice(-2)
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      !method.is_default && /* @__PURE__ */ jsx(IconButton, { onClick: onSetDefault, title: "Predeterminar", children: /* @__PURE__ */ jsx(Star, { className: "h-4 w-4", strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsx(IconButton, { onClick: onDelete, title: "Eliminar", danger: true, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4", strokeWidth: 1.5 }) })
    ] })
  ] });
}
function IconButton({
  onClick,
  title,
  danger = false,
  children
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      title,
      "aria-label": title,
      className: `flex h-9 w-9 items-center justify-center text-[var(--iko-stone-whisper)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] ${danger ? "hover:text-[var(--iko-error)]" : "hover:text-[var(--iko-accent)]"}`,
      children
    }
  );
}
function EmptyMethods({ onAdd }) {
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-5 border-y border-[var(--iko-stone-hairline)] py-16", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Sin tarjetas" }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[42ch] font-display text-[1.5rem] leading-[1.15] text-[var(--iko-stone-ink)]", children: "Aún no has guardado tarjetas." }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: "Guarda una tarjeta para hacer pedidos en un paso. Los datos se almacenan de forma segura en Stripe." }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: onAdd,
        className: "inline-flex h-12 items-center gap-2 bg-[var(--iko-accent)] px-7 text-[14px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]",
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4", strokeWidth: 1.5 }),
          "Agregar tarjeta"
        ]
      }
    ) })
  ] });
}
function AddCardModal({
  stripeKey,
  onClose,
  onError
}) {
  const [submitting, setSubmitting] = useState(false);
  const [stripe, setStripe] = useState(null);
  const cardElementRef = useRef(null);
  const cardElementInstance = useRef(null);
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const stripeInstance = await loadStripe(stripeKey);
        if (!stripeInstance || cancelled) {
          return;
        }
        setStripe(stripeInstance);
        const cardElement = stripeInstance.elements().create("card", {
          style: {
            base: {
              fontSize: "15px",
              color: "#0d262e",
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
              "::placeholder": { color: "#7a7a7a" }
            }
          }
        });
        cardElementInstance.current = cardElement;
        if (cardElementRef.current) {
          cardElement.mount(cardElementRef.current);
        }
      } catch {
        onError("Error al inicializar el sistema de pagos.");
      }
    }
    init();
    return () => {
      cancelled = true;
      if (cardElementInstance.current) {
        cardElementInstance.current.unmount();
        cardElementInstance.current = null;
      }
    };
  }, [stripeKey, onError]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !cardElementInstance.current) {
      return;
    }
    setSubmitting(true);
    try {
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElementInstance.current
      });
      if (stripeError) {
        onError(stripeError.message || "Error al procesar la tarjeta.");
        setSubmitting(false);
        return;
      }
      router.post(
        "/account/payment-methods",
        {
          payment_method_id: paymentMethod.id,
          set_as_default: true
        },
        {
          preserveScroll: true,
          onSuccess: () => onClose(),
          onError: () => onError("No fue posible agregar la tarjeta."),
          onFinish: () => setSubmitting(false)
        }
      );
    } catch {
      onError("Error de conexión. Intenta nuevamente.");
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "card-modal-heading",
      className: "fixed inset-0 z-50 flex items-center justify-center bg-[var(--iko-stone-ink)]/40 p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "w-full max-w-[28rem] border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] shadow-[0_24px_60px_-20px_rgba(13,38,46,0.25)]",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between border-b border-[var(--iko-stone-hairline)] px-6 py-5", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: "card-modal-heading",
                  className: "font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]",
                  children: "Nueva tarjeta"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]",
                  "aria-label": "Cerrar",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", strokeWidth: 1.5 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5 p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx("label", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Datos de la tarjeta" }),
                /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] px-4 py-3.5", children: /* @__PURE__ */ jsx("div", { ref: cardElementRef }) }),
                /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]", children: "Procesado de forma segura por Stripe." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "flex-1 border border-[var(--iko-stone-hairline)] py-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)]",
                    children: "Cancelar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: submitting || !stripe,
                    className: "flex-1 bg-[var(--iko-accent)] py-3 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] disabled:opacity-60",
                    children: submitting ? "Guardando…" : "Agregar tarjeta"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
export {
  PaymentMethods as default
};
