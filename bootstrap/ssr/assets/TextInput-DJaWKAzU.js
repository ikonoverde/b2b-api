import { jsxs, jsx } from "react/jsx-runtime";
function TextInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled,
  suffix,
  autoFocus,
  required,
  readOnly,
  autoComplete,
  inputMode
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxs(
      "label",
      {
        htmlFor: id,
        className: "font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase",
        children: [
          label,
          required && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "ml-1 opacity-50", children: "*" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type,
          id,
          value,
          onChange,
          placeholder,
          className: `w-full h-12 ${suffix ? "pr-12" : ""} border-b border-[var(--iko-stone-hairline)] bg-transparent text-[var(--iko-stone-ink)] placeholder:text-[var(--iko-stone-whisper)] focus-visible:outline-none focus-visible:border-[var(--iko-accent)] disabled:opacity-50 font-sans text-[15px] transition-colors ${error ? "border-[var(--iko-error)]" : ""}`,
          disabled,
          autoFocus,
          required,
          readOnly,
          autoComplete,
          inputMode,
          "aria-invalid": error ? "true" : void 0,
          "aria-describedby": error ? `${id}-error` : void 0
        }
      ),
      suffix
    ] }),
    error && /* @__PURE__ */ jsxs(
      "span",
      {
        id: `${id}-error`,
        className: "flex items-center gap-1.5 font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]",
        children: [
          /* @__PURE__ */ jsx(ErrorGlyph, { "aria-hidden": "true" }),
          error
        ]
      }
    )
  ] });
}
function ErrorGlyph() {
  return /* @__PURE__ */ jsxs("svg", { width: "11", height: "11", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "1", children: [
    /* @__PURE__ */ jsx("circle", { cx: "6", cy: "6", r: "5.5" }),
    /* @__PURE__ */ jsx("line", { x1: "6", y1: "3", x2: "6", y2: "7", strokeWidth: "1.25" }),
    /* @__PURE__ */ jsx("circle", { cx: "6", cy: "9", r: "0.6", fill: "currentColor" })
  ] });
}
export {
  TextInput as T
};
