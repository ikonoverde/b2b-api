import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { C as CustomerShell } from "./CustomerShell-BUXLAgvU.js";
const ACCOUNT_NAV = [
  { section: "overview", label: "Resumen", href: "/account" },
  { section: "orders", label: "Pedidos", href: "/account/orders" },
  { section: "addresses", label: "Direcciones", href: "/account/addresses" },
  { section: "payment-methods", label: "Métodos de pago", href: "/account/payment-methods" },
  { section: "notifications", label: "Notificaciones", href: "/account/notifications" },
  { section: "profile", label: "Perfil", href: "/account/profile" }
];
function AccountShell({
  title,
  eyebrow,
  headline,
  sub,
  section,
  children
}) {
  return /* @__PURE__ */ jsxs(CustomerShell, { title, children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 pb-2", children: [
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: eyebrow }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: headline }),
      sub && /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: sub })
    ] }),
    /* @__PURE__ */ jsx(
      "nav",
      {
        "aria-label": "Navegación de cuenta",
        className: "-mx-6 mt-10 overflow-x-auto border-y border-[var(--iko-stone-hairline)] sm:-mx-10 lg:-mx-16",
        children: /* @__PURE__ */ jsx("ol", { className: "mx-auto flex max-w-[72rem] items-stretch px-6 sm:px-10 lg:px-16", children: ACCOUNT_NAV.map((entry, idx) => {
          const isActive = entry.section === section;
          return /* @__PURE__ */ jsx("li", { className: "shrink-0", children: /* @__PURE__ */ jsxs(
            Link,
            {
              href: entry.href,
              "aria-current": isActive ? "page" : void 0,
              className: `group flex items-baseline gap-2 py-4 pr-7 text-[13px] transition-colors ${isActive ? "text-[var(--iko-stone-ink)]" : "text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]"} focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]`,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `font-spec text-[11px] tabular-nums tracking-[0.04em] ${isActive ? "text-[var(--iko-accent)]" : "text-[var(--iko-stone-mid)] group-hover:text-[var(--iko-stone-whisper)]"}`,
                    children: String(idx + 1).padStart(2, "0")
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: entry.label })
              ]
            }
          ) }, entry.section);
        }) })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "pt-12", children })
  ] });
}
export {
  AccountShell as A
};
