import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, useForm, Link, Head } from "@inertiajs/react";
import { ShoppingCart, Package, Folder, Truck, Building2, FileText, Leaf, LayoutGrid, ChartBar, Users, Star, Image, PenLine, Newspaper, Settings, LogOut } from "lucide-react";
const mainNav = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid, id: "dashboard" },
  { name: "Analiticas", href: "/admin/analytics", icon: ChartBar, id: "analytics" },
  { name: "Usuarios", href: "/admin/users", icon: Users, id: "users" }
];
const managementNav = [
  { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart, id: "orders" },
  { name: "Productos", href: "/admin/products", icon: Package, id: "products" },
  { name: "Categorías", href: "/admin/categories", icon: Folder, id: "categories" },
  { name: "Envios", href: "/admin/shipments", icon: Truck, id: "shipments" },
  { name: "Negocios", href: "/admin/businesses", icon: Building2, id: "businesses" },
  { name: "Facturas", href: "/admin/invoices", icon: FileText, id: "invoices" }
];
const contentNav = [
  { name: "Destacados", href: "/admin/featured-products", icon: Star, id: "featured-products" },
  { name: "Banners", href: "/admin/banners", icon: Image, id: "banners" },
  { name: "Páginas", href: "/admin/static-pages", icon: PenLine, id: "static-pages" },
  { name: "Blog", href: "/admin/blog-posts", icon: Newspaper, id: "blog-posts" }
];
const systemNav = [
  { name: "Configuracion", href: "/admin/settings", icon: Settings, id: "settings" }
];
function Sidebar({ active }) {
  const { auth, adminNavigation } = usePage().props;
  const user = auth.user;
  const ordersCount = adminNavigation?.ordersCount ?? 0;
  const managementItems = managementNav.map((item) => item.id === "orders" ? { ...item, badge: ordersCount } : item);
  const { post, processing } = useForm({});
  const handleLogout = () => post("/admin/logout");
  return /* @__PURE__ */ jsxs("aside", { className: "w-[280px] min-h-screen bg-[#F5F3F0] flex flex-col py-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-6 pb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[#4A5D4A] rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Leaf, { className: "w-6 h-6 text-white" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Ikonoverde" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#999999] font-[Outfit]", children: "Admin" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 px-4 mt-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-[#999999] tracking-wider px-4 mb-1 font-[Outfit]", children: "PRINCIPAL" }),
      mainNav.map((item) => /* @__PURE__ */ jsx(
        NavLink,
        {
          item,
          isActive: active === item.id
        },
        item.id
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 px-4 mt-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-[#999999] tracking-wider px-4 mb-1 font-[Outfit]", children: "GESTION" }),
      managementItems.map((item) => /* @__PURE__ */ jsx(
        NavLink,
        {
          item,
          isActive: active === item.id
        },
        item.id
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 px-4 mt-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-[#999999] tracking-wider px-4 mb-1 font-[Outfit]", children: "CONTENIDO" }),
      contentNav.map((item) => /* @__PURE__ */ jsx(
        NavLink,
        {
          item,
          isActive: active === item.id
        },
        item.id
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 px-4 mt-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-[#999999] tracking-wider px-4 mb-1 font-[Outfit]", children: "SISTEMA" }),
      systemNav.map((item) => /* @__PURE__ */ jsx(
        NavLink,
        {
          item,
          isActive: active === item.id
        },
        item.id
      ))
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1" }),
    user && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-6 pt-4 border-t border-[#E5E5E5]", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[#4A5D4A] rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white font-[Outfit]", children: user.initials }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 flex-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: user.name }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: user.email })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleLogout,
          disabled: processing,
          className: `p-2 rounded-lg transition-all duration-200 ${processing ? "opacity-50 cursor-not-allowed" : "opacity-60 hover:opacity-100 hover:scale-105 cursor-pointer"}`,
          title: "Cerrar sesión",
          children: /* @__PURE__ */ jsx(LogOut, { className: "w-5 h-5 text-[#4A5D4A]" })
        }
      )
    ] })
  ] });
}
function NavLink({ item, isActive }) {
  const Icon = item.icon;
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: item.href,
      className: `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors font-[Outfit] ${isActive ? "bg-white text-[#1A1A1A]" : "text-[#666666] hover:bg-white/50"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            Icon,
            {
              className: `w-5 h-5 ${isActive ? "text-[#4A5D4A]" : "text-[#666666]"}`
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-sm ${isActive ? "font-medium" : "font-normal"}`,
              children: item.name
            }
          )
        ] }),
        typeof item.badge === "number" && /* @__PURE__ */ jsx("span", { className: "flex h-[22px] min-w-7 items-center justify-center rounded-full bg-[#4A5D4A] px-2 text-[11px] font-medium text-white", children: item.badge })
      ]
    }
  );
}
function AppLayout({ children, title, active }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[#FBF9F7]", children: [
      /* @__PURE__ */ jsx(Sidebar, { active }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-auto", children })
    ] })
  ] });
}
export {
  AppLayout as A
};
