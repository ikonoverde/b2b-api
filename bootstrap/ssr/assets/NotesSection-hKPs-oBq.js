import { jsxs, jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { Send, MessageSquare } from "lucide-react";
import { b as formatDate } from "./date-CuQtAuCG.js";
function NotesSection({ order }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    content: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/orders/${order.id}/notes`, {
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-foreground", children: [
      "Notas Internas (",
      order.notes.length,
      ")"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.content,
              onChange: (e) => setData("content", e.target.value),
              placeholder: "Agregar una nota interna...",
              rows: 2,
              className: "w-full px-4 py-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors resize-none"
            }
          ),
          errors.content && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: errors.content })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing || !data.content.trim(),
            className: "self-end h-10 px-4 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50",
            children: /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" })
          }
        )
      ] }),
      order.notes.map((note) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-3 bg-background rounded-lg", children: [
        /* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4 text-muted-foreground mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: note.content }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: formatDate(note.created_at) }),
            note.admin_name && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "por ",
              note.admin_name
            ] })
          ] })
        ] })
      ] }, note.id))
    ] })
  ] });
}
export {
  NotesSection as default
};
