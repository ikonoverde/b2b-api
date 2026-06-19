import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, router } from "@inertiajs/react";
import { Search, Plus, ArrowUp, ArrowDown, X } from "lucide-react";
import { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-C3u1HoYz.js";
function swapItems(items, indexA, indexB) {
  const updated = [...items];
  [updated[indexA], updated[indexB]] = [updated[indexB], updated[indexA]];
  return updated;
}
function useProductListActions(initialProducts) {
  const [products, setProducts] = useState(initialProducts);
  const [saving, setSaving] = useState(false);
  const moveUp = (index) => {
    if (index === 0) return;
    setProducts(swapItems(products, index - 1, index));
  };
  const moveDown = (index) => {
    if (index === products.length - 1) return;
    setProducts(swapItems(products, index, index + 1));
  };
  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };
  const addProduct = (product) => {
    setProducts([
      ...products,
      { ...product, image_url: null, featured_order: products.length + 1 }
    ]);
  };
  const save = () => {
    setSaving(true);
    router.put(
      "/admin/featured-products",
      { products: products.map((p, i) => ({ id: p.id, featured_order: i + 1 })) },
      { onFinish: () => setSaving(false) }
    );
  };
  return { products, saving, moveUp, moveDown, removeProduct, addProduct, save };
}
function useProductSearch(availableProducts, currentProducts) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const filteredAvailable = useMemo(
    () => availableProducts.filter((p) => !currentProducts.some((fp) => fp.id === p.id)).filter(
      (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    ),
    [availableProducts, currentProducts, search]
  );
  const resetSearch = () => {
    setSearch("");
    setShowDropdown(false);
  };
  return { search, setSearch, showDropdown, setShowDropdown, filteredAvailable, resetSearch };
}
function FeaturedProducts({ featuredProducts, availableProducts }) {
  const { flash } = usePage().props;
  const listActions = useProductListActions(featuredProducts);
  const searchActions = useProductSearch(availableProducts, listActions.products);
  const handleAddProduct = (product) => {
    listActions.addProduct(product);
    searchActions.resetSearch();
  };
  const manager = {
    ...listActions,
    search: searchActions.search,
    setSearch: searchActions.setSearch,
    showDropdown: searchActions.showDropdown,
    setShowDropdown: searchActions.setShowDropdown,
    filteredAvailable: searchActions.filteredAvailable,
    addProduct: handleAddProduct
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Productos Destacados", active: "featured-products", children: /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1A1A1A] font-[Outfit]", children: "Productos Destacados" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666] font-[Outfit] mt-1", children: "Administra los productos destacados en la página principal" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: manager.save,
          disabled: manager.saving,
          className: "bg-[#4A5D4A] text-white px-6 py-2.5 rounded-lg font-[Outfit] font-medium text-sm hover:bg-[#3d4e3d] transition-colors disabled:opacity-50 cursor-pointer",
          children: manager.saving ? "Guardando..." : "Guardar Cambios"
        }
      )
    ] }),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-[Outfit] text-sm", children: flash.success }),
    /* @__PURE__ */ jsx(
      ProductSearchDropdown,
      {
        search: manager.search,
        showDropdown: manager.showDropdown,
        filteredAvailable: manager.filteredAvailable,
        onSearchChange: (value) => {
          manager.setSearch(value);
          manager.setShowDropdown(true);
        },
        onFocus: () => manager.setShowDropdown(true),
        onAddProduct: manager.addProduct
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border border-[#E5E5E5] divide-y divide-[#E5E5E5]", children: manager.products.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-[#999999] font-[Outfit] text-sm", children: "No hay productos destacados. Usa la búsqueda para agregar productos." }) }) : manager.products.map((product, index) => /* @__PURE__ */ jsx(
      FeaturedProductItem,
      {
        product,
        index,
        total: manager.products.length,
        onMoveUp: () => manager.moveUp(index),
        onMoveDown: () => manager.moveDown(index),
        onRemove: () => manager.removeProduct(index)
      },
      product.id
    )) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-[#999999] font-[Outfit]", children: "Máximo 20 productos. Arrastra para reordenar." })
  ] }) }) });
}
function ProductSearchDropdown({
  search,
  showDropdown,
  filteredAvailable,
  onSearchChange,
  onFocus,
  onAddProduct
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-6 relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-lg px-4 py-3", children: [
      /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-[#999999]" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Buscar producto para agregar...",
          value: search,
          onChange: (e) => onSearchChange(e.target.value),
          onFocus,
          className: "flex-1 bg-transparent outline-none font-[Outfit] text-sm text-[#1A1A1A] placeholder:text-[#999999]"
        }
      )
    ] }),
    showDropdown && search && filteredAvailable.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-10 top-full mt-1 w-full bg-white border border-[#E5E5E5] rounded-lg shadow-lg max-h-60 overflow-y-auto", children: filteredAvailable.slice(0, 10).map((product) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onAddProduct(product),
        className: "w-full px-4 py-3 text-left hover:bg-[#F5F3F0] flex items-center justify-between cursor-pointer",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm text-[#1A1A1A]", children: product.name }),
            /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-xs text-[#999999] ml-2", children: product.sku })
          ] }),
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 text-[#4A5D4A]" })
        ]
      },
      product.id
    )) })
  ] });
}
function FeaturedProductItem({
  product,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [
    /* @__PURE__ */ jsx("span", { className: "w-6 text-center text-sm font-medium text-[#999999] font-[Outfit]", children: index + 1 }),
    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[#F5F3F0] rounded-lg overflow-hidden shrink-0", children: product.image_url ? /* @__PURE__ */ jsx("img", { src: product.image_url, alt: product.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-5 h-5 bg-[#E8E8E8] rounded-full" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: "font-[Outfit] text-sm font-medium text-[#1A1A1A] truncate", children: product.name }),
      /* @__PURE__ */ jsxs("p", { className: "font-[Outfit] text-xs text-[#999999]", children: [
        product.sku,
        product.category && ` · ${product.category}`
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx("button", { onClick: onMoveUp, disabled: index === 0, className: "p-1.5 rounded hover:bg-[#F5F3F0] disabled:opacity-30 cursor-pointer", children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-4 h-4 text-[#666666]" }) }),
      /* @__PURE__ */ jsx("button", { onClick: onMoveDown, disabled: index === total - 1, className: "p-1.5 rounded hover:bg-[#F5F3F0] disabled:opacity-30 cursor-pointer", children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-4 h-4 text-[#666666]" }) }),
      /* @__PURE__ */ jsx("button", { onClick: onRemove, className: "p-1.5 rounded hover:bg-red-50 cursor-pointer", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 text-red-400" }) })
    ] })
  ] });
}
export {
  FeaturedProducts as default
};
