import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { router, InfiniteScroll, Link } from "@inertiajs/react";
import { Search, X, ChevronDown, Minus, Plus, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { C as CustomerShell } from "./CustomerShell-BUXLAgvU.js";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import "./SiteFooter-Cn_4a6rU.js";
const SORT_LABELS = {
  newest: "Más recientes",
  oldest: "Más antiguos",
  price_asc: "Precio: menor a mayor",
  price_desc: "Precio: mayor a menor",
  name_asc: "Nombre: A–Z",
  name_desc: "Nombre: Z–A"
};
function Catalog({
  products,
  categories,
  selectedCategoryId,
  selectedSort,
  selectedSearch
}) {
  const [cartStates, setCartStates] = useState({});
  const [quantities, setQuantities] = useState({});
  const timersRef = useRef({});
  const filters = useFilters(selectedCategoryId, selectedSort, selectedSearch);
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);
  const setQty = useCallback((productId, next) => {
    setQuantities((s) => ({ ...s, [productId]: Math.max(1, next) }));
  }, []);
  const addToCart = useCallback(
    (productId) => {
      const quantity = quantities[productId] ?? 1;
      router.post(
        "/cart/items",
        { product_id: productId, quantity },
        {
          preserveScroll: true,
          preserveState: true,
          onStart: () => setCartStates((s) => ({ ...s, [productId]: "loading" })),
          onSuccess: () => {
            setCartStates((s) => ({ ...s, [productId]: "added" }));
            clearTimeout(timersRef.current[productId]);
            timersRef.current[productId] = setTimeout(() => {
              setCartStates((s) => {
                const next = { ...s };
                delete next[productId];
                return next;
              });
              setQuantities((q) => {
                const next = { ...q };
                delete next[productId];
                return next;
              });
              delete timersRef.current[productId];
            }, 1500);
          },
          onError: () => {
            setCartStates((s) => {
              const next = { ...s };
              delete next[productId];
              return next;
            });
          }
        }
      );
    },
    [quantities]
  );
  const hasFilters = Boolean(filters.search) || Boolean(selectedCategoryId) || Boolean(selectedSort);
  const showingCount = products.total ?? products.data.length;
  return /* @__PURE__ */ jsxs(CustomerShell, { title: "Catálogo", children: [
    /* @__PURE__ */ jsx(PageHeader, { count: showingCount }),
    /* @__PURE__ */ jsx(
      Toolbar,
      {
        search: filters.search,
        onSearchChange: filters.setSearch,
        onClearSearch: filters.handleClearSearch,
        sort: selectedSort,
        onSelectSort: filters.handleSortSelect,
        categories,
        selectedCategoryId,
        onSelectCategory: filters.handleCategorySelect
      }
    ),
    products.data.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        search: filters.search,
        hasFilters,
        onClear: filters.handleClearAll
      }
    ) : /* @__PURE__ */ jsx(
      InfiniteScroll,
      {
        data: "products",
        preserveUrl: true,
        loading: /* @__PURE__ */ jsx("ol", { className: "border-t border-[var(--iko-stone-hairline)]", children: Array.from({ length: 3 }).map((_, idx) => /* @__PURE__ */ jsx(RowSkeleton, {}, idx)) }),
        children: /* @__PURE__ */ jsx("ol", { className: "border-t border-[var(--iko-stone-hairline)]", children: products.data.map((product, idx) => /* @__PURE__ */ jsx(
          ProductRow,
          {
            product,
            index: idx + 1,
            quantity: quantities[product.id] ?? 1,
            onQuantityChange: (q) => setQty(product.id, q),
            onAddToCart: () => addToCart(product.id),
            cartState: cartStates[product.id]
          },
          product.id
        )) })
      }
    )
  ] });
}
function PageHeader({ count }) {
  return /* @__PURE__ */ jsxs("header", { className: "flex items-baseline justify-between gap-6 border-b border-[var(--iko-stone-hairline)] pb-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-6", children: [
      /* @__PURE__ */ jsx("span", { className: "hidden font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)] uppercase sm:inline", children: "01 · Tienda" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: "Catálogo" })
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
      count,
      " ",
      count === 1 ? "producto" : "productos"
    ] })
  ] });
}
function Toolbar({
  search,
  onSearchChange,
  onClearSearch,
  sort,
  onSelectSort,
  categories,
  selectedCategoryId,
  onSelectCategory
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col gap-4 border-b border-[var(--iko-stone-hairline)] pb-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-stretch", children: [
      /* @__PURE__ */ jsx(SearchInput, { value: search, onChange: onSearchChange, onClear: onClearSearch }),
      /* @__PURE__ */ jsx(SortDropdown, { selected: sort, onSelect: onSelectSort })
    ] }),
    /* @__PURE__ */ jsx(
      CategoryStrip,
      {
        categories,
        selectedId: selectedCategoryId,
        onSelect: onSelectCategory
      }
    )
  ] });
}
function SearchInput({
  value,
  onChange,
  onClear
}) {
  return /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
    /* @__PURE__ */ jsx(
      Search,
      {
        className: "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--iko-stone-whisper)]",
        strokeWidth: 1.5
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder: "Buscar por nombre, SKU o categoría",
        className: "h-11 w-full border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] pr-10 pl-9 text-[14px] text-[var(--iko-stone-ink)] placeholder:text-[var(--iko-stone-whisper)] focus:border-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
      }
    ),
    value && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onClear,
        className: "absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)]",
        "aria-label": "Borrar búsqueda",
        children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", strokeWidth: 1.5 })
      }
    )
  ] });
}
function SortDropdown({
  selected,
  onSelect
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);
  const entries = Object.entries(SORT_LABELS);
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "relative shrink-0", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "flex h-11 w-full items-center justify-between gap-3 border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] px-4 text-[14px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] sm:w-60",
        "aria-expanded": open,
        "aria-haspopup": "listbox",
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: "Ordenar" }),
            /* @__PURE__ */ jsx("span", { children: selected ? SORT_LABELS[selected] : SORT_LABELS.newest })
          ] }),
          /* @__PURE__ */ jsx(
            ChevronDown,
            {
              className: `h-4 w-4 text-[var(--iko-stone-whisper)] transition-transform ${open ? "rotate-180" : ""}`,
              strokeWidth: 1.5
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsx(
      "ol",
      {
        role: "listbox",
        className: "absolute right-0 z-20 mt-1 w-full min-w-60 border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)]",
        children: entries.map(([value, label], idx) => {
          const active = selected === value || !selected && value === "newest";
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": active,
              onClick: () => {
                setOpen(false);
                onSelect(value);
              },
              className: `flex w-full items-baseline gap-3 border-b border-[var(--iko-stone-hairline)] px-4 py-2.5 text-left text-[13px] transition-colors last:border-b-0 hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none ${active ? "text-[var(--iko-stone-ink)]" : "text-[var(--iko-stone-whisper)]"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `font-spec text-[11px] tabular-nums ${active ? "text-[var(--iko-accent)]" : "text-[var(--iko-stone-mid)]"}`,
                    children: String(idx + 1).padStart(2, "0")
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "flex-1", children: label })
              ]
            }
          ) }, value);
        })
      }
    )
  ] });
}
function CategoryStrip({
  categories,
  selectedId,
  onSelect
}) {
  const items = [
    { id: null, label: "Todas" },
    ...categories.map((c) => ({ id: c.id, label: c.name }))
  ];
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Categorías", className: "-mx-1", children: /* @__PURE__ */ jsx("ol", { className: "flex flex-wrap items-baseline", children: items.map((item, idx) => {
    const active = selectedId === item.id;
    return /* @__PURE__ */ jsxs("li", { className: "flex items-baseline", children: [
      idx > 0 && /* @__PURE__ */ jsx(
        "span",
        {
          "aria-hidden": "true",
          className: "mx-3 text-[var(--iko-stone-mid)]",
          children: "·"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelect(item.id),
          "aria-pressed": active,
          className: `group flex items-baseline gap-1.5 px-1 py-1 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] ${active ? "text-[var(--iko-accent)]" : "text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]"}`,
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `font-spec text-[10px] tabular-nums tracking-[0.04em] ${active ? "text-[var(--iko-accent)]" : "text-[var(--iko-stone-mid)]"}`,
                children: String(idx).padStart(2, "0")
              }
            ),
            /* @__PURE__ */ jsx("span", { children: item.label })
          ]
        }
      )
    ] }, item.id ?? "all");
  }) }) });
}
function ProductRow({
  product,
  index,
  quantity,
  onQuantityChange,
  onAddToCart,
  cartState
}) {
  const inStock = product.stock > 0;
  const stockLabel = inStock ? `${product.stock} en stock` : "Sin existencias";
  const detailHref = `/products/${product.slug}`;
  const specLine = /* @__PURE__ */ jsxs("p", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
    /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: product.sku }),
    product.is_featured && /* @__PURE__ */ jsx("span", { className: "text-[var(--iko-accent)]", children: " · DESTACADO" }),
    /* @__PURE__ */ jsxs("span", { children: [
      " · ",
      product.category
    ] }),
    /* @__PURE__ */ jsxs(
      "span",
      {
        className: inStock ? " text-[var(--iko-stone-whisper)]" : " text-[var(--iko-error)]",
        children: [
          " · ",
          stockLabel
        ]
      }
    )
  ] });
  const indexLabel = String(index).padStart(2, "0");
  return /* @__PURE__ */ jsxs("li", { className: "border-b border-[var(--iko-stone-hairline)] last:border-b-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 py-4 md:hidden", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: detailHref,
          className: "group flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
          children: [
            /* @__PURE__ */ jsx(ProductImage, { product, size: 64 }),
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-display text-[16px] leading-tight text-[var(--iko-stone-ink)] transition-colors group-hover:text-[var(--iko-accent)] group-focus-visible:text-[var(--iko-accent)]", children: product.name }),
              specLine,
              /* @__PURE__ */ jsx("span", { className: "mt-1 font-spec text-[15px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(product.price) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        RowActions,
        {
          quantity,
          onQuantityChange,
          onAddToCart,
          cartState,
          inStock
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-6 py-5 md:grid md:grid-cols-[2.5rem_5rem_minmax(0,1fr)_8rem_auto_auto]", children: [
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-stone-mid)]", children: indexLabel }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: detailHref,
          className: "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
          tabIndex: -1,
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx(ProductImage, { product, size: 80 })
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: detailHref,
          className: "group flex min-w-0 flex-col gap-1 focus-visible:outline-none",
          children: [
            /* @__PURE__ */ jsx("h2", { className: "font-display text-[17px] leading-tight text-[var(--iko-stone-ink)] truncate transition-colors group-hover:text-[var(--iko-accent)] group-focus-visible:text-[var(--iko-accent)]", children: product.name }),
            specLine
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-right font-spec text-[15px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(product.price) }),
      /* @__PURE__ */ jsx(
        RowActions,
        {
          quantity,
          onQuantityChange,
          onAddToCart,
          cartState,
          inStock
        }
      )
    ] })
  ] });
}
function ProductImage({ product, size }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "block shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40",
      style: { width: size, height: size },
      children: product.image ? /* @__PURE__ */ jsx(
        "img",
        {
          src: product.image,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }
      ) : null
    }
  );
}
function RowActions({
  quantity,
  onQuantityChange,
  onAddToCart,
  cartState,
  inStock
}) {
  if (!inStock) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end md:contents", children: /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)] uppercase md:col-span-2 md:text-right", children: "Sin existencias" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 md:contents", children: [
    /* @__PURE__ */ jsx(QuantityStepper, { quantity, onChange: onQuantityChange }),
    /* @__PURE__ */ jsx(AddButton, { state: cartState, quantity, onClick: onAddToCart })
  ] });
}
function QuantityStepper({
  quantity,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center border border-[var(--iko-stone-hairline)]", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(quantity - 1),
        disabled: quantity <= 1,
        className: "flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
        "aria-label": "Reducir cantidad",
        children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3", strokeWidth: 1.5 })
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "flex h-9 min-w-[2.75rem] items-center justify-center border-x border-[var(--iko-stone-hairline)] font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]", children: quantity }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(quantity + 1),
        className: "flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset",
        "aria-label": "Aumentar cantidad",
        children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3", strokeWidth: 1.5 })
      }
    )
  ] });
}
function AddButton({
  state,
  quantity,
  onClick
}) {
  let label;
  if (state === "added") {
    label = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5", strokeWidth: 1.75 }),
      /* @__PURE__ */ jsxs("span", { children: [
        "Agregado · ",
        /* @__PURE__ */ jsx("span", { className: "font-spec tabular-nums", children: quantity })
      ] })
    ] });
  } else if (state === "loading") {
    label = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          "aria-hidden": "true",
          className: "h-3.5 w-3.5 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)] motion-reduce:animate-none"
        }
      ),
      /* @__PURE__ */ jsx("span", { children: "Agregando…" })
    ] });
  } else {
    label = "Agregar";
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      disabled: state === "loading" || state === "added",
      className: "inline-flex h-9 min-w-[6.5rem] items-center justify-center gap-2 bg-[var(--iko-accent)] px-4 text-[13px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-70",
      children: label
    }
  );
}
function RowSkeleton() {
  return /* @__PURE__ */ jsx("li", { className: "border-b border-[var(--iko-stone-hairline)] last:border-b-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 py-5 sm:gap-6", children: [
    /* @__PURE__ */ jsx("span", { className: "hidden h-3 w-6 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse md:block" }),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "h-16 w-16 shrink-0 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse sm:h-20 sm:w-20",
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "flex flex-1 flex-col gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "h-4 w-3/5 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse" }),
      /* @__PURE__ */ jsx("span", { className: "h-3 w-2/5 bg-[var(--iko-stone-mid)]/30 motion-safe:animate-pulse" })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "hidden h-4 w-20 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse md:block" }),
    /* @__PURE__ */ jsx("span", { className: "hidden h-9 w-28 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse md:block" }),
    /* @__PURE__ */ jsx("span", { className: "hidden h-9 w-24 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse md:block" })
  ] }) });
}
function EmptyState({
  search,
  hasFilters,
  onClear
}) {
  return /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--iko-stone-hairline)] py-20", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-display text-[1.875rem] leading-tight text-[var(--iko-stone-ink)]", children: "Sin resultados" }),
    /* @__PURE__ */ jsx("p", { className: "font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: search ? /* @__PURE__ */ jsxs(Fragment, { children: [
      "Para «",
      /* @__PURE__ */ jsx("span", { className: "text-[var(--iko-stone-ink)]", children: search }),
      "»"
    ] }) : "Ningún producto coincide con los filtros aplicados" }),
    hasFilters && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onClear,
        className: "mt-3 self-start text-[13px] text-[var(--iko-accent)] underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none",
        children: "Quitar filtros"
      }
    )
  ] }) });
}
function buildQuery(categoryId, sort, search) {
  const query = {};
  if (categoryId) {
    query.category_id = String(categoryId);
  }
  if (sort) {
    query.sort = sort;
  }
  if (search) {
    query.search = search;
  }
  return query;
}
function useFilters(selectedCategoryId, selectedSort, selectedSearch) {
  const [search, setSearch] = useState(selectedSearch ?? "");
  const debounceRef = useRef(void 0);
  const filtersRef = useRef({ categoryId: selectedCategoryId, sort: selectedSort });
  filtersRef.current = { categoryId: selectedCategoryId, sort: selectedSort };
  useEffect(() => {
    if (search === (selectedSearch ?? "")) {
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.get(
        window.location.pathname,
        buildQuery(filtersRef.current.categoryId, filtersRef.current.sort, search || null),
        { preserveState: true, preserveScroll: true }
      );
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, selectedSearch]);
  const handleCategorySelect = useCallback(
    (id) => {
      router.get(
        window.location.pathname,
        buildQuery(id, selectedSort, search || null),
        { preserveState: true }
      );
    },
    [selectedSort, search]
  );
  const handleSortSelect = useCallback(
    (sort) => {
      const newSort = sort === selectedSort || sort === "newest" ? null : sort;
      router.get(
        window.location.pathname,
        buildQuery(selectedCategoryId, newSort, search || null),
        { preserveState: true }
      );
    },
    [selectedSort, selectedCategoryId, search]
  );
  const handleClearSearch = useCallback(() => {
    clearTimeout(debounceRef.current);
    setSearch("");
    router.get(
      window.location.pathname,
      buildQuery(selectedCategoryId, selectedSort, null),
      { preserveState: true }
    );
  }, [selectedCategoryId, selectedSort]);
  const handleClearAll = useCallback(() => {
    clearTimeout(debounceRef.current);
    setSearch("");
    router.get(window.location.pathname, {}, { preserveState: true });
  }, []);
  return {
    search,
    setSearch,
    handleCategorySelect,
    handleSortSelect,
    handleClearSearch,
    handleClearAll
  };
}
export {
  Catalog as default
};
