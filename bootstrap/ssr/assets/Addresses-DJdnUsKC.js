import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, router, useForm } from "@inertiajs/react";
import { Plus, Star, Pencil, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { A as AccountShell } from "./AccountShell-B64sRR20.js";
import { T as TextInput } from "./TextInput-DJaWKAzU.js";
import "./CustomerShell-BUXLAgvU.js";
import "./SiteFooter-Cn_4a6rU.js";
import "./currency-BiP3uvrU.js";
const MEXICO_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas"
];
const EMPTY_FORM = {
  label: "",
  name: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  postal_code: "",
  phone: "",
  is_default: false
};
function Addresses({ addresses }) {
  const { flash } = usePage().props;
  const [success, setSuccess] = useState("");
  const formState = useAddressForm();
  useEffect(() => {
    if (flash?.success) {
      setSuccess(flash.success);
      const timer = setTimeout(() => setSuccess(""), 3e3);
      return () => clearTimeout(timer);
    }
  }, [flash?.success]);
  return /* @__PURE__ */ jsxs(
    AccountShell,
    {
      title: "Direcciones",
      eyebrow: "Cuenta · Direcciones",
      headline: "Direcciones de envío",
      sub: "Gestiona las direcciones que aparecen en el checkout. La predeterminada se selecciona automáticamente al pagar.",
      section: "addresses",
      children: [
        success && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]", children: success }),
        flash?.error && /* @__PURE__ */ jsx("div", { className: "mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]", children: flash.error }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase", children: [
            String(addresses.length).padStart(2, "0"),
            " ",
            addresses.length === 1 ? "dirección guardada" : "direcciones guardadas"
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: formState.openAddModal,
              className: "inline-flex h-11 items-center gap-2 bg-[var(--iko-accent)] px-5 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4", strokeWidth: 1.5 }),
                "Nueva dirección"
              ]
            }
          )
        ] }),
        addresses.length === 0 ? /* @__PURE__ */ jsx(EmptyAddresses, { onAdd: formState.openAddModal }) : /* @__PURE__ */ jsx("ol", { className: "divide-y divide-[var(--iko-stone-hairline)] border-b border-[var(--iko-stone-hairline)]", children: addresses.map((address, idx) => /* @__PURE__ */ jsx(
          AddressRow,
          {
            address,
            index: idx + 1,
            onEdit: () => formState.openEditModal(address),
            onDelete: () => {
              if (confirm("¿Eliminar esta dirección?")) {
                router.delete(`/account/addresses/${address.id}`, {
                  preserveScroll: true
                });
              }
            },
            onSetDefault: () => router.put(
              `/account/addresses/${address.id}`,
              { is_default: true },
              { preserveScroll: true }
            )
          },
          address.id
        )) }),
        formState.isEditing && /* @__PURE__ */ jsx(
          AddressFormModal,
          {
            editingAddress: formState.editingAddress,
            form: formState.form,
            onClose: formState.closeModal,
            onSubmit: formState.handleSubmit,
            onChange: formState.handleChange
          }
        )
      ]
    }
  );
}
function AddressRow({
  address,
  index,
  onEdit,
  onDelete,
  onSetDefault
}) {
  return /* @__PURE__ */ jsxs("li", { className: "grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 py-6 sm:grid-cols-[3rem_1fr_auto] sm:gap-6", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums text-[var(--iko-accent)]", children: String(index).padStart(2, "0") }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]", children: address.label }),
        address.is_default && /* @__PURE__ */ jsx("span", { className: "font-spec text-[10px] tracking-[0.08em] text-[var(--iko-accent)] uppercase", children: "· Predeterminada" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-[14px] text-[var(--iko-stone-ink)]", children: address.name }),
      /* @__PURE__ */ jsxs("span", { className: "text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]", children: [
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
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      !address.is_default && /* @__PURE__ */ jsx(IconButton, { onClick: onSetDefault, title: "Predeterminar", children: /* @__PURE__ */ jsx(Star, { className: "h-4 w-4", strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsx(IconButton, { onClick: onEdit, title: "Editar", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4", strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsx(IconButton, { onClick: onDelete, title: "Eliminar", danger: true, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4", strokeWidth: 1.5 }) })
    ] })
  ] });
}
function IconButton({
  onClick,
  title,
  danger = false,
  children
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      title,
      "aria-label": title,
      className: `flex h-9 w-9 items-center justify-center text-[var(--iko-stone-whisper)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] ${danger ? "hover:text-[var(--iko-error)]" : "hover:text-[var(--iko-accent)]"}`,
      children
    }
  );
}
function EmptyAddresses({ onAdd }) {
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-5 border-y border-[var(--iko-stone-hairline)] py-16", children: [
    /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase", children: "Sin direcciones" }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[42ch] font-display text-[1.5rem] leading-[1.15] text-[var(--iko-stone-ink)]", children: "Aún no has guardado direcciones." }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[58ch] text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75", children: "Guarda direcciones de envío para acelerar tus próximos pedidos. Una sola dirección puede ser predeterminada." }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: onAdd,
        className: "inline-flex h-12 items-center gap-2 bg-[var(--iko-accent)] px-7 text-[14px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]",
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4", strokeWidth: 1.5 }),
          "Agregar dirección"
        ]
      }
    ) })
  ] });
}
function useAddressForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const form = useForm({ ...EMPTY_FORM });
  function openAddModal() {
    setEditingAddress(null);
    form.reset();
    form.clearErrors();
    setIsEditing(true);
  }
  function openEditModal(address) {
    setEditingAddress(address);
    form.setData({
      label: address.label,
      name: address.name,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      phone: address.phone || "",
      is_default: address.is_default
    });
    form.clearErrors();
    setIsEditing(true);
  }
  function closeModal() {
    setIsEditing(false);
    setEditingAddress(null);
    form.reset();
    form.clearErrors();
  }
  function handleChange(e) {
    const target = e.target;
    const name = target.name;
    if (target.type === "checkbox") {
      form.setData(name, target.checked);
    } else {
      form.setData(name, target.value);
    }
    if (form.errors[name]) {
      form.clearErrors(name);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    const options = { preserveScroll: true, onSuccess: () => closeModal() };
    if (editingAddress) {
      form.put(`/account/addresses/${editingAddress.id}`, options);
    } else {
      form.post("/account/addresses", options);
    }
  }
  return {
    isEditing,
    editingAddress,
    form,
    openAddModal,
    openEditModal,
    closeModal,
    handleChange,
    handleSubmit
  };
}
function AddressFormModal({
  editingAddress,
  form,
  onClose,
  onSubmit,
  onChange
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "address-modal-heading",
      className: "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--iko-stone-ink)]/40 p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "my-8 w-full max-w-[32rem] border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] shadow-[0_24px_60px_-20px_rgba(13,38,46,0.25)]",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between border-b border-[var(--iko-stone-hairline)] px-6 py-5", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: "address-modal-heading",
                  className: "font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]",
                  children: editingAddress ? "Editar dirección" : "Nueva dirección"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]",
                  "aria-label": "Cerrar",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", strokeWidth: 1.5 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit, className: "flex flex-col gap-6 p-6", children: [
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "label",
                  label: "Etiqueta",
                  value: form.data.label,
                  onChange: (e) => {
                    form.setData("label", e.target.value);
                    if (form.errors.label) form.clearErrors("label");
                  },
                  placeholder: "Ej. Bodega, Oficina, Sucursal centro",
                  error: form.errors.label,
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "name",
                  label: "Nombre de contacto",
                  value: form.data.name,
                  onChange: (e) => {
                    form.setData("name", e.target.value);
                    if (form.errors.name) form.clearErrors("name");
                  },
                  error: form.errors.name,
                  autoComplete: "name",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "address_line_1",
                  label: "Calle y número",
                  value: form.data.address_line_1,
                  onChange: (e) => {
                    form.setData("address_line_1", e.target.value);
                    if (form.errors.address_line_1) form.clearErrors("address_line_1");
                  },
                  error: form.errors.address_line_1,
                  autoComplete: "address-line1",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "address_line_2",
                  label: "Colonia / referencias",
                  value: form.data.address_line_2,
                  onChange: (e) => {
                    form.setData("address_line_2", e.target.value);
                    if (form.errors.address_line_2) form.clearErrors("address_line_2");
                  },
                  error: form.errors.address_line_2,
                  autoComplete: "address-line2"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "city",
                    label: "Ciudad",
                    value: form.data.city,
                    onChange: (e) => {
                      form.setData("city", e.target.value);
                      if (form.errors.city) form.clearErrors("city");
                    },
                    error: form.errors.city,
                    autoComplete: "address-level2",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  SelectField,
                  {
                    id: "state",
                    label: "Estado",
                    value: form.data.state,
                    error: form.errors.state,
                    onChange,
                    options: MEXICO_STATES
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-[8rem_1fr]", children: [
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "postal_code",
                    label: "C.P.",
                    value: form.data.postal_code,
                    onChange: (e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                      form.setData("postal_code", value);
                      if (form.errors.postal_code) form.clearErrors("postal_code");
                    },
                    error: form.errors.postal_code,
                    autoComplete: "postal-code",
                    inputMode: "numeric",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "phone",
                    label: "Teléfono",
                    type: "tel",
                    value: form.data.phone,
                    onChange: (e) => {
                      form.setData("phone", e.target.value);
                      if (form.errors.phone) form.clearErrors("phone");
                    },
                    error: form.errors.phone,
                    autoComplete: "tel",
                    inputMode: "tel"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-[13px] text-[var(--iko-stone-ink)]", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    name: "is_default",
                    checked: form.data.is_default,
                    onChange,
                    className: "h-4 w-4 border border-[var(--iko-stone-hairline)] accent-[var(--iko-accent)] rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)]"
                  }
                ),
                "Establecer como dirección predeterminada"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "flex-1 border border-[var(--iko-stone-hairline)] py-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)]",
                    children: "Cancelar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: form.processing,
                    className: "flex-1 bg-[var(--iko-accent)] py-3 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] disabled:opacity-60",
                    children: form.processing ? "Guardando…" : editingAddress ? "Guardar cambios" : "Agregar dirección"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function SelectField({
  id,
  label,
  value,
  error,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxs(
      "label",
      {
        htmlFor: id,
        className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase",
        children: [
          label,
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "ml-1 opacity-50", children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "select",
      {
        id,
        name: id,
        value,
        onChange,
        required: true,
        className: `h-12 w-full appearance-none border-b bg-transparent pr-6 font-sans text-[15px] text-[var(--iko-stone-ink)] focus-visible:outline-none focus-visible:border-[var(--iko-accent)] ${error ? "border-[var(--iko-error)]" : "border-[var(--iko-stone-hairline)]"}`,
        style: {
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none' stroke='%237a7a7a'><path d='M1 1l4 4 4-4'/></svg>")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0 center",
          backgroundSize: "10px"
        },
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar…" }),
          options.map((opt) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, opt))
        ]
      }
    ),
    error && /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]", children: error })
  ] });
}
export {
  Addresses as default
};
