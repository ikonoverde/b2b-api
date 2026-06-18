import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AccountShell } from "./AccountShell-BEtaQOIT.js";
import { T as TextInput } from "./TextInput-DJaWKAzU.js";
import { a as apiFetch } from "./api-B-GwsZxI.js";
import "./CustomerShell-D8_I-KnY.js";
import "lucide-react";
import "./SiteFooter-DIt_Mg7v.js";
import "./currency-BiP3uvrU.js";
function Profile({ user }) {
  const { flash } = usePage().props;
  const [data, setData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(flash?.success || "");
  function handleChange(e) {
    const { id, value } = e.target;
    const field = id;
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
    if (success) {
      setSuccess("");
    }
  }
  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess("");
    try {
      const response = await apiFetch("/account/profile", {
        method: "PUT",
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setSuccess("Perfil actualizado.");
        router.reload({ only: ["user"] });
      } else if (response.status === 422) {
        const body = await response.json();
        setErrors(body.errors || {});
      } else {
        setErrors({ name: "No fue posible actualizar el perfil." });
      }
    } catch {
      setErrors({ name: "Error de conexión. Intenta nuevamente." });
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxs(
    AccountShell,
    {
      title: "Editar perfil",
      eyebrow: "Cuenta · Perfil",
      headline: "Editar perfil",
      sub: "Mantén tus datos de contacto al día. Estos datos se utilizan para confirmaciones de pedido, envíos y atención comercial.",
      section: "profile",
      children: [
        success && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]", children: success }),
        flash?.error && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]", children: flash.error }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid grid-cols-1 gap-12 md:grid-cols-[10rem_1fr] md:gap-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Información personal" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "name",
                label: "Nombre completo",
                value: data.name,
                onChange: handleChange,
                error: errors.name,
                autoComplete: "name",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "email",
                label: "Email",
                type: "email",
                value: data.email,
                onChange: handleChange,
                error: errors.email,
                autoComplete: "email",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "phone",
                label: "Teléfono",
                type: "tel",
                value: data.phone,
                onChange: handleChange,
                error: errors.phone,
                autoComplete: "tel",
                inputMode: "tel"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: submitting,
                  className: "inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60",
                  children: submitting ? "Guardando…" : "Guardar cambios"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/account",
                  className: "inline-flex h-12 items-center border border-[var(--iko-stone-hairline)] px-7 text-[14px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
                  children: "Cancelar"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Profile as default
};
