import { jsxs, jsx } from "react/jsx-runtime";
import { useState, Suspense, lazy } from "react";
import { Deferred } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown-Dkkibk0Y.js";
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
    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Fórmula" }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: onToggle,
        className: "h-11 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsx("span", { className: formulaId ? "text-foreground" : "text-muted-foreground", children: selectedFormula?.name || "Sin fórmula" }),
          /* @__PURE__ */ jsx(ChevronDown, { className: "w-[18px] h-[18px] text-muted-foreground" })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-10 max-h-48 overflow-y-auto", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onSelect(""),
          className: "w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted transition-colors",
          children: "Sin fórmula"
        }
      ),
      formulas.map((formula) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onSelect(String(formula.id)),
          className: "w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors",
          children: formula.name
        },
        formula.id
      ))
    ] }),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: error })
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Información Básica" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Nombre del Producto" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            placeholder: "Ej: Camiseta Básica Algodón",
            className: "h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
          }
        ),
        errors.name && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "SKU / Código" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.sku,
              onChange: (e) => setData("sku", e.target.value),
              placeholder: "Ej: CAM-BAS-001",
              className: "h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
            }
          ),
          errors.sku && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.sku })
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
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Fórmula" }),
        /* @__PURE__ */ jsx("div", { className: "h-11 bg-background rounded-lg border border-border animate-pulse" })
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
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Slug (URL amigable)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.slug,
            onChange: (e) => setData("slug", e.target.value),
            placeholder: "ej: fertilizante-premium",
            className: "h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
          }
        ),
        errors.slug && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.slug }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "URL: /products/",
          data.slug || "slug-del-producto"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Descripción (Markdown)" }),
        /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-[300px] bg-background rounded-lg border border-border animate-pulse" }),
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
        errors.description && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Ingredientes activos (Markdown)" }),
        /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-[220px] bg-background rounded-lg border border-border animate-pulse" }),
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
        errors.active_ingredients && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.active_ingredients })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Recomendaciones (Markdown)" }),
        /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-[220px] bg-background rounded-lg border border-border animate-pulse" }),
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
        errors.recommendations && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.recommendations })
      ] })
    ] })
  ] });
}
export {
  BasicInfoCard as default
};
