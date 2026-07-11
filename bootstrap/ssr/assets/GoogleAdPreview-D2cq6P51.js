import { jsx, jsxs } from "react/jsx-runtime";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
function rotate(items, offset, take) {
  if (items.length === 0) {
    return [];
  }
  return Array.from({ length: Math.min(take, items.length) }, (_, index) => items[(offset + index) % items.length]);
}
function SerpAd({ creative, offset }) {
  const headlines = rotate(creative.headlines, offset, 3);
  const descriptions = rotate(creative.descriptions, offset, 2);
  const path = creative.path ? `/${creative.path.replace(/^\/+/, "")}` : "";
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[652px] font-[Arial,sans-serif]", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-[14px] leading-tight text-[#202124]", children: /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Patrocinado" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full border border-[#DADCE0] bg-white text-[12px] font-semibold text-[#4A5D4A]", children: creative.display_url.charAt(0).toUpperCase() }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "truncate text-[14px] leading-tight text-[#202124]", children: creative.display_url }),
        /* @__PURE__ */ jsxs("span", { className: "truncate text-[12px] leading-tight text-[#4D5156]", children: [
          "https://",
          creative.display_url,
          path
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h3", { className: "mt-1 text-[20px] leading-[1.3] text-[#1A0DAB] hover:underline", children: headlines.length > 0 ? headlines.join(" | ") : "—" }),
    descriptions.length > 0 && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[14px] leading-[1.58] text-[#4D5156]", children: descriptions.join(" ") }),
    creative.sitelinks.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-2 gap-x-10 gap-y-2", children: creative.sitelinks.map((sitelink) => /* @__PURE__ */ jsx(
      "span",
      {
        className: "border-t border-[#DADCE0] pt-2 text-[14px] text-[#1A0DAB] hover:underline",
        children: sitelink
      },
      sitelink
    )) })
  ] });
}
function AssetList({ title, items, limit }) {
  if (items.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-[11px] font-medium uppercase tracking-wide text-[#999999]", children: title }),
      /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-[11px] text-[#999999]", children: [
        items.length,
        " / ",
        limit
      ] })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1.5", children: items.map((item) => /* @__PURE__ */ jsxs(
      "li",
      {
        className: "flex items-baseline justify-between gap-4 rounded-lg border border-[#E5E5E5] bg-white px-3 py-2",
        children: [
          /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm text-[#1A1A1A]", children: item }),
          /* @__PURE__ */ jsx("span", { className: "shrink-0 font-[Outfit] text-xs text-[#999999]", children: item.length })
        ]
      },
      item
    )) })
  ] });
}
function GoogleAdCard({ creative }) {
  const [offset, setOffset] = useState(0);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
    creative.ad_group && /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-xs font-medium text-[#666666]", children: [
      "Grupo de anuncios: ",
      creative.ad_group
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-white p-6", children: [
      /* @__PURE__ */ jsx(SerpAd, { creative, offset }),
      creative.headlines.length > 3 && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setOffset((current) => current + 1),
          className: "flex w-fit items-center gap-2 font-[Outfit] text-xs font-medium text-[#4A5D4A] hover:underline",
          children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "h-3 w-3" }),
            "Ver otra combinación"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsx(AssetList, { title: "Títulos", items: creative.headlines, limit: 15 }),
      /* @__PURE__ */ jsx(AssetList, { title: "Descripciones", items: creative.descriptions, limit: 4 })
    ] }),
    creative.keywords.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-[11px] font-medium uppercase tracking-wide text-[#999999]", children: "Palabras clave" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: creative.keywords.map((keyword) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "rounded-full border border-[#E5E5E5] bg-white px-2.5 py-1 font-[Outfit] text-xs text-[#666666]",
          children: keyword
        },
        keyword
      )) })
    ] })
  ] });
}
function GoogleAdPreview({ creatives }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-8 rounded-xl bg-[#F1F3F4] p-6", children: creatives.map((creative, index) => /* @__PURE__ */ jsx(GoogleAdCard, { creative }, index)) });
}
export {
  GoogleAdPreview as default
};
