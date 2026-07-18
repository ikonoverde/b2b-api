import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, usePage, Deferred } from "@inertiajs/react";
import { C as CustomerShell } from "./CustomerShell-BPYHgCcv.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import "react";
import "lucide-react";
import "./SiteFooter-BfzQHT4y.js";
function BannerCard({
  banner,
  className
}) {
  const inner = /* @__PURE__ */ jsxs(
    "article",
    {
      className: `grid h-full grid-cols-1 overflow-hidden border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] sm:grid-cols-[40%_1fr] ${className ?? ""}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "bg-[var(--iko-stone-mid)]/40", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: banner.image_url,
            alt: "",
            className: "h-full w-full object-cover",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 p-6 sm:p-8", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]", children: banner.title }),
          banner.subtitle && /* @__PURE__ */ jsx("p", { className: "text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: banner.subtitle }),
          banner.link_text && /* @__PURE__ */ jsxs("span", { className: "mt-2 inline-flex items-baseline gap-2 font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent)] uppercase", children: [
            banner.link_text,
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
          ] })
        ] })
      ]
    }
  );
  return /* @__PURE__ */ jsx(BannerLinkWrapper, { banner, children: inner });
}
function BannerLinkWrapper({ banner, children }) {
  if (!banner.link_type || !banner.link_value) {
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
  const linkClass = "block transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset";
  if (banner.link_type === "url") {
    return /* @__PURE__ */ jsx("a", { href: banner.link_value, target: "_blank", rel: "noopener noreferrer", className: linkClass, children });
  }
  const href = banner.link_type === "product" ? `/products/${banner.link_value}` : `/catalog?category_id=${banner.link_value}`;
  return /* @__PURE__ */ jsx(Link, { href, className: linkClass, children });
}
function CustomerDashboard({
  featuredProducts,
  profile,
  banners
}) {
  const { auth } = usePage().props;
  const userName = auth.user?.name ?? "Bienvenido";
  const isReturning = profile.orders_count > 0;
  return /* @__PURE__ */ jsxs(CustomerShell, { title: "Resumen", children: [
    /* @__PURE__ */ jsxs("header", { className: "grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] md:items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "Cuenta · Resumen" }),
        /* @__PURE__ */ jsxs("h1", { className: "font-display text-[clamp(2.25rem,4.5vw,3rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: [
          "Hola, ",
          userName,
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: isReturning ? "Vuelve a pedir tus formatos habituales o explora el catálogo completo." : "Tu cuenta está activa. Empieza por explorar el catálogo o realizar tu primer pedido." })
      ] }),
      /* @__PURE__ */ jsx(AccountReadyPanel, {})
    ] }),
    /* @__PURE__ */ jsx(ReorderBlock, { isReturning }),
    /* @__PURE__ */ jsx(StatStrip, { profile }),
    /* @__PURE__ */ jsx(Deferred, { data: "banners", fallback: /* @__PURE__ */ jsx(BannersSkeleton, {}), children: /* @__PURE__ */ jsx(BannersBlock, { banners }) }),
    /* @__PURE__ */ jsx(FeaturedProducts, { products: featuredProducts })
  ] });
}
function AccountReadyPanel() {
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      "aria-label": "Estado de cuenta",
      className: "border border-[var(--iko-accent-line)] bg-[var(--iko-accent-mist)] p-5 text-[var(--iko-accent-ink)]",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-[var(--iko-accent)]", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] uppercase", children: "Cuenta activa" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-[13px] leading-[1.5]", children: "Compra desde una unidad, con precios visibles antes de pagar." })
      ]
    }
  );
}
function ReorderBlock({ isReturning }) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-labelledby": "reorder-heading",
      className: "mt-14 grid grid-cols-1 gap-8 border border-[var(--iko-accent-line)] bg-[var(--iko-accent-mist)] px-6 py-8 md:grid-cols-[2fr_1fr] md:items-center md:gap-12 md:px-8 md:py-10",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent-ink)] uppercase", children: isReturning ? "Pedido recurrente" : "Empezar" }),
          /* @__PURE__ */ jsx(
            "h2",
            {
              id: "reorder-heading",
              className: "font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.01em] text-[var(--iko-stone-ink)]",
              children: isReturning ? "Reordena tus productos habituales en un paso." : "Tu primer pedido te toma menos de un minuto."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-4 md:items-end", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/catalog",
              className: "inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
              children: isReturning ? "Hacer un pedido" : "Explorar catálogo"
            }
          ),
          isReturning && /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/account/orders",
              className: "inline-flex items-baseline gap-2 text-[13px] text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:underline",
              children: [
                "Ver pedidos anteriores",
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const STAT_LABELS = {
  orders: "Pedidos realizados",
  spent: "Total comprado"
};
function StatStrip({ profile }) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-label": "Resumen de cuenta",
      className: "mt-12 grid grid-cols-1 border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-surface)] sm:grid-cols-2 sm:divide-x sm:divide-[var(--iko-stone-hairline)]",
      children: [
        /* @__PURE__ */ jsx(
          StatItem,
          {
            label: STAT_LABELS.orders,
            value: String(profile.orders_count).padStart(2, "0"),
            hint: profile.orders_count === 1 ? "pedido" : "pedidos"
          }
        ),
        /* @__PURE__ */ jsx(
          StatItem,
          {
            label: STAT_LABELS.spent,
            value: formatCurrency(profile.total_spent)
          }
        )
      ]
    }
  );
}
function StatItem({ label, value, hint }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 border-b border-[var(--iko-stone-hairline)] px-6 py-7 sm:border-b-0 sm:px-8", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[1.75rem] tabular-nums text-[var(--iko-stone-ink)]", children: value }),
    hint && /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: hint })
  ] });
}
function BannersBlock({ banners }) {
  if (!banners || banners.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "banners-heading", className: "mt-20", children: [
    /* @__PURE__ */ jsx(SectionHeader, { index: "01", eyebrow: "Avisos", title: "Novedades", headingId: "banners-heading" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `mt-8 grid gap-px bg-[var(--iko-stone-hairline)] ${banners.length > 1 ? "sm:grid-cols-2" : ""}`,
        children: banners.map((banner) => /* @__PURE__ */ jsx(BannerCard, { banner, className: "h-full" }, banner.id))
      }
    )
  ] });
}
function BannersSkeleton() {
  return /* @__PURE__ */ jsxs("section", { className: "mt-20", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-[var(--iko-stone-hairline)] pb-4", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-48 animate-pulse bg-[var(--iko-stone-mid)]/40" }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid gap-px bg-[var(--iko-stone-hairline)] sm:grid-cols-2", children: [0, 1].map((i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-44 animate-pulse bg-[var(--iko-stone-paper)]"
      },
      i
    )) })
  ] });
}
function FeaturedProducts({ products }) {
  if (products.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "featured-heading", className: "mt-20", children: [
    /* @__PURE__ */ jsx(
      SectionHeader,
      {
        index: "02",
        eyebrow: "Catálogo",
        title: "Productos destacados",
        headingId: "featured-heading",
        action: { href: "/catalog", label: "Ver todo" }
      }
    ),
    /* @__PURE__ */ jsx("ol", { className: "mt-10 border-t border-[var(--iko-stone-hairline)]", children: products.map((product, idx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
      Link,
      {
        href: `/products/${product.slug}`,
        className: "group grid grid-cols-[3rem_4rem_1fr_auto] items-center gap-4 border-b border-[var(--iko-stone-hairline)] py-5 transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset sm:grid-cols-[3rem_5rem_1fr_auto] sm:gap-6",
        children: [
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-accent)]", children: String(idx + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx("span", { className: "h-14 w-14 shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40 sm:h-16 sm:w-16", children: product.image ? /* @__PURE__ */ jsx(
            "img",
            {
              src: product.image,
              alt: "",
              className: "h-full w-full object-cover",
              loading: "lazy"
            }
          ) : null }),
          /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 flex-col gap-1", children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)] truncate", children: product.name }),
            product.category && /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.06em] text-[var(--iko-stone-whisper)] uppercase", children: product.category })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[13px] tabular-nums text-[var(--iko-stone-whisper)] group-hover:text-[var(--iko-accent)]", children: formatCurrency(product.price) })
        ]
      }
    ) }, product.id)) })
  ] });
}
function SectionHeader({
  index,
  eyebrow,
  title,
  headingId,
  action
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-[var(--iko-stone-hairline)] pb-4", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)]", children: index }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        id: headingId,
        className: "font-display text-[1.875rem] leading-tight text-[var(--iko-stone-ink)]",
        children: title
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: eyebrow }),
    action && /* @__PURE__ */ jsxs(
      Link,
      {
        href: action.href,
        className: "ml-auto inline-flex items-baseline gap-2 text-[13px] text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)]",
        children: [
          action.label,
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
        ]
      }
    )
  ] });
}
export {
  CustomerDashboard as default
};
