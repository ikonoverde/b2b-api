import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { X, AlertTriangle, Check } from "lucide-react";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
function RefundModal({
  order,
  onClose
}) {
  const remaining = order.total_amount - order.refunded_amount;
  const { data, setData, post, processing, errors } = useForm({
    amount: remaining.toString(),
    reason: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/orders/${order.id}/refund`, {
      onSuccess: () => onClose()
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Procesar Reembolso" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1.5 text-[#999999] hover:text-[#666666] hover:bg-gray-100 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-amber-600 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-800 font-[Outfit]", children: "Esta accion procesara un reembolso a traves de Stripe y no se puede deshacer." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: [
          "Monto (max: ",
          formatCurrency(remaining),
          ")"
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            min: "0.01",
            max: remaining,
            value: data.amount,
            onChange: (e) => setData("amount", e.target.value),
            className: "h-10 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
          }
        ),
        errors.amount && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.amount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Razon (opcional)" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: data.reason,
            onChange: (e) => setData("reason", e.target.value),
            rows: 2,
            placeholder: "Motivo del reembolso...",
            className: "px-4 py-3 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors resize-none"
          }
        ),
        errors.reason && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.reason })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-5 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-gray-50 transition-colors",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex items-center gap-2 px-5 py-2.5 bg-red-600 rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-red-700 transition-colors disabled:opacity-50",
            children: processing ? "Procesando..." : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }),
              "Confirmar Reembolso"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  RefundModal as default
};
