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
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-xl w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Procesar Reembolso" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-muted rounded-xl border border-border", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-muted-foreground mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Esta accion procesara un reembolso a traves de Stripe y no se puede deshacer." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-foreground", children: [
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
            className: "h-10 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
          }
        ),
        errors.amount && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.amount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: "Razon (opcional)" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: data.reason,
            onChange: (e) => setData("reason", e.target.value),
            rows: 2,
            placeholder: "Motivo del reembolso...",
            className: "px-4 py-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors resize-none"
          }
        ),
        errors.reason && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.reason })
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
            className: "flex items-center gap-2 px-5 py-2.5 bg-destructive rounded-lg text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50",
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
