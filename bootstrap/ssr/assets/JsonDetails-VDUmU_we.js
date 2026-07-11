import { jsxs, jsx } from "react/jsx-runtime";
function humanize(key) {
  return key.replace(/[_-]+/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}
function ScalarValue({ value }) {
  return /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm text-[#1A1A1A]", children: String(value) });
}
function JsonValue({ value, depth = 0 }) {
  if (value === null || value === void 0 || value === "") {
    return /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm text-[#999999]", children: "—" });
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return /* @__PURE__ */ jsx(ScalarValue, { value });
  }
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: value.map((item, index) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "rounded-full border border-[#E5E5E5] bg-[#FBF9F7] px-2.5 py-1 font-[Outfit] text-xs text-[#666666]",
          children: String(item)
        },
        index
      )) });
    }
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: value.map((item, index) => /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-[#E5E5E5] bg-[#FBF9F7] p-3", children: /* @__PURE__ */ jsx(JsonValue, { value: item, depth: depth + 1 }) }, index)) });
  }
  if (typeof value === "object") {
    return /* @__PURE__ */ jsx("dl", { className: "flex flex-col gap-2.5", children: Object.entries(value).map(([key, nested]) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("dt", { className: "font-[Outfit] text-[11px] font-medium uppercase tracking-wide text-[#999999]", children: humanize(key) }),
      /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(JsonValue, { value: nested, depth: depth + 1 }) })
    ] }, key)) });
  }
  return /* @__PURE__ */ jsx(ScalarValue, { value: String(value) });
}
function DetailCard({
  title,
  value,
  children
}) {
  const isEmpty = children === void 0 && (value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0);
  if (isEmpty) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-white p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-[Outfit] text-sm font-semibold text-[#1A1A1A]", children: title }),
    children ?? /* @__PURE__ */ jsx(JsonValue, { value })
  ] });
}
export {
  DetailCard,
  JsonValue
};
