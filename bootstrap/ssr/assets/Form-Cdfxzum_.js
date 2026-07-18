import { jsx, jsxs } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Eye } from "lucide-react";
import { Suspense, lazy } from "react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
const MDEditor = lazy(() => import("@uiw/react-md-editor"));
function BlogPostForm({ post }) {
  const form = useForm({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    cover_image: null,
    is_published: post?.is_published ?? false,
    published_at: post?.published_at ? post.published_at.slice(0, 16) : ""
  });
  const isEditing = Boolean(post);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (post) {
      form.transform((data) => ({ ...data, _method: "PUT" }));
      form.post(`/admin/blog-posts/${post.id}`, { forceFormData: true });
      return;
    }
    form.post("/admin/blog-posts", { forceFormData: true });
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: isEditing ? `Editar: ${post?.title}` : "Nueva entrada", active: "blog-posts", children: /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/admin/blog-posts",
        className: "mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Volver al Blog"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: isEditing ? "Editar Entrada" : "Nueva Entrada" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Administra el contenido, portada y publicación de la entrada." })
      ] }),
      post && /* @__PURE__ */ jsxs(
        "a",
        {
          href: `/admin/blog-posts/${post.id}/preview`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-primary hover:bg-muted",
          children: [
            /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
            "Vista previa"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Field, { label: "Título", error: form.errors.title, children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: form.data.title,
            onChange: (e) => form.setData("title", e.target.value),
            className: "w-full rounded-lg border border-border px-4 py-2.5 text-sm",
            required: true
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { label: "Slug", error: form.errors.slug, children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: form.data.slug,
            onChange: (e) => form.setData("slug", e.target.value),
            placeholder: "se-genera-si-lo-dejas-vacio",
            className: "w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(Field, { label: "Extracto", error: form.errors.excerpt, children: /* @__PURE__ */ jsx(
        "textarea",
        {
          value: form.data.excerpt,
          onChange: (e) => form.setData("excerpt", e.target.value),
          rows: 3,
          maxLength: 500,
          className: "w-full rounded-lg border border-border px-4 py-2.5 text-sm"
        }
      ) }),
      /* @__PURE__ */ jsxs(Field, { label: "Imagen de portada", error: form.errors.cover_image, children: [
        post?.cover_image_url && /* @__PURE__ */ jsx(
          "img",
          {
            src: post.cover_image_url,
            alt: "",
            className: "mb-3 aspect-[16/7] w-full rounded-lg object-cover"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/png,image/jpeg,image/webp",
            onChange: (e) => form.setData("cover_image", e.target.files?.[0] ?? null),
            className: "w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Field, { label: "Contenido (Markdown)", error: form.errors.content, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "h-96 animate-pulse rounded-lg bg-muted" }), children: /* @__PURE__ */ jsx("div", { "data-color-mode": "light", children: /* @__PURE__ */ jsx(
        MDEditor,
        {
          value: form.data.content,
          onChange: (value) => form.setData("content", value ?? ""),
          height: 520
        }
      ) }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 rounded-xl border border-border bg-card p-5 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2", children: [
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
        /* @__PURE__ */ jsx(Field, { label: "Fecha de publicación", error: form.errors.published_at, compact: true, children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "datetime-local",
            value: form.data.published_at,
            onChange: (e) => form.setData("published_at", e.target.value),
            className: "w-full rounded-lg border border-border px-4 py-2.5 text-sm"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/admin/blog-posts",
            className: "px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: form.processing,
            className: "cursor-pointer rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white hover:bg-primary disabled:opacity-50",
            children: form.processing ? "Guardando..." : isEditing ? "Actualizar" : "Crear"
          }
        )
      ] })
    ] })
  ] }) }) });
}
function Field({
  label,
  error,
  children,
  compact = false
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium text-foreground ${compact ? "mb-1" : "mb-2"}`, children: label }),
    children,
    error && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-destructive", children: error })
  ] });
}
export {
  BlogPostForm as default
};
