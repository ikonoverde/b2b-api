import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, useForm } from "@inertiajs/react";
import { useRef, useEffect } from "react";
import { P as PublicShell } from "./PublicShell-BcEJPWWt.js";
import "./SiteFooter-Cn_4a6rU.js";
function MeridaSamples({ options }) {
  const { flash } = usePage().props;
  const successMessageRef = useRef(null);
  const form = useForm({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    business_type: "",
    client_volume: "",
    social_url: "",
    products_interested: [],
    improvement_goals: []
  });
  useEffect(() => {
    if (flash.success) {
      const timeout = window.setTimeout(() => {
        successMessageRef.current?.scrollIntoView({ block: "start" });
      });
      return () => window.clearTimeout(timeout);
    }
  }, [flash.success]);
  function submit(event) {
    event.preventDefault();
    form.post("/muestras-gratis-merida", {
      onSuccess: () => form.reset()
    });
  }
  function toggleArrayValue(field, value) {
    const values = form.data[field];
    form.setData(
      field,
      values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
    );
  }
  return /* @__PURE__ */ jsx(PublicShell, { title: "Muestras gratis para negocios en Mérida", children: /* @__PURE__ */ jsx("section", { className: "py-16 sm:py-20 lg:py-24", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16", children: [
    /* @__PURE__ */ jsxs("header", { className: "lg:sticky lg:top-10 lg:self-start", children: [
      /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent-ink)] uppercase", children: "Mérida · Yucatán" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 max-w-[12ch] font-display text-[clamp(2.45rem,5.4vw,4.75rem)] leading-[0.98] tracking-[-0.025em] text-[var(--iko-stone-ink)]", children: "Muestras para cabina profesional." }),
      /* @__PURE__ */ jsx("p", { className: "mt-7 max-w-[50ch] text-[16px] leading-[1.7] text-[var(--iko-stone-ink)]/75", children: "Programa local para negocios de bienestar en Mérida. El cuestionario nos ayuda a validar el tipo de servicio, volumen de uso y productos que vale la pena enviar para prueba." }),
      /* @__PURE__ */ jsxs("dl", { className: "mt-10 grid gap-px border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-hairline)] sm:grid-cols-3 lg:grid-cols-1", children: [
        /* @__PURE__ */ jsx(SpecFact, { label: "Costo", value: "Sin cargo" }),
        /* @__PURE__ */ jsx(SpecFact, { label: "Zona", value: "Mérida" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: submit,
        className: "border-t border-[var(--iko-accent-line)] pt-8",
        children: [
          flash.success && /* @__PURE__ */ jsxs(
            "div",
            {
              ref: successMessageRef,
              className: "mb-8 border border-[var(--iko-accent-line)] bg-[var(--iko-accent-mist)] px-5 py-4 text-[var(--iko-accent-ink)]",
              children: [
                /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.08em] uppercase", children: "Solicitud enviada" }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-[14px] leading-[1.6]", children: flash.success })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-10", children: [
            /* @__PURE__ */ jsxs(
              "section",
              {
                "aria-labelledby": "contact-heading",
                className: "grid gap-6",
                children: [
                  /* @__PURE__ */ jsx(
                    SectionLabel,
                    {
                      index: "01",
                      title: "Datos de seguimiento",
                      headingId: "contact-heading"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
                    /* @__PURE__ */ jsx(
                      TextField,
                      {
                        id: "business_name",
                        label: "Nombre del negocio",
                        value: form.data.business_name,
                        error: form.errors.business_name,
                        required: true,
                        onChange: (value) => form.setData("business_name", value)
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      TextField,
                      {
                        id: "contact_name",
                        label: "Nombre de contacto",
                        value: form.data.contact_name,
                        error: form.errors.contact_name,
                        required: true,
                        onChange: (value) => form.setData("contact_name", value)
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      TextField,
                      {
                        id: "email",
                        label: "Correo",
                        type: "email",
                        value: form.data.email,
                        error: form.errors.email,
                        required: true,
                        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                        onChange: (value) => form.setData("email", value)
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      TextField,
                      {
                        id: "phone",
                        label: "Teléfono",
                        type: "tel",
                        value: form.data.phone,
                        error: form.errors.phone,
                        required: true,
                        pattern: "[0-9]{10}",
                        inputMode: "numeric",
                        maxLength: 10,
                        placeholder: "9991234567",
                        onChange: (value) => form.setData("phone", value)
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              RadioGroup,
              {
                index: "02",
                name: "business_type",
                title: "¿Cuál es tu tipo de negocio?",
                options: options.businessTypes,
                value: form.data.business_type,
                error: form.errors.business_type,
                onChange: (value) => form.setData("business_type", value)
              }
            ),
            /* @__PURE__ */ jsx(
              RadioGroup,
              {
                index: "03",
                name: "client_volume",
                title: "¿Cuál es tu volumen de clientes o consumo mensual aproximado?",
                options: options.clientVolumes,
                value: form.data.client_volume,
                error: form.errors.client_volume,
                onChange: (value) => form.setData("client_volume", value)
              }
            ),
            /* @__PURE__ */ jsxs(
              "section",
              {
                "aria-labelledby": "social-heading",
                className: "grid gap-6",
                children: [
                  /* @__PURE__ */ jsx(
                    SectionLabel,
                    {
                      index: "04",
                      title: "Sitio web o enlace a sus redes sociales",
                      headingId: "social-heading"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    TextField,
                    {
                      id: "social_url",
                      label: "URL (opcional, recomendado)",
                      type: "url",
                      value: form.data.social_url,
                      error: form.errors.social_url,
                      placeholder: "https://instagram.com/tu-negocio",
                      onChange: (value) => form.setData("social_url", value)
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              CheckboxGroup,
              {
                index: "05",
                name: "products_interested",
                title: "¿Qué producto de nuestra línea te interesa probar más?",
                options: options.products,
                values: form.data.products_interested,
                error: form.errors.products_interested,
                onChange: (value) => toggleArrayValue(
                  "products_interested",
                  value
                )
              }
            ),
            /* @__PURE__ */ jsx(
              CheckboxGroup,
              {
                index: "06",
                name: "improvement_goals",
                title: "¿Qué buscas mejorar en tus insumos actuales?",
                options: options.improvementGoals,
                values: form.data.improvement_goals,
                error: form.errors.improvement_goals,
                onChange: (value) => toggleArrayValue("improvement_goals", value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 border-t border-[var(--iko-stone-hairline)] pt-8", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: form.processing,
                className: "inline-flex h-12 w-full items-center justify-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
                children: form.processing ? "Enviando solicitud..." : "Enviar solicitud de muestras"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-[58ch] text-[13px] leading-[1.6] text-[var(--iko-stone-whisper)]", children: "Enviar este formulario no garantiza el envío de muestras. Revisaremos disponibilidad, zona y compatibilidad con el tipo de servicio." })
          ] })
        ]
      }
    )
  ] }) }) });
}
function SpecFact({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-[var(--iko-stone-surface)] px-5 py-4", children: [
    /* @__PURE__ */ jsx("dt", { className: "font-spec text-[10px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-2 font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]", children: value })
  ] });
}
function SectionLabel({
  index,
  title,
  headingId
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-[3rem_1fr] sm:items-baseline", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent-ink)]", children: index }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        id: headingId,
        className: "font-display text-[1.45rem] leading-[1.12] text-[var(--iko-stone-ink)]",
        children: title
      }
    )
  ] });
}
function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
  placeholder,
  required = false,
  pattern,
  inputMode,
  maxLength
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ jsxs(
      "label",
      {
        htmlFor: id,
        className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase",
        children: [
          label,
          required && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "ml-1 opacity-50", children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        id,
        name: id,
        type,
        value,
        placeholder,
        required,
        pattern,
        inputMode,
        maxLength,
        onChange: (event) => onChange(event.target.value),
        "aria-invalid": error ? "true" : void 0,
        "aria-describedby": error ? `${id}-error` : void 0,
        className: `h-12 border-b bg-transparent font-sans text-[15px] text-[var(--iko-stone-ink)] transition-colors placeholder:text-[var(--iko-stone-whisper)] focus-visible:border-[var(--iko-accent)] focus-visible:outline-none ${error ? "border-[var(--iko-error)]" : "border-[var(--iko-stone-hairline)]"}`
      }
    ),
    /* @__PURE__ */ jsx(FieldError, { id: `${id}-error`, error })
  ] });
}
function RadioGroup({
  index,
  name,
  title,
  options,
  value,
  error,
  onChange
}) {
  const headingId = `${name}-heading`;
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": headingId, className: "grid gap-6", children: [
    /* @__PURE__ */ jsx(SectionLabel, { index, title, headingId }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-px border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-hairline)]", children: options.map((option) => /* @__PURE__ */ jsxs(
      "label",
      {
        className: "flex cursor-pointer items-center gap-4 bg-[var(--iko-stone-surface)] px-4 py-4 transition-colors hover:bg-[var(--iko-accent-soft)]",
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name,
              value: option,
              checked: value === option,
              onChange: () => onChange(option),
              className: "h-4 w-4 accent-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-surface)]"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-[14px] leading-[1.45] text-[var(--iko-stone-ink)]", children: option })
        ]
      },
      option
    )) }),
    /* @__PURE__ */ jsx(FieldError, { id: `${name}-error`, error })
  ] });
}
function CheckboxGroup({
  index,
  name,
  title,
  options,
  values,
  error,
  onChange
}) {
  const headingId = `${name}-heading`;
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": headingId, className: "grid gap-6", children: [
    /* @__PURE__ */ jsx(SectionLabel, { index, title, headingId }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-px border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-hairline)] sm:grid-cols-2", children: options.map((option) => /* @__PURE__ */ jsxs(
      "label",
      {
        className: "flex cursor-pointer items-center gap-4 bg-[var(--iko-stone-surface)] px-4 py-4 transition-colors hover:bg-[var(--iko-accent-soft)]",
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              name: `${name}[]`,
              value: option,
              checked: values.includes(option),
              onChange: () => onChange(option),
              className: "h-4 w-4 accent-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-surface)]"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-[14px] leading-[1.45] text-[var(--iko-stone-ink)]", children: option })
        ]
      },
      option
    )) }),
    /* @__PURE__ */ jsx(FieldError, { id: `${name}-error`, error })
  ] });
}
function FieldError({ id, error }) {
  if (!error) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      id,
      className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]",
      children: error
    }
  );
}
export {
  MeridaSamples as default
};
