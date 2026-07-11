import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-Q3nFYZ7E.js";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
const roleLabels = {
  customer: "Cliente",
  admin: "Administrador",
  super_admin: "Super Admin"
};
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function getSortIcon(field) {
  const currentSortBy = new URLSearchParams(window.location.search).get("sort_by") || "created_at";
  const currentSortOrder = new URLSearchParams(window.location.search).get("sort_order") || "desc";
  if (currentSortBy !== field) {
    return /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-4 h-4 text-gray-400" });
  }
  return currentSortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-4 h-4 text-[#1A1A1A]" }) : /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-4 h-4 text-[#1A1A1A] rotate-180" });
}
function handleSort(field) {
  const params = new URLSearchParams(window.location.search);
  const currentSortBy = params.get("sort_by") || "created_at";
  const currentSortOrder = params.get("sort_order") || "desc";
  const search = params.get("search") || "";
  if (currentSortBy === field) {
    params.set("sort_order", currentSortOrder === "asc" ? "desc" : "asc");
  } else {
    params.set("sort_by", field);
    params.set("sort_order", "desc");
  }
  if (search) {
    params.set("search", search);
  }
  window.location.href = `${window.location.pathname}?${params.toString()}`;
}
function SortableHeader({ field, label }) {
  return /* @__PURE__ */ jsx(
    "th",
    {
      className: "text-left px-6 py-4 cursor-pointer hover:bg-gray-50",
      onClick: () => handleSort(field),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: label }),
        getSortIcon(field)
      ] })
    }
  );
}
function UserRow({ user }) {
  return /* @__PURE__ */ jsxs(
    "tr",
    {
      className: "border-b border-[#E5E5E5] hover:bg-gray-50",
      children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
          Link,
          {
            href: `/admin/users/${user.id}`,
            className: "text-sm text-[#1A1A1A] hover:underline",
            children: user.name
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A]", children: user.email }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800", children: roleLabels[user.role] || user.role }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, children: user.is_active ? "Activo" : "Inactivo" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-[#666666]", children: formatDate(user.created_at) }) })
      ]
    }
  );
}
function Pagination({ users }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-[#666666]", children: [
      "Mostrando ",
      users.from,
      " a ",
      users.to,
      " de ",
      users.total,
      " usuarios"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: `?page=${users.current_page - 1}`,
          className: `p-2 rounded-lg border border-[#E5E5E5] ${users.current_page === 1 ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-gray-50"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 text-[#666666]" })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-[#1A1A1A]", children: [
        users.current_page,
        " / ",
        users.last_page
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: `?page=${users.current_page + 1}`,
          className: `p-2 rounded-lg border border-[#E5E5E5] ${users.current_page === users.last_page ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-gray-50"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-[#666666]" })
        }
      )
    ] })
  ] });
}
function UsersIndex() {
  const { users } = usePage().props;
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, []);
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Usuarios", active: "users", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]", children: "Usuarios" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666] font-[Outfit]", children: "Gestiona los usuarios del sistema" })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar por nombre o email...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "px-5 py-2.5 bg-[#4A5D4A] rounded-xl text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors",
          children: "Buscar"
        }
      ),
      searchQuery && /* @__PURE__ */ jsx(
        Link,
        {
          href: "/admin/users",
          className: "px-5 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-gray-50 transition-colors",
          children: "Limpiar"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-[#E5E5E5] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5]", children: [
          /* @__PURE__ */ jsx(SortableHeader, { field: "name", label: "Nombre" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "email", label: "Email" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "role", label: "Rol" }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Estado" }) }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "created_at", label: "Registrado" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: users.data.map((user) => /* @__PURE__ */ jsx(UserRow, { user }, user.id)) })
      ] }),
      users.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666]", children: searchQuery ? "No se encontraron usuarios que coincidan con la búsqueda" : "No hay usuarios registrados" }) }),
      users.last_page > 1 && /* @__PURE__ */ jsx(Pagination, { users })
    ] })
  ] }) });
}
export {
  UsersIndex as default
};
