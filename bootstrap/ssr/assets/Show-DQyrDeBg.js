import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Link, useForm, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { User, Truck, DollarSign, MapPin, Package, Printer, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { g as getStatusColor, p as paymentStatusLabels, a as getPaymentStatusColor, b as allowedTransitions } from "./helpers-tCu_W-gk.js";
import StatusChangeModal from "./StatusChangeModal-BTHpzq3A.js";
import RefundModal from "./RefundModal-Tj63IJ8X.js";
import OrderItemsTable from "./OrderItemsTable-utBzvxQz.js";
import StatusHistoryTimeline from "./StatusHistoryTimeline-DZf-JpSt.js";
import NotesSection from "./NotesSection-hKPs-oBq.js";
import { s as statusLabels } from "./order-BWzUrFgY.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import { b as formatDate } from "./date-CuQtAuCG.js";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function OrderInfoCard({ order }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-foreground", children: [
      "Pedido #",
      order.id
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Estado" }),
        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`, children: statusLabels[order.status] || order.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Pago" }),
        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`, children: paymentStatusLabels[order.payment_status] || order.payment_status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Total" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: formatCurrency(order.total_amount) })
      ] }),
      order.refunded_amount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Reembolsado" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-destructive", children: formatCurrency(order.refunded_amount) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Fecha" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: formatDate(order.created_at) })
      ] })
    ] })
  ] });
}
function CustomerCard({ order }) {
  if (!order.customer) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Cliente" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6 flex flex-col gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-muted rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/admin/users/${order.customer.id}`,
            className: "text-sm font-medium text-foreground hover:underline",
            children: order.customer.name
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: order.customer.email })
      ] })
    ] }) })
  ] });
}
function ShippingCard({ order }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Envio" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      order.shipping_method && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Truck, { className: "w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Metodo" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: order.shipping_method.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Costo de Envio" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: formatCurrency(order.shipping_cost) })
        ] })
      ] }),
      order.shipping_address && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Direccion" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground", children: [
            order.shipping_address.street,
            ", ",
            order.shipping_address.city,
            ", ",
            order.shipping_address.state,
            " ",
            order.shipping_address.zip
          ] })
        ] })
      ] }),
      order.tracking_number && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Rastreo" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground", children: [
            order.shipping_carrier,
            " - ",
            order.tracking_number
          ] })
        ] })
      ] })
    ] })
  ] });
}
function StatusManagementCard({ order, onOpenStatusModal }) {
  const transitions = allowedTransitions[order.status] || [];
  if (transitions.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Gestion de Estado" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onOpenStatusModal,
        className: "w-full px-4 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors",
        children: "Cambiar Estado"
      }
    ) })
  ] });
}
function ShippingLabelCard({ order }) {
  if (order.shipping_quote_source !== "skydropx") {
    return null;
  }
  const [retrying, setRetrying] = useState(false);
  const handleRetry = () => {
    setRetrying(true);
    router.post(`/admin/orders/${order.id}/retry-label`, {}, {
      preserveScroll: true,
      onFinish: () => setRetrying(false)
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Guía de Envío" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6 flex flex-col gap-4", children: order.label_url ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Printer, { className: "w-5 h-5 text-primary" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-primary font-medium", children: "Guía generada" })
      ] }),
      order.skydropx_shipment_id && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
        "ID Envío: ",
        order.skydropx_shipment_id
      ] }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: order.label_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-full px-4 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors text-center flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4" }),
            "Imprimir Guía"
          ]
        }
      )
    ] }) : order.label_error ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-destructive shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: order.label_error })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleRetry,
          disabled: retrying,
          className: "w-full px-4 py-2.5 bg-muted-foreground rounded-lg text-sm font-medium text-white hover:bg-muted-foreground/90 transition-colors disabled:opacity-50",
          children: retrying ? "Reintentando..." : "Reintentar Generación"
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-muted-foreground animate-spin" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Generando guía de envío..." })
    ] }) })
  ] });
}
function TrackingForm({ order }) {
  const { data, setData, patch, processing, errors } = useForm({
    tracking_number: order.tracking_number || "",
    shipping_carrier: order.shipping_carrier || ""
  });
  if (order.status !== "processing") {
    return null;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    patch(`/admin/orders/${order.id}/tracking`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Rastreo de Envio" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Paqueteria" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.shipping_carrier,
            onChange: (e) => setData("shipping_carrier", e.target.value),
            placeholder: "DHL, FedEx, Estafeta...",
            className: "h-10 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
          }
        ),
        errors.shipping_carrier && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.shipping_carrier })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Numero de Rastreo" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.tracking_number,
            onChange: (e) => setData("tracking_number", e.target.value),
            placeholder: "Ingresa el numero de rastreo",
            className: "h-10 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
          }
        ),
        errors.tracking_number && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.tracking_number })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "w-full px-4 py-2.5 bg-accent-foreground rounded-lg text-sm font-medium text-white hover:bg-accent-foreground/90 transition-colors disabled:opacity-50",
          children: processing ? "Enviando..." : "Marcar como Enviado"
        }
      )
    ] })
  ] });
}
function RefundSection({ order, onOpenRefundModal }) {
  if (!order.payment_intent_id || order.payment_status !== "completed") {
    return null;
  }
  const remaining = order.total_amount - order.refunded_amount;
  if (remaining <= 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Reembolso" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Disponible para reembolso" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: formatCurrency(remaining) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onOpenRefundModal,
          className: "w-full px-4 py-2.5 bg-destructive rounded-lg text-sm font-medium text-white hover:bg-destructive/90 transition-colors",
          children: "Procesar Reembolso"
        }
      )
    ] })
  ] });
}
function OrderShow() {
  const { order } = usePage().props;
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Pedido #${order.id}`, active: "orders", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/admin/orders",
              className: "text-muted-foreground hover:text-muted-foreground transition-colors",
              children: "Pedidos"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "/" }),
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
            "Pedido #",
            order.id
          ] })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-[28px] font-semibold text-foreground", children: [
          "Pedido #",
          order.id
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-[400px] flex flex-col gap-6", children: [
          /* @__PURE__ */ jsx(OrderInfoCard, { order }),
          /* @__PURE__ */ jsx(CustomerCard, { order }),
          /* @__PURE__ */ jsx(ShippingCard, { order }),
          /* @__PURE__ */ jsx(ShippingLabelCard, { order }),
          /* @__PURE__ */ jsx(StatusManagementCard, { order, onOpenStatusModal: () => setShowStatusModal(true) }),
          /* @__PURE__ */ jsx(TrackingForm, { order }),
          /* @__PURE__ */ jsx(RefundSection, { order, onOpenRefundModal: () => setShowRefundModal(true) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-6", children: [
          /* @__PURE__ */ jsx(OrderItemsTable, { order }),
          /* @__PURE__ */ jsx(StatusHistoryTimeline, { order }),
          /* @__PURE__ */ jsx(NotesSection, { order })
        ] })
      ] })
    ] }),
    showStatusModal && /* @__PURE__ */ jsx(
      StatusChangeModal,
      {
        order,
        onClose: () => setShowStatusModal(false)
      }
    ),
    showRefundModal && /* @__PURE__ */ jsx(
      RefundModal,
      {
        order,
        onClose: () => setShowRefundModal(false)
      }
    )
  ] });
}
export {
  OrderShow as default
};
