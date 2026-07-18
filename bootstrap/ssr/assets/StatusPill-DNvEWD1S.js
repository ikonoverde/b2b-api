import { jsxs, jsx } from "react/jsx-runtime";
import { AlertTriangle, CircleSlash, CheckCircle2, HelpCircle, Clock } from "lucide-react";
const platformLabels = {
  facebook: "Facebook",
  instagram: "Instagram"
};
const statusLabels = {
  pending: "En revisión",
  publishing: "Sin confirmar",
  published: "Publicado",
  rejected: "Descartado",
  failed: "Falló"
};
const statusDescriptions = {
  pending: "Nadie lo ha enviado a Meta. Sigue siendo una propuesta.",
  publishing: "Se envió a Meta y no quedó registrada la respuesta. Puede estar publicado o no. Revisa la cuenta antes de volver a intentarlo: reintentar puede publicarlo dos veces.",
  published: "Meta lo aceptó. Ya es público y no se puede deshacer desde aquí.",
  rejected: "Una persona lo descartó. No se envió nada a Meta.",
  failed: "Meta lo rechazó. No hay nada público."
};
const statusPillClasses = {
  pending: "border-muted bg-muted text-primary",
  publishing: "border-border bg-muted text-muted-foreground",
  published: "border-muted bg-primary text-white",
  rejected: "border-border bg-muted text-muted-foreground",
  failed: "border-destructive/20 bg-destructive/10 text-destructive"
};
function formatDateTime(value) {
  if (value === null) {
    return "Sin fecha";
  }
  return new Date(value).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function truncate(value, length = 120) {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length).trimEnd()}…`;
}
const statusIcons = {
  pending: Clock,
  publishing: HelpCircle,
  published: CheckCircle2,
  rejected: CircleSlash,
  failed: AlertTriangle
};
function StatusPill({ status }) {
  const Icon = statusIcons[status] ?? HelpCircle;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      title: statusDescriptions[status],
      className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[status]}`,
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
        statusLabels[status]
      ]
    }
  );
}
const StatusPill$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StatusPill
}, Symbol.toStringTag, { value: "Module" }));
export {
  StatusPill as S,
  statusDescriptions as a,
  StatusPill$1 as b,
  formatDateTime as f,
  platformLabels as p,
  statusLabels as s,
  truncate as t
};
