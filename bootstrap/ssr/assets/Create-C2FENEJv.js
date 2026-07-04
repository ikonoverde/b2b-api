import { jsx, jsxs } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-ca4ZqyB9.js";
import ProductFormHeader from "./ProductFormHeader-B-3p6RCs.js";
import BasicInfoCard from "./BasicInfoCard-DUl2Poqc.js";
import PricingInventoryCard from "./PricingInventoryCard-C7okmkMR.js";
import ShippingDimensionsCard from "./ShippingDimensionsCard-mTz3hsad.js";
import ImageSection from "./ImageSection-CSsqV-Zx.js";
import StatusCard from "./StatusCard-Cy1NVGJC.js";
import "lucide-react";
import "react";
import "./CategoryDropdown-LCDDgS9l.js";
import "./ToggleSwitch-CFm40GDN.js";
function Create({ categories, formulas }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    slug: "",
    sku: "",
    category_id: "",
    formula_id: "",
    description: "",
    active_ingredients: "",
    recommendations: "",
    price: "",
    cost: "",
    stock: "",
    min_stock: "",
    weight_kg: "",
    width_cm: "",
    height_cm: "",
    depth_cm: "",
    shipping_packages: [],
    is_active: true,
    is_featured: false,
    images: []
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/admin/products");
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Agregar Producto", active: "products", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-8 p-10 pr-12", children: [
    /* @__PURE__ */ jsx(
      ProductFormHeader,
      {
        title: "Agregar Producto",
        breadcrumbLabel: "Agregar Producto",
        submitLabel: "Guardar Producto",
        processing
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-6", children: [
        /* @__PURE__ */ jsx(
          BasicInfoCard,
          {
            data,
            setData,
            errors,
            categories,
            formulas
          }
        ),
        /* @__PURE__ */ jsx(
          PricingInventoryCard,
          {
            data,
            setData,
            errors
          }
        ),
        /* @__PURE__ */ jsx(
          ShippingDimensionsCard,
          {
            data,
            setData,
            errors
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-[400px] flex flex-col gap-6", children: [
        /* @__PURE__ */ jsx(
          ImageSection,
          {
            images: data.images,
            onImagesChange: (images) => setData("images", images)
          }
        ),
        /* @__PURE__ */ jsx(
          StatusCard,
          {
            isActive: data.is_active,
            isFeatured: data.is_featured,
            onToggleActive: () => setData("is_active", !data.is_active),
            onToggleFeatured: () => setData("is_featured", !data.is_featured)
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  Create as default
};
