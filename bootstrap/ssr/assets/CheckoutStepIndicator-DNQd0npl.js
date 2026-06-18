import { jsx, jsxs } from "react/jsx-runtime";
import { Check } from "lucide-react";
const STEPS = [
  { label: "Envío", step: 1 },
  { label: "Pago", step: 2 },
  { label: "Confirmación", step: 3 }
];
function CheckoutStepIndicator({ currentStep }) {
  return /* @__PURE__ */ jsx(
    "ol",
    {
      "aria-label": "Progreso de la compra",
      className: "flex items-stretch border-y border-[var(--iko-stone-hairline)]",
      children: STEPS.map(({ label, step }, index) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;
        const status = isCompleted ? "completed" : isActive ? "active" : "pending";
        return /* @__PURE__ */ jsxs(
          "li",
          {
            className: `flex flex-1 items-center gap-3 py-4 ${index === 0 ? "" : "border-l border-[var(--iko-stone-hairline)] pl-5"} pr-5`,
            "aria-current": isActive ? "step" : void 0,
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `flex h-7 w-7 shrink-0 items-center justify-center border ${status === "completed" ? "border-[var(--iko-accent)] bg-[var(--iko-accent)] text-[var(--iko-accent-on)]" : status === "active" ? "border-[var(--iko-accent)] text-[var(--iko-accent)]" : "border-[var(--iko-stone-hairline)] text-[var(--iko-stone-mid)]"}`,
                  children: status === "completed" ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5", strokeWidth: 2 }) : /* @__PURE__ */ jsx("span", { className: "font-spec text-[11px] tabular-nums", children: String(step).padStart(2, "0") })
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `font-spec text-[10px] tracking-[0.08em] uppercase ${status === "pending" ? "text-[var(--iko-stone-mid)]" : "text-[var(--iko-stone-whisper)]"}`,
                    children: [
                      "Paso ",
                      step
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[13px] ${status === "active" ? "text-[var(--iko-stone-ink)]" : status === "completed" ? "text-[var(--iko-stone-ink)]" : "text-[var(--iko-stone-whisper)]"}`,
                    children: label
                  }
                )
              ] })
            ]
          },
          step
        );
      })
    }
  );
}
export {
  CheckoutStepIndicator as C
};
