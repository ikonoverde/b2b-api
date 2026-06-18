import { jsxs, jsx } from "react/jsx-runtime";
import { Package } from "lucide-react";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
function OrderItemsTable({ order }) {
  const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: [
      "Productos (",
      order.items.length,
      ")"
    ] }) }),
    /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5]", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Producto" }) }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-6 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Precio" }) }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-6 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Cant." }) }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-6 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Subtotal" }) })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: order.items.map((item) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5]", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          item.image ? /* @__PURE__ */ jsx("img", { src: item.image, alt: item.product_name, className: "w-10 h-10 rounded-lg object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-gray-400" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: item.product_name })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: formatCurrency(item.unit_price) }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: item.quantity }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: formatCurrency(item.subtotal) }) })
      ] }, item.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 flex flex-col gap-2 border-t border-[#E5E5E5]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-[Outfit]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#999999]", children: "Subtotal" }),
        /* @__PURE__ */ jsx("span", { className: "text-[#1A1A1A]", children: formatCurrency(subtotal) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-[Outfit]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#999999]", children: "Envio" }),
        /* @__PURE__ */ jsx("span", { className: "text-[#1A1A1A]", children: formatCurrency(order.shipping_cost) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-semibold font-[Outfit] pt-2 border-t border-[#E5E5E5]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#1A1A1A]", children: "Total" }),
        /* @__PURE__ */ jsx("span", { className: "text-[#1A1A1A]", children: formatCurrency(order.total_amount) })
      ] }),
      order.refunded_amount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-[Outfit]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "Reembolsado" }),
        /* @__PURE__ */ jsxs("span", { className: "text-red-600", children: [
          "-",
          formatCurrency(order.refunded_amount)
        ] })
      ] })
    ] })
  ] });
}
export {
  OrderItemsTable as default
};
