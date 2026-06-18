import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { Save } from "lucide-react";
function ProductFormHeader({
  title,
  breadcrumbLabel,
  submitLabel,
  processing
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]", children: title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-[Outfit]", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/admin/products",
            className: "text-[#999999] hover:text-[#666666] transition-colors",
            children: "Productos"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-[#999999]", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-[#666666]", children: breadcrumbLabel })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/admin/products",
          className: "flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-gray-50 transition-colors",
          children: "Cancelar"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "flex items-center gap-2 px-5 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx(Save, { className: "w-[18px] h-[18px]" }),
            submitLabel
          ]
        }
      )
    ] })
  ] });
}
export {
  ProductFormHeader as default
};
