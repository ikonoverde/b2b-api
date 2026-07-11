import { jsx } from "react/jsx-runtime";
const platformLabels = {
  meta: "Meta Ads",
  google: "Google Ads"
};
const statusLabels = {
  draft: "Borrador",
  approved: "Aprobada",
  rejected: "Rechazada",
  launched: "Lanzada"
};
const budgetPeriodLabels = {
  daily: "diario",
  weekly: "semanal",
  monthly: "mensual",
  campaign: "por campaña"
};
function formatBudget(amount, currency, period) {
  if (amount === null) {
    return "—";
  }
  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount));
  return period ? `${formatted} ${budgetPeriodLabels[period] ?? period}` : formatted;
}
function formatDate(value) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function PlatformBadge({ platform }) {
  const styles = platform === "meta" ? "bg-[#E7F0FE] text-[#1877F2]" : "bg-[#FEF3E2] text-[#B06000]";
  return /* @__PURE__ */ jsx("span", { className: `inline-flex rounded-full px-2.5 py-1 font-[Outfit] text-xs font-medium ${styles}`, children: platformLabels[platform] ?? platform });
}
const PlatformBadge$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PlatformBadge
}, Symbol.toStringTag, { value: "Module" }));
export {
  PlatformBadge as P,
  formatDate as a,
  PlatformBadge$1 as b,
  formatBudget as f,
  platformLabels as p,
  statusLabels as s
};
