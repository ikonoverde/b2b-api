import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, usePage, Link } from "@inertiajs/react";
import { S as SiteFooter, W as Wordmark } from "./SiteFooter-Cn_4a6rU.js";
function PublicShell({ title, children }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        "data-iko": "",
        className: "relative flex min-h-screen flex-col overflow-x-clip bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] font-sans antialiased",
        style: {
          fontFeatureSettings: '"ss01", "cv11"'
        },
        children: [
          /* @__PURE__ */ jsx(SiteHeader, {}),
          /* @__PURE__ */ jsx("div", { className: "flex-1 px-6 sm:px-10 lg:px-16", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-[72rem]", children }) }),
          /* @__PURE__ */ jsx(SiteFooter, { className: "mt-32" })
        ]
      }
    )
  ] });
}
function SiteHeader() {
  const { auth } = usePage().props;
  const linkClass = "rounded-sm text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]";
  return /* @__PURE__ */ jsx("header", { className: "border-b border-[var(--iko-stone-hairline)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-[72rem] items-baseline justify-between px-6 py-6 sm:px-10 lg:px-16", children: [
    /* @__PURE__ */ jsx(Link, { href: "/", className: "group flex items-baseline", "aria-label": "Ikonoverde, inicio", children: /* @__PURE__ */ jsx(Wordmark, {}) }),
    /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-7 text-[13px]", children: [
      /* @__PURE__ */ jsx(Link, { href: "/catalog", className: linkClass, children: "Catálogo" }),
      /* @__PURE__ */ jsx(Link, { href: "/blog", className: linkClass, children: "Blog" }),
      auth.user ? /* @__PURE__ */ jsxs(Fragment, { children: [
        auth.canAccessAdmin && /* @__PURE__ */ jsx(Link, { href: "/admin", className: linkClass, children: "Admin" }),
        /* @__PURE__ */ jsx(Link, { href: "/dashboard", className: linkClass, children: "Mi cuenta" })
      ] }) : /* @__PURE__ */ jsx(Link, { href: "/login", className: linkClass, children: "Ingresar" })
    ] })
  ] }) });
}
export {
  PublicShell as P
};
