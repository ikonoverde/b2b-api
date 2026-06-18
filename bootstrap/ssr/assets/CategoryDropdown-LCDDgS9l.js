import { jsxs, jsx } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";
function CategoryDropdown({
  categoryId,
  categories,
  isOpen,
  onToggle,
  onSelect,
  error
}) {
  const selectedCategory = categories.find((cat) => String(cat.id) === categoryId);
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2 relative", children: [
    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-[#1A1A1A] font-[Outfit]", children: "Categoría" }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: onToggle,
        className: "h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsx("span", { className: categoryId ? "text-[#1A1A1A]" : "text-[#999999]", children: selectedCategory?.name || "Seleccionar categoría" }),
          /* @__PURE__ */ jsx(ChevronDown, { className: "w-[18px] h-[18px] text-[#999999]" })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-10 max-h-48 overflow-y-auto", children: categories.map((cat) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onSelect(String(cat.id)),
        className: "w-full px-4 py-2.5 text-left text-sm text-[#1A1A1A] font-[Outfit] hover:bg-[#F5F3F0] transition-colors",
        children: cat.name
      },
      cat.id
    )) }),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: error })
  ] });
}
export {
  CategoryDropdown as default
};
