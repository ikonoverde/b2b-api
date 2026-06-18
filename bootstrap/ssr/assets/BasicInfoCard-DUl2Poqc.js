import { jsxs, jsx } from "react/jsx-runtime";
import { useState, Suspense, lazy } from "react";
import { Deferred } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown-LCDDgS9l.js";
function FormulaDropdown({
  formulaId,
  formulas,
  isOpen,
  onToggle,
  onSelect,
  error
}) {
  const selectedFormula = formulas.find((f) => String(f.id) === formulaId);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 relative", children: [
    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Fórmula" }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: onToggle,
        className: "h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsx("span", { className: formulaId ? "text-[#1A1A1A]" : "text-[#999999]", children: selectedFormula?.name || "Sin fórmula" }),
          /* @__PURE__ */ jsx(ChevronDown, { className: "w-[18px] h-[18px] text-[#999999]" })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-10 max-h-48 overflow-y-auto", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onSelect(""),
          className: "w-full px-4 py-2.5 text-left text-sm text-[#999999] font-[Outfit] hover:bg-[#F5F3F0] transition-colors",
          children: "Sin fórmula"
        }
      ),
      formulas.map((formula) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onSelect(String(formula.id)),
          className: "w-full px-4 py-2.5 text-left text-sm text-[#1A1A1A] font-[Outfit] hover:bg-[#F5F3F0] transition-colors",
          children: formula.name
        },
        formula.id
      ))
    ] }),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: error })
  ] });
}
const MDEditor = lazy(() => import("@uiw/react-md-editor"));
function BasicInfoCard({
  data,
  setData,
  errors,
  categories,
  formulas
}) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Información Básica" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Nombre del Producto" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            placeholder: "Ej: Camiseta Básica Algodón",
            className: "h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
          }
        ),
        errors.name && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "SKU / Código" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.sku,
              onChange: (e) => setData("sku", e.target.value),
              placeholder: "Ej: CAM-BAS-001",
              className: "h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
            }
          ),
          errors.sku && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.sku })
        ] }),
        /* @__PURE__ */ jsx(
          CategoryDropdown,
          {
            categoryId: data.category_id,
            categories,
            isOpen: categoryOpen,
            onToggle: () => setCategoryOpen(!categoryOpen),
            onSelect: (id) => {
              setData("category_id", id);
              setCategoryOpen(false);
            },
            error: errors.category_id
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Deferred, { data: "formulas", fallback: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Fórmula" }),
        /* @__PURE__ */ jsx("div", { className: "h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] animate-pulse" })
      ] }), children: /* @__PURE__ */ jsx(
        FormulaDropdown,
        {
          formulaId: data.formula_id,
          formulas,
          isOpen: formulaOpen,
          onToggle: () => setFormulaOpen(!formulaOpen),
          onSelect: (id) => {
            setData("formula_id", id);
            setFormulaOpen(false);
          },
          error: errors.formula_id
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Slug (URL amigable)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.slug,
            onChange: (e) => setData("slug", e.target.value),
            placeholder: "ej: fertilizante-premium",
            className: "h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
          }
        ),
        errors.slug && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.slug }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#999999] font-[Outfit]", children: [
          "URL: /products/",
          data.slug || "slug-del-producto"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Descripción (Markdown)" }),
        /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-[300px] bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] animate-pulse" }),
            children: /* @__PURE__ */ jsx("div", { "data-color-mode": "light", children: /* @__PURE__ */ jsx(
              MDEditor,
              {
                value: data.description,
                onChange: (val) => setData("description", val || ""),
                height: 300
              }
            ) })
          }
        ),
        errors.description && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Ingredientes activos (Markdown)" }),
        /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-[220px] bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] animate-pulse" }),
            children: /* @__PURE__ */ jsx("div", { "data-color-mode": "light", children: /* @__PURE__ */ jsx(
              MDEditor,
              {
                value: data.active_ingredients,
                onChange: (val) => setData("active_ingredients", val || ""),
                height: 220
              }
            ) })
          }
        ),
        errors.active_ingredients && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.active_ingredients })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Recomendaciones (Markdown)" }),
        /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-[220px] bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] animate-pulse" }),
            children: /* @__PURE__ */ jsx("div", { "data-color-mode": "light", children: /* @__PURE__ */ jsx(
              MDEditor,
              {
                value: data.recommendations,
                onChange: (val) => setData("recommendations", val || ""),
                height: 220
              }
            ) })
          }
        ),
        errors.recommendations && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.recommendations })
      ] })
    ] })
  ] });
}
export {
  BasicInfoCard as default
};
