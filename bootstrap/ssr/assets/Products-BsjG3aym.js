import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { Search, Bell, Settings, ChevronDown, Download, Plus, Package, MoreHorizontal, Trash2, AlertTriangle } from "lucide-react";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const tabs = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "inactive", label: "Inactivos" },
  { id: "low_stock", label: "Stock bajo" }
];
function useProductFilters(products) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const filteredProducts = products.filter((product) => {
    const matchesTab = activeTab === "all" || product.status === activeTab;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });
  const handleDelete = (product) => {
    setDeleteModal({ isOpen: true, product });
  };
  const confirmDelete = () => {
    if (deleteModal.product) {
      router.delete(`/admin/products/${deleteModal.product.id}`, {
        onSuccess: () => {
          setDeleteModal({ isOpen: false, product: null });
        }
      });
    }
  };
  const closeModal = () => {
    setDeleteModal({ isOpen: false, product: null });
  };
  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    deleteModal,
    filteredProducts,
    handleDelete,
    confirmDelete,
    closeModal
  };
}
function Products({ products }) {
  const { auth } = usePage().props;
  const user = auth.user;
  const pf = useProductFilters(products);
  return /* @__PURE__ */ jsx(AppLayout, { title: "Productos", active: "products", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]", children: "Productos" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666] font-[Outfit]", children: "Gestiona tu catálogo de productos" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-60 h-11 px-4 bg-white rounded-lg border border-[#E5E5E5]", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-[18px] h-[18px] text-[#999999]" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Buscar...",
              value: pf.searchQuery,
              onChange: (e) => pf.setSearchQuery(e.target.value),
              className: "flex-1 text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] bg-transparent border-none outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { className: "w-11 h-11 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors", children: /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5 text-[#666666]" }) }),
        /* @__PURE__ */ jsx("button", { className: "w-11 h-11 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors", children: /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-[#666666]" }) }),
        /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-3 pl-1.5 pr-3 py-1.5 bg-white rounded-full border border-[#E5E5E5] hover:bg-gray-50 transition-colors", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-[#4A5D4A] rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white font-[Outfit]", children: user?.initials?.[0] || "A" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: user?.name?.split(" ")[0] || "Admin" }),
          /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-[#999999]" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 bg-[#F5F5F5] rounded-lg p-1", children: tabs.map((tab) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => pf.setActiveTab(tab.id),
          className: `px-4 py-2 rounded-md text-[13px] font-medium font-[Outfit] transition-colors ${pf.activeTab === tab.id ? "bg-[#4A5D4A] text-white" : "text-[#666666] hover:bg-white/50"}`,
          children: tab.label
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-[13px] font-medium text-[#666666] font-[Outfit] hover:bg-gray-50 transition-colors", children: [
          /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
          "Exportar"
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/admin/products/create",
            className: "flex items-center gap-2 px-4 py-2.5 bg-[#4A5D4A] rounded-lg text-[13px] font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "Agregar producto"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-visible", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 rounded-t-2xl border-b border-[#E5E5E5] bg-[#FAFAFA] px-6 py-4", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[13px] font-medium text-[#666666] font-[Outfit]", children: "Producto" }),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] font-medium text-[#666666] font-[Outfit]", children: "Categoría" }),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] font-medium text-[#666666] font-[Outfit]", children: "Precio" }),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] font-medium text-[#666666] font-[Outfit]", children: "Stock" }),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] font-medium text-[#666666] font-[Outfit]", children: "Estado" }),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] font-medium text-[#666666] font-[Outfit]", children: "Acción" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y divide-[#E5E5E5]", children: pf.filteredProducts.map((product) => /* @__PURE__ */ jsx(
        ProductRow,
        {
          product,
          onDelete: pf.handleDelete
        },
        product.id
      )) }),
      pf.filteredProducts.length === 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-3", children: [
        /* @__PURE__ */ jsx(Package, { className: "w-12 h-12 text-[#999999]" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#999999] font-[Outfit]", children: "No se encontraron productos" })
      ] })
    ] }),
    pf.deleteModal.isOpen && pf.deleteModal.product && /* @__PURE__ */ jsx(
      DeleteProductModal,
      {
        product: pf.deleteModal.product,
        onConfirm: pf.confirmDelete,
        onClose: pf.closeModal
      }
    )
  ] }) });
}
function DeleteProductModal({ product, onConfirm, onClose }) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-6 h-6 text-red-600" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Archivar Producto" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#666666] font-[Outfit] mt-1", children: [
          "¿Estás seguro de que quieres archivar ",
          /* @__PURE__ */ jsx("strong", { children: product.name }),
          "?"
        ] }),
        product.has_pending_orders && /* @__PURE__ */ jsx("div", { className: "mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-700 font-[Outfit] flex items-start gap-2", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsx("span", { children: "Este producto tiene pedidos pendientes. No se puede archivar hasta que todos los pedidos estén completados o cancelados." })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#999999] font-[Outfit] mt-2", children: "Este producto se ocultará del catálogo pero permanecerá visible en los pedidos históricos." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 mt-6", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "px-4 py-2 text-sm font-medium text-[#666666] font-[Outfit] hover:bg-gray-100 rounded-lg transition-colors", children: "Cancelar" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onConfirm,
          disabled: product.has_pending_orders,
          className: "px-4 py-2 text-sm font-medium text-white font-[Outfit] bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:bg-red-300 disabled:cursor-not-allowed",
          children: "Archivar"
        }
      )
    ] })
  ] }) });
}
function ProductRow({ product, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusConfig = {
    active: {
      label: "Activo",
      bg: "#E8F5E9",
      color: "#4CAF50"
    },
    inactive: {
      label: "Inactivo",
      bg: "#F5F5F5",
      color: "#999999"
    },
    low_stock: {
      label: "Stock bajo",
      bg: "#FFF3E0",
      color: "#FF9800"
    }
  };
  const status = statusConfig[product.status];
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 px-6 py-4 items-center hover:bg-[#FAFAFA] transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center", children: product.image ? /* @__PURE__ */ jsx(
        "img",
        {
          src: product.image,
          alt: product.name,
          className: "w-full h-full rounded-full object-cover"
        }
      ) : /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-[#999999]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/admin/products/${product.id}/edit`,
            className: "text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:text-[#4A5D4A] hover:underline underline-offset-2 transition-colors",
            children: product.name
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: product.sku })
      ] })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: product.category }),
    /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: [
      "$",
      product.price.toFixed(2)
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666] font-[Outfit]", children: product.stock.toLocaleString() }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      "span",
      {
        className: "inline-flex px-3 py-1 rounded-full text-xs font-medium font-[Outfit]",
        style: { backgroundColor: status.bg, color: status.color },
        children: status.label
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMenuOpen(!menuOpen),
          onBlur: () => setTimeout(() => setMenuOpen(false), 150),
          className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5] transition-colors",
          children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-5 h-5 text-[#999999]" })
        }
      ),
      menuOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full z-10 mt-1 min-w-[140px] overflow-hidden rounded-lg border border-[#E5E5E5] bg-white shadow-lg", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/admin/products/${product.id}/edit`,
            className: "block px-4 py-2.5 text-sm text-[#1A1A1A] font-[Outfit] hover:bg-[#F5F3F0] transition-colors",
            children: "Editar"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onDelete(product),
            className: "w-full text-left px-4 py-2.5 text-sm text-red-600 font-[Outfit] hover:bg-red-50 transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
              "Archivar"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  Products as default
};
