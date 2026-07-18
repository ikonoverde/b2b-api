import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { P as PublicShell } from "./PublicShell-nawmX4QX.js";
import { c as formatDateMonthYear } from "./date-CuQtAuCG.js";
function DocumentSheet({
  title,
  eyebrow,
  updatedAt,
  related = [],
  children
}) {
  return /* @__PURE__ */ jsx(PublicShell, { title, children: /* @__PURE__ */ jsxs("article", { children: [
    /* @__PURE__ */ jsxs("header", { className: "pt-16 pb-12 sm:pt-24 sm:pb-16", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: [
        "Ikonoverde · ",
        eyebrow
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 max-w-[28ch] font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: title }),
      /* @__PURE__ */ jsxs("p", { className: "mt-8 font-spec text-[11px] tabular-nums tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: [
        "Última actualización · ",
        formatDateMonthYear(updatedAt)
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--iko-stone-hairline)] pt-12 pb-16", children: /* @__PURE__ */ jsx("div", { className: "font-sans text-[var(--iko-stone-ink)]", children }) }),
    related.length > 0 && /* @__PURE__ */ jsxs("footer", { className: "border-t border-[var(--iko-stone-hairline)] pt-10 pb-4", children: [
      /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Documentos relacionados" }),
      /* @__PURE__ */ jsx("ul", { className: "mt-6 grid gap-px bg-[var(--iko-stone-hairline)] sm:grid-cols-2", children: related.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: item.href,
          className: "group flex items-baseline justify-between gap-4 bg-[var(--iko-stone-paper)] py-5 pr-4 text-[15px] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]", children: item.label }),
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent)] uppercase transition-transform group-hover:translate-x-0.5",
                children: "Ver →"
              }
            )
          ]
        }
      ) }, item.href)) })
    ] })
  ] }) });
}
function Section({ title, children }) {
  return /* @__PURE__ */ jsxs("section", { className: "mt-14 border-t border-[var(--iko-stone-hairline)] pt-10 first:mt-0 first:border-t-0 first:pt-0", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-6 font-display text-[clamp(1.5rem,2.5vw,1.875rem)] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)]", children: title }),
    children
  ] });
}
function P({ children }) {
  return /* @__PURE__ */ jsx("p", { className: "mb-5 max-w-[65ch] text-[16px] leading-[1.65] text-[var(--iko-stone-ink)]/85", children });
}
function List({ children }) {
  return /* @__PURE__ */ jsx("ul", { className: "mb-6 max-w-[65ch] list-none space-y-2 pl-0", children });
}
function Item({ children }) {
  return /* @__PURE__ */ jsx("li", { className: "relative pl-6 text-[15.5px] leading-[1.65] text-[var(--iko-stone-ink)]/85 before:absolute before:top-[0.5em] before:left-0 before:h-px before:w-3 before:bg-[var(--iko-accent)]", children });
}
function Strong({ children }) {
  return /* @__PURE__ */ jsx("strong", { className: "font-medium text-[var(--iko-stone-ink)]", children });
}
function ContactList({
  contactEmail,
  contactPhone,
  contactAddress,
  extra
}) {
  return /* @__PURE__ */ jsxs(List, { children: [
    contactEmail && /* @__PURE__ */ jsxs(Item, { children: [
      "Correo electrónico: ",
      contactEmail
    ] }),
    contactPhone && /* @__PURE__ */ jsxs(Item, { children: [
      "Teléfono: ",
      contactPhone
    ] }),
    contactAddress && /* @__PURE__ */ jsxs(Item, { children: [
      "Dirección: ",
      contactAddress
    ] }),
    extra
  ] });
}
function DocLink({ href, children }) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      href,
      className: "rounded-sm text-[var(--iko-accent)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
      children
    }
  );
}
export {
  ContactList as C,
  DocumentSheet as D,
  Item as I,
  List as L,
  P,
  Section as S,
  Strong as a,
  DocLink as b
};
