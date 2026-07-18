import { jsxs, jsx } from "react/jsx-runtime";
const baseDimensionFields = [
  { key: "weight_kg", label: "Peso base", unit: "kg" },
  { key: "width_cm", label: "Ancho base", unit: "cm" },
  { key: "height_cm", label: "Alto base", unit: "cm" },
  { key: "depth_cm", label: "Profundidad base", unit: "cm" }
];
const packageFields = [
  { key: "weight_kg", label: "Peso", unit: "kg", placeholder: "5.10" },
  { key: "width_cm", label: "Ancho", unit: "cm", placeholder: "20" },
  { key: "height_cm", label: "Alto", unit: "cm", placeholder: "17" },
  { key: "depth_cm", label: "Prof.", unit: "cm", placeholder: "25" }
];
const emptyShippingPackage = {
  quantity: "",
  weight_kg: "",
  width_cm: "",
  height_cm: "",
  depth_cm: ""
};
function ShippingDimensionsCard({ data, setData, errors }) {
  const updatePackage = (index, key, value) => {
    setData(
      "shipping_packages",
      data.shipping_packages.map((pkg, i) => i === index ? { ...pkg, [key]: value } : pkg)
    );
  };
  const addPackage = () => {
    setData("shipping_packages", [...data.shipping_packages, { ...emptyShippingPackage }]);
  };
  const removePackage = (index) => {
    setData("shipping_packages", data.shipping_packages.filter((_, i) => i !== index));
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Peso y Dimensiones" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Define el empaque base y medidas específicas por cantidad para cotizar envíos." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Empaque base" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Se usa como respaldo cuando no hay una configuración exacta para la cantidad." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-5", children: baseDimensionFields.map(({ key, label, unit }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: label }),
          /* @__PURE__ */ jsxs("div", { className: "flex h-11 bg-background rounded-lg border border-border overflow-hidden focus-within:border-primary transition-colors", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                inputMode: "decimal",
                value: data[key],
                onChange: (e) => setData(key, e.target.value),
                placeholder: "0.00",
                className: "flex-1 px-3 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "flex items-center px-3 bg-muted border-l border-border text-sm text-muted-foreground", children: unit })
          ] }),
          errors[key] && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors[key] })
        ] }, key)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-6 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Empaques por cantidad" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Ejemplo: 2 piezas pueden pesar 10.11 kg y medir 35 × 17 × 25 cm." })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: addPackage,
              className: "h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary transition-colors",
              children: "Agregar fila"
            }
          )
        ] }),
        data.shipping_packages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-border bg-background px-4 py-5 text-sm text-muted-foreground", children: "No hay empaques por cantidad. Agrega las filas necesarias para productos que cambian su peso o volumen al agruparse." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("div", { className: "min-w-[720px] flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px_repeat(4,minmax(110px,1fr))_40px] gap-3 px-1 text-xs font-semibold text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { children: "Cantidad" }),
            packageFields.map((field) => /* @__PURE__ */ jsx("span", { children: field.label }, field.key)),
            /* @__PURE__ */ jsx("span", {})
          ] }),
          data.shipping_packages.map((pkg, index) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px_repeat(4,minmax(110px,1fr))_40px] gap-3 items-start", children: [
            /* @__PURE__ */ jsx(
              PackageInput,
              {
                value: pkg.quantity,
                onChange: (value) => updatePackage(index, "quantity", value),
                placeholder: "1",
                unit: "uds",
                error: errors[`shipping_packages.${index}.quantity`],
                inputMode: "numeric"
              }
            ),
            packageFields.map((field) => /* @__PURE__ */ jsx(
              PackageInput,
              {
                value: pkg[field.key],
                onChange: (value) => updatePackage(index, field.key, value),
                placeholder: field.placeholder,
                unit: field.unit,
                error: errors[`shipping_packages.${index}.${field.key}`]
              },
              field.key
            )),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => removePackage(index),
                className: "h-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                "aria-label": "Eliminar fila de empaque",
                children: "×"
              }
            )
          ] }, index))
        ] }) }),
        errors.shipping_packages && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.shipping_packages })
      ] })
    ] })
  ] });
}
function PackageInput({
  value,
  onChange,
  placeholder,
  unit,
  error,
  inputMode = "decimal"
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex h-10 bg-background rounded-lg border border-border overflow-hidden focus-within:border-primary transition-colors", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          inputMode,
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder,
          className: "min-w-0 flex-1 px-3 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "flex items-center px-2 bg-muted border-l border-border text-xs text-muted-foreground", children: unit })
    ] }),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: error })
  ] });
}
export {
  ShippingDimensionsCard as default
};
