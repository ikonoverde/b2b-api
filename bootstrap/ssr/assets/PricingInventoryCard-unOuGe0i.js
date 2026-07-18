import { jsxs, jsx } from "react/jsx-runtime";
function PricingInventoryCard({
  data,
  setData,
  errors
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Precios e Inventario" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Precio de Venta" }),
          /* @__PURE__ */ jsxs("div", { className: "flex h-11 bg-background rounded-lg border border-border overflow-hidden focus-within:border-primary transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center px-3 bg-muted border-r border-border", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "$" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.price,
                onChange: (e) => setData("price", e.target.value),
                placeholder: "0.00",
                className: "flex-1 px-3 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
              }
            )
          ] }),
          errors.price && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.price })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Precio de Costo" }),
          /* @__PURE__ */ jsxs("div", { className: "flex h-11 bg-background rounded-lg border border-border overflow-hidden focus-within:border-primary transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center px-3 bg-muted border-r border-border", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "$" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.cost,
                onChange: (e) => setData("cost", e.target.value),
                placeholder: "0.00",
                className: "flex-1 px-3 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
              }
            )
          ] }),
          errors.cost && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.cost })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Stock Disponible" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.stock,
              onChange: (e) => setData("stock", e.target.value),
              placeholder: "0",
              className: "h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
            }
          ),
          errors.stock && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.stock })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Stock Mínimo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.min_stock,
              onChange: (e) => setData("min_stock", e.target.value),
              placeholder: "0",
              className: "h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
            }
          ),
          errors.min_stock && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.min_stock })
        ] })
      ] })
    ] })
  ] });
}
export {
  PricingInventoryCard as default
};
