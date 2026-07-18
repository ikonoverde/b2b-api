import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, useForm } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import "lucide-react";
import "./sidebar-DK9OU6Q6.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
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
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Configuración" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Información de contacto de la empresa" })
    ] }),
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-lg text-sm", children: flash.success }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "bg-card rounded-xl border border-border p-6 flex flex-col gap-4",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Correo electrónico" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: form.data.contact_email,
                onChange: (e) => form.setData("contact_email", e.target.value),
                className: "w-full border border-border rounded-lg px-3 py-2 text-sm",
                placeholder: "contacto@ejemplo.com"
              }
            ),
            form.errors.contact_email && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs mt-1", children: form.errors.contact_email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Teléfono" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: form.data.contact_phone,
                onChange: (e) => form.setData("contact_phone", e.target.value),
                className: "w-full border border-border rounded-lg px-3 py-2 text-sm",
                placeholder: "999 123 4567"
              }
            ),
            form.errors.contact_phone && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs mt-1", children: form.errors.contact_phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Dirección" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 4,
                value: form.data.contact_address,
                onChange: (e) => form.setData("contact_address", e.target.value),
                className: "w-full border border-border rounded-lg px-3 py-2 text-sm resize-y",
                placeholder: "Calle, número, colonia, ciudad, estado, código postal"
              }
            ),
            form.errors.contact_address && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs mt-1", children: form.errors.contact_address })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: form.processing,
              className: "bg-primary text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-primary disabled:opacity-50 cursor-pointer",
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
