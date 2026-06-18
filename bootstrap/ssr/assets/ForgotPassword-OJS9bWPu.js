import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, useForm, Link } from "@inertiajs/react";
import { CheckCircle } from "lucide-react";
import { A as AuthShell } from "./AuthShell-Cmhswqre.js";
import { T as TextInput } from "./TextInput-DJaWKAzU.js";
import "./SiteFooter-DIt_Mg7v.js";
function ForgotPassword() {
  const { flash } = usePage();
  const { data, setData, post, processing, errors } = useForm({
    email: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/forgot-password");
  };
  return /* @__PURE__ */ jsx(
    AuthShell,
    {
      title: "Restablecer contraseña",
      eyebrow: "01 · Recuperación",
      headline: "Restablecer contraseña",
      sub: "Te enviaremos un enlace al correo asociado a tu cuenta.",
      children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-8", children: [
        flash?.success && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 border border-[var(--iko-accent)] px-4 py-3 bg-[var(--iko-accent-soft)] text-[var(--iko-stone-ink)]", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-[var(--iko-accent)] shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[14px] font-medium", children: "Enlace enviado" }),
            /* @__PURE__ */ jsx("p", { className: "text-[13px] text-[var(--iko-stone-whisper)]", children: flash.success })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "email",
            label: "Email",
            type: "email",
            value: data.email,
            onChange: (e) => setData("email", e.target.value),
            placeholder: "Ingresa tu email",
            error: errors.email,
            autoFocus: true,
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "h-12 w-full bg-[var(--iko-accent)] px-6 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors disabled:opacity-50",
            children: processing ? "Enviando…" : "Enviar enlace"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-center text-[13px] text-[var(--iko-stone-whisper)]", children: /* @__PURE__ */ jsx(Link, { href: "/login", className: "font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] transition-colors", children: "← Volver al inicio de sesión" }) })
      ] })
    }
  );
}
export {
  ForgotPassword as default
};
