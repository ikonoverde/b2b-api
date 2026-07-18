import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, useForm } from "@inertiajs/react";
import { C as CustomerShell } from "./CustomerShell-BPYHgCcv.js";
import { T as TextInput } from "./TextInput-DJaWKAzU.js";
import { C as CheckoutStepIndicator } from "./CheckoutStepIndicator-DNQd0npl.js";
import { Plus } from "lucide-react";
import { f as formatCurrency } from "./currency-BiP3uvrU.js";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { b as trackGoogleAnalyticsBeginCheckout, c as trackMetaInitiateCheckout, M as META_PIXEL_CURRENCY } from "./analytics-BNINfFmc.js";
import "./SiteFooter-BfzQHT4y.js";
function AddressForm({ data, errors, disabled, onFieldChange }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-10", children: [
    /* @__PURE__ */ jsxs("fieldset", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsx("legend", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "Contacto" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "name",
            label: "Nombre completo",
            value: data.name,
            onChange: (e) => onFieldChange("name", e.target.value),
            error: errors.name,
            disabled,
            autoComplete: "name",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "phone",
            label: "Teléfono",
            type: "tel",
            value: data.phone,
            onChange: (e) => onFieldChange("phone", e.target.value),
            error: errors.phone,
            disabled,
            autoComplete: "tel",
            inputMode: "tel"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("fieldset", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsx("legend", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "Dirección de envío" }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          id: "address_line_1",
          label: "Calle y número",
          value: data.address_line_1,
          onChange: (e) => onFieldChange("address_line_1", e.target.value),
          error: errors.address_line_1,
          disabled,
          autoComplete: "address-line1",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          id: "address_line_2",
          label: "Colonia",
          value: data.address_line_2,
          onChange: (e) => onFieldChange("address_line_2", e.target.value),
          error: errors.address_line_2,
          disabled,
          autoComplete: "address-line2",
          required: true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-[1fr_1fr_8rem]", children: [
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "city",
            label: "Ciudad",
            value: data.city,
            onChange: (e) => onFieldChange("city", e.target.value),
            error: errors.city,
            disabled,
            autoComplete: "address-level2",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "state",
            label: "Estado",
            value: data.state,
            onChange: (e) => onFieldChange("state", e.target.value),
            error: errors.state,
            disabled,
            autoComplete: "address-level1",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "postal_code",
            label: "C.P.",
            value: data.postal_code,
            onChange: (e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5);
              onFieldChange("postal_code", value);
            },
            error: errors.postal_code,
            disabled,
            autoComplete: "postal-code",
            inputMode: "numeric",
            required: true
          }
        )
      ] })
    ] })
  ] });
}
function SavedAddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onNewAddress
}) {
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "saved-addresses-heading", className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] pb-2", children: [
      /* @__PURE__ */ jsx(
        "h3",
        {
          id: "saved-addresses-heading",
          className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase",
          children: "Direcciones guardadas"
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
        String(addresses.length).padStart(2, "0"),
        " ",
        addresses.length === 1 ? "guardada" : "guardadas"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border border-[var(--iko-stone-hairline)] divide-y divide-[var(--iko-stone-hairline)]", children: [
      addresses.map((address) => /* @__PURE__ */ jsx(
        SelectableAddressRow,
        {
          address,
          selected: selectedAddressId === address.id,
          onSelect: () => onSelect(address)
        },
        address.id
      )),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: onNewAddress,
          "aria-pressed": selectedAddressId === null,
          className: `flex w-full items-center gap-4 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset ${selectedAddressId === null ? "bg-[var(--iko-accent-soft)]" : "hover:bg-[var(--iko-stone-mid)]/15"}`,
          children: [
            /* @__PURE__ */ jsx(SelectionMark, { selected: selectedAddressId === null }),
            /* @__PURE__ */ jsxs("span", { className: "flex flex-1 flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-[14px] text-[var(--iko-stone-ink)]", children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4", strokeWidth: 1.5 }),
                "Agregar nueva dirección"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: "Mostrar formulario" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function SelectableAddressRow({
  address,
  selected,
  onSelect
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: onSelect,
      "aria-pressed": selected,
      className: `flex w-full items-start gap-4 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset ${selected ? "bg-[var(--iko-accent-soft)]" : "hover:bg-[var(--iko-stone-mid)]/15"}`,
      children: [
        /* @__PURE__ */ jsx(SelectionMark, { selected }),
        /* @__PURE__ */ jsxs("span", { className: "flex flex-1 flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-baseline gap-3", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `font-spec text-[11px] tracking-[0.08em] uppercase ${selected ? "text-[var(--iko-accent)]" : "text-[var(--iko-stone-whisper)]"}`,
                children: address.label
              }
            ),
            address.is_default && /* @__PURE__ */ jsx("span", { className: "font-spec text-[10px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: "· Predeterminada" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[14px] leading-snug text-[var(--iko-stone-ink)]", children: address.name }),
          /* @__PURE__ */ jsxs("span", { className: "text-[13px] leading-[1.5] text-[var(--iko-stone-whisper)]", children: [
            address.address_line_1,
            address.address_line_2 && `, ${address.address_line_2}`,
            /* @__PURE__ */ jsx("br", {}),
            address.city,
            ", ",
            address.state,
            " ",
            address.postal_code
          ] }),
          address.phone && /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]", children: [
            "Tel · ",
            address.phone
          ] })
        ] })
      ]
    }
  );
}
function SelectionMark({ selected }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      className: `mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${selected ? "border-[var(--iko-accent)]" : "border-[var(--iko-stone-mid)]"}`,
      children: selected && /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[var(--iko-accent)]" })
    }
  );
}
function ShippingQuoteOption({
  quote,
  isSelected,
  onSelect
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: onSelect,
      "aria-pressed": isSelected,
      className: `flex w-full items-center gap-4 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset ${isSelected ? "bg-[var(--iko-accent-soft)]" : "hover:bg-[var(--iko-stone-mid)]/15"}`,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: `flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${isSelected ? "border-[var(--iko-accent)]" : "border-[var(--iko-stone-mid)]"}`,
            children: isSelected && /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[var(--iko-accent)]" })
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "flex flex-1 flex-col gap-0.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[14px] text-[var(--iko-stone-ink)]", children: quote.carrier }),
          /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
            quote.service,
            " · ",
            quote.estimated_days,
            " ",
            quote.estimated_days === 1 ? "día hábil" : "días hábiles"
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(quote.price) })
      ]
    }
  );
}
function ShippingQuoteSelector({
  quotes,
  selectedRateId,
  loading,
  fetched,
  error,
  validationError,
  onSelect
}) {
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "shipping-quotes-heading", className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] pb-2", children: /* @__PURE__ */ jsx(
      "h3",
      {
        id: "shipping-quotes-heading",
        className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase",
        children: "Opciones de envío"
      }
    ) }),
    !fetched && !loading && /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] px-5 py-6", children: /* @__PURE__ */ jsx("p", { className: "text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]", children: "Completa tu dirección para ver las tarifas y tiempos de entrega disponibles." }) }),
    loading && /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-stone-hairline)]", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-[60px] animate-pulse border-b border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-mid)]/20 last:border-b-0"
      },
      i
    )) }),
    error && !loading && /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-4", children: /* @__PURE__ */ jsx("p", { className: "font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-error)]", children: error }) }),
    fetched && !loading && quotes.length > 0 && /* @__PURE__ */ jsx("div", { className: "border border-[var(--iko-stone-hairline)] divide-y divide-[var(--iko-stone-hairline)]", children: quotes.map((quote) => /* @__PURE__ */ jsx(
      ShippingQuoteOption,
      {
        quote,
        isSelected: selectedRateId === quote.rate_id,
        onSelect: () => onSelect(quote)
      },
      quote.rate_id
    )) }),
    validationError && /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]", children: validationError })
  ] });
}
function CheckoutSummary({
  items,
  subtotal,
  shippingCost,
  total
}) {
  return /* @__PURE__ */ jsxs("aside", { className: "border border-[var(--iko-stone-hairline)] lg:sticky lg:top-24", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] px-5 py-4", children: [
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "Resumen" }),
      /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
        items.length,
        " ",
        items.length === 1 ? "producto" : "productos"
      ] })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y divide-[var(--iko-stone-hairline)]", children: items.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-baseline justify-between gap-3 px-5 py-3", children: [
      /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1 truncate text-[13px] text-[var(--iko-stone-ink)]", children: [
        item.name,
        /* @__PURE__ */ jsxs("span", { className: "ml-2 font-spec text-[11px] tabular-nums text-[var(--iko-stone-whisper)]", children: [
          "×",
          item.quantity
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "shrink-0 font-spec text-[12px] tabular-nums text-[var(--iko-stone-ink)]", children: formatCurrency(item.subtotal) })
    ] }, item.id)) }),
    /* @__PURE__ */ jsxs("dl", { className: "border-t border-[var(--iko-stone-hairline)] px-5 py-4", children: [
      /* @__PURE__ */ jsx(SummaryRow, { label: "Subtotal", value: formatCurrency(subtotal) }),
      /* @__PURE__ */ jsx(
        SummaryRow,
        {
          label: "Envío",
          value: shippingCost === null ? "A calcular" : formatCurrency(shippingCost),
          muted: shippingCost === null
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] px-5 py-4", children: [
      /* @__PURE__ */ jsx("dt", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase", children: "Total" }),
      /* @__PURE__ */ jsx("dd", { className: "font-spec text-[1.125rem] tabular-nums text-[var(--iko-stone-ink)]", children: total === null ? "—" : formatCurrency(total) })
    ] })
  ] });
}
function SummaryRow({
  label,
  value,
  muted = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between py-1.5", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-[13px] text-[var(--iko-stone-whisper)]", children: label }),
    /* @__PURE__ */ jsx(
      "dd",
      {
        className: `font-spec text-[13px] tabular-nums ${muted ? "text-[var(--iko-stone-whisper)]" : "text-[var(--iko-stone-ink)]"}`,
        children: value
      }
    )
  ] });
}
function addressToFormData(address) {
  return {
    name: address.name,
    address_line_1: address.address_line_1,
    address_line_2: address.address_line_2 ?? "",
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
    phone: address.phone ?? "",
    quote_id: "",
    rate_id: ""
  };
}
function useSavedAddress({
  addresses,
  setFormData,
  resetForm,
  onAddressReady
}) {
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    if (addresses.length === 0) {
      return null;
    }
    return (addresses.find((address) => address.is_default) ?? addresses[0]).id;
  });
  const initialized = useRef(false);
  function selectAddress(address) {
    const data = addressToFormData(address);
    setFormData(data);
    setSelectedAddressId(address.id);
    onAddressReady?.(data);
  }
  function clearSelection() {
    setSelectedAddressId(null);
    resetForm();
  }
  useEffect(() => {
    if (initialized.current || addresses.length === 0) {
      return;
    }
    initialized.current = true;
    const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];
    selectAddress(defaultAddress);
  }, [addresses]);
  return { selectedAddressId, selectAddress, clearSelection };
}
function useShippingQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  function reset() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    abortRef.current?.abort();
    setQuotes([]);
    setLoading(false);
    setError(null);
    setFetched(false);
  }
  function fetch(address) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setError(null);
      setFetched(false);
      setQuotes([]);
      try {
        const { data } = await axios.post("/checkout/shipping-quotes", address, {
          signal: controller.signal
        });
        const fetchedQuotes = data.quotes ?? [];
        setQuotes(fetchedQuotes);
        setFetched(true);
        if (fetchedQuotes.length === 0) {
          setError("No encontramos opciones de envío para este código postal.");
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        setError("No pudimos obtener opciones de envío. Verifica tu código postal.");
        setFetched(true);
      } finally {
        setLoading(false);
      }
    }, 600);
  }
  return { quotes, loading, error, fetched, fetch, reset };
}
const QUOTE_FIELDS = /* @__PURE__ */ new Set(["postal_code", "city", "state", "address_line_2"]);
function canFetchQuotes(data) {
  return data.postal_code.length === 5 && !!data.city.trim() && !!data.state.trim() && !!data.address_line_2.trim();
}
function Shipping({ cart, addresses }) {
  const { errors } = usePage().props;
  const {
    quotes,
    loading,
    error,
    fetched,
    fetch: fetchQuotes,
    reset: resetQuotes
  } = useShippingQuotes();
  const form = useForm({
    name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    quote_id: "",
    rate_id: ""
  });
  function fetchQuotesIfReady(data) {
    if (canFetchQuotes(data)) {
      fetchQuotes({
        postal_code: data.postal_code,
        city: data.city,
        state: data.state,
        neighborhood: data.address_line_2
      });
    }
  }
  const { selectedAddressId, selectAddress, clearSelection } = useSavedAddress({
    addresses,
    setFormData: (data) => form.setData(data),
    resetForm: () => form.reset(),
    onAddressReady: fetchQuotesIfReady
  });
  const selectedQuote = quotes.find((q) => q.rate_id === form.data.rate_id) ?? null;
  const shippingCost = selectedQuote?.price ?? null;
  const total = shippingCost !== null ? cart.totals.subtotal + shippingCost : null;
  function handleFieldChange(field, value) {
    const updated = { ...form.data, [field]: value };
    if (QUOTE_FIELDS.has(field)) {
      const dataWithoutQuote = { ...updated, quote_id: "", rate_id: "" };
      form.setData(dataWithoutQuote);
      resetQuotes();
      if (canFetchQuotes(dataWithoutQuote)) {
        fetchQuotes({
          postal_code: dataWithoutQuote.postal_code,
          city: dataWithoutQuote.city,
          state: dataWithoutQuote.state,
          neighborhood: dataWithoutQuote.address_line_2
        });
      }
      return;
    }
    form.setData(field, value);
  }
  function submit(e) {
    e.preventDefault();
    form.post("/checkout/shipping", {
      onSuccess: () => {
        trackGoogleAnalyticsBeginCheckout({
          value: cart.totals.subtotal,
          currency: META_PIXEL_CURRENCY,
          items: cart.items.map((item) => ({
            item_id: String(item.product_id),
            item_name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        });
        trackMetaInitiateCheckout({
          content_ids: cart.items.map((item) => String(item.product_id)),
          content_type: "product",
          contents: cart.items.map((item) => ({
            id: String(item.product_id),
            quantity: item.quantity,
            item_price: item.price
          })),
          num_items: cart.items.reduce((count, item) => count + item.quantity, 0),
          value: cart.totals.subtotal,
          currency: META_PIXEL_CURRENCY
        });
      }
    });
  }
  const stockErrors = errors.stock ? Array.isArray(errors.stock) ? errors.stock : [errors.stock] : null;
  return /* @__PURE__ */ jsxs(CustomerShell, { title: "Envío · Compra", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase", children: "Compra · Envío" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]", children: "Dirección de envío" }),
      /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: "Selecciona una dirección guardada o ingresa una nueva. Las tarifas y tiempos de entrega se calculan en tiempo real." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsx(CheckoutStepIndicator, { currentStep: 1 }) }),
    stockErrors && /* @__PURE__ */ jsxs("div", { className: "mt-8 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-4", children: [
      /* @__PURE__ */ jsx("p", { className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-error)] uppercase", children: "Existencias insuficientes" }),
      /* @__PURE__ */ jsx("ul", { className: "mt-2 flex flex-col gap-1", children: stockErrors.map((msg, i) => /* @__PURE__ */ jsx("li", { className: "text-[13px] text-[var(--iko-error)]", children: msg }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col gap-10", children: [
        addresses.length > 0 && /* @__PURE__ */ jsx(
          SavedAddressSelector,
          {
            addresses,
            selectedAddressId,
            onSelect: (address) => {
              resetQuotes();
              selectAddress(address);
            },
            onNewAddress: () => {
              resetQuotes();
              clearSelection();
            }
          }
        ),
        selectedAddressId === null && /* @__PURE__ */ jsx(
          AddressForm,
          {
            data: form.data,
            errors: form.errors,
            disabled: form.processing,
            onFieldChange: handleFieldChange
          }
        ),
        /* @__PURE__ */ jsx(
          ShippingQuoteSelector,
          {
            quotes,
            selectedRateId: form.data.rate_id,
            loading,
            fetched,
            error,
            validationError: form.errors.rate_id,
            onSelect: (quote) => form.setData({
              ...form.data,
              quote_id: quote.quote_id,
              rate_id: quote.rate_id
            })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: form.processing || !form.data.rate_id,
            className: "flex h-12 w-full items-center justify-center bg-[var(--iko-accent)] px-6 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60",
            children: form.processing ? /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "h-4 w-4 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)]"
              }
            ) : "Continuar al pago"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        CheckoutSummary,
        {
          items: cart.items,
          subtotal: cart.totals.subtotal,
          shippingCost,
          total
        }
      )
    ] })
  ] });
}
export {
  Shipping as default
};
