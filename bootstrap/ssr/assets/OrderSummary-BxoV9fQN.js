import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
function SummaryContent({
  items,
  totalAmount,
  shippingCost
}) {
  const subtotal = totalAmount - shippingCost;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("ul", { className: "divide-y divide-[var(--iko-stone-hairline)]", children: items.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-baseline justify-between gap-3 py-3", children: [
      /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1 truncate text-[13px] text-[var(--iko-stone-ink)]", children: [
        item.product_name,
        /* @__PURE__ */ jsxs("span", { className: "ml-2 font-spec text-[11px] tabular-nums text-[var(--iko-stone-whisper)]", children: [
          "×",
          item.quantity
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "shrink-0 font-spec text-[12px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(item.subtotal) })
    ] }, item.id)) }),
    /* @__PURE__ */ jsxs("dl", { className: "border-t border-[var(--iko-stone-hairline)] py-3", children: [
      /* @__PURE__ */ jsx(SummaryRow, { label: "Subtotal", value: formatCurrency(subtotal) }),
      /* @__PURE__ */ jsx(SummaryRow, { label: "Envío", value: formatCurrency(shippingCost) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] py-3", children: [
      /* @__PURE__ */ jsx("dt", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Total" }),
      /* @__PURE__ */ jsx("dd", { className: "font-spec text-[1.125rem] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(totalAmount) })
    ] })
  ] });
}
function OrderSummary({
  items,
  totalAmount,
  shippingCost,
  showCard = true
}) {
  if (!showCard) {
    return /* @__PURE__ */ jsx(
      SummaryContent,
      {
        items,
        totalAmount,
        shippingCost
      }
    );
  }
  return /* @__PURE__ */ jsxs("aside", { className: "border border-[var(--iko-stone-hairline)] lg:sticky lg:top-24", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] px-5 py-4", children: [
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "Resumen" }),
      /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
        items.length,
        " ",
        items.length === 1 ? "producto" : "productos"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5", children: /* @__PURE__ */ jsx(
      SummaryContent,
      {
        items,
        totalAmount,
        shippingCost
      }
    ) })
  ] });
}
function SummaryRow({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between py-1.5", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-[13px] text-[var(--iko-stone-whisper)]", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "font-spec text-[13px] tabular-nums text-[var(--iko-stone-ink)]", children: value })
  ] });
}
export {
  OrderSummary as O
};
