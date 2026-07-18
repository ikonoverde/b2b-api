import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, useForm, Link, Head } from "@inertiajs/react";
import { LayoutGrid, ChartBar, Users, ShoppingCart, Package, Folder, Truck, Building2, MessageSquareText, Gift, Megaphone, ClipboardList, Compass, Send, FileText, Star, Image, PenLine, Newspaper, Settings, Leaf, LogOut } from "lucide-react";
import { S as Sidebar, a as SidebarHeader, b as SidebarContent, c as SidebarGroup, d as SidebarGroupLabel, e as SidebarGroupContent, f as SidebarMenu, g as SidebarMenuItem, h as SidebarMenuButton, i as SidebarMenuBadge, j as SidebarFooter, k as SidebarProvider, l as SidebarInset, m as SidebarTrigger } from "./sidebar-DK9OU6Q6.js";
const mainNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutGrid, id: "dashboard" },
  { name: "Analiticas", href: "/admin/analytics", icon: ChartBar, id: "analytics" },
  { name: "Usuarios", href: "/admin/users", icon: Users, id: "users" }
];
const managementNav = [
  { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart, id: "orders" },
  { name: "Productos", href: "/admin/products", icon: Package, id: "products" },
  { name: "Categorías", href: "/admin/categories", icon: Folder, id: "categories" },
  { name: "Envios", href: "/admin/shipments", icon: Truck, id: "shipments" },
  { name: "Negocios", href: "/admin/businesses", icon: Building2, id: "businesses" },
  { name: "Chat", href: "/admin/chat", icon: MessageSquareText, id: "chat" },
  { name: "Muestras gratis", href: "/admin/sample-requests", icon: Gift, id: "sample-requests" },
  { name: "Propuestas de anuncios", href: "/admin/ad-proposals", icon: Megaphone, id: "ad-proposals" },
  { name: "Reportes de marketing", href: "/admin/marketing-reports", icon: ClipboardList, id: "marketing-reports" },
  { name: "Plan de crecimiento", href: "/admin/growth-plan", icon: Compass, id: "growth-plan" },
  { name: "Publicaciones sociales", href: "/admin/social-posts", icon: Send, id: "social-posts" },
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
const navSections = [
  { label: "Principal", items: mainNav },
  { label: "Gestion", items: managementNav },
  { label: "Contenido", items: contentNav },
  { label: "Sistema", items: systemNav }
];
function AdminSidebar({ active }) {
  const { auth, adminNavigation } = usePage().props;
  const user = auth.user;
  const ordersCount = adminNavigation?.ordersCount ?? 0;
  const { post, processing } = useForm({});
  const handleLogout = () => post("/admin/logout");
  const sections = navSections.map((section) => ({
    ...section,
    items: section.items.map(
      (item) => item.id === "orders" ? { ...item, badge: ordersCount } : item
    )
  }));
  return /* @__PURE__ */ jsxs(Sidebar, { children: [
    /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-2 py-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex size-10 items-center justify-center rounded-lg bg-sidebar-primary", children: /* @__PURE__ */ jsx(Leaf, { className: "size-6 text-sidebar-primary-foreground" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-sidebar-foreground", children: "Ikonoverde" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "Admin" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SidebarContent, { children: sections.map((section) => /* @__PURE__ */ jsxs(SidebarGroup, { children: [
      /* @__PURE__ */ jsx(SidebarGroupLabel, { className: "tracking-wider uppercase", children: section.label }),
      /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: section.items.map((item) => /* @__PURE__ */ jsxs(SidebarMenuItem, { children: [
        /* @__PURE__ */ jsx(
          SidebarMenuButton,
          {
            asChild: true,
            isActive: active === item.id,
            className: "data-active:[&>svg]:text-sidebar-primary",
            children: /* @__PURE__ */ jsxs(Link, { href: item.href, children: [
              /* @__PURE__ */ jsx(item.icon, {}),
              /* @__PURE__ */ jsx("span", { children: item.name })
            ] })
          }
        ),
        typeof item.badge === "number" && /* @__PURE__ */ jsx(SidebarMenuBadge, { className: "rounded-full bg-sidebar-primary px-2 text-sidebar-primary-foreground", children: item.badge })
      ] }, item.id)) }) })
    ] }, section.label)) }),
    user && /* @__PURE__ */ jsx(SidebarFooter, { className: "border-t border-sidebar-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-2 py-1", children: [
      /* @__PURE__ */ jsx("div", { className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-sidebar-primary-foreground", children: user.initials }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: [
        /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-medium text-sidebar-foreground", children: user.name }),
        /* @__PURE__ */ jsx("span", { className: "truncate text-xs text-muted-foreground", children: user.email })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleLogout,
          disabled: processing,
          className: `rounded-lg p-2 transition-all duration-200 ${processing ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-60 hover:scale-105 hover:opacity-100"}`,
          title: "Cerrar sesión",
          children: /* @__PURE__ */ jsx(LogOut, { className: "size-5 text-sidebar-primary" })
        }
      )
    ] }) })
  ] });
}
function AppLayout({ children, title, active }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(SidebarProvider, { style: { "--sidebar-width": "280px" }, children: [
      /* @__PURE__ */ jsx(AdminSidebar, { active }),
      /* @__PURE__ */ jsxs(SidebarInset, { className: "bg-background", children: [
        /* @__PURE__ */ jsx("header", { className: "flex h-12 items-center gap-2 px-4 md:hidden", children: /* @__PURE__ */ jsx(SidebarTrigger, {}) }),
        children
      ] })
    ] })
  ] });
}
export {
  AppLayout as A
};
