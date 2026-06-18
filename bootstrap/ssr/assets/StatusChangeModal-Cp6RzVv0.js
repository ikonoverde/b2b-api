import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { X, Check } from "lucide-react";
import { b as allowedTransitions, g as getStatusColor } from "./helpers-CnpaKXV5.js";
import { s as statusLabels } from "./order-BWzUrFgY.js";
function StatusChangeModal({
  order,
  onClose
}) {
  const transitions = allowedTransitions[order.status] || [];
  const { data, setData, patch, processing } = useForm({
    status: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    patch(`/admin/orders/${order.id}/status`, {
      onSuccess: () => onClose()
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: "Cambiar Estado" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1.5 text-[#999999] hover:text-[#666666] hover:bg-gray-100 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-[Outfit]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#999999]", children: "Estado actual:" }),
        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`, children: statusLabels[order.status] || order.status })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: transitions.map((status) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setData("status", status),
          className: `w-full px-4 py-3 rounded-lg border text-left transition-colors ${data.status === status ? "border-[#4A5D4A] bg-[#4A5D4A]/5" : "border-[#E5E5E5] hover:bg-gray-50"}`,
          children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`, children: statusLabels[status] || status })
        },
        status
      )) }),
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
            disabled: processing || !data.status,
            className: "flex items-center gap-2 px-5 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50",
            children: processing ? "Actualizando..." : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }),
              "Confirmar"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  StatusChangeModal as default
};
