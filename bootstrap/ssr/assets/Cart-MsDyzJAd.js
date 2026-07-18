import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, router, Link } from "@inertiajs/react";
import { X, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { C as CustomerShell } from "./CustomerShell-BPYHgCcv.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import "./SiteFooter-BfzQHT4y.js";
function CartPage({ cart }) {
  const { flash } = usePage().props;
  const [warningsDismissed, setWarningsDismissed] = useState(false);
  const isEmpty = cart.items.length === 0;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  function clearCart() {
    if (!confirm("¿Vaciar todo el carrito?")) {
      return;
    }
    router.delete("/cart", { preserveScroll: true });
  }
  return /* @__PURE__ */ jsxs(CustomerShell, { title: "Carrito", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "01 · Carrito" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: "Tu pedido" }),
        !isEmpty && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: clearCart,
            className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase transition-colors hover:text-[var(--iko-error)]",
            children: "Vaciar carrito"
          }
        )
      ] }),
      !isEmpty && /* @__PURE__ */ jsxs("p", { className: "max-w-[58ch] font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
        itemCount,
        " ",
        itemCount === 1 ? "unidad" : "unidades",
        " ·",
        " ",
        cart.items.length,
        " ",
        cart.items.length === 1 ? "producto" : "productos"
      ] })
    ] }),
    flash.reorder_warnings && !warningsDismissed && /* @__PURE__ */ jsx(
      ReorderWarningPanel,
      {
        warnings: flash.reorder_warnings,
        onDismiss: () => setWarningsDismissed(true)
      }
    ),
    isEmpty ? /* @__PURE__ */ jsx(EmptyCart, {}) : /* @__PURE__ */ jsxs("div", { className: "mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]", children: [
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "cart-items-heading", children: [
        /* @__PURE__ */ jsx("h2", { id: "cart-items-heading", className: "sr-only", children: "Artículos en el carrito" }),
        /* @__PURE__ */ jsx("ol", { className: "border-t border-[var(--iko-stone-hairline)]", children: cart.items.map((item, idx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(CartLineRow, { item, index: idx + 1 }) }, item.id)) })
      ] }),
      /* @__PURE__ */ jsx("aside", { "aria-labelledby": "cart-summary-heading", children: /* @__PURE__ */ jsx(SummaryPanel, { cart }) })
    ] })
  ] });
}
function CartLineRow({ item, index }) {
  function updateQuantity(newQty) {
    if (newQty < 1) {
      return;
    }
    router.post(`/cart/items/${item.id}`, { quantity: newQty }, { preserveScroll: true });
  }
  function remove() {
    router.delete(`/cart/items/${item.id}`, { preserveScroll: true });
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[2.5rem_4.5rem_1fr_auto] items-center gap-4 border-b border-[var(--iko-stone-hairline)] py-6 sm:grid-cols-[3rem_5rem_1fr_auto_auto] sm:gap-6", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-accent)]", children: String(index).padStart(2, "0") }),
    /* @__PURE__ */ jsx("div", { className: "h-16 w-16 shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40 sm:h-20 sm:w-20", children: item.image ? /* @__PURE__ */ jsx(
      "img",
      {
        src: item.image,
        alt: "",
        className: "h-full w-full object-cover",
        loading: "lazy"
      }
    ) : null }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx("span", { className: "font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]", children: item.name }),
      /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]", children: [
        formatCurrency(item.price),
        " / unidad"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 flex items-center sm:hidden", children: /* @__PURE__ */ jsx(
        QuantityStepper,
        {
          quantity: item.quantity,
          onIncrement: () => updateQuantity(item.quantity + 1),
          onDecrement: () => updateQuantity(item.quantity - 1)
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsx(
      QuantityStepper,
      {
        quantity: item.quantity,
        onIncrement: () => updateQuantity(item.quantity + 1),
        onDecrement: () => updateQuantity(item.quantity - 1)
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(item.subtotal) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: remove,
          className: "text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-error)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
          "aria-label": `Quitar ${item.name} del carrito`,
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", strokeWidth: 1.5 })
        }
      )
    ] })
  ] });
}
function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement
}) {
  return /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center border border-[var(--iko-stone-hairline)]", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onDecrement,
        disabled: quantity <= 1,
        className: "flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
        "aria-label": "Reducir cantidad",
        children: /* @__PURE__ */ jsx(Minus, { className: "h-3.5 w-3.5", strokeWidth: 1.5 })
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "flex h-9 min-w-[3rem] items-center justify-center border-x border-[var(--iko-stone-hairline)] font-spec text-[13px] tabular-nums text-[var(--iko-stone-ink)]", children: quantity }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onIncrement,
        className: "flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
        "aria-label": "Aumentar cantidad",
        children: /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5", strokeWidth: 1.5 })
      }
    )
  ] });
}
function SummaryPanel({ cart }) {
  return /* @__PURE__ */ jsxs("div", { className: "border border-[var(--iko-stone-hairline)] lg:sticky lg:top-24", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-[var(--iko-stone-hairline)] px-6 py-5", children: /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "Resumen" }) }),
    /* @__PURE__ */ jsxs("dl", { className: "flex flex-col px-6 py-5", children: [
      /* @__PURE__ */ jsx(SummaryRow, { label: "Subtotal", value: formatCurrency(cart.totals.subtotal) }),
      /* @__PURE__ */ jsx(
        SummaryRow,
        {
          label: "Envío",
          value: cart.totals.shipping === null ? "A calcular" : formatCurrency(cart.totals.shipping),
          muted: cart.totals.shipping === null
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] px-6 py-5", children: [
      /* @__PURE__ */ jsx("dt", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Total" }),
      /* @__PURE__ */ jsx("dd", { className: "font-spec text-[1.25rem] tabular-nums text-[var(--iko-stone-ink)]", children: cart.totals.total === null ? "—" : formatCurrency(cart.totals.total) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-[var(--iko-stone-hairline)] p-6", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/checkout/shipping",
          className: "flex h-12 w-full items-center justify-center bg-[var(--iko-accent)] text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
          children: "Continuar al envío"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/catalog",
          className: "mt-3 inline-flex w-full items-baseline justify-center gap-2 text-[13px] text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]",
          children: "Seguir comprando"
        }
      )
    ] })
  ] });
}
function SummaryRow({
  label,
  value,
  muted = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between py-2", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-[13px] text-[var(--iko-stone-whisper)]", children: label }),
    /* @__PURE__ */ jsx(
      "dd",
      {
        className: `font-spec text-[13px] tabular-nums ${muted ? "text-[var(--iko-stone-whisper)]" : "text-[var(--iko-stone-ink)]"}`,
        children: value
      }
    )
  ] });
}
function EmptyCart() {
  return /* @__PURE__ */ jsxs("section", { className: "mt-16 flex flex-col gap-6 border-y border-[var(--iko-stone-hairline)] py-20", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Sin productos" }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[42ch] font-display text-[1.875rem] leading-[1.15] text-[var(--iko-stone-ink)]", children: "Tu carrito está vacío." }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[52ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: "Agrega productos desde el catálogo para empezar tu pedido. Compra desde una unidad, sin mínimos." }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Link,
      {
        href: "/catalog",
        className: "inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
        children: "Explorar catálogo"
      }
    ) })
  ] });
}
const reasonLabels = {
  out_of_stock: "Sin existencias",
  product_unavailable: "Producto no disponible"
};
function ReorderWarningPanel({
  warnings,
  onDismiss
}) {
  return /* @__PURE__ */ jsx("div", { className: "mt-10 border-l-0 border-y border-r border-[var(--iko-stone-hairline)] bg-[var(--iko-accent-soft)]", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[auto_1fr_auto] gap-5 px-6 py-5", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: "Aviso" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx(
        WarningSection,
        {
          title: "Productos no disponibles",
          items: warnings.unavailable,
          renderDetail: (item) => /* @__PURE__ */ jsx("span", { children: reasonLabels[item.reason] ?? item.reason })
        }
      ),
      /* @__PURE__ */ jsx(
        WarningSection,
        {
          title: "Precios actualizados",
          items: warnings.price_changes,
          renderDetail: (item) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "font-spec tabular-nums text-[var(--iko-stone-whisper)] line-through", children: formatCurrency(item.original_price) }),
            /* @__PURE__ */ jsx("span", { className: "text-[var(--iko-stone-whisper)]", children: "→" }),
            /* @__PURE__ */ jsx("span", { className: "font-spec tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(item.current_price) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onDismiss,
        className: "text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-stone-ink)]",
        "aria-label": "Cerrar aviso",
        children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", strokeWidth: 1.5 })
      }
    )
  ] }) });
}
function WarningSection({
  title,
  items,
  renderDetail
}) {
  if (items.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-ink)] uppercase", children: title }),
    /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1.5", children: items.map((item) => /* @__PURE__ */ jsxs(
      "li",
      {
        className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13px] text-[var(--iko-stone-ink)]",
        children: [
          /* @__PURE__ */ jsx("span", { children: item.product_name }),
          /* @__PURE__ */ jsx("span", { className: "text-[var(--iko-stone-whisper)]", children: "·" }),
          renderDetail(item)
        ]
      },
      item.product_id
    )) })
  ] });
}
export {
  CartPage as default
};
