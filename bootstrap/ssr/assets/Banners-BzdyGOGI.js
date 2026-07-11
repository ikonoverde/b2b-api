import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, useForm, router } from "@inertiajs/react";
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-Q3nFYZ7E.js";
import { a as formatDateShort } from "./date-ClVPp3mI.js";
const statusConfig = {
  active: { label: "Activo", bg: "bg-green-50", text: "text-green-700" },
  inactive: { label: "Inactivo", bg: "bg-gray-100", text: "text-gray-600" },
  scheduled: { label: "Programado", bg: "bg-blue-50", text: "text-blue-700" },
  expired: { label: "Expirado", bg: "bg-red-50", text: "text-red-700" }
};
const linkTypeLabels = {
  product: "Producto",
  category: "Categoría",
  url: "URL externa"
};
function BannerFormModal({
  form,
  editingBanner,
  onSubmit,
  onClose,
  linkValuePlaceholder
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "font-[Outfit] font-semibold text-lg text-[#1A1A1A]", children: editingBanner ? "Editar Banner" : "Nuevo Banner" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Título *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: form.data.title,
            onChange: (e) => form.setData("title", e.target.value),
            className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm",
            required: true
          }
        ),
        form.errors.title && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Subtítulo" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: form.data.subtitle,
            onChange: (e) => form.setData("subtitle", e.target.value),
            className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: [
          "Imagen ",
          editingBanner ? "" : "*"
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/png,image/jpeg,image/webp",
            onChange: (e) => form.setData("image", e.target.files?.[0] || null),
            className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm",
            required: !editingBanner
          }
        ),
        form.errors.image && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.image })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Tipo de enlace" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: form.data.link_type,
            onChange: (e) => {
              const value = e.target.value;
              form.setData({
                ...form.data,
                link_type: value,
                link_value: value ? form.data.link_value : ""
              });
            },
            className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Ninguno" }),
              /* @__PURE__ */ jsx("option", { value: "product", children: "Producto" }),
              /* @__PURE__ */ jsx("option", { value: "category", children: "Categoría" }),
              /* @__PURE__ */ jsx("option", { value: "url", children: "URL externa" })
            ]
          }
        ),
        form.errors.link_type && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.link_type })
      ] }),
      form.data.link_type && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: [
            linkTypeLabels[form.data.link_type],
            " *"
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: form.data.link_type === "url" ? "url" : "text",
              placeholder: linkValuePlaceholder(),
              value: form.data.link_value,
              onChange: (e) => form.setData("link_value", e.target.value),
              className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm",
              required: true
            }
          ),
          form.errors.link_value && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.link_value })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Texto del enlace" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.data.link_text,
              onChange: (e) => form.setData("link_text", e.target.value),
              className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Inicio" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "datetime-local",
              value: form.data.starts_at,
              onChange: (e) => form.setData("starts_at", e.target.value),
              className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Fin" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "datetime-local",
              value: form.data.ends_at,
              onChange: (e) => form.setData("ends_at", e.target.value),
              className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: form.data.is_active,
            onChange: (e) => form.setData("is_active", e.target.checked),
            className: "rounded border-[#E5E5E5]"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm text-[#1A1A1A]", children: "Activo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 mt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 text-sm font-[Outfit] font-medium text-[#666666] hover:text-[#1A1A1A] cursor-pointer",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: form.processing,
            className: "bg-[#4A5D4A] text-white px-6 py-2 rounded-lg font-[Outfit] font-medium text-sm hover:bg-[#3d4e3d] disabled:opacity-50 cursor-pointer",
            children: form.processing ? "Guardando..." : editingBanner ? "Actualizar" : "Crear"
          }
        )
      ] })
    ] })
  ] }) });
}
function DeleteConfirmModal({
  deleteConfirm,
  onDelete,
  onClose
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl w-full max-w-sm mx-4 p-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-[Outfit] font-semibold text-lg text-[#1A1A1A] mb-2", children: "Eliminar Banner" }),
    /* @__PURE__ */ jsx("p", { className: "font-[Outfit] text-sm text-[#666666] mb-6", children: "¿Estás seguro de que deseas eliminar este banner? Esta acción no se puede deshacer." }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-4 py-2 text-sm font-[Outfit] font-medium text-[#666666] hover:text-[#1A1A1A] cursor-pointer",
          children: "Cancelar"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onDelete(deleteConfirm),
          className: "bg-red-500 text-white px-6 py-2 rounded-lg font-[Outfit] font-medium text-sm hover:bg-red-600 cursor-pointer",
          children: "Eliminar"
        }
      )
    ] })
  ] }) });
}
function buildBannerFormData(data) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("subtitle", data.subtitle);
  if (data.image) {
    formData.append("image", data.image);
  }
  if (data.link_type) {
    formData.append("link_type", data.link_type);
    formData.append("link_value", data.link_value);
  }
  formData.append("link_text", data.link_text);
  formData.append("is_active", data.is_active ? "1" : "0");
  formData.append("starts_at", data.starts_at);
  formData.append("ends_at", data.ends_at);
  return formData;
}
function buildReorderPayload(banners, index, swapIndex) {
  return banners.map((b, i) => {
    if (i === index) {
      return { id: b.id, display_order: swapIndex };
    }
    if (i === swapIndex) {
      return { id: b.id, display_order: index };
    }
    return { id: b.id, display_order: i };
  });
}
const LINK_PLACEHOLDERS = {
  product: "ID del producto",
  category: "ID de categoría",
  url: "https://ejemplo.com"
};
function useBannerFormActions() {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const form = useForm({
    title: "",
    subtitle: "",
    image: null,
    link_type: "",
    link_value: "",
    link_text: "",
    is_active: true,
    starts_at: "",
    ends_at: ""
  });
  const openCreate = () => {
    setEditingBanner(null);
    form.reset();
    setShowModal(true);
  };
  const openEdit = (banner) => {
    setEditingBanner(banner);
    form.setData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: null,
      link_type: banner.link_type || "",
      link_value: banner.link_value || "",
      link_text: banner.link_text || "",
      is_active: banner.is_active,
      starts_at: banner.starts_at ? banner.starts_at.slice(0, 16) : "",
      ends_at: banner.ends_at ? banner.ends_at.slice(0, 16) : ""
    });
    setShowModal(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = buildBannerFormData(form.data);
    const onSuccess = () => setShowModal(false);
    if (editingBanner) {
      formData.append("_method", "PUT");
      router.post(`/admin/banners/${editingBanner.id}`, formData, { onSuccess });
    } else {
      router.post("/admin/banners", formData, { onSuccess });
    }
  };
  const linkValuePlaceholder = () => {
    return LINK_PLACEHOLDERS[form.data.link_type] || "";
  };
  return {
    showModal,
    setShowModal,
    editingBanner,
    form,
    openCreate,
    openEdit,
    handleSubmit,
    linkValuePlaceholder
  };
}
function useBannerListActions(banners) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const handleDelete = (id) => {
    router.delete(`/admin/banners/${id}`, {
      onSuccess: () => setDeleteConfirm(null)
    });
  };
  const toggleVisibility = (banner) => {
    router.patch(`/admin/banners/${banner.id}/visibility`, {}, { preserveScroll: true });
  };
  const reorder = (index, direction) => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= banners.length) {
      return;
    }
    const reordered = buildReorderPayload(banners, index, swapIndex);
    router.post("/admin/banners/reorder", { items: reordered }, { preserveScroll: true });
  };
  return { deleteConfirm, setDeleteConfirm, handleDelete, toggleVisibility, reorder };
}
function Banners({ banners }) {
  const { flash } = usePage().props;
  const formActions = useBannerFormActions();
  const listActions = useBannerListActions(banners);
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Banners", active: "banners", children: [
    /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1A1A1A] font-[Outfit]", children: "Banners" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666] font-[Outfit] mt-1", children: "Administra los banners promocionales de la página principal" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: formActions.openCreate,
            className: "flex items-center gap-2 bg-[#4A5D4A] text-white px-5 py-2.5 rounded-lg font-[Outfit] font-medium text-sm hover:bg-[#3d4e3d] transition-colors cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "Nuevo Banner"
            ]
          }
        )
      ] }),
      flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-[Outfit] text-sm", children: flash.success }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border border-[#E5E5E5] overflow-hidden", children: banners.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-[#999999] font-[Outfit] text-sm", children: "No hay banners. Crea el primero." }) }) : /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5] bg-[#FAFAFA]", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Banner" }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Estado" }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Programación" }),
          /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#E5E5E5]", children: banners.map((banner, index) => /* @__PURE__ */ jsx(
          BannerRow,
          {
            banner,
            index,
            total: banners.length,
            onEdit: () => formActions.openEdit(banner),
            onDelete: () => listActions.setDeleteConfirm(banner.id),
            onToggle: () => listActions.toggleVisibility(banner),
            onReorder: (dir) => listActions.reorder(index, dir)
          },
          banner.id
        )) })
      ] }) })
    ] }) }),
    formActions.showModal && /* @__PURE__ */ jsx(
      BannerFormModal,
      {
        form: formActions.form,
        editingBanner: formActions.editingBanner,
        onSubmit: formActions.handleSubmit,
        onClose: () => formActions.setShowModal(false),
        linkValuePlaceholder: formActions.linkValuePlaceholder
      }
    ),
    listActions.deleteConfirm !== null && /* @__PURE__ */ jsx(
      DeleteConfirmModal,
      {
        deleteConfirm: listActions.deleteConfirm,
        onDelete: listActions.handleDelete,
        onClose: () => listActions.setDeleteConfirm(null)
      }
    )
  ] });
}
function BannerRow({
  banner,
  index,
  total,
  onEdit,
  onDelete,
  onToggle,
  onReorder
}) {
  const status = statusConfig[banner.status];
  return /* @__PURE__ */ jsxs("tr", { className: "group", children: [
    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: banner.image_url,
          alt: banner.title,
          className: "w-16 h-10 object-cover rounded-lg"
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-[Outfit] text-sm font-medium text-[#1A1A1A]", children: banner.title }),
        banner.link_type && /* @__PURE__ */ jsxs("p", { className: "font-[Outfit] text-xs text-[#999999]", children: [
          linkTypeLabels[banner.link_type],
          ": ",
          banner.link_value
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
      "span",
      {
        className: `inline-flex px-2 py-1 rounded-full text-xs font-medium font-[Outfit] ${status.bg} ${status.text}`,
        children: status.label
      }
    ) }),
    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-xs text-[#666666]", children: banner.starts_at || banner.ends_at ? `${formatDateShort(banner.starts_at)} → ${formatDateShort(banner.ends_at)}` : "Siempre" }) }),
    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onReorder("up"),
          disabled: index === 0,
          className: "p-1.5 rounded hover:bg-[#F5F3F0] disabled:opacity-30 cursor-pointer",
          children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-3.5 h-3.5 text-[#666666]" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onReorder("down"),
          disabled: index === total - 1,
          className: "p-1.5 rounded hover:bg-[#F5F3F0] disabled:opacity-30 cursor-pointer",
          children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-3.5 h-3.5 text-[#666666]" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onToggle,
          className: "p-1.5 rounded hover:bg-[#F5F3F0] cursor-pointer",
          title: banner.is_active ? "Desactivar" : "Activar",
          children: banner.is_active ? /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 text-[#4A5D4A]" }) : /* @__PURE__ */ jsx(EyeOff, { className: "w-3.5 h-3.5 text-[#999999]" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onEdit,
          className: "p-1.5 rounded hover:bg-[#F5F3F0] cursor-pointer",
          children: /* @__PURE__ */ jsx(Pencil, { className: "w-3.5 h-3.5 text-[#666666]" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onDelete,
          className: "p-1.5 rounded hover:bg-red-50 cursor-pointer",
          children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 text-red-400" })
        }
      )
    ] }) })
  ] });
}
export {
  Banners as default
};
