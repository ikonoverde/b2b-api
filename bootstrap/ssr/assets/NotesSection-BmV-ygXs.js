import { jsxs, jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { Send, MessageSquare } from "lucide-react";
import { a as formatDate } from "./date-31wqykji.js";
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-[#E5E5E5]", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-[#1A1A1A] font-[Outfit]", children: [
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
              className: "w-full px-4 py-3 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors resize-none"
            }
          ),
          errors.content && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-[Outfit]", children: errors.content })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing || !data.content.trim(),
            className: "self-end h-10 px-4 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50",
            children: /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" })
          }
        )
      ] }),
      order.notes.map((note) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-3 bg-[#FBF9F7] rounded-lg", children: [
        /* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4 text-[#999999] mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[#1A1A1A] font-[Outfit]", children: note.content }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-[#999999] font-[Outfit]", children: formatDate(note.created_at) }),
            note.admin_name && /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#999999] font-[Outfit]", children: [
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
