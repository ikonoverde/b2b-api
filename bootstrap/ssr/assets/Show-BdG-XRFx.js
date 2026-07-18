import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Minus, Plus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { C as CustomerShell } from "./CustomerShell-BPYHgCcv.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import { f as trackGoogleAnalyticsViewItem, g as trackMetaViewContent, t as trackGoogleAnalyticsAddToCart, a as trackMetaAddToCart, M as META_PIXEL_CURRENCY } from "./analytics-BNINfFmc.js";
import "./SiteFooter-BfzQHT4y.js";
function ProductShow({ product, related_products }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;
  const stockReady = product.stock > 0 && product.is_active;
  const detailSections = [
    {
      headingId: "description-heading",
      eyebrow: "Producto",
      title: "Descripción",
      html: product.description
    },
    {
      headingId: "active-ingredients-heading",
      eyebrow: "Fórmula",
      title: "Ingredientes activos",
      html: product.active_ingredients
    },
    {
      headingId: "recommendations-heading",
      eyebrow: "Uso",
      title: "Recomendaciones",
      html: product.recommendations
    }
  ].filter((section) => Boolean(section.html));
  useEffect(() => {
    trackGoogleAnalyticsViewItem({
      value: product.price,
      currency: META_PIXEL_CURRENCY,
      items: [
        {
          item_id: String(product.id),
          item_name: product.name,
          item_category: product.category.name,
          price: product.price,
          quantity: 1
        }
      ]
    });
    trackMetaViewContent({
      content_ids: [String(product.id)],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: META_PIXEL_CURRENCY
    });
  }, [product.category.name, product.id, product.name, product.price]);
  function addToCart() {
    router.post(
      "/cart/items",
      { product_id: product.id, quantity },
      {
        preserveScroll: true,
        preserveState: true,
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
        onSuccess: () => {
          setAdded(true);
          trackGoogleAnalyticsAddToCart({
            value: unitPrice * quantity,
            currency: META_PIXEL_CURRENCY,
            items: [
              {
                item_id: String(product.id),
                item_name: product.name,
                item_category: product.category.name,
                price: unitPrice,
                quantity
              }
            ]
          });
          trackMetaAddToCart({
            content_ids: [String(product.id)],
            content_name: product.name,
            content_type: "product",
            contents: [{ id: String(product.id), quantity }],
            num_items: quantity,
            value: unitPrice * quantity,
            currency: META_PIXEL_CURRENCY
          });
          setTimeout(() => setAdded(false), 2e3);
        }
      }
    );
  }
  return /* @__PURE__ */ jsxs(CustomerShell, { title: product.name, children: [
    /* @__PURE__ */ jsx(Breadcrumbs, { breadcrumbs: product.breadcrumbs }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]", children: [
      /* @__PURE__ */ jsx(ImageGallery, { images: product.images, alt: product.name }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-10", children: [
        /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: `/catalog?category=${product.category.slug}`,
              className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase hover:text-[var(--iko-accent-hover)]",
              children: product.category.name
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: product.name }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-baseline gap-3", children: /* @__PURE__ */ jsx("span", { className: "font-spec text-[1.75rem] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(unitPrice) }) })
        ] }),
        /* @__PURE__ */ jsxs(SpecBlock, { children: [
          /* @__PURE__ */ jsx(SpecRow, { label: "SKU", value: product.sku, mono: true }),
          /* @__PURE__ */ jsx(
            SpecRow,
            {
              label: "Stock",
              value: stockReady ? `${product.stock} ${product.stock === 1 ? "unidad" : "unidades"}` : "Sin existencias",
              mono: true
            }
          ),
          product.weight_kg != null && /* @__PURE__ */ jsx(SpecRow, { label: "Peso", value: `${product.weight_kg} kg`, mono: true }),
          (product.width_cm != null || product.height_cm != null || product.depth_cm != null) && /* @__PURE__ */ jsx(
            SpecRow,
            {
              label: "Dimensiones",
              value: [product.width_cm, product.height_cm, product.depth_cm].filter((v) => v != null).join(" × ") + " cm",
              mono: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { "aria-labelledby": "qty-heading", className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx(SectionTitle, { id: "qty-heading", eyebrow: "Cantidad", children: "¿Cuántas unidades?" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [
            /* @__PURE__ */ jsx(
              QuantityStepper,
              {
                quantity,
                onIncrement: () => setQuantity((q) => q + 1),
                onDecrement: () => setQuantity((q) => Math.max(1, q - 1))
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Total" }),
              /* @__PURE__ */ jsx("span", { className: "font-spec text-[1.25rem] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(totalPrice) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          AddToCartButton,
          {
            loading,
            added,
            disabled: !stockReady,
            onClick: addToCart
          }
        ),
        !stockReady && /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)] uppercase", children: "Sin existencias · Producto no disponible para pedido" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ProductDetailSections, { sections: detailSections }),
    /* @__PURE__ */ jsx(
      RelatedProductsList,
      {
        products: related_products,
        index: String(detailSections.length + 1).padStart(2, "0")
      }
    )
  ] });
}
function ProductDetailSections({ sections }) {
  if (sections.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "mt-24 flex flex-col gap-20", children: sections.map((section, index) => /* @__PURE__ */ jsxs("section", { "aria-labelledby": section.headingId, children: [
    /* @__PURE__ */ jsx(
      SectionHeader,
      {
        index: String(index + 1).padStart(2, "0"),
        eyebrow: section.eyebrow,
        title: section.title,
        headingId: section.headingId
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "prose prose-stone mt-8 max-w-[68ch] font-sans text-[15px] leading-[1.7] text-[var(--iko-stone-ink)]/85",
        dangerouslySetInnerHTML: { __html: section.html }
      }
    )
  ] }, section.headingId)) });
}
function Breadcrumbs({ breadcrumbs }) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Migas de pan", className: "-mx-1 flex flex-wrap items-center text-[12px]", children: breadcrumbs.map((crumb, index) => /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
    index > 0 && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "mx-2 text-[var(--iko-stone-mid)]", children: "/" }),
    crumb.url ? /* @__PURE__ */ jsx(
      Link,
      {
        href: crumb.url,
        className: "text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-accent)]",
        children: crumb.name
      }
    ) : /* @__PURE__ */ jsx("span", { className: "text-[var(--iko-stone-ink)]", children: crumb.name })
  ] }, index)) });
}
function ImageGallery({
  images,
  alt
}) {
  const [selected, setSelected] = useState(0);
  const selectedImage = images[selected]?.url;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative aspect-square overflow-hidden bg-[var(--iko-stone-mid)]/40", children: [
      selectedImage ? /* @__PURE__ */ jsx(
        "img",
        {
          src: selectedImage,
          alt: `${alt} — vista ${selected + 1}`,
          className: "h-full w-full object-cover"
        }
      ) : null,
      images.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelected((prev) => (prev - 1 + images.length) % images.length),
            className: "absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] hover:bg-[var(--iko-accent)] hover:text-[var(--iko-accent-on)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
            "aria-label": "Imagen anterior",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4", strokeWidth: 1.5 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelected((prev) => (prev + 1) % images.length),
            className: "absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] hover:bg-[var(--iko-accent)] hover:text-[var(--iko-accent-on)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
            "aria-label": "Imagen siguiente",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4", strokeWidth: 1.5 })
          }
        )
      ] })
    ] }),
    images.length > 1 && /* @__PURE__ */ jsx("div", { className: "-mx-1 flex gap-2 overflow-x-auto px-1 pb-1", children: images.map((img, idx) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setSelected(idx),
        className: `relative h-20 w-20 shrink-0 overflow-hidden border transition-colors ${selected === idx ? "border-[var(--iko-accent)]" : "border-[var(--iko-stone-hairline)] hover:border-[var(--iko-stone-mid)]"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]`,
        "aria-label": `Vista ${idx + 1}`,
        children: /* @__PURE__ */ jsx("img", { src: img.url, alt: "", className: "h-full w-full object-cover" })
      },
      img.id
    )) })
  ] });
}
function SpecBlock({ children }) {
  return /* @__PURE__ */ jsx("dl", { className: "border-y border-[var(--iko-stone-hairline)]", children });
}
function SpecRow({ label, value, mono = false }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[8rem_1fr] items-baseline gap-4 border-b border-[var(--iko-stone-hairline)] py-3 last:border-b-0", children: [
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
function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement
}) {
  return /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center border border-[var(--iko-stone-hairline)]", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onDecrement,
        disabled: quantity <= 1,
        className: "flex h-11 w-11 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
        "aria-label": "Reducir cantidad",
        children: /* @__PURE__ */ jsx(Minus, { className: "h-3.5 w-3.5", strokeWidth: 1.5 })
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "flex h-11 min-w-[3.5rem] items-center justify-center border-x border-[var(--iko-stone-hairline)] font-spec text-[15px] tabular-nums text-[var(--iko-stone-ink)]", children: quantity }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onIncrement,
        className: "flex h-11 w-11 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
        "aria-label": "Aumentar cantidad",
        children: /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5", strokeWidth: 1.5 })
      }
    )
  ] });
}
function AddToCartButton({
  loading,
  added,
  disabled,
  onClick
}) {
  let label;
  if (added) {
    label = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Check, { className: "h-4 w-4", strokeWidth: 1.75 }),
      "Agregado al pedido"
    ] });
  } else if (loading) {
    label = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          "aria-hidden": "true",
          className: "h-4 w-4 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)]"
        }
      ),
      "Agregando…"
    ] });
  } else {
    label = "Agregar al pedido";
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      disabled: loading || added || disabled,
      className: "flex h-12 w-full items-center justify-center gap-2 bg-[var(--iko-accent)] px-6 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60",
      children: label
    }
  );
}
function SectionTitle({
  id,
  eyebrow,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-3", children: [
    /* @__PURE__ */ jsx("h2", { id, className: "font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]", children }),
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: eyebrow })
  ] });
}
function SectionHeader({
  index,
  eyebrow,
  title,
  headingId
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-6 border-b border-[var(--iko-stone-hairline)] pb-4", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)]", children: index }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-baseline justify-between gap-6", children: [
      /* @__PURE__ */ jsx(
        "h2",
        {
          id: headingId,
          className: "font-display text-[1.875rem] leading-tight text-[var(--iko-stone-ink)]",
          children: title
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: eyebrow })
    ] })
  ] });
}
function RelatedProductsList({ products, index }) {
  if (products.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "related-heading", className: "mt-24", children: [
    /* @__PURE__ */ jsx(
      SectionHeader,
      {
        index,
        eyebrow: "Catálogo",
        title: "También en esta categoría",
        headingId: "related-heading"
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
          /* @__PURE__ */ jsx("span", { className: "font-display text-[1rem] leading-tight text-[var(--iko-stone-ink)] truncate", children: product.name }),
          /* @__PURE__ */ jsx("span", { className: "font-spec text-[13px] tabular-nums text-[var(--iko-stone-whisper)] group-hover:text-[var(--iko-accent)]", children: formatCurrency(product.price) })
        ]
      }
    ) }, product.id)) })
  ] });
}
export {
  ProductShow as default
};
