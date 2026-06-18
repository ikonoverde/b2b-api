import { jsx, jsxs } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { Suspense, lazy } from "react";
import { A as AppLayout } from "./AppLayout-BWo2G9Nz.js";
const MDEditor = lazy(() => import("@uiw/react-md-editor"));
function EditStaticPage({ page }) {
  const form = useForm({
    title: page.title,
    content: page.content,
    is_published: page.is_published
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    form.put(`/admin/static-pages/${page.id}`);
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: `Editar: ${page.title}`, active: "static-pages", children: /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/admin/static-pages",
        className: "inline-flex items-center gap-2 text-[#4A5D4A] font-[Outfit] font-medium text-sm hover:underline mb-6",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Volver a Páginas"
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-8", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1A1A1A] font-[Outfit]", children: "Editar Página" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#666666] font-[Outfit] mt-1", children: [
        "/",
        page.slug
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Título" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: form.data.title,
            onChange: (e) => form.setData("title", e.target.value),
            className: "w-full border border-[#E5E5E5] rounded-lg px-4 py-2.5 font-[Outfit] text-sm",
            required: true
          }
        ),
        form.errors.title && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1", children: "Contenido (Markdown)" }),
        /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-96 bg-[#F5F3F0] rounded-lg animate-pulse" }),
            children: /* @__PURE__ */ jsx("div", { "data-color-mode": "light", children: /* @__PURE__ */ jsx(
              MDEditor,
              {
                value: form.data.content,
                onChange: (val) => form.setData("content", val || ""),
                height: 500
              }
            ) })
          }
        ),
        form.errors.content && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.content })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: form.data.is_published,
            onChange: (e) => form.setData("is_published", e.target.checked),
            className: "rounded border-[#E5E5E5]"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm text-[#1A1A1A]", children: "Publicada" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: form.processing,
          className: "bg-[#4A5D4A] text-white px-8 py-2.5 rounded-lg font-[Outfit] font-medium text-sm hover:bg-[#3d4e3d] disabled:opacity-50 cursor-pointer",
          children: form.processing ? "Guardando..." : "Guardar Cambios"
        }
      ) })
    ] })
  ] }) }) });
}
export {
  EditStaticPage as default
};
