import { jsxs, jsx } from "react/jsx-runtime";
import ToggleSwitch from "./ToggleSwitch-DlZVQ1ss.js";
function StatusCard({
  isActive,
  isFeatured,
  onToggleActive,
  onToggleFeatured
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Estado del Producto" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsx(
        ToggleSwitch,
        {
          enabled: isActive,
          onToggle: onToggleActive,
          label: "Producto Activo",
          description: "Visible en el catálogo"
        }
      ),
      /* @__PURE__ */ jsx(
        ToggleSwitch,
        {
          enabled: isFeatured,
          onToggle: onToggleFeatured,
          label: "Producto Destacado",
          description: "Mostrar en página principal"
        }
      )
    ] })
  ] });
}
export {
  StatusCard as default
};
