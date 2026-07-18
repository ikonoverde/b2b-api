import { jsx, jsxs } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { Suspense, lazy } from "react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
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
        className: "inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline mb-6",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Volver a Páginas"
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-8", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Editar Página" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        "/",
        page.slug
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Título" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: form.data.title,
            onChange: (e) => form.setData("title", e.target.value),
            className: "w-full border border-border rounded-lg px-4 py-2.5 text-sm",
            required: true
          }
        ),
        form.errors.title && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs mt-1", children: form.errors.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Contenido (Markdown)" }),
        /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-96 bg-muted rounded-lg animate-pulse" }),
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
        form.errors.content && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs mt-1", children: form.errors.content })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: form.data.is_published,
            onChange: (e) => form.setData("is_published", e.target.checked),
            className: "rounded border-border"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: "Publicada" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: form.processing,
          className: "bg-primary text-white px-8 py-2.5 rounded-lg font-medium text-sm hover:bg-primary disabled:opacity-50 cursor-pointer",
          children: form.processing ? "Guardando..." : "Guardar Cambios"
        }
      ) })
    ] })
  ] }) }) });
}
export {
  EditStaticPage as default
};
