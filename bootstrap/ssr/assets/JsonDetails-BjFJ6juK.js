import { jsxs, jsx } from "react/jsx-runtime";
function humanize(key) {
  return key.replace(/[_-]+/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}
function ScalarValue({ value }) {
  return /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: String(value) });
}
function JsonValue({ value, depth = 0 }) {
  if (value === null || value === void 0 || value === "") {
    return /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "—" });
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return /* @__PURE__ */ jsx(ScalarValue, { value });
  }
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: value.map((item, index) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground",
          children: String(item)
        },
        index
      )) });
    }
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: value.map((item, index) => /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-background p-3", children: /* @__PURE__ */ jsx(JsonValue, { value: item, depth: depth + 1 }) }, index)) });
  }
  if (typeof value === "object") {
    return /* @__PURE__ */ jsx("dl", { className: "flex flex-col gap-2.5", children: Object.entries(value).map(([key, nested]) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("dt", { className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground", children: humanize(key) }),
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
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-3 rounded-xl border border-border bg-card p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: title }),
    children ?? /* @__PURE__ */ jsx(JsonValue, { value })
  ] });
}
export {
  DetailCard,
  JsonValue
};
