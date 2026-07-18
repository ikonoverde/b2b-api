import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
function IkonoverdeMark(props) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "5.024 18.754 89.951 68.745",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      "aria-hidden": "true",
      focusable: "false",
      ...props,
      children: /* @__PURE__ */ jsx("path", { d: "M48.45,87.499c0,0-1.772-49.417-43.426-68.745C5.024,18.754,56.809,23.627,48.45,87.499z M62.525,58.003 c10.035-7.941,18.488-15.329,26.783-30.683l0,0c0.363-0.745,0.658-1.35,0.855-1.75c0.75-1.458,2.371-4.974,4.812-6.816 c-0.021-0.001-24.873,1.422-36.395,17.992c-4.271,6.14-7.312,16.379-7.312,35.529c0.055-0.26,0.111-0.528,0.166-0.811 c0.248-1.105,0.66-2.32,1.039-3.658c0.197-0.664,0.401-1.363,0.613-2.084c0.244-0.705,0.538-1.43,0.818-2.171 c0.585-1.483,1.115-3.079,1.908-4.629c0.75-1.569,1.453-3.22,2.387-4.787c0.443-0.794,0.889-1.592,1.342-2.395 c0.445-0.8,0.98-1.557,1.471-2.339c0.506-0.771,0.98-1.564,1.51-2.313c0.543-0.742,1.078-1.478,1.613-2.213 c1.029-1.494,2.229-2.824,3.293-4.18c1.143-1.294,2.232-2.556,3.33-3.69c1.104-1.132,2.145-2.204,3.158-3.13 c1.994-1.899,3.771-3.353,5.029-4.345c1.264-0.991,2.025-1.499,2.025-1.499s-0.744,0.54-1.961,1.579 c-1.216,1.042-2.931,2.561-4.837,4.532c-0.978,0.964-1.965,2.07-3.012,3.239c-1.043,1.169-2.072,2.465-3.149,3.793 c-1.002,1.387-2.132,2.748-3.091,4.265c-0.498,0.746-0.998,1.496-1.5,2.249c-0.489,0.761-0.928,1.562-1.392,2.34 c-0.448,0.792-0.942,1.551-1.354,2.355c-0.406,0.808-0.812,1.61-1.211,2.407c-0.854,1.566-1.479,3.22-2.148,4.777 c-0.707,1.541-1.164,3.121-1.672,4.592c-0.246,0.736-0.504,1.445-0.711,2.146c-0.107,0.432-0.211,0.834-0.312,1.244 C56.346,64.665,58.802,61.368,62.525,58.003z" })
    }
  );
}
function Wordmark({ size = "md" }) {
  const dims = SIZE_MAP[size];
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2.5", "aria-label": "Ikonoverde", children: [
    /* @__PURE__ */ jsx(
      IkonoverdeMark,
      {
        style: { width: dims.mark, height: dims.mark },
        className: "text-[var(--iko-verde)] shrink-0"
      }
    ),
    /* @__PURE__ */ jsxs(
      "span",
      {
        className: "font-display leading-none tracking-[-0.01em]",
        style: { fontSize: dims.text },
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-[var(--iko-stone-ink)]", children: "Ikono" }),
          /* @__PURE__ */ jsx("span", { className: "text-[var(--iko-verde)]", children: "verde" })
        ]
      }
    )
  ] });
}
const SIZE_MAP = {
  sm: { mark: "16px", text: "16px" },
  md: { mark: "22px", text: "22px" },
  lg: { mark: "32px", text: "32px" }
};
const FOOTER_FACTS = [
  { label: "Sin mínimo", value: "Desde 1 unidad" },
  { label: "Precios visibles", value: "Sin iniciar sesión" }
];
const footerLinkClass = "rounded-sm text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-stone-ink)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]";
function SiteFooter({ className = "" }) {
  const { contact } = usePage().props;
  return /* @__PURE__ */ jsx("footer", { className: `${className} border-t border-[var(--iko-stone-hairline)]`, children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[72rem] px-6 py-12 sm:px-10 sm:py-14 lg:px-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-11 lg:grid-cols-[1.15fr_0.65fr_1fr] lg:gap-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-[34rem]", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/",
            className: "inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
            "aria-label": "Ikonoverde, inicio",
            children: /* @__PURE__ */ jsx(Wordmark, { size: "sm" })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-[44ch] text-[15px] leading-[1.65] text-[var(--iko-stone-ink)]/75", children: "Aceite de masaje y cuidado corporal formulado para spas, hoteles y uso profesional en cabina." }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/catalog",
            prefetch: true,
            className: "mt-7 inline-flex items-center bg-[var(--iko-accent)] px-6 py-3 text-[13px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
            children: "Comprar ahora"
          }
        ),
        contact.whatsappUrl && /* @__PURE__ */ jsxs("p", { className: "mt-7", children: [
          /* @__PURE__ */ jsx("span", { className: "block font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Escríbenos" }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: contact.whatsappUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "mt-2 inline-flex rounded-sm text-[15px] text-[var(--iko-accent)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
              children: [
                "WhatsApp",
                contact.phone ? ` · ${contact.phone}` : ""
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Navegación del pie", className: "flex flex-col gap-4 text-[13px]", children: [
        /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Comprar" }),
        /* @__PURE__ */ jsx(Link, { href: "/catalog", prefetch: true, className: footerLinkClass, children: "Catálogo" }),
        /* @__PURE__ */ jsx(Link, { href: "/blog", prefetch: true, className: footerLinkClass, children: "Blog" }),
        /* @__PURE__ */ jsx(Link, { href: "/faq", className: footerLinkClass, children: "Preguntas frecuentes" })
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "footer-terms-heading", children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            id: "footer-terms-heading",
            className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase",
            children: "Condiciones"
          }
        ),
        /* @__PURE__ */ jsx("dl", { className: "mt-4 divide-y divide-[var(--iko-stone-hairline)] border-t border-[var(--iko-stone-hairline)]", children: FOOTER_FACTS.map((fact) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[9.5rem_1fr] gap-5 py-3.5", children: [
          /* @__PURE__ */ jsx("dt", { className: "font-spec text-[11px] leading-5 tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: fact.label }),
          /* @__PURE__ */ jsx("dd", { className: "text-[14px] leading-5 text-[var(--iko-stone-ink)]", children: fact.value })
        ] }, fact.label)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-col gap-4 border-t border-[var(--iko-stone-hairline)] pt-6 sm:flex-row sm:items-baseline sm:justify-between", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Ikonoverde"
      ] }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Legal", className: "flex items-center gap-6 text-[13px]", children: [
        /* @__PURE__ */ jsx(Link, { href: "/terms", className: footerLinkClass, children: "Términos" }),
        /* @__PURE__ */ jsx(Link, { href: "/privacy", className: footerLinkClass, children: "Privacidad" })
      ] })
    ] })
  ] }) });
}
export {
  SiteFooter as S,
  Wordmark as W
};
