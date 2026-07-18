import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ShoppingCart, Users, AlertTriangle, Search, Bell, Settings, ChevronDown, TrendingUp, TrendingDown, Package, X, Star, UserPlus, Check } from "lucide-react";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const statusColorMap = {
  delivered: "bg-primary",
  shipped: "bg-accent-foreground",
  processing: "bg-accent-foreground",
  pending: "bg-muted-foreground",
  payment_pending: "bg-muted-foreground",
  cancelled: "bg-destructive"
};
const periodLabels = {
  daily: { current: "Hoy", previous: "ayer" },
  weekly: { current: "Esta Semana", previous: "semana ant." },
  monthly: { current: "Este Mes", previous: "mes ant." }
};
function formatCurrency(value) {
  return value.toLocaleString("es-MX", { minimumFractionDigits: 2 });
}
function SalesStatsCard({ currentSales, salesPeriod }) {
  const labels = periodLabels[salesPeriod];
  const isPositive = currentSales.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  return /* @__PURE__ */ jsxs("div", { className: "h-[200px] rounded-2xl p-6 flex flex-col gap-4 bg-primary", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl flex items-center justify-center bg-card", children: /* @__PURE__ */ jsx("span", { className: "text-2xl font-semibold text-primary", children: "$" }) }),
      /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-card/20`, children: [
        /* @__PURE__ */ jsx(TrendIcon, { className: "w-3.5 h-3.5 text-white" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-white", children: [
          isPositive ? "+" : "",
          currentSales.change,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-white/70", children: [
        "Ingresos ",
        labels.current
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-[40px] font-semibold leading-tight text-white", children: [
        "$",
        formatCurrency(currentSales.total)
      ] })
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "text-xs text-white/50", children: [
      "vs $",
      formatCurrency(currentSales.previous),
      " ",
      labels.previous
    ] })
  ] });
}
function StatsCard({ icon, iconBg, badge, title, value, subtitle }) {
  return /* @__PURE__ */ jsxs("div", { className: "h-[200px] rounded-2xl p-6 flex flex-col gap-4 bg-card border border-border", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`, children: icon }),
      badge
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: title }),
      /* @__PURE__ */ jsx("span", { className: "text-[40px] font-semibold leading-tight text-foreground", children: value })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: subtitle })
  ] });
}
function TrendBadge({ change }) {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-primary/10`, children: [
    /* @__PURE__ */ jsx(TrendIcon, { className: `w-3.5 h-3.5 ${isPositive ? "text-primary" : "text-destructive"}` }),
    /* @__PURE__ */ jsxs("span", { className: `text-xs font-medium ${isPositive ? "text-primary" : "text-destructive"}`, children: [
      isPositive ? "+" : "",
      change,
      "%"
    ] })
  ] });
}
function PeriodTabs({ salesPeriod, onChangePeriod }) {
  const tabs = [
    { key: "daily", label: "Dia" },
    { key: "weekly", label: "Semana" },
    { key: "monthly", label: "Mes" }
  ];
  return /* @__PURE__ */ jsx("div", { className: "flex items-center bg-muted rounded-lg p-1", children: tabs.map(({ key, label }) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onChangePeriod(key),
      className: `px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${salesPeriod === key ? "bg-primary text-white" : "text-muted-foreground hover:bg-card/50"}`,
      children: label
    },
    key
  )) });
}
function SalesTrendSection({ currentSales, salesPeriod, onChangePeriod }) {
  const isPositive = currentSales.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Tendencia de Ventas" }),
        /* @__PURE__ */ jsx("p", { className: "text-[13px] text-muted-foreground", children: "Comparacion de periodos" })
      ] }),
      /* @__PURE__ */ jsx(PeriodTabs, { salesPeriod, onChangePeriod })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-background rounded-xl p-4 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Periodo Actual" }),
        /* @__PURE__ */ jsxs("span", { className: "text-2xl font-semibold text-foreground", children: [
          "$",
          formatCurrency(currentSales.total)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-background rounded-xl p-4 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Periodo Anterior" }),
        /* @__PURE__ */ jsxs("span", { className: "text-2xl font-semibold text-muted-foreground", children: [
          "$",
          formatCurrency(currentSales.previous)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-background rounded-xl p-4 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Cambio" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendIcon, { className: `w-5 h-5 ${isPositive ? "text-primary" : "text-destructive"}` }),
          /* @__PURE__ */ jsxs("span", { className: `text-2xl font-semibold ${isPositive ? "text-primary" : "text-destructive"}`, children: [
            isPositive ? "+" : "",
            currentSales.change,
            "%"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function TopProductsList({ topProducts }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Top 10 Productos" }),
      /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-muted-foreground" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: topProducts.length > 0 ? topProducts.map((product, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-2 hover:bg-background rounded-lg transition-colors", children: [
      /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-primary text-white text-xs font-medium flex items-center justify-center", children: index + 1 }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground truncate", children: product.name }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          product.units_sold,
          " vendidos"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-primary", children: [
        "$",
        formatCurrency(product.revenue)
      ] })
    ] }, product.id)) : /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No hay datos de ventas aun" }) })
  ] });
}
function OrderStatusList({ ordersByStatus }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Pedidos por Estado" }),
      /* @__PURE__ */ jsx(ShoppingCart, { className: "w-5 h-5 text-muted-foreground" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: ordersByStatus.map((status) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 hover:bg-background rounded-lg transition-colors", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full ${statusColorMap[status.status] || "bg-muted-foreground"}` }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: status.label })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: status.count })
    ] }, status.status)) })
  ] });
}
function LowStockAlerts({ lowStockAlerts }) {
  if (lowStockAlerts.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Alertas de Stock" }),
      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-muted-foreground" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
      lowStockAlerts.slice(0, 5).map((product) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-2 bg-muted rounded-lg", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground truncate", children: product.name }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "SKU: ",
            product.sku,
            " | Stock: ",
            product.stock,
            "/",
            product.min_stock
          ] })
        ] })
      ] }, product.id)),
      lowStockAlerts.length > 5 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground text-center", children: [
        "+",
        lowStockAlerts.length - 5,
        " mas alertas"
      ] })
    ] })
  ] });
}
const iconConfig = {
  success: {
    className: "bg-primary/10 text-primary",
    Icon: Check
  },
  info: {
    className: "bg-accent text-accent-foreground",
    Icon: UserPlus
  },
  warning: {
    className: "bg-muted text-muted-foreground",
    Icon: AlertTriangle
  },
  review: {
    className: "bg-accent text-accent-foreground",
    Icon: Star
  },
  error: {
    className: "bg-destructive/10 text-destructive",
    Icon: X
  }
};
function ActivityItem({ activity }) {
  const config = iconConfig[activity.type] || iconConfig.info;
  const Icon = config.Icon;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-10 h-10 rounded-full flex items-center justify-center ${config.className}`,
        children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: activity.title }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
        activity.time,
        " • ",
        activity.customer
      ] })
    ] })
  ] });
}
function DashboardHeader({ userName, userInitials, alertCount }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: "Dashboard" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Bienvenido de nuevo, ",
        userName
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-60 h-11 px-4 bg-card rounded-lg border border-border", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-[18px] h-[18px] text-muted-foreground" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Buscar..." })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "w-11 h-11 bg-card rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors relative", children: [
        /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5 text-muted-foreground" }),
        alertCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs text-white flex items-center justify-center font-medium", children: alertCount })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "w-11 h-11 bg-card rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors", children: /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-3 pl-1.5 pr-3 py-1.5 bg-card rounded-full border border-border hover:bg-muted transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white", children: userInitials }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: userName }),
        /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
      ] })
    ] })
  ] });
}
function Dashboard({
  salesMetrics,
  ordersByStatus,
  topProducts,
  newUsersCount,
  lowStockAlerts,
  recentActivity
}) {
  const { auth } = usePage().props;
  const user = auth.user;
  const [salesPeriod, setSalesPeriod] = useState("monthly");
  const currentSales = salesMetrics[salesPeriod];
  const totalOrders = ordersByStatus.reduce((sum, status) => sum + status.count, 0);
  const pendingOrders = ordersByStatus.find((s) => s.status === "pending")?.count || 0;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Dashboard", active: "dashboard", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 p-10 pr-12", children: [
    /* @__PURE__ */ jsx(
      DashboardHeader,
      {
        userName: user?.name?.split(" ")[0] || "Admin",
        userInitials: user?.initials?.[0] || "A",
        alertCount: lowStockAlerts.length
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx(SalesStatsCard, { currentSales, salesPeriod }),
      /* @__PURE__ */ jsx(
        StatsCard,
        {
          icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "w-6 h-6 text-muted-foreground" }),
          iconBg: "bg-muted",
          badge: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-primary/10", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-primary", children: [
            totalOrders,
            " total"
          ] }) }),
          title: "Pedidos Pendientes",
          value: pendingOrders,
          subtitle: `${ordersByStatus.find((s) => s.status === "processing")?.count || 0} en proceso`
        }
      ),
      /* @__PURE__ */ jsx(
        StatsCard,
        {
          icon: /* @__PURE__ */ jsx(Users, { className: "w-6 h-6 text-primary" }),
          iconBg: "bg-primary/10",
          badge: /* @__PURE__ */ jsx(TrendBadge, { change: newUsersCount.change }),
          title: "Nuevos Clientes",
          value: newUsersCount.this_month,
          subtitle: `${newUsersCount.last_month} el mes pasado`
        }
      ),
      /* @__PURE__ */ jsx(
        StatsCard,
        {
          icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-6 h-6 text-muted-foreground" }),
          iconBg: "bg-muted",
          badge: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-muted", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Alertas" }) }),
          title: "Stock Bajo",
          value: lowStockAlerts.length,
          subtitle: "productos requieren atencion"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-6 flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-[2] flex flex-col gap-6", children: [
        /* @__PURE__ */ jsx(
          SalesTrendSection,
          {
            currentSales,
            salesPeriod,
            onChangePeriod: setSalesPeriod
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx(TopProductsList, { topProducts }),
          /* @__PURE__ */ jsx(OrderStatusList, { ordersByStatus })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 flex flex-col gap-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Actividad Reciente" }),
            /* @__PURE__ */ jsx("button", { className: "text-[13px] text-muted-foreground hover:text-muted-foreground transition-colors", children: "Ver todo" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: recentActivity.length > 0 ? recentActivity.map((activity) => /* @__PURE__ */ jsx(
            ActivityItem,
            {
              activity
            },
            activity.id
          )) : /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No hay actividad reciente" }) })
        ] }),
        /* @__PURE__ */ jsx(LowStockAlerts, { lowStockAlerts })
      ] })
    ] })
  ] }) });
}
export {
  Dashboard as default
};
