import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, useForm, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { Mail, Phone, FileText, Calendar, UserCog, Power, Key, CreditCard, Package, TrendingUp, Clock, ChevronLeft, ChevronRight, X, Shield, Check, AlertTriangle } from "lucide-react";
import { useState } from "react";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const roleLabels = {
  customer: "Cliente",
  admin: "Administrador",
  super_admin: "Super Admin"
};
const availableRoles = [
  { value: "customer", label: "Cliente", description: "Acceso básico al catálogo y compras" },
  { value: "admin", label: "Administrador", description: "Gestión de productos, usuarios y pedidos" },
  { value: "super_admin", label: "Super Admin", description: "Control total del sistema y gestión de roles" }
];
const paymentMethodLabels = {
  card: "Tarjeta",
  paypal: "PayPal"
};
const statusLabels = {
  payment_pending: "Pago Pendiente",
  pending: "Pagado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado"
};
const paymentStatusLabels = {
  pending: "Pendiente",
  paid: "Pagado",
  failed: "Fallido",
  refunded: "Reembolsado"
};
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  }).format(amount);
};
const getStatusColor = (status) => {
  const colors = {
    pending: "bg-muted text-muted-foreground",
    processing: "bg-accent text-accent-foreground",
    shipped: "bg-accent text-accent-foreground",
    delivered: "bg-primary/10 text-primary",
    cancelled: "bg-destructive/10 text-destructive"
  };
  return colors[status] || "bg-muted text-foreground";
};
const getPaymentStatusColor = (status) => {
  const colors = {
    pending: "bg-muted text-muted-foreground",
    paid: "bg-primary/10 text-primary",
    failed: "bg-destructive/10 text-destructive",
    refunded: "bg-accent text-accent-foreground"
  };
  return colors[status] || "bg-muted text-foreground";
};
function PasswordResetCard({
  user,
  onOpenPasswordResetModal
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Restablecer Contraseña" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-muted rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Key, { className: "w-5 h-5 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Enviar Email de Restablecimiento" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "El usuario recibirá un email con un enlace para crear una nueva contraseña." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onOpenPasswordResetModal,
          className: "w-full px-4 py-2.5 bg-muted-foreground rounded-lg text-sm font-medium text-white hover:bg-muted-foreground/90 transition-colors",
          children: "Enviar Email de Restablecimiento"
        }
      )
    ] })
  ] });
}
function PersonalInfoCard({ user }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Información Personal" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-muted rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-primary", children: user.name.charAt(0).toUpperCase() }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: user.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
            /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`, children: user.is_active ? "Activo" : "Inactivo" }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground", children: roleLabels[user.role] || user.role })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Email" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: user.email })
          ] })
        ] }),
        user.phone && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Teléfono" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: user.phone })
          ] })
        ] }),
        user.rfc && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "RFC" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: user.rfc })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Fecha de Registro" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: formatDate(user.created_at) })
          ] })
        ] }),
        user.email_verified_at && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-primary" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Email Verificado" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: formatDate(user.email_verified_at) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function RoleManagementCard({
  user,
  canAssignAdminRoles,
  onOpenRoleModal
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Gestión de Rol" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-accent rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(UserCog, { className: "w-5 h-5 text-accent-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Rol Actual" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: roleLabels[user.role] || user.role })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onOpenRoleModal,
          disabled: !canAssignAdminRoles && (user.role === "admin" || user.role === "super_admin"),
          className: "w-full px-4 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Cambiar Rol"
        }
      ),
      !canAssignAdminRoles && (user.role === "admin" || user.role === "super_admin") && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Solo los Super Admin pueden cambiar roles de administradores." })
    ] })
  ] });
}
function AccountStatusCard({
  user,
  onOpenStatusModal
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Estado de la Cuenta" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${user.is_active ? "bg-primary/10" : "bg-destructive/10"}`, children: /* @__PURE__ */ jsx(Power, { className: `w-5 h-5 ${user.is_active ? "text-primary" : "text-destructive"}` }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-foreground", children: [
            "Cuenta ",
            user.is_active ? "Activa" : "Inactiva"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: user.is_active ? "El usuario puede iniciar sesión y acceder al sistema." : "El usuario no puede iniciar sesión ni acceder al sistema." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onOpenStatusModal(!user.is_active),
          className: `w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${user.is_active ? "bg-destructive text-white hover:bg-destructive/90" : "bg-primary text-white hover:bg-primary/90"}`,
          children: user.is_active ? "Desactivar Cuenta" : "Activar Cuenta"
        }
      )
    ] })
  ] });
}
function PaymentMethodCard({ user }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Método de Pago" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5 text-muted-foreground" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: paymentMethodLabels[user.pm_type || ""] || user.pm_type || "Método de Pago" }),
        user.pm_last_four && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "•••• ",
          user.pm_last_four
        ] })
      ] })
    ] }) })
  ] });
}
function ActivitySummaryGrid({ activity }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl border border-border p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-accent rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-accent-foreground" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-2xl font-semibold text-foreground", children: activity.total_orders }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Pedidos" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl border border-border p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-2xl font-semibold text-foreground", children: formatCurrency(activity.total_spent) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Gastado" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl border border-border p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-accent rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-accent-foreground" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-2xl font-semibold text-foreground", children: activity.account_age_days }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Días como Cliente" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl border border-border p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-muted rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-2xl font-semibold text-foreground", children: activity.last_order_date ? formatDate(activity.last_order_date) : "N/A" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Último Pedido" })
      ] })
    ] }) })
  ] });
}
function OrdersTable({ orders }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Historial de Pedidos" }) }),
    orders.data.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(Package, { className: "w-12 h-12 text-border mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No hay pedidos registrados" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Pedido" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Estado" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Pago" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Total" }) }),
          /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Fecha" }) })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: orders.data.map((order) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "border-b border-border hover:bg-muted",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  href: `/admin/orders/${order.id}`,
                  className: "text-sm text-foreground hover:underline font-medium",
                  children: [
                    "#",
                    order.id
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`, children: statusLabels[order.status] || order.status }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`, children: paymentStatusLabels[order.payment_status] || order.payment_status }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground font-medium", children: formatCurrency(order.total_amount) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: formatDate(order.created_at) }) })
            ]
          },
          order.id
        )) })
      ] }),
      orders.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-border", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "Mostrando ",
          orders.from,
          " a ",
          orders.to,
          " de ",
          orders.total,
          " pedidos"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: `?page=${orders.current_page - 1}`,
              className: `p-2 rounded-lg border border-border ${orders.current_page === 1 ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-muted"}`,
              preserveScroll: true,
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 text-muted-foreground" })
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground", children: [
            orders.current_page,
            " / ",
            orders.last_page
          ] }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: `?page=${orders.current_page + 1}`,
              className: `p-2 rounded-lg border border-border ${orders.current_page === orders.last_page ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-muted"}`,
              preserveScroll: true,
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function RoleOption({
  role,
  canAssignAdminRoles,
  onSelect
}) {
  const isDisabled = !canAssignAdminRoles && (role.value === "admin" || role.value === "super_admin");
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        if (!isDisabled) {
          onSelect(role.value);
        }
      },
      disabled: isDisabled,
      className: `w-full px-4 py-3 text-left transition-colors ${isDisabled ? "opacity-50 cursor-not-allowed bg-muted" : "hover:bg-muted"}`,
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-foreground", children: [
          role.label,
          isDisabled && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-muted-foreground", children: "(Requiere Super Admin)" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: role.description })
      ] })
    },
    role.value
  );
}
function RoleChangeModal({
  user,
  data,
  errors,
  processing,
  canAssignAdminRoles,
  roleDropdownOpen,
  onSetData,
  onSetRoleDropdownOpen,
  onClose,
  onSubmit
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-xl w-full max-w-md max-h-[500px] flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center justify-between flex-shrink-0", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Cambiar Rol de Usuario" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-muted rounded-xl border border-border", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "El cambio de rol tomará efecto en el próximo inicio de sesión del usuario." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Seleccionar Nuevo Rol" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => onSetRoleDropdownOpen(!roleDropdownOpen),
              className: "w-full h-11 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors flex items-center justify-between",
              children: [
                /* @__PURE__ */ jsx("span", { className: data.role ? "text-foreground" : "text-muted-foreground", children: availableRoles.find((r) => r.value === data.role)?.label || "Seleccionar rol" }),
                /* @__PURE__ */ jsx(ChevronLeft, { className: `w-4 h-4 text-muted-foreground transition-transform ${roleDropdownOpen ? "rotate-90" : "-rotate-90"}` })
              ]
            }
          ),
          roleDropdownOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-10 max-h-64 overflow-y-auto", children: availableRoles.map((role) => /* @__PURE__ */ jsx(
            RoleOption,
            {
              role,
              canAssignAdminRoles,
              onSelect: (value) => {
                onSetData("role", value);
                onSetRoleDropdownOpen(false);
              }
            },
            role.value
          )) })
        ] }),
        errors.role && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.role })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing || data.role === user.role,
            className: "flex items-center gap-2 px-5 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50",
            children: processing ? /* @__PURE__ */ jsx("span", { children: "Actualizando..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Confirmar Cambio" })
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function StatusChangeModal({
  user,
  pendingStatus,
  statusProcessing,
  onClose,
  onSubmit
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-xl w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: pendingStatus ? "Activar Cuenta" : "Desactivar Cuenta" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex items-start gap-3 p-4 rounded-xl border ${pendingStatus ? "bg-primary/10 border-primary/20" : "bg-destructive/10 border-destructive/20"}`, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: `w-5 h-5 mt-0.5 flex-shrink-0 ${pendingStatus ? "text-primary" : "text-destructive"}` }),
        /* @__PURE__ */ jsx("p", { className: `text-sm ${pendingStatus ? "text-primary" : "text-destructive"}`, children: pendingStatus ? `¿Estás seguro de que deseas activar la cuenta de ${user.name}? El usuario podrá iniciar sesión y acceder al sistema inmediatamente.` : `¿Estás seguro de que deseas desactivar la cuenta de ${user.name}? El usuario no podrá iniciar sesión ni acceder al sistema.` })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: statusProcessing,
            className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${pendingStatus ? "bg-primary hover:bg-primary/90" : "bg-destructive hover:bg-destructive/90"}`,
            children: statusProcessing ? /* @__PURE__ */ jsx("span", { children: "Procesando..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: pendingStatus ? "Confirmar Activación" : "Confirmar Desactivación" })
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function PasswordResetModal({
  user,
  processing,
  onClose,
  onSubmit
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-xl w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Enviar Email de Restablecimiento" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-muted rounded-xl border border-border", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "¿Estás seguro de que deseas enviar un email de restablecimiento de contraseña a ",
          user.name,
          "? El usuario recibirá un enlace para crear una nueva contraseña."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex items-center gap-2 px-5 py-2.5 bg-muted-foreground rounded-lg text-sm font-medium text-white hover:bg-muted-foreground/90 transition-colors disabled:opacity-50",
            children: processing ? /* @__PURE__ */ jsx("span", { children: "Enviando..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Confirmar Envío" })
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function UserShow() {
  const { user, orders, activity, auth } = usePage().props;
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const { data, setData, patch, processing, errors } = useForm({
    role: user.role
  });
  const { setData: setStatusData, patch: patchStatus, processing: statusProcessing } = useForm({
    is_active: user.is_active
  });
  const { post: postPasswordReset, processing: passwordResetProcessing } = useForm({});
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const canAssignAdminRoles = auth.user?.role === "super_admin";
  const isSelf = auth.user?.id === user.id;
  const handleRoleSubmit = (e) => {
    e.preventDefault();
    patch(`/admin/users/${user.id}/role`, {
      onSuccess: () => {
        setShowRoleModal(false);
      }
    });
  };
  const openRoleModal = () => {
    setData("role", user.role);
    setRoleDropdownOpen(false);
    setShowRoleModal(true);
  };
  const openStatusModal = (newStatus) => {
    setPendingStatus(newStatus);
    setStatusData("is_active", newStatus);
    setShowStatusModal(true);
  };
  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (pendingStatus !== null) {
      patchStatus(`/admin/users/${user.id}/toggle-active`, {
        onSuccess: () => {
          setShowStatusModal(false);
          setPendingStatus(null);
        }
      });
    }
  };
  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    postPasswordReset(`/admin/users/${user.id}/send-password-reset`, {
      onSuccess: () => {
        setShowPasswordResetModal(false);
      }
    });
  };
  const openPasswordResetModal = () => {
    setShowPasswordResetModal(true);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Detalles del Usuario", active: "users", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/admin/users",
              className: "text-muted-foreground hover:text-muted-foreground transition-colors",
              children: "Usuarios"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Detalles del Usuario" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-[28px] font-semibold text-foreground", children: user.name })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-[400px] flex flex-col gap-6", children: [
          /* @__PURE__ */ jsx(PersonalInfoCard, { user }),
          !isSelf && /* @__PURE__ */ jsx(
            RoleManagementCard,
            {
              user,
              canAssignAdminRoles,
              onOpenRoleModal: openRoleModal
            }
          ),
          !isSelf && /* @__PURE__ */ jsx(
            AccountStatusCard,
            {
              user,
              onOpenStatusModal: openStatusModal
            }
          ),
          !isSelf && /* @__PURE__ */ jsx(
            PasswordResetCard,
            {
              user,
              onOpenPasswordResetModal: openPasswordResetModal
            }
          ),
          (user.pm_type || user.pm_last_four) && /* @__PURE__ */ jsx(PaymentMethodCard, { user })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-6", children: [
          /* @__PURE__ */ jsx(ActivitySummaryGrid, { activity }),
          /* @__PURE__ */ jsx(OrdersTable, { orders })
        ] })
      ] })
    ] }),
    showRoleModal && /* @__PURE__ */ jsx(
      RoleChangeModal,
      {
        user,
        data,
        errors,
        processing,
        canAssignAdminRoles,
        roleDropdownOpen,
        onSetData: setData,
        onSetRoleDropdownOpen: setRoleDropdownOpen,
        onClose: () => setShowRoleModal(false),
        onSubmit: handleRoleSubmit
      }
    ),
    showStatusModal && pendingStatus !== null && /* @__PURE__ */ jsx(
      StatusChangeModal,
      {
        user,
        pendingStatus,
        statusProcessing,
        onClose: () => setShowStatusModal(false),
        onSubmit: handleStatusSubmit
      }
    ),
    showPasswordResetModal && /* @__PURE__ */ jsx(
      PasswordResetModal,
      {
        user,
        processing: passwordResetProcessing,
        onClose: () => setShowPasswordResetModal(false),
        onSubmit: handlePasswordResetSubmit
      }
    )
  ] });
}
export {
  UserShow as default
};
