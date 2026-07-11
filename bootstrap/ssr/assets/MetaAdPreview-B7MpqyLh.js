import { jsxs, jsx } from "react/jsx-runtime";
import { Globe, MoreHorizontal, ThumbsUp, MessageCircle, Share2, ChevronRight, Heart, Send, Bookmark, ImageIcon } from "lucide-react";
import { useState } from "react";
function BrandAvatar({ brand, size = 40 }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4A5D4A] to-[#2f3d2f] font-semibold text-white",
      style: { width: size, height: size, fontSize: size * 0.42 },
      children: brand.initial
    }
  );
}
function CreativeMedia({
  creative,
  aspect
}) {
  if (creative.image_url) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src: creative.image_url,
        alt: creative.headline ?? "Creativo del anuncio",
        className: "w-full object-cover",
        style: { aspectRatio: aspect }
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex w-full flex-col items-center justify-center gap-2 bg-[#E4E6EB] px-6 text-center",
      style: { aspectRatio: aspect },
      children: [
        /* @__PURE__ */ jsx(ImageIcon, { className: "h-8 w-8 text-[#8A8D91]" }),
        /* @__PURE__ */ jsx("p", { className: "max-w-sm text-[13px] leading-snug text-[#65676B]", children: creative.media_note ?? "Sin imagen definida" })
      ]
    }
  );
}
function FacebookAd({ creative, brand }) {
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[500px] overflow-hidden rounded-lg bg-white font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] shadow-[0_1px_2px_rgba(0,0,0,0.2)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 px-3 pb-2 pt-3", children: [
      /* @__PURE__ */ jsx(BrandAvatar, { brand }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[15px] font-semibold leading-tight text-[#050505]", children: brand.name }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[13px] leading-tight text-[#65676B]", children: [
          "Patrocinado ",
          /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "·" }),
          " ",
          /* @__PURE__ */ jsx(Globe, { className: "h-3 w-3" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-5 w-5 shrink-0 text-[#65676B]" })
    ] }),
    creative.primary_text && /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line px-3 pb-3 text-[15px] leading-[1.35] text-[#050505]", children: creative.primary_text }),
    /* @__PURE__ */ jsx(CreativeMedia, { creative, aspect: "1.91 / 1" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-[#CED0D4] bg-[#F7F8FA] px-3 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "truncate text-[12px] uppercase tracking-wide text-[#65676B]", children: brand.display_url }),
        /* @__PURE__ */ jsx("span", { className: "truncate text-[16px] font-semibold leading-tight text-[#050505]", children: creative.headline ?? "—" }),
        creative.description && /* @__PURE__ */ jsx("span", { className: "truncate text-[13px] text-[#65676B]", children: creative.description })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "shrink-0 cursor-default rounded-md bg-[#E4E6EB] px-3 py-2 text-[14px] font-semibold text-[#050505]",
          children: creative.cta
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-around px-3 py-1", children: [
      { icon: ThumbsUp, label: "Me gusta" },
      { icon: MessageCircle, label: "Comentar" },
      { icon: Share2, label: "Compartir" }
    ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxs(
      "span",
      {
        className: "flex flex-1 items-center justify-center gap-2 py-2 text-[15px] font-semibold text-[#65676B]",
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "h-[18px] w-[18px]" }),
          label
        ]
      },
      label
    )) })
  ] });
}
function InstagramAd({ creative, brand }) {
  const handle = brand.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[420px] overflow-hidden rounded-lg border border-[#DBDBDB] bg-white font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] p-[2px]", children: /* @__PURE__ */ jsx("div", { className: "rounded-full bg-white p-[2px]", children: /* @__PURE__ */ jsx(BrandAvatar, { brand, size: 30 }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "truncate text-[14px] font-semibold leading-tight text-[#262626]", children: handle }),
        /* @__PURE__ */ jsx("span", { className: "text-[12px] leading-tight text-[#262626]", children: "Patrocinado" })
      ] }),
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-5 w-5 shrink-0 text-[#262626]" })
    ] }),
    /* @__PURE__ */ jsx(CreativeMedia, { creative, aspect: "1 / 1" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#EFEFEF] px-3 py-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[14px] font-semibold text-[#262626]", children: creative.cta }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-[#262626]" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-3 pb-1 pt-3", children: [
      /* @__PURE__ */ jsx(Heart, { className: "h-6 w-6 text-[#262626]" }),
      /* @__PURE__ */ jsx(MessageCircle, { className: "h-6 w-6 -scale-x-100 text-[#262626]" }),
      /* @__PURE__ */ jsx(Send, { className: "h-6 w-6 text-[#262626]" }),
      /* @__PURE__ */ jsx(Bookmark, { className: "ml-auto h-6 w-6 text-[#262626]" })
    ] }),
    (creative.primary_text || creative.headline) && /* @__PURE__ */ jsxs("p", { className: "whitespace-pre-line px-3 pb-4 pt-2 text-[14px] leading-[1.4] text-[#262626]", children: [
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: handle }),
      " ",
      creative.primary_text ?? creative.headline
    ] })
  ] });
}
function MetaAdPreview({
  creatives,
  brand
}) {
  const [placement, setPlacement] = useState("facebook");
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx("div", { className: "flex w-fit gap-1 rounded-lg border border-[#E5E5E5] bg-[#FBF9F7] p-1", children: [
      ["facebook", "Facebook feed"],
      ["instagram", "Instagram feed"]
    ].map(([value, label]) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setPlacement(value),
        className: `rounded-md px-3 py-1.5 font-[Outfit] text-sm font-medium transition-colors ${placement === value ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#666666] hover:text-[#1A1A1A]"}`,
        children: label
      },
      value
    )) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-6 rounded-xl bg-[#F0F2F5] p-6", children: creatives.map((creative, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      creatives.length > 1 && /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-xs font-medium text-[#666666]", children: [
        "Creativo ",
        index + 1
      ] }),
      placement === "facebook" ? /* @__PURE__ */ jsx(FacebookAd, { creative, brand }) : /* @__PURE__ */ jsx(InstagramAd, { creative, brand })
    ] }, index)) })
  ] });
}
export {
  MetaAdPreview as default
};
