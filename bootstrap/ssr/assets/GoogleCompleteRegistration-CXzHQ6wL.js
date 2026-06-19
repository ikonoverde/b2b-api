import { jsx, jsxs } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { A as AuthShell } from "./AuthShell-DwgI5cc3.js";
import { T as TextInput } from "./TextInput-DJaWKAzU.js";
import "./SiteFooter-Cn_4a6rU.js";
function GoogleCompleteRegistration() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    rfc: "",
    phone: "",
    terms_accepted: false
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/auth/google/complete-registration");
  };
  return /* @__PURE__ */ jsx(
    AuthShell,
    {
      title: "Completar registro",
      eyebrow: "01 · Completar registro",
      headline: "Un par de datos más",
      sub: "Para terminar de crear tu cuenta necesitamos un par de datos más.",
      children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-8", children: [
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
          errors.terms_accepted && /* @__PURE__ */ jsx("span", { className: "mt-1 font-spec text-[11px] text-[var(--iko-error)]", children: errors.terms_accepted })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "h-12 w-full bg-[var(--iko-accent)] px-6 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors disabled:opacity-50",
            children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
              "Guardando…"
            ] }) : "Completar registro"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-center text-[13px] text-[var(--iko-stone-whisper)]", children: /* @__PURE__ */ jsx(Link, { href: "/login", className: "font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] transition-colors", children: "← Volver al inicio de sesión" }) })
      ] })
    }
  );
}
export {
  GoogleCompleteRegistration as default
};
