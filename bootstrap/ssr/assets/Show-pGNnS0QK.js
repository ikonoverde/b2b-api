import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Link, useForm, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BWo2G9Nz.js";
import { User, Truck, DollarSign, MapPin, Package, Printer, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { g as getStatusColor, p as paymentStatusLabels, a as getPaymentStatusColor, b as allowedTransitions } from "./helpers-CnpaKXV5.js";
import StatusChangeModal from "./StatusChangeModal-Cp6RzVv0.js";
import RefundModal from "./RefundModal-DiH1IJz_.js";
import OrderItemsTable from "./OrderItemsTable-P2cVj-a-.js";
import StatusHistoryTimeline from "./StatusHistoryTimeline-DigLU9gs.js";
import NotesSection from "./NotesSection-BmV-ygXs.js";
import { s as statusLabels } from "./order-BWzUrFgY.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import { a as formatDate } from "./date-31wqykji.js";
function OrderInfoCard({ order }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: [
      "Pedido #",
      order.id
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#999999] font-[Outfit]", children: "Estado" }),
        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`, children: statusLabels[order.status] || order.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#999999] font-[Outfit]", children: "Pago" }),
        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`, children: paymentStatusLabels[order.payment_status] || order.payment_status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#999999] font-[Outfit]", children: "Total" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: formatCurrency(order.total_amount) })
      ] }),
      order.refunded_amount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#999999] font-[Outfit]", children: "Reembolsado" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-red-600 font-[Outfit]", children: formatCurrency(order.refunded_amount) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#999999] font-[Outfit]", children: "Fecha" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: formatDate(order.created_at) })
      ] })
    ] })
  ] });
}
function CustomerCard({ order }) {
  if (!order.customer) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Cliente" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6 flex flex-col gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[#E8EDE8] rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-[#4A5D4A]" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/admin/users/${order.customer.id}`,
            className: "text-sm font-medium text-[#1A1A1A] hover:underline font-[Outfit]",
            children: order.customer.name
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#999999] font-[Outfit]", children: order.customer.email })
      ] })
    ] }) })
  ] });
}
function ShippingCard({ order }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Envio" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      order.shipping_method && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Truck, { className: "w-5 h-5 text-[#999999]" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Metodo" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: order.shipping_method.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5 text-[#999999]" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Costo de Envio" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: formatCurrency(order.shipping_cost) })
        ] })
      ] }),
      order.shipping_address && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-[#999999]" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Direccion" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: [
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
        /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-[#999999]" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: "Rastreo" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: [
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Gestion de Estado" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onOpenStatusModal,
        className: "w-full px-4 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors",
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Guía de Envío" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6 flex flex-col gap-4", children: order.label_url ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Printer, { className: "w-5 h-5 text-green-600" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-green-700 font-medium font-[Outfit]", children: "Guía generada" })
      ] }),
      order.skydropx_shipment_id && /* @__PURE__ */ jsxs("div", { className: "text-xs text-[#999999] font-[Outfit]", children: [
        "ID Envío: ",
        order.skydropx_shipment_id
      ] }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: order.label_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-full px-4 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors text-center flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4" }),
            "Imprimir Guía"
          ]
        }
      )
    ] }) : order.label_error ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-red-500 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 font-[Outfit]", children: order.label_error })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleRetry,
          disabled: retrying,
          className: "w-full px-4 py-2.5 bg-orange-600 rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-orange-700 transition-colors disabled:opacity-50",
          children: retrying ? "Reintentando..." : "Reintentar Generación"
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-[#999999] animate-spin" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-[#999999] font-[Outfit]", children: "Generando guía de envío..." })
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Rastreo de Envio" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Paqueteria" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.shipping_carrier,
            onChange: (e) => setData("shipping_carrier", e.target.value),
            placeholder: "DHL, FedEx, Estafeta...",
            className: "h-10 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
          }
        ),
        errors.shipping_carrier && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.shipping_carrier })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Numero de Rastreo" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.tracking_number,
            onChange: (e) => setData("tracking_number", e.target.value),
            placeholder: "Ingresa el numero de rastreo",
            className: "h-10 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
          }
        ),
        errors.tracking_number && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.tracking_number })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "w-full px-4 py-2.5 bg-indigo-600 rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-indigo-700 transition-colors disabled:opacity-50",
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Reembolso" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm font-[Outfit]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#999999]", children: "Disponible para reembolso" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium text-[#1A1A1A]", children: formatCurrency(remaining) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onOpenRefundModal,
          className: "w-full px-4 py-2.5 bg-red-600 rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-red-700 transition-colors",
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
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-[Outfit]", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/admin/orders",
              className: "text-[#999999] hover:text-[#666666] transition-colors",
              children: "Pedidos"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-[#999999]", children: "/" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[#666666]", children: [
            "Pedido #",
            order.id
          ] })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]", children: [
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
