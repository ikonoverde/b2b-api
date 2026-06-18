import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { C as CustomerShell } from "./CustomerShell-D8_I-KnY.js";
import { C as CheckoutStepIndicator } from "./CheckoutStepIndicator-DNQd0npl.js";
import { O as OrderSummary } from "./OrderSummary-BxoV9fQN.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import "@inertiajs/react";
import "lucide-react";
import "./SiteFooter-DIt_Mg7v.js";
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
function formatExpiry(method) {
  return `${String(method.card.exp_month).padStart(2, "0")}/${String(method.card.exp_year).slice(-2)}`;
}
function Payment({ order, client_secret, stripe_key, payment_methods }) {
  const stripePromise = useMemo(() => loadStripe(stripe_key), [stripe_key]);
  return /* @__PURE__ */ jsxs(CustomerShell, { title: "Pago · Compra", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "Compra · Pago" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: "Método de pago" }),
      /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: "Elige una tarjeta guardada o introduce una nueva. Stripe procesa el pago con cifrado." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsx(CheckoutStepIndicator, { currentStep: 2 }) }),
    /* @__PURE__ */ jsx(
      Elements,
      {
        stripe: stripePromise,
        options: {
          clientSecret: client_secret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#0c5e6f",
              colorText: "#0d262e",
              colorBackground: "#f5f3ee",
              borderRadius: "0px",
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
              fontSizeBase: "15px",
              spacingUnit: "4px"
            },
            rules: {
              ".Input": {
                border: "1px solid #d8d6d0",
                boxShadow: "none"
              },
              ".Input:focus": {
                borderColor: "#0c5e6f",
                boxShadow: "0 0 0 1px #0c5e6f"
              },
              ".Tab": {
                border: "1px solid #d8d6d0"
              },
              ".Tab--selected": {
                borderColor: "#0c5e6f",
                color: "#0c5e6f"
              }
            }
          },
          locale: "es"
        },
        children: /* @__PURE__ */ jsx(
          PaymentForm,
          {
            order,
            clientSecret: client_secret,
            paymentMethods: payment_methods
          }
        )
      }
    )
  ] });
}
function PaymentForm({
  order,
  clientSecret,
  paymentMethods
}) {
  const stripe = useStripe();
  const elements = useElements();
  const defaultPaymentMethod = paymentMethods.find((method) => method.is_default);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
    defaultPaymentMethod?.id ?? paymentMethods[0]?.id ?? "new"
  );
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const isUsingNewCard = selectedPaymentMethodId === "new";
  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedPaymentMethodId
  );
  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe) {
      return;
    }
    setProcessing(true);
    setError(null);
    if (!isUsingNewCard) {
      if (!selectedPaymentMethod) {
        setError("Selecciona una tarjeta guardada o usa una tarjeta nueva.");
        setProcessing(false);
        return;
      }
      const { error: savedCardError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: selectedPaymentMethod.id
      });
      if (savedCardError) {
        setError(savedCardError.message ?? "Ocurrió un error al procesar el pago.");
        setProcessing(false);
        return;
      }
      window.location.assign(`/checkout/thank-you?order=${order.id}`);
      return;
    }
    if (!elements) {
      setProcessing(false);
      return;
    }
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/thank-you?order=${order.id}`
      }
    });
    if (submitError) {
      setError(submitError.message ?? "Ocurrió un error al procesar el pago.");
      setProcessing(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
      paymentMethods.length > 0 && /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--iko-stone-hairline)] pb-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]", children: "Tarjetas guardadas" }),
          /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: [
            String(paymentMethods.length).padStart(2, "0"),
            " disponibles"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", role: "radiogroup", "aria-label": "Método de pago", children: [
          paymentMethods.map((method) => /* @__PURE__ */ jsx(
            PaymentMethodOption,
            {
              method,
              selected: selectedPaymentMethodId === method.id,
              onSelect: () => setSelectedPaymentMethodId(method.id)
            },
            method.id
          )),
          /* @__PURE__ */ jsxs(
            "label",
            {
              className: `grid cursor-pointer grid-cols-[auto_1fr] gap-4 border px-5 py-4 transition-colors focus-within:ring-2 focus-within:ring-[var(--iko-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--iko-stone-paper)] ${isUsingNewCard ? "border-[var(--iko-accent)] bg-[var(--iko-accent-soft)]" : "border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] hover:border-[var(--iko-stone-mid)]"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name: "payment_method",
                    value: "new",
                    checked: isUsingNewCard,
                    onChange: () => setSelectedPaymentMethodId("new"),
                    className: "mt-1 h-4 w-4 accent-[var(--iko-accent)]"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-display text-[1.05rem] leading-tight text-[var(--iko-stone-ink)]", children: "Usar otra tarjeta" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[13px] leading-[1.45] text-[var(--iko-stone-ink)]/70", children: "Introduce los datos solo para este pago." })
                ] })
              ]
            }
          )
        ] })
      ] }),
      isUsingNewCard && /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] p-5", children: /* @__PURE__ */ jsx(PaymentElement, {}) }),
      error && /* @__PURE__ */ jsxs("div", { className: "border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-error)] uppercase", children: "Pago no procesado" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-[13px] text-[var(--iko-error)]", children: error })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing || !stripe || isUsingNewCard && !elements,
          className: "flex h-12 w-full items-center justify-center gap-3 bg-[var(--iko-accent)] px-6 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60",
          children: processing ? /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "h-4 w-4 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)]"
            }
          ) : /* @__PURE__ */ jsxs(Fragment, { children: [
            selectedPaymentMethod && !isUsingNewCard ? `Pagar con ${formatCardBrand(selectedPaymentMethod.card.brand)}` : "Pagar",
            /* @__PURE__ */ jsx("span", { className: "font-spec tabular-nums", children: formatCurrency(order.total_amount) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      OrderSummary,
      {
        items: order.items,
        totalAmount: order.total_amount,
        shippingCost: order.shipping_cost
      }
    )
  ] });
}
function PaymentMethodOption({
  method,
  selected,
  onSelect
}) {
  return /* @__PURE__ */ jsxs(
    "label",
    {
      className: `grid cursor-pointer grid-cols-[auto_1fr] gap-4 border px-5 py-4 transition-colors focus-within:ring-2 focus-within:ring-[var(--iko-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--iko-stone-paper)] ${selected ? "border-[var(--iko-accent)] bg-[var(--iko-accent-soft)]" : "border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] hover:border-[var(--iko-stone-mid)]"}`,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name: "payment_method",
            value: method.id,
            checked: selected,
            onChange: onSelect,
            className: "mt-1 h-4 w-4 accent-[var(--iko-accent)]"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex flex-wrap items-baseline gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-[1.05rem] leading-tight text-[var(--iko-stone-ink)]", children: formatCardBrand(method.card.brand) }),
            /* @__PURE__ */ jsxs("span", { className: "font-spec text-[13px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)]", children: [
              "···· ",
              method.card.last4
            ] }),
            method.is_default && /* @__PURE__ */ jsx("span", { className: "font-spec text-[10px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: "Predeterminada" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
            "Vence ",
            formatExpiry(method)
          ] })
        ] })
      ]
    }
  );
}
export {
  Payment as default
};
