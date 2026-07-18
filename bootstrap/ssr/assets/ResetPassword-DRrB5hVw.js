import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { EyeOff, Eye } from "lucide-react";
import { A as AuthShell } from "./AuthShell-Bulns-kt.js";
import { T as TextInput } from "./TextInput-DJaWKAzU.js";
import "./SiteFooter-BfzQHT4y.js";
function ResetPassword({ token, email }) {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    token,
    email,
    password: "",
    password_confirmation: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/reset-password");
  };
  return /* @__PURE__ */ jsx(
    AuthShell,
    {
      title: "Nueva contraseña",
      eyebrow: "01 · Restablecer",
      headline: "Nueva contraseña",
      sub: "Elige una contraseña que no hayas usado antes en esta cuenta.",
      children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 border-b border-[var(--iko-stone-hairline)] pb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Cuenta" }),
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[14px] text-[var(--iko-stone-ink)] tabular-nums", children: email || "No se proporcionó email" })
        ] }),
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "token", value: token }),
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "email", value: email }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "password",
              label: "Nueva contraseña",
              type: showPassword ? "text" : "password",
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              placeholder: "Mínimo 8 caracteres",
              error: errors.password,
              autoFocus: true,
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
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "h-12 w-full bg-[var(--iko-accent)] px-6 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors disabled:opacity-50",
            children: processing ? "Restableciendo…" : "Restablecer contraseña"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-center text-[13px] text-[var(--iko-stone-whisper)]", children: /* @__PURE__ */ jsx(Link, { href: "/login", className: "font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] transition-colors", children: "← Volver al inicio de sesión" }) })
      ] })
    }
  );
}
export {
  ResetPassword as default
};
