import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { Folder, Search, Bell, Settings, ChevronDown, Plus, ChevronRight, GripVertical, Package, X, AlertTriangle, FolderOpen, Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function CategoryFormModal({
  modalMode,
  formData,
  setFormData,
  errors,
  processing,
  onSubmit,
  onClose,
  parentOptions
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-foreground", children: modalMode === "create" ? "Nueva Categoría" : "Editar Categoría" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-2 hover:bg-muted rounded-lg transition-colors",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-muted-foreground" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-foreground mb-2", children: [
          "Nombre ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: formData.name,
            onChange: (e) => setFormData("name", e.target.value),
            className: "w-full h-11 px-4 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
            placeholder: "Ej: Electrónicos"
          }
        ),
        errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-destructive", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Descripción" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: formData.description,
            onChange: (e) => setFormData("description", e.target.value),
            rows: 3,
            className: "w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none",
            placeholder: "Descripción opcional de la categoría"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Categoría Padre" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: formData.parent_id ?? "",
            onChange: (e) => setFormData("parent_id", e.target.value ? parseInt(e.target.value) : null),
            className: "w-full h-11 px-4 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-card",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Sin categoría padre (nivel raíz)" }),
              parentOptions.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "is_active",
            checked: formData.is_active,
            onChange: (e) => setFormData("is_active", e.target.checked),
            className: "w-5 h-5 rounded border-border text-primary focus:ring-primary"
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: "is_active", className: "text-sm text-foreground", children: "Categoría activa (visible en la tienda)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 h-11 border border-border rounded-lg text-muted-foreground font-medium text-sm hover:bg-muted transition-colors",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex-1 h-11 bg-primary rounded-lg text-white font-medium text-sm hover:bg-primary transition-colors disabled:opacity-50",
            children: processing ? "Guardando..." : modalMode === "create" ? "Crear" : "Guardar"
          }
        )
      ] })
    ] })
  ] }) });
}
function DeleteConfirmationModal({ deleteModal, onDelete, onClose }) {
  if (!deleteModal.isOpen || !deleteModal.category) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-border flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-destructive" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-foreground", children: "Eliminar Categoría" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-4", children: [
        "¿Estás seguro de que quieres eliminar la categoría ",
        /* @__PURE__ */ jsx("strong", { children: deleteModal.category.name }),
        "?"
      ] }),
      (deleteModal.stats.products_count > 0 || deleteModal.stats.children_count > 0) && /* @__PURE__ */ jsxs("div", { className: "bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium mb-2", children: "No se puede eliminar:" }),
        deleteModal.stats.children_count > 0 && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive", children: [
          "• Esta categoría tiene ",
          deleteModal.stats.children_count,
          " subcategoría(s)"
        ] }),
        deleteModal.stats.products_count > 0 && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive", children: [
          "• Esta categoría tiene ",
          deleteModal.stats.products_count,
          " producto(s)"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "flex-1 h-11 border border-border rounded-lg text-muted-foreground font-medium text-sm hover:bg-muted transition-colors",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onDelete,
            disabled: deleteModal.stats.products_count > 0 || deleteModal.stats.children_count > 0,
            className: "flex-1 h-11 bg-destructive rounded-lg text-white font-medium text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            children: "Eliminar"
          }
        )
      ] })
    ] })
  ] }) });
}
function CategoryActions({ category, onAddSubcategory, onEdit, onDelete }) {
  return /* @__PURE__ */ jsx("div", { className: "w-12", children: /* @__PURE__ */ jsxs("div", { className: "relative group/menu", children: [
    /* @__PURE__ */ jsx("button", { className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-border transition-colors", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-5 h-5 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full z-10 mt-1 hidden w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg group-hover/menu:block", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onAddSubcategory(category.id),
          className: "w-full px-4 py-2 text-left text-sm text-foreground hover:bg-background flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            "Agregar subcategoría"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onEdit(category),
          className: "w-full px-4 py-2 text-left text-sm text-foreground hover:bg-background flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }),
            "Editar"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onDelete(category),
          className: "w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
            "Eliminar"
          ]
        }
      )
    ] })
  ] }) });
}
const EMPTY_DELETE_STATE = { isOpen: false, category: null, stats: { products_count: 0, children_count: 0 } };
function useCategoryFormActions(flatCategories) {
  const [modalMode, setModalMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: formData, setData: setFormData, post, put, processing, errors, reset } = useForm({
    name: "",
    description: "",
    parent_id: null,
    is_active: true
  });
  const closeModal = () => {
    setModalMode(null);
    setSelectedCategory(null);
    reset();
  };
  const openCreateModal = (parentId = null) => {
    reset();
    setFormData("parent_id", parentId);
    setModalMode("create");
  };
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description ?? "",
      parent_id: category.parent_id,
      is_active: category.is_active
    });
    setModalMode("edit");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      post("/admin/categories", { onSuccess: () => closeModal() });
    } else if (modalMode === "edit" && selectedCategory) {
      put(`/admin/categories/${selectedCategory.id}`, { onSuccess: () => closeModal() });
    }
  };
  const getParentOptions = (currentId) => {
    return flatCategories.filter((cat) => cat.id !== currentId);
  };
  return {
    modalMode,
    selectedCategory,
    formData,
    setFormData,
    processing,
    errors,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    getParentOptions
  };
}
function useCategoryDeleteActions() {
  const [deleteModal, setDeleteModal] = useState(EMPTY_DELETE_STATE);
  const openDeleteModal = async (category) => {
    try {
      const response = await fetch(`/admin/categories/${category.id}/stats`);
      const stats = await response.json();
      setDeleteModal({ isOpen: true, category, stats });
    } catch {
      setDeleteModal({ isOpen: true, category, stats: { products_count: 0, children_count: 0 } });
    }
  };
  const handleDelete = () => {
    if (!deleteModal.category) return;
    router.delete(`/admin/categories/${deleteModal.category.id}`, {
      onSuccess: () => setDeleteModal(EMPTY_DELETE_STATE)
    });
  };
  const closeDeleteModal = () => setDeleteModal(EMPTY_DELETE_STATE);
  return { deleteModal, openDeleteModal, handleDelete, closeDeleteModal };
}
async function toggleCategoryVisibility(category) {
  try {
    const response = await fetch(`/admin/categories/${category.id}/visibility`, {
      method: "PATCH",
      headers: {
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      router.reload();
    }
  } catch (error) {
    console.error("Error toggling visibility:", error);
  }
}
function filterCategoryTree(categories, searchQuery) {
  if (!searchQuery.trim()) return categories;
  const query = searchQuery.toLowerCase();
  const matchesSearch = (cat) => {
    return cat.name.toLowerCase().includes(query) || (cat.description?.toLowerCase().includes(query) ?? false);
  };
  const filterTree = (cats) => {
    return cats.reduce((acc, cat) => {
      const children = cat.children ? filterTree(cat.children) : [];
      if (matchesSearch(cat) || children.length > 0) {
        acc.push({ ...cat, children });
      }
      return acc;
    }, []);
  };
  return filterTree(categories);
}
function CategoriesHeader({ searchQuery, setSearchQuery, totalCount, onCreateClick, userInitials }) {
  return /* @__PURE__ */ jsxs("header", { className: "px-8 py-6 border-b border-border", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Categorías" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Buscar categorías...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-[320px] h-11 pl-10 pr-4 bg-card border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "p-2 rounded-lg hover:bg-card transition-colors relative", children: [
          /* @__PURE__ */ jsx(Bell, { className: "w-6 h-6 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-muted-foreground rounded-full" })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "p-2 rounded-lg hover:bg-card transition-colors", children: /* @__PURE__ */ jsx(Settings, { className: "w-6 h-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pl-4 border-l border-border", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white", children: userInitials }) }),
          /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5 text-muted-foreground" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxs("span", { children: [
        "Total: ",
        totalCount,
        " categorías"
      ] }) }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onCreateClick,
          className: "flex items-center gap-2 h-11 px-5 bg-primary rounded-lg text-white font-medium text-sm hover:bg-primary transition-colors",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
            "Nueva Categoría"
          ]
        }
      )
    ] })
  ] });
}
function Categories({ categories, flatCategories }) {
  const { auth, flash } = usePage().props;
  const user = auth.user;
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState(/* @__PURE__ */ new Set());
  const formActions = useCategoryFormActions(flatCategories);
  const deleteActions = useCategoryDeleteActions();
  const filteredCategories = useMemo(
    () => filterCategoryTree(categories, searchQuery),
    [categories, searchQuery]
  );
  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Categorías", active: "categories", children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      CategoriesHeader,
      {
        searchQuery,
        setSearchQuery,
        totalCount: flatCategories.length,
        onCreateClick: () => formActions.openCreateModal(),
        userInitials: user?.initials
      }
    ),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mx-8 mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-primary", children: flash.success }) }),
    flash?.error && /* @__PURE__ */ jsx("div", { className: "mx-8 mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: flash.error }) }),
    /* @__PURE__ */ jsx("main", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border border-border overflow-visible", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-t-xl border-b border-border bg-background p-4 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { className: "w-12" }),
        /* @__PURE__ */ jsx("span", { className: "w-12" }),
        /* @__PURE__ */ jsx("span", { className: "flex-1", children: "Nombre" }),
        /* @__PURE__ */ jsx("span", { className: "w-48", children: "Productos" }),
        /* @__PURE__ */ jsx("span", { className: "w-24", children: "Estado" }),
        /* @__PURE__ */ jsx("span", { className: "w-12" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: filteredCategories.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsx(Folder, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: searchQuery ? "No se encontraron categorías" : "No hay categorías. Crea la primera." })
      ] }) : filteredCategories.map((category) => /* @__PURE__ */ jsx(
        CategoryRow,
        {
          category,
          depth: 0,
          expandedIds,
          onToggleExpand: toggleExpand,
          onEdit: formActions.openEditModal,
          onDelete: deleteActions.openDeleteModal,
          onToggleVisibility: toggleCategoryVisibility,
          onAddSubcategory: formActions.openCreateModal
        },
        category.id
      )) })
    ] }) }),
    formActions.modalMode && /* @__PURE__ */ jsx(
      CategoryFormModal,
      {
        modalMode: formActions.modalMode,
        formData: formActions.formData,
        setFormData: formActions.setFormData,
        errors: formActions.errors,
        processing: formActions.processing,
        onSubmit: formActions.handleSubmit,
        onClose: formActions.closeModal,
        parentOptions: formActions.getParentOptions(formActions.selectedCategory?.id)
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteConfirmationModal,
      {
        deleteModal: deleteActions.deleteModal,
        onDelete: deleteActions.handleDelete,
        onClose: deleteActions.closeDeleteModal
      }
    )
  ] }) });
}
function CategoryStatusBadge({ category, onToggleVisibility }) {
  return /* @__PURE__ */ jsx("div", { className: "w-24", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onToggleVisibility(category),
      className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
      children: category.is_active ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }),
        " Activa"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(EyeOff, { className: "w-3.5 h-3.5" }),
        " Oculta"
      ] })
    }
  ) });
}
function CategoryInfo({ category, hasChildren }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center gap-3", children: [
    hasChildren ? /* @__PURE__ */ jsx(FolderOpen, { className: "w-5 h-5 text-primary" }) : /* @__PURE__ */ jsx(Folder, { className: "w-5 h-5 text-muted-foreground" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: category.name }),
      category.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate max-w-xs", children: category.description })
    ] })
  ] });
}
function CategoryRow({ category, depth, expandedIds, onToggleExpand, onEdit, onDelete, onToggleVisibility, onAddSubcategory }) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const paddingLeft = 16 + depth * 32;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-4 p-4 hover:bg-background transition-colors group",
        style: { paddingLeft },
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => hasChildren && onToggleExpand(category.id),
              className: `w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${hasChildren ? "hover:bg-border cursor-pointer" : "cursor-default"}`,
              disabled: !hasChildren,
              children: hasChildren && (isExpanded ? /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }))
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center cursor-move text-muted-foreground", children: /* @__PURE__ */ jsx(GripVertical, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx(CategoryInfo, { category, hasChildren: !!hasChildren }),
          /* @__PURE__ */ jsxs("div", { className: "w-48 flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxs("span", { children: [
              category.products_count ?? 0,
              " productos"
            ] })
          ] }),
          /* @__PURE__ */ jsx(CategoryStatusBadge, { category, onToggleVisibility }),
          /* @__PURE__ */ jsx(
            CategoryActions,
            {
              category,
              onAddSubcategory,
              onEdit,
              onDelete
            }
          )
        ]
      }
    ),
    hasChildren && isExpanded && category.children?.map((child) => /* @__PURE__ */ jsx(
      CategoryRow,
      {
        category: child,
        depth: depth + 1,
        expandedIds,
        onToggleExpand,
        onEdit,
        onDelete,
        onToggleVisibility,
        onAddSubcategory
      },
      child.id
    ))
  ] });
}
export {
  Categories as default
};
