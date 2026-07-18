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
      /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/admin/products",
            className: "text-muted-foreground hover:text-muted-foreground transition-colors",
            children: "Productos"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: breadcrumbLabel })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/admin/products",
          className: "flex items-center justify-center px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors",
          children: "Cancelar"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "flex items-center gap-2 px-5 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50",
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
