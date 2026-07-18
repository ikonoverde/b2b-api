import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, useForm, Link } from "@inertiajs/react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { A as AuthShell } from "./AuthShell-Bulns-kt.js";
import { T as TextInput } from "./TextInput-DJaWKAzU.js";
import "./SiteFooter-BfzQHT4y.js";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { errors: pageErrors } = usePage();
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    rfc: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    terms_accepted: false
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register");
  };
  return /* @__PURE__ */ jsx(
    AuthShell,
    {
      title: "Crear cuenta",
      eyebrow: "01 · Cuenta nueva",
      headline: "Crear cuenta",
      sub: "Guarda direcciones, repite pedidos en un clic y revisa tu historial cuando quieras.",
      children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-8", children: [
        pageErrors?.google && /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-error)] px-4 py-3 text-[13px] bg-[var(--iko-error)]/5 text-[var(--iko-error)]", children: pageErrors.google }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "name",
                label: "Nombre o razón social",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Tu nombre o empresa",
                error: errors.name,
                autoFocus: true,
                required: true
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "rfc",
                label: "RFC",
                value: data.rfc,
                onChange: (e) => setData("rfc", e.target.value.toUpperCase()),
                placeholder: "XAXX010101000",
                error: errors.rfc,
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "email",
                label: "Email",
                type: "email",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                placeholder: "tu@email.com",
                error: errors.email,
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
                onChange: (e) => setData("phone", e.target.value),
                placeholder: "55 1234 5678",
                error: errors.phone,
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "password",
              label: "Contraseña",
              type: showPassword ? "text" : "password",
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              placeholder: "Mínimo 8 caracteres",
              error: errors.password,
              required: true,
              suffix: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute right-0 top-1/2 -translate-y-1/2 text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)] transition-colors p-2",
                  "aria-label": showPassword ? "Ocultar contraseña" : "Mostrar contraseña",
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "password_confirmation",
              label: "Confirmar contraseña",
              type: "password",
              value: data.password_confirmation,
              onChange: (e) => setData("password_confirmation", e.target.value),
              placeholder: "Repite tu contraseña",
              error: errors.password_confirmation,
              required: true
            }
          ),
          /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-2.5 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: data.terms_accepted,
                onChange: (e) => setData("terms_accepted", e.target.checked),
                className: "mt-0.5 w-4 h-4 border border-[var(--iko-stone-hairline)] accent-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-[13px] leading-relaxed text-[var(--iko-stone-ink)]", children: [
              "Acepto los",
              " ",
              /* @__PURE__ */ jsx(Link, { href: "/terms", className: "underline hover:text-[var(--iko-accent)] transition-colors", children: "Términos de uso" }),
              " ",
              "y la",
              " ",
              /* @__PURE__ */ jsx(Link, { href: "/privacy", className: "underline hover:text-[var(--iko-accent)] transition-colors", children: "Política de privacidad" }),
              "."
            ] })
          ] }),
          errors.terms_accepted && /* @__PURE__ */ jsx("span", { className: "mt-1 flex items-center gap-1.5 font-spec text-[11px] text-[var(--iko-error)]", children: errors.terms_accepted })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "h-12 w-full bg-[var(--iko-accent)] px-6 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors disabled:opacity-50",
            children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
              "Creando cuenta…"
            ] }) : "Crear cuenta"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-[var(--iko-stone-hairline)]" }),
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "o continúa con" }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-[var(--iko-stone-hairline)]" })
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/auth/google",
            className: "h-12 w-full flex items-center justify-center gap-3 border border-[var(--iko-stone-hairline)] text-[var(--iko-stone-ink)] text-[14px] font-medium hover:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors",
            children: [
              /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
                /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
                /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
                /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
              ] }),
              "Continuar con Google"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "text-center text-[13px] text-[var(--iko-stone-whisper)]", children: [
          "¿Ya tienes cuenta?",
          " ",
          /* @__PURE__ */ jsx(Link, { href: "/login", className: "font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] transition-colors", children: "Iniciar sesión" })
        ] })
      ] })
    }
  );
}
export {
  Register as default
};
