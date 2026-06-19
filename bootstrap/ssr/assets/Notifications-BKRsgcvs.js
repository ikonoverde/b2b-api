import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import { A as AccountShell } from "./AccountShell-B64sRR20.js";
import { a as apiFetch } from "./api-B-GwsZxI.js";
import "./CustomerShell-BUXLAgvU.js";
import "lucide-react";
import "./SiteFooter-Cn_4a6rU.js";
import "./currency-BiP3uvrU.js";
const TOGGLE_ITEMS = [
  {
    key: "notify_order_updates",
    eyebrow: "01",
    label: "Actualizaciones de pedidos",
    description: "Confirmaciones, cambios de estado, envío y entrega. Es la única categoría que afecta tus pedidos directamente."
  },
  {
    key: "notify_promotional_emails",
    eyebrow: "02",
    label: "Promociones",
    description: "Avisos de ofertas, descuentos por volumen y novedades del catálogo. Bajo volumen, sin spam."
  },
  {
    key: "notify_newsletter",
    eyebrow: "03",
    label: "Boletín",
    description: "Notas sobre nuevas formulaciones, formatos y cambios en el catálogo. Mensual."
  }
];
function Notifications({ preferences }) {
  const { flash } = usePage().props;
  const [data, setData] = useState({ ...preferences });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(flash?.success || "");
  const [error, setError] = useState("");
  function toggle(key) {
    setData((prev) => ({ ...prev, [key]: !prev[key] }));
    if (success) {
      setSuccess("");
    }
    if (error) {
      setError("");
    }
  }
  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const response = await apiFetch("/account/notifications", {
        method: "PUT",
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setSuccess("Preferencias actualizadas.");
      } else {
        setError("No fue posible actualizar las preferencias.");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxs(
    AccountShell,
    {
      title: "Notificaciones",
      eyebrow: "Cuenta · Notificaciones",
      headline: "Notificaciones",
      sub: "Decide qué correos recibir. Las actualizaciones de pedidos están encendidas por defecto y se recomienda mantenerlas activas.",
      section: "notifications",
      children: [
        success && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]", children: success }),
        (error || flash?.error) && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]", children: error || flash?.error }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid grid-cols-1 gap-12 md:grid-cols-[10rem_1fr] md:gap-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Preferencias" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("ol", { className: "border-y border-[var(--iko-stone-hairline)]", children: TOGGLE_ITEMS.map((item) => /* @__PURE__ */ jsx(
              ToggleRow,
              {
                item,
                checked: data[item.key],
                onToggle: () => toggle(item.key)
              },
              item.key
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
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
function ToggleRow({
  item,
  checked,
  onToggle
}) {
  return /* @__PURE__ */ jsxs("li", { className: "grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 border-b border-[var(--iko-stone-hairline)] py-6 last:border-b-0 sm:grid-cols-[3rem_1fr_auto] sm:gap-6", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-stone-mid)]", children: item.eyebrow }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: `toggle-${item.key}`,
          className: "font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]",
          children: item.label
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]", children: item.description })
    ] }),
    /* @__PURE__ */ jsx(Toggle, { id: `toggle-${item.key}`, checked, onChange: onToggle })
  ] });
}
function Toggle({
  id,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      id,
      role: "switch",
      "aria-checked": checked,
      onClick: onChange,
      className: `relative inline-flex h-6 w-11 shrink-0 items-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] ${checked ? "border-[var(--iko-accent)] bg-[var(--iko-accent)]" : "border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)]"}`,
      children: /* @__PURE__ */ jsx(
        "span",
        {
          "aria-hidden": "true",
          className: `inline-block h-4 w-4 bg-[var(--iko-accent-on)] transition-transform ${checked ? "translate-x-[1.375rem]" : "translate-x-[0.125rem] bg-[var(--iko-stone-mid)]"}`
        }
      )
    }
  );
}
export {
  Notifications as default
};
