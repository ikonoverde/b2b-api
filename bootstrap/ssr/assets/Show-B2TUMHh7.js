import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-6e0_pEmP.js";
import { ArrowLeft, AlertTriangle, CheckCircle2, ExternalLink, Send } from "lucide-react";
import { p as platformLabels, S as StatusPill, a as statusDescriptions, f as formatDateTime } from "./StatusPill-DNvEWD1S.js";
import "./sidebar-DK9OU6Q6.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function Flash({ flash }) {
  const message = flash.success ?? flash.error;
  if (message === void 0) {
    return null;
  }
  const isSuccess = flash.success !== void 0;
  const Icon = isSuccess ? CheckCircle2 : AlertTriangle;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex items-start gap-3 rounded-xl border px-5 py-4 ${isSuccess ? "border-muted bg-muted text-primary" : "border-destructive/20 bg-destructive/10 text-destructive"}`,
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "mt-0.5 h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: message })
      ]
    }
  );
}
function PostPreview({ draft }) {
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: "La publicación, tal como saldría" }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: [
      draft.image_url && /* @__PURE__ */ jsx(
        "img",
        {
          src: draft.image_url,
          alt: "",
          className: "max-h-[420px] w-full border-b border-border object-cover"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 px-8 py-7", children: [
        /* @__PURE__ */ jsx("p", { className: "max-w-[65ch] whitespace-pre-wrap text-[15px] leading-relaxed text-foreground", children: draft.caption }),
        draft.link && /* @__PURE__ */ jsxs(
          "a",
          {
            href: draft.link,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex w-fit items-center gap-1.5 text-sm text-primary hover:underline",
            children: [
              draft.link,
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] })
    ] }),
    draft.requires_image && draft.image_url === null && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: "Instagram no acepta publicaciones sin imagen. Este borrador no se puede publicar hasta que tenga una." })
  ] });
}
function Notes({ draft }) {
  if (draft.rationale === null && draft.brand_review === null) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-4 rounded-xl border border-border bg-card px-8 py-7", children: [
    draft.rationale && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground", children: "Por qué esta publicación" }),
      /* @__PURE__ */ jsx("p", { className: "max-w-[70ch] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground", children: draft.rationale })
    ] }),
    draft.brand_review && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground", children: "Revisión de marca" }),
      /* @__PURE__ */ jsx("p", { className: "max-w-[70ch] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground", children: draft.brand_review })
    ] })
  ] });
}
function PublishActions({ draft }) {
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const publish = useForm({});
  const reject = useForm({ rejection_reason: "" });
  if (!draft.is_publishable && draft.status === "pending") {
    return /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Este borrador todavía no se puede publicar." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
    !confirming && !rejecting && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setConfirming(true),
          className: "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary",
          children: [
            /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
            "Publicar en ",
            platformLabels[draft.platform]
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setRejecting(true),
          className: "inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-muted",
          children: "Descartar"
        }
      )
    ] }),
    confirming && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-lg border border-border bg-muted p-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Esto se publica de inmediato en ",
        platformLabels[draft.platform],
        " y queda a la vista de cualquiera. Meta no tiene deshacer: para bajarlo tendrás que entrar a la cuenta."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: publish.processing,
            onClick: () => publish.post(`/admin/social-posts/${draft.id}/publish`, {
              preserveScroll: true,
              onFinish: () => setConfirming(false)
            }),
            className: "inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-60",
            children: [
              /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
              publish.processing ? "Publicando..." : "Sí, publicar ahora"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setConfirming(false),
            disabled: publish.processing,
            className: "inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted",
            children: "Cancelar"
          }
        )
      ] })
    ] }),
    rejecting && /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: (event) => {
          event.preventDefault();
          reject.post(`/admin/social-posts/${draft.id}/reject`, {
            preserveScroll: true,
            onSuccess: () => setRejecting(false)
          });
        },
        className: "flex flex-col gap-3 rounded-lg border border-border bg-background p-4",
        children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "rejection_reason",
              className: "text-sm font-medium text-foreground",
              children: "¿Por qué se descarta?"
            }
          ),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "rejection_reason",
              value: reject.data.rejection_reason,
              onChange: (event) => reject.setData("rejection_reason", event.target.value),
              rows: 3,
              className: "rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary",
              placeholder: "Lo que escribas aquí es lo único que le dice al siguiente borrador qué evitar."
            }
          ),
          reject.errors.rejection_reason && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: reject.errors.rejection_reason }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: reject.processing,
                className: "inline-flex h-10 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-white transition-colors hover:bg-foreground disabled:opacity-60",
                children: reject.processing ? "Descartando..." : "Descartar borrador"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setRejecting(false),
                disabled: reject.processing,
                className: "inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted",
                children: "Cancelar"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function Record({ draft }) {
  const rows = [
    { label: "Plataforma", value: platformLabels[draft.platform] },
    { label: "Creado", value: formatDateTime(draft.created_at) }
  ];
  if (draft.proposed_for) {
    rows.push({ label: "Sugerido para", value: formatDateTime(draft.proposed_for) });
  }
  if (draft.reviewer) {
    rows.push({ label: "Revisó", value: draft.reviewer });
  }
  if (draft.reviewed_at) {
    rows.push({ label: "Revisado", value: formatDateTime(draft.reviewed_at) });
  }
  if (draft.published_at) {
    rows.push({ label: "Publicado", value: formatDateTime(draft.published_at) });
  }
  if (draft.remote_post_id) {
    rows.push({
      label: "ID en Meta",
      value: /* @__PURE__ */ jsx("span", { className: "font-mono text-xs", children: draft.remote_post_id })
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsx("dl", { className: "flex flex-col gap-3", children: rows.map((row) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsx("dt", { className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground", children: row.label }),
      /* @__PURE__ */ jsx("dd", { className: "text-sm text-foreground", children: row.value })
    ] }, row.label)) }),
    draft.remote_permalink && /* @__PURE__ */ jsxs(
      "a",
      {
        href: draft.remote_permalink,
        target: "_blank",
        rel: "noreferrer",
        className: "inline-flex w-fit items-center gap-1.5 text-sm text-primary hover:underline",
        children: [
          "Ver en ",
          platformLabels[draft.platform],
          /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
        ]
      }
    )
  ] });
}
function SocialPostShow() {
  const { draft, flash } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: `Borrador · ${platformLabels[draft.platform]}`, active: "social-posts", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/admin/social-posts",
        className: "flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Publicaciones sociales"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-[28px] font-semibold text-foreground", children: [
        "Borrador para ",
        platformLabels[draft.platform]
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsx(StatusPill, { status: draft.status }),
        /* @__PURE__ */ jsx("span", { className: "max-w-2xl text-sm text-muted-foreground", children: statusDescriptions[draft.status] })
      ] })
    ] }),
    flash && /* @__PURE__ */ jsx(Flash, { flash }),
    draft.publish_error && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 px-5 py-4", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: "Meta rechazó la publicación. No hay nada público." }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs leading-relaxed text-destructive/85", children: draft.publish_error })
      ] })
    ] }),
    draft.rejection_reason && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 rounded-xl border border-border bg-muted px-5 py-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Descartado" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: draft.rejection_reason })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsx(PostPreview, { draft }),
        /* @__PURE__ */ jsx(Notes, { draft })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "flex flex-col gap-6 self-start rounded-xl border border-border bg-card p-6", children: [
        draft.status === "pending" && /* @__PURE__ */ jsx(PublishActions, { draft }),
        /* @__PURE__ */ jsx(Record, { draft })
      ] })
    ] })
  ] }) });
}
export {
  SocialPostShow as default
};
