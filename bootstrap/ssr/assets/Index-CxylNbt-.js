import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, useForm } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-Q3nFYZ7E.js";
import "lucide-react";
function SettingsIndex() {
  const { settings, flash } = usePage().props;
  const form = useForm({
    contact_email: settings.contact_email ?? "",
    contact_phone: settings.contact_phone ?? "",
    contact_address: settings.contact_address ?? ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    form.put("/admin/settings", { preserveScroll: true });
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Configuración", active: "settings", children: /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1A1A1A] font-[Outfit]", children: "Configuración" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[#666666] font-[Outfit] mt-1", children: "Información de contacto de la empresa" })
    ] }),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-[Outfit] text-sm", children: flash.success }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "bg-white rounded-xl border border-[#E5E5E5] p-6 flex flex-col gap-4",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Correo electrónico" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: form.data.contact_email,
                onChange: (e) => form.setData("contact_email", e.target.value),
                className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm",
                placeholder: "contacto@ejemplo.com"
              }
            ),
            form.errors.contact_email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.contact_email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Teléfono" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: form.data.contact_phone,
                onChange: (e) => form.setData("contact_phone", e.target.value),
                className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm",
                placeholder: "999 123 4567"
              }
            ),
            form.errors.contact_phone && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.contact_phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Dirección" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 4,
                value: form.data.contact_address,
                onChange: (e) => form.setData("contact_address", e.target.value),
                className: "w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm resize-y",
                placeholder: "Calle, número, colonia, ciudad, estado, código postal"
              }
            ),
            form.errors.contact_address && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.contact_address })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: form.processing,
              className: "bg-[#4A5D4A] text-white px-6 py-2 rounded-lg font-[Outfit] font-medium text-sm hover:bg-[#3d4e3d] disabled:opacity-50 cursor-pointer",
              children: form.processing ? "Guardando..." : "Guardar cambios"
            }
          ) })
        ]
      }
    )
  ] }) }) });
}
export {
  SettingsIndex as default
};
