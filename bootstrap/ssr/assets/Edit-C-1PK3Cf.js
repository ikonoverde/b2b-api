import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-ca4ZqyB9.js";
import ProductFormHeader from "./ProductFormHeader-B-3p6RCs.js";
import BasicInfoCard from "./BasicInfoCard-DUl2Poqc.js";
import PricingInventoryCard from "./PricingInventoryCard-C7okmkMR.js";
import ShippingDimensionsCard from "./ShippingDimensionsCard-mTz3hsad.js";
import ImageSection from "./ImageSection-CSsqV-Zx.js";
import StatusCard from "./StatusCard-Cy1NVGJC.js";
import "lucide-react";
import "./CategoryDropdown-LCDDgS9l.js";
import "./ToggleSwitch-CFm40GDN.js";
function Edit({ product, categories, formulas }) {
  const [existingImages, setExistingImages] = useState(product.images);
  const { data, setData, post, processing, errors } = useForm({
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category_id: String(product.category_id),
    formula_id: product.formula_id ? String(product.formula_id) : "",
    description: product.description,
    active_ingredients: product.active_ingredients,
    recommendations: product.recommendations,
    price: product.price,
    cost: product.cost,
    stock: product.stock,
    min_stock: product.min_stock,
    weight_kg: product.weight_kg,
    width_cm: product.width_cm,
    height_cm: product.height_cm,
    depth_cm: product.depth_cm,
    shipping_packages: product.shipping_packages,
    is_active: product.is_active,
    is_featured: product.is_featured,
    images: [],
    delete_images: [],
    _method: "put"
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/products/${product.id}`);
  };
  const removeExistingImage = (id) => {
    setExistingImages(existingImages.filter((img) => img.id !== id));
    setData("delete_images", [...data.delete_images ?? [], id]);
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Editar Producto", active: "products", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-8 p-10 pr-12", children: [
    /* @__PURE__ */ jsx(
      ProductFormHeader,
      {
        title: "Editar Producto",
        breadcrumbLabel: "Editar Producto",
        submitLabel: "Actualizar Producto",
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
            onImagesChange: (images) => setData("images", images),
            existingImages,
            onExistingImageRemove: removeExistingImage
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
  Edit as default
};
