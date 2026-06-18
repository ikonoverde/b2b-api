import { jsxs, jsx } from "react/jsx-runtime";
function PricingInventoryCard({
  data,
  setData,
  errors
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Precios e Inventario" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Precio de Venta" }),
          /* @__PURE__ */ jsxs("div", { className: "flex h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center px-3 bg-[#F5F3F0] border-r border-[#E5E5E5]", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: "$" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.price,
                onChange: (e) => setData("price", e.target.value),
                placeholder: "0.00",
                className: "flex-1 px-3 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
              }
            )
          ] }),
          errors.price && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.price })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Precio de Costo" }),
          /* @__PURE__ */ jsxs("div", { className: "flex h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center px-3 bg-[#F5F3F0] border-r border-[#E5E5E5]", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: "$" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.cost,
                onChange: (e) => setData("cost", e.target.value),
                placeholder: "0.00",
                className: "flex-1 px-3 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
              }
            )
          ] }),
          errors.cost && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.cost })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Stock Disponible" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.stock,
              onChange: (e) => setData("stock", e.target.value),
              placeholder: "0",
              className: "h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
            }
          ),
          errors.stock && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.stock })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Stock Mínimo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.min_stock,
              onChange: (e) => setData("min_stock", e.target.value),
              placeholder: "0",
              className: "h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
            }
          ),
          errors.min_stock && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.min_stock })
        ] })
      ] })
    ] })
  ] });
}
export {
  PricingInventoryCard as default
};
