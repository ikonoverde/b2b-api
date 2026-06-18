import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { X, EyeOff, Eye } from "lucide-react";
import { A as AccountShell } from "./AccountShell-BEtaQOIT.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import "./CustomerShell-D8_I-KnY.js";
import "./SiteFooter-DIt_Mg7v.js";
const EMPTY_PASSWORD_FORM = {
  current_password: "",
  password: "",
  password_confirmation: ""
};
function Account({ profile }) {
  const { auth, flash } = usePage().props;
  const user = auth.user;
  return /* @__PURE__ */ jsxs(
    AccountShell,
    {
      title: "Mi cuenta",
      eyebrow: "Cuenta · Resumen",
      headline: `Hola, ${user.name}`,
      sub: "Información de cuenta y atajos a tu actividad reciente.",
      section: "overview",
      children: [
        flash?.success && /* @__PURE__ */ jsx(FlashBanner, { kind: "success", message: flash.success }),
        /* @__PURE__ */ jsx(ContactBlock, { user }),
        /* @__PURE__ */ jsx(StatStrip, { profile }),
        /* @__PURE__ */ jsx(PasswordSection, {}),
        /* @__PURE__ */ jsx(SignOutBlock, {})
      ]
    }
  );
}
function ContactBlock({
  user
}) {
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "contact-heading", className: "grid grid-cols-1 gap-6 border-b border-[var(--iko-stone-hairline)] pb-10 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-12", children: [
    /* @__PURE__ */ jsx(
      "h2",
      {
        id: "contact-heading",
        className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase",
        children: "Contacto"
      }
    ),
    /* @__PURE__ */ jsxs("dl", { className: "border-t border-[var(--iko-stone-hairline)]", children: [
      /* @__PURE__ */ jsx(SpecRow, { label: "Nombre", value: user.name }),
      /* @__PURE__ */ jsx(SpecRow, { label: "Email", value: user.email, mono: true }),
      /* @__PURE__ */ jsx(SpecRow, { label: "Iniciales", value: user.initials, mono: true }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-6 py-3", children: [
        /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Editar" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/account/profile",
            className: "inline-flex items-baseline gap-2 text-[13px] text-[var(--iko-accent)] hover:text-[var(--iko-accent-hover)]",
            children: [
              "Editar perfil",
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
function StatStrip({ profile }) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-label": "Resumen comercial",
      className: "mt-10 grid grid-cols-1 border-y border-[var(--iko-stone-hairline)] sm:grid-cols-2 sm:divide-x sm:divide-[var(--iko-stone-hairline)]",
      children: [
        /* @__PURE__ */ jsx(
          StatItem,
          {
            label: "Pedidos realizados",
            value: String(profile.orders_count).padStart(2, "0"),
            hint: profile.orders_count === 1 ? "pedido" : "pedidos"
          }
        ),
        /* @__PURE__ */ jsx(
          StatItem,
          {
            label: "Total comprado",
            value: formatCurrency(profile.total_spent)
          }
        )
      ]
    }
  );
}
function StatItem({ label, value, hint }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 border-b border-[var(--iko-stone-hairline)] py-7 last:border-b-0 sm:border-b-0 sm:px-8 sm:first:pl-0 sm:last:pr-0", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[1.75rem] tabular-nums text-[var(--iko-stone-ink)]", children: value }),
    hint && /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: hint })
  ] });
}
function PasswordSection() {
  const [showModal, setShowModal] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "section",
      {
        "aria-labelledby": "security-heading",
        className: "mt-12 grid grid-cols-1 gap-6 border-b border-[var(--iko-stone-hairline)] pb-10 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-12",
        children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              id: "security-heading",
              className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase",
              children: "Seguridad"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]", children: "Cambia tu contraseña periódicamente para mantener tu cuenta segura." }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowModal(true),
                className: "inline-flex h-11 items-center border border-[var(--iko-stone-hairline)] px-5 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
                children: "Cambiar contraseña"
              }
            ) })
          ] })
        ]
      }
    ),
    showModal && /* @__PURE__ */ jsx(PasswordModal, { onClose: () => setShowModal(false) })
  ] });
}
function SignOutBlock() {
  function logout() {
    router.post("/logout");
  }
  return /* @__PURE__ */ jsxs("section", { className: "mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--iko-stone-hairline)] py-6", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Sesión" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: logout,
        className: "font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-ink)] uppercase hover:text-[var(--iko-error)] transition-colors",
        children: "Cerrar sesión →"
      }
    )
  ] });
}
function SpecRow({ label, value, mono = false }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[8rem_1fr] items-baseline gap-6 border-b border-[var(--iko-stone-hairline)] py-3 last:border-b-0", children: [
    /* @__PURE__ */ jsx("dt", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: label }),
    /* @__PURE__ */ jsx(
      "dd",
      {
        className: `text-[14px] text-[var(--iko-stone-ink)] ${mono ? "font-spec tabular-nums" : ""}`,
        children: value
      }
    )
  ] });
}
function FlashBanner({ kind, message }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `mt-2 border px-5 py-4 text-[13px] leading-relaxed ${kind === "success" ? "border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] text-[var(--iko-stone-ink)]" : "border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 text-[var(--iko-error)]"}`,
      children: message
    }
  );
}
function PasswordModal({ onClose }) {
  const [data, setData] = useState(EMPTY_PASSWORD_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: void 0 }));
    }
    if (success) {
      setSuccess("");
    }
  }
  function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    router.put("/account/password", data, {
      preserveScroll: true,
      onSuccess: () => {
        setSuccess("Contraseña actualizada.");
        setData(EMPTY_PASSWORD_FORM);
        setTimeout(onClose, 1600);
      },
      onError: (validationErrors) => {
        setErrors(validationErrors);
      },
      onFinish: () => {
        setSubmitting(false);
      }
    });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "password-modal-heading",
      className: "fixed inset-0 z-50 flex items-center justify-center bg-[var(--iko-stone-ink)]/40 p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "w-full max-w-[28rem] border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] shadow-[0_24px_60px_-20px_rgba(13,38,46,0.25)]",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between border-b border-[var(--iko-stone-hairline)] px-6 py-5", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: "password-modal-heading",
                  className: "font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]",
                  children: "Cambiar contraseña"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]",
                  "aria-label": "Cerrar",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", strokeWidth: 1.5 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col gap-6 p-6", children: [
              success && /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-4 py-3 text-[13px] text-[var(--iko-stone-ink)]", children: success }),
              /* @__PURE__ */ jsx(
                PasswordField,
                {
                  id: "current_password",
                  name: "current_password",
                  label: "Contraseña actual",
                  value: data.current_password,
                  error: errors.current_password,
                  onChange: handleChange
                }
              ),
              /* @__PURE__ */ jsx(
                PasswordField,
                {
                  id: "password",
                  name: "password",
                  label: "Nueva contraseña",
                  value: data.password,
                  error: errors.password,
                  onChange: handleChange
                }
              ),
              /* @__PURE__ */ jsx(
                PasswordField,
                {
                  id: "password_confirmation",
                  name: "password_confirmation",
                  label: "Confirmar nueva contraseña",
                  value: data.password_confirmation,
                  error: errors.password_confirmation,
                  onChange: handleChange
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "flex-1 border border-[var(--iko-stone-hairline)] py-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)]",
                    children: "Cancelar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: submitting,
                    className: "flex-1 bg-[var(--iko-accent)] py-3 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] disabled:opacity-60",
                    children: submitting ? "Guardando…" : "Cambiar"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function PasswordField({
  id,
  name,
  label,
  value,
  error,
  onChange
}) {
  const [visible, setVisible] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsx(
      "label",
      {
        htmlFor: id,
        className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase",
        children: label
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: visible ? "text" : "password",
          id,
          name,
          value,
          onChange,
          required: true,
          className: `h-12 w-full border-b bg-transparent pr-10 font-sans text-[15px] text-[var(--iko-stone-ink)] placeholder:text-[var(--iko-stone-whisper)] focus-visible:border-[var(--iko-accent)] focus-visible:outline-none ${error ? "border-[var(--iko-error)]" : "border-[var(--iko-stone-hairline)]"}`,
          "aria-invalid": error ? "true" : void 0
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setVisible((v) => !v),
          className: "absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]",
          "aria-label": visible ? "Ocultar contraseña" : "Mostrar contraseña",
          children: visible ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]", children: error })
  ] });
}
export {
  Account as default
};
