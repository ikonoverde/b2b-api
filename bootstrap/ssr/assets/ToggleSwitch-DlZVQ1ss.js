import { jsxs, jsx } from "react/jsx-runtime";
function ToggleSwitch({
  enabled,
  onToggle,
  label,
  description
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: label }),
      /* @__PURE__ */ jsx("span", { className: "text-[13px] text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onToggle,
        className: `w-11 h-6 rounded-full p-0.5 transition-colors ${enabled ? "bg-primary" : "bg-muted border border-border"}`,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `w-5 h-5 bg-card rounded-full shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"} ${!enabled ? "border border-border" : ""}`
          }
        )
      }
    )
  ] });
}
export {
  ToggleSwitch as default
};
