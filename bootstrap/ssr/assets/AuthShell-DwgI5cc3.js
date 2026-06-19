import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { W as Wordmark, S as SiteFooter } from "./SiteFooter-Cn_4a6rU.js";
function AuthShell({
  title,
  eyebrow,
  headline,
  sub,
  children
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        "data-iko": "",
        className: "relative min-h-screen bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] font-sans antialiased flex flex-col",
        children: [
          /* @__PURE__ */ jsx("header", { className: "border-b border-[var(--iko-stone-hairline)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-[72rem] items-baseline justify-between px-6 py-6 sm:px-10 lg:px-16", children: [
            /* @__PURE__ */ jsx(Link, { href: "/", "aria-label": "Ikonoverde, inicio", children: /* @__PURE__ */ jsx(Wordmark, { size: "md" }) }),
            /* @__PURE__ */ jsx("nav", { className: "flex items-center gap-7 text-[13px]", children: /* @__PURE__ */ jsx(
              Link,
              {
                href: "/catalog",
                className: "text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] rounded-sm transition-colors",
                children: "Catálogo"
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsx("main", { className: "flex-1 flex flex-col items-center px-6 py-16 sm:px-10 sm:py-24 lg:px-16", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[26rem] flex flex-col gap-12", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: eyebrow }),
              /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(2rem,4vw,2.5rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: headline }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: sub })
            ] }),
            children
          ] }) }),
          /* @__PURE__ */ jsx(SiteFooter, {})
        ]
      }
    )
  ] });
}
export {
  AuthShell as A
};
