import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, usePage, useForm, Head } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, LogOut, X, Menu } from "lucide-react";
import { W as Wordmark, S as SiteFooter } from "./SiteFooter-Cn_4a6rU.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
function MiniCart({ miniCart }) {
  const { items, subtotal, totalCount } = miniCart;
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: containerRef, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen(!open),
        className: "inline-flex h-9 items-center gap-2 px-2 text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors",
        "aria-label": `Carrito · ${totalCount} ${totalCount === 1 ? "producto" : "productos"}`,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4.5 w-4.5", strokeWidth: 1.5 }),
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[12px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]", children: String(totalCount).padStart(2, "0") })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        role: "dialog",
        "aria-label": "Resumen del carrito",
        className: "absolute right-0 top-full z-50 mt-3 w-80 border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] sm:w-96",
        children: totalCount === 0 ? /* @__PURE__ */ jsx(EmptyState, { onDismiss: () => setOpen(false) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("header", { className: "flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] px-5 py-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: "Carrito" }),
            /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
              totalCount,
              " ",
              totalCount === 1 ? "producto" : "productos"
            ] })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "max-h-80 divide-y divide-[var(--iko-stone-hairline)] overflow-y-auto", children: items.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 px-5 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40", children: item.image ? /* @__PURE__ */ jsx(
              "img",
              {
                src: item.image,
                alt: "",
                className: "h-full w-full object-cover",
                loading: "lazy"
              }
            ) : null }),
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: "truncate text-[13px] leading-tight text-[var(--iko-stone-ink)]", children: item.name }),
              /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]", children: [
                item.quantity,
                " × ",
                formatCurrency(item.price)
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "shrink-0 font-spec text-[12px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(item.subtotal) })
          ] }, item.id)) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] px-5 py-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { className: "font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(subtotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-px border-t border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-hairline)]", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/cart",
                onClick: () => setOpen(false),
                className: "flex-1 bg-[var(--iko-stone-paper)] py-3 text-center text-[13px] text-[var(--iko-stone-ink)] hover:bg-[var(--iko-accent-soft)]",
                children: "Ver carrito"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/checkout/shipping",
                onClick: () => setOpen(false),
                className: "flex-1 bg-[var(--iko-accent)] py-3 text-center text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]",
                children: "Realizar pedido"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function EmptyState({ onDismiss }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-3 px-5 py-6", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: "Carrito vacío" }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[26ch] text-[13px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: "Agrega productos desde el catálogo para empezar tu pedido." }),
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/catalog",
        onClick: onDismiss,
        className: "inline-flex items-baseline gap-2 text-[13px] font-medium text-[var(--iko-accent)] hover:text-[var(--iko-accent-hover)]",
        children: [
          "Ver catálogo",
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
        ]
      }
    )
  ] });
}
function CustomerShell({ title, children }) {
  const { auth, miniCart } = usePage().props;
  const user = auth.user;
  const canAccessAdmin = auth.canAccessAdmin;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { post, processing } = useForm({});
  const handleLogout = () => {
    post("/logout");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        "data-iko": "",
        className: "relative flex min-h-screen flex-col bg-[var(--iko-stone-paper)] font-sans text-[var(--iko-stone-ink)] antialiased",
        children: [
          /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 border-b border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)]", children: [
            /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-[72rem] items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-16", children: [
              /* @__PURE__ */ jsx(Link, { href: "/dashboard", "aria-label": "Ikonoverde, inicio", className: "shrink-0", children: /* @__PURE__ */ jsx(Wordmark, { size: "md" }) }),
              /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-7 text-[13px] md:flex", children: [
                /* @__PURE__ */ jsx(NavLink, { href: "/catalog", children: "Catálogo" }),
                canAccessAdmin && /* @__PURE__ */ jsx(NavLink, { href: "/admin", children: "Admin" }),
                /* @__PURE__ */ jsx(NavLink, { href: "/account/orders", children: "Pedidos" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                user && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    MiniCart,
                    {
                      miniCart: miniCart ?? { items: [], subtotal: 0, totalCount: 0 }
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Link,
                    {
                      href: "/account",
                      className: "ml-2 hidden h-9 items-center gap-2.5 border border-[var(--iko-stone-hairline)] px-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] md:inline-flex",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: user.initials }),
                        /* @__PURE__ */ jsx("span", { children: "Cuenta" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleLogout,
                      disabled: processing,
                      className: "hidden h-9 w-9 items-center justify-center text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] md:inline-flex",
                      title: "Cerrar sesión",
                      "aria-label": "Cerrar sesión",
                      children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setMobileOpen(!mobileOpen),
                    className: "inline-flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] md:hidden",
                    "aria-label": mobileOpen ? "Cerrar menú" : "Abrir menú",
                    "aria-expanded": mobileOpen,
                    children: mobileOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
                  }
                )
              ] })
            ] }),
            mobileOpen && /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] md:hidden", children: /* @__PURE__ */ jsxs("nav", { className: "mx-auto flex max-w-[72rem] flex-col px-6 sm:px-10", children: [
              /* @__PURE__ */ jsx(MobileLink, { href: "/catalog", onSelect: () => setMobileOpen(false), children: "Catálogo" }),
              /* @__PURE__ */ jsx(MobileLink, { href: "/account/orders", onSelect: () => setMobileOpen(false), children: "Pedidos" }),
              canAccessAdmin && /* @__PURE__ */ jsx(MobileLink, { href: "/admin", onSelect: () => setMobileOpen(false), children: "Admin" }),
              /* @__PURE__ */ jsx(MobileLink, { href: "/account", onSelect: () => setMobileOpen(false), children: "Mi cuenta" }),
              user && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleLogout,
                  disabled: processing,
                  className: "flex items-center justify-between border-t border-[var(--iko-stone-hairline)] py-4 text-left text-[14px] text-[var(--iko-stone-whisper)]",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: "Cerrar sesión" }),
                    /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" })
                  ]
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-[72rem] px-6 py-10 sm:px-10 sm:py-14 lg:px-16", children }) }),
          /* @__PURE__ */ jsx(SiteFooter, { className: "mt-16" })
        ]
      }
    )
  ] });
}
function NavLink({ href, children }) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      href,
      className: "rounded-sm text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
      children
    }
  );
}
function MobileLink({
  href,
  onSelect,
  children
}) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href,
      onClick: onSelect,
      className: "flex items-center justify-between border-b border-[var(--iko-stone-hairline)] py-4 text-[14px] text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)]",
      children: [
        children,
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-[var(--iko-stone-whisper)]", children: "→" })
      ]
    }
  );
}
export {
  CustomerShell as C
};
