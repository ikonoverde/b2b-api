import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { Slot, Tooltip as Tooltip$1 } from "radix-ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StickToBottom } from "use-stick-to-bottom";
import React, { useState, useRef, useLayoutEffect, createContext, useContext, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import { ArrowLeft, Bot, MessageSquarePlus, MessagesSquare, Sparkles, LineChart, Brain, Paperclip, ArrowUp } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function ChatContainerRoot({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    StickToBottom,
    {
      className: cn("flex overflow-y-auto", className),
      resize: "smooth",
      initial: "instant",
      role: "log",
      ...props,
      children
    }
  );
}
function ChatContainerContent({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    StickToBottom.Content,
    {
      className: cn("flex w-full flex-col", className),
      ...props,
      children
    }
  );
}
function ChatContainerScrollAnchor({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("h-px w-full shrink-0 scroll-mt-4", className),
      "aria-hidden": "true",
      ...props
    }
  );
}
function CircularLoader({
  className,
  size = "md"
}) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "border-primary animate-spin rounded-full border-2 border-t-transparent",
        sizeClasses[size],
        className
      ),
      children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
    }
  );
}
function ClassicLoader({
  className,
  size = "md"
}) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6"
  };
  const barSizes = {
    sm: { height: "6px", width: "1.5px" },
    md: { height: "8px", width: "2px" },
    lg: { height: "10px", width: "2.5px" }
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("relative", sizeClasses[size], className), children: [
    /* @__PURE__ */ jsx("div", { className: "absolute h-full w-full", children: [...Array(12)].map((_, i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-primary absolute animate-[spinner-fade_1.2s_linear_infinite] rounded-full",
        style: {
          top: "0",
          left: "50%",
          marginLeft: size === "sm" ? "-0.75px" : size === "lg" ? "-1.25px" : "-1px",
          transformOrigin: `${size === "sm" ? "0.75px" : size === "lg" ? "1.25px" : "1px"} ${size === "sm" ? "10px" : size === "lg" ? "14px" : "12px"}`,
          transform: `rotate(${i * 30}deg)`,
          opacity: 0,
          animationDelay: `${i * 0.1}s`,
          height: barSizes[size].height,
          width: barSizes[size].width
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
  ] });
}
function PulseLoader({
  className,
  size = "md"
}) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6"
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("relative", sizeClasses[size], className), children: [
    /* @__PURE__ */ jsx("div", { className: "border-primary absolute inset-0 animate-[thin-pulse_1.5s_ease-in-out_infinite] rounded-full border-2" }),
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
  ] });
}
function PulseDotLoader({
  className,
  size = "md"
}) {
  const sizeClasses = {
    sm: "size-1",
    md: "size-2",
    lg: "size-3"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "bg-primary animate-[pulse-dot_1.2s_ease-in-out_infinite] rounded-full",
        sizeClasses[size],
        className
      ),
      children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
    }
  );
}
function DotsLoader({
  className,
  size = "md"
}) {
  const dotSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5"
  };
  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center space-x-1",
        containerSizes[size],
        className
      ),
      children: [
        [...Array(3)].map((_, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "bg-primary animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full",
              dotSizes[size]
            ),
            style: {
              animationDelay: `${i * 160}ms`
            }
          },
          i
        )),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
      ]
    }
  );
}
function TypingLoader({
  className,
  size = "md"
}) {
  const dotSizes = {
    sm: "h-1 w-1",
    md: "h-1.5 w-1.5",
    lg: "h-2 w-2"
  };
  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center space-x-1",
        containerSizes[size],
        className
      ),
      children: [
        [...Array(3)].map((_, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "bg-primary animate-[typing_1s_infinite] rounded-full",
              dotSizes[size]
            ),
            style: {
              animationDelay: `${i * 250}ms`
            }
          },
          i
        )),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
      ]
    }
  );
}
function WaveLoader({
  className,
  size = "md"
}) {
  const barWidths = {
    sm: "w-0.5",
    md: "w-0.5",
    lg: "w-1"
  };
  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6"
  };
  const heights = {
    sm: ["6px", "9px", "12px", "9px", "6px"],
    md: ["8px", "12px", "16px", "12px", "8px"],
    lg: ["10px", "15px", "20px", "15px", "10px"]
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-0.5",
        containerSizes[size],
        className
      ),
      children: [
        [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "bg-primary animate-[wave_1s_ease-in-out_infinite] rounded-full",
              barWidths[size]
            ),
            style: {
              animationDelay: `${i * 100}ms`,
              height: heights[size][i]
            }
          },
          i
        )),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
      ]
    }
  );
}
function BarsLoader({
  className,
  size = "md"
}) {
  const barWidths = {
    sm: "w-1",
    md: "w-1.5",
    lg: "w-2"
  };
  const containerSizes = {
    sm: "h-4 gap-1",
    md: "h-5 gap-1.5",
    lg: "h-6 gap-2"
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("flex", containerSizes[size], className), children: [
    [...Array(3)].map((_, i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "bg-primary h-full animate-[wave-bars_1.2s_ease-in-out_infinite]",
          barWidths[size]
        ),
        style: {
          animationDelay: `${i * 0.2}s`
        }
      },
      i
    )),
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
  ] });
}
function TerminalLoader({
  className,
  size = "md"
}) {
  const cursorSizes = {
    sm: "h-3 w-1.5",
    md: "h-4 w-2",
    lg: "h-5 w-2.5"
  };
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center space-x-1",
        containerSizes[size],
        className
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: cn("text-primary font-mono", textSizes[size]), children: ">" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "bg-primary animate-[blink_1s_step-end_infinite]",
              cursorSizes[size]
            )
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading" })
      ]
    }
  );
}
function TextBlinkLoader({
  text = "Thinking",
  className,
  size = "md"
}) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "animate-[text-blink_2s_ease-in-out_infinite] font-medium",
        textSizes[size],
        className
      ),
      children: text
    }
  );
}
function TextShimmerLoader({
  text = "Thinking",
  className,
  size = "md"
}) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)]",
        "bg-size-[200%_auto] bg-clip-text font-medium text-transparent",
        "animate-[shimmer_4s_infinite_linear]",
        textSizes[size],
        className
      ),
      children: text
    }
  );
}
function TextDotsLoader({
  className,
  text = "Thinking",
  size = "md"
}) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("inline-flex items-center", className),
      children: [
        /* @__PURE__ */ jsx("span", { className: cn("text-primary font-medium", textSizes[size]), children: text }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex", children: [
          /* @__PURE__ */ jsx("span", { className: "text-primary animate-[loading-dots_1.4s_infinite_0.2s]", children: "." }),
          /* @__PURE__ */ jsx("span", { className: "text-primary animate-[loading-dots_1.4s_infinite_0.4s]", children: "." }),
          /* @__PURE__ */ jsx("span", { className: "text-primary animate-[loading-dots_1.4s_infinite_0.6s]", children: "." })
        ] })
      ]
    }
  );
}
function Loader({
  variant = "circular",
  size = "md",
  text,
  className
}) {
  switch (variant) {
    case "circular":
      return /* @__PURE__ */ jsx(CircularLoader, { size, className });
    case "classic":
      return /* @__PURE__ */ jsx(ClassicLoader, { size, className });
    case "pulse":
      return /* @__PURE__ */ jsx(PulseLoader, { size, className });
    case "pulse-dot":
      return /* @__PURE__ */ jsx(PulseDotLoader, { size, className });
    case "dots":
      return /* @__PURE__ */ jsx(DotsLoader, { size, className });
    case "typing":
      return /* @__PURE__ */ jsx(TypingLoader, { size, className });
    case "wave":
      return /* @__PURE__ */ jsx(WaveLoader, { size, className });
    case "bars":
      return /* @__PURE__ */ jsx(BarsLoader, { size, className });
    case "terminal":
      return /* @__PURE__ */ jsx(TerminalLoader, { size, className });
    case "text-blink":
      return /* @__PURE__ */ jsx(TextBlinkLoader, { text, size, className });
    case "text-shimmer":
      return /* @__PURE__ */ jsx(TextShimmerLoader, { text, size, className });
    case "loading-dots":
      return /* @__PURE__ */ jsx(TextDotsLoader, { text, size, className });
    default:
      return /* @__PURE__ */ jsx(CircularLoader, { size, className });
  }
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Tooltip$1.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Portal, { children: /* @__PURE__ */ jsxs(
    Tooltip$1.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(Tooltip$1.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })
      ]
    }
  ) });
}
const PromptInputContext = createContext({
  isLoading: false,
  value: "",
  setValue: () => {
  },
  maxHeight: 240,
  onSubmit: void 0,
  disabled: false,
  textareaRef: React.createRef()
});
function usePromptInput() {
  return useContext(PromptInputContext);
}
function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
  disabled = false,
  onClick,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value || "");
  const textareaRef = useRef(null);
  const handleChange = (newValue) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };
  const handleClick = (e) => {
    if (!disabled) textareaRef.current?.focus();
    onClick?.(e);
  };
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(
    PromptInputContext.Provider,
    {
      value: {
        isLoading,
        value: value ?? internalValue,
        setValue: onValueChange ?? handleChange,
        maxHeight,
        onSubmit,
        disabled,
        textareaRef
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          onClick: handleClick,
          className: cn(
            "border-input bg-background cursor-text rounded-3xl border p-2 shadow-xs",
            disabled && "cursor-not-allowed opacity-60",
            className
          ),
          ...props,
          children
        }
      )
    }
  ) });
}
function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}) {
  const { value, setValue, maxHeight, onSubmit, disabled, textareaRef } = usePromptInput();
  const adjustHeight = (el) => {
    if (!el || disableAutosize) return;
    el.style.height = "auto";
    if (typeof maxHeight === "number") {
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    } else {
      el.style.height = `min(${el.scrollHeight}px, ${maxHeight})`;
    }
  };
  const handleRef = (el) => {
    textareaRef.current = el;
    adjustHeight(el);
  };
  useLayoutEffect(() => {
    if (!textareaRef.current || disableAutosize) return;
    const el = textareaRef.current;
    el.style.height = "auto";
    if (typeof maxHeight === "number") {
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    } else {
      el.style.height = `min(${el.scrollHeight}px, ${maxHeight})`;
    }
  }, [value, maxHeight, disableAutosize]);
  const handleChange = (e) => {
    adjustHeight(e.target);
    setValue(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };
  return /* @__PURE__ */ jsx(
    Textarea,
    {
      ref: handleRef,
      value,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      className: cn(
        "text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      ),
      rows: 1,
      disabled,
      ...props
    }
  );
}
function PromptInputActions({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex items-center gap-2", className), ...props, children });
}
function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}) {
  const { disabled } = usePromptInput();
  return /* @__PURE__ */ jsxs(Tooltip, { ...props, children: [
    /* @__PURE__ */ jsx(
      TooltipTrigger,
      {
        asChild: true,
        disabled,
        onClick: (event) => event.stopPropagation(),
        children
      }
    ),
    /* @__PURE__ */ jsx(TooltipContent, { side, className, children: tooltip })
  ] });
}
function PromptSuggestion({
  children,
  variant,
  size,
  className,
  highlight,
  ...props
}) {
  const isHighlightMode = highlight !== void 0 && highlight.trim() !== "";
  const content = typeof children === "string" ? children : "";
  if (!isHighlightMode) {
    return /* @__PURE__ */ jsx(
      Button,
      {
        variant: variant || "outline",
        size: size || "lg",
        className: cn("rounded-full", className),
        ...props,
        children
      }
    );
  }
  if (!content) {
    return /* @__PURE__ */ jsx(
      Button,
      {
        variant: variant || "ghost",
        size: size || "sm",
        className: cn(
          "w-full cursor-pointer justify-start rounded-xl py-2",
          "hover:bg-accent",
          className
        ),
        ...props,
        children
      }
    );
  }
  const trimmedHighlight = highlight.trim();
  const contentLower = content.toLowerCase();
  const highlightLower = trimmedHighlight.toLowerCase();
  const shouldHighlight = contentLower.includes(highlightLower);
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: variant || "ghost",
      size: size || "sm",
      className: cn(
        "w-full cursor-pointer justify-start gap-0 rounded-xl py-2",
        "hover:bg-accent",
        className
      ),
      ...props,
      children: shouldHighlight ? (() => {
        const index = contentLower.indexOf(highlightLower);
        if (index === -1)
          return /* @__PURE__ */ jsx("span", { className: "text-muted-foreground whitespace-pre-wrap", children: content });
        const actualHighlightedText = content.substring(
          index,
          index + highlightLower.length
        );
        const before = content.substring(0, index);
        const after = content.substring(index + actualHighlightedText.length);
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          before && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground whitespace-pre-wrap", children: before }),
          /* @__PURE__ */ jsx("span", { className: "text-primary font-medium whitespace-pre-wrap", children: actualHighlightedText }),
          after && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground whitespace-pre-wrap", children: after })
        ] });
      })() : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground whitespace-pre-wrap", children: content })
    }
  );
}
function AdminChatIndex({ agents, conversations, selectedConversation, messages: initialMessages }) {
  const firstAgentKey = Object.keys(agents)[0] ?? "ads";
  const [activeAgentKey, setActiveAgentKey] = useState(initialMessages[0]?.agent ?? firstAgentKey);
  const [activeConversation, setActiveConversation] = useState(selectedConversation);
  const [conversationList, setConversationList] = useState(conversations);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const activeAgent = agents[activeAgentKey] ?? agents[firstAgentKey];
  useEffect(() => {
    setActiveConversation(selectedConversation);
    setConversationList(conversations);
    setMessages(initialMessages);
    setActiveAgentKey(initialMessages[0]?.agent ?? firstAgentKey);
  }, [conversations, firstAgentKey, initialMessages, selectedConversation]);
  const startNewConversation = () => {
    setActiveConversation(null);
    setMessages([]);
    setInput("");
    setError(null);
    window.history.pushState({}, "", "/admin/chat");
  };
  const sendMessage = async () => {
    const content = input.trim();
    if (!content || isSending) {
      return;
    }
    const userMessage = {
      id: crypto.randomUUID(),
      agent: activeAgentKey,
      role: "user",
      content
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setIsSending(true);
    try {
      const response = await axios.post("/admin/chat/messages", {
        agent: activeAgentKey,
        conversation_id: activeConversation?.id,
        message: content
      });
      const conversation = response.data.conversation;
      const assistantMessage = response.data.message;
      setActiveConversation(conversation);
      setConversationList((current) => [conversation, ...current.filter((item) => item.id !== conversation.id)]);
      setMessages((current) => [...current, assistantMessage]);
      if (!activeConversation) {
        window.history.replaceState({}, "", `/admin/chat?conversation=${conversation.id}`);
      }
    } catch {
      setError("No pude completar la respuesta. Revisa la configuracion del proveedor de AI e intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Chat" }),
    /* @__PURE__ */ jsxs("div", { className: "grid min-h-screen bg-[#FBF9F7] font-[Outfit] text-[#1A1A1A] lg:grid-cols-[340px_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsxs("aside", { className: "flex max-h-[48svh] min-h-0 flex-col border-b border-[#E5E5E5] bg-[#F5F3F0] lg:max-h-none lg:min-h-screen lg:border-b-0 lg:border-r", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-[#E5E5E5] px-5 py-5", children: [
          /* @__PURE__ */ jsxs(Link, { href: "/admin/dashboard", className: "inline-flex items-center gap-2 text-xs font-medium text-[#666666] hover:text-[#1A1A1A]", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
            "Volver al admin"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#4A5D4A] text-white", children: /* @__PURE__ */ jsx(Bot, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#1A1A1A]", children: "Ikonoverde AI" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5 text-[#666666]", children: "Conversaciones internas persistentes para diagnostico y trabajo administrativo." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { type: "button", className: "mt-5 w-full rounded-full bg-[#4A5D4A] text-white", onClick: startNewConversation, children: [
            /* @__PURE__ */ jsx(MessageSquarePlus, { className: "h-4 w-4" }),
            "Nueva conversacion"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto px-4 py-5", children: [
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between px-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium tracking-[0.14em] text-[#999999]", children: "CONVERSACIONES" }),
              /* @__PURE__ */ jsx(MessagesSquare, { className: "h-4 w-4 text-[#999999]" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: conversationList.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[#E5E5E5] bg-[#FBF9F7] px-4 py-4 text-sm leading-6 text-[#666666]", children: "Todavia no hay conversaciones. Escribe un mensaje para guardar la primera." }) : conversationList.map((conversation) => /* @__PURE__ */ jsxs(
              Link,
              {
                href: `/admin/chat?conversation=${conversation.id}`,
                className: `rounded-2xl px-4 py-3 transition-colors ${activeConversation?.id === conversation.id ? "bg-white text-[#1A1A1A]" : "text-[#666666] hover:bg-white/60"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "block truncate text-sm font-medium", children: conversation.title }),
                  /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-[#999999]", children: formatDate(conversation.updated_at) })
                ]
              },
              conversation.id
            )) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "mt-7", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between px-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium tracking-[0.14em] text-[#999999]", children: "AGENTES" }),
              /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-[#999999]" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: Object.entries(agents).map(([key, agent]) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: `rounded-2xl border px-4 py-3 text-left transition-colors ${activeAgentKey === key ? "border-[#D9D6D0] bg-white" : "border-transparent bg-transparent hover:border-[#E5E5E5] hover:bg-white/60"}`,
                onClick: () => setActiveAgentKey(key),
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-[#1A1A1A]", children: agent.name }),
                    /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#FBF9F7] px-2 py-1 text-[11px] text-[#4A5D4A]", children: agent.status })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "mt-2 block text-xs leading-5 text-[#666666]", children: agent.description })
                ]
              },
              key
            )) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "flex min-h-0 flex-col", children: [
        /* @__PURE__ */ jsx("header", { className: "border-b border-[#E5E5E5] bg-[#FBF9F7] px-6 py-5 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9D6D0] bg-white px-3 py-1 text-xs font-medium text-[#4A5D4A]", children: [
              /* @__PURE__ */ jsx(LineChart, { className: "h-3.5 w-3.5" }),
              activeAgent.status
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight text-[#1A1A1A]", children: activeAgent.name }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm leading-6 text-[#666666]", children: activeAgent.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm leading-6 text-[#666666] xl:w-[360px]", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-[#1A1A1A]", children: "Conversacion:" }),
            " ",
            activeConversation ? activeConversation.title : "Nueva conversacion sin guardar"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("section", { className: "flex min-h-0 flex-1 flex-col bg-[#FBF9F7]", children: [
          /* @__PURE__ */ jsx(ChatContainerRoot, { className: "min-h-0 flex-1 px-5 py-7 lg:px-8", children: /* @__PURE__ */ jsxs(ChatContainerContent, { className: "mx-auto w-full max-w-3xl gap-6", children: [
            messages.length === 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-[#E5E5E5] bg-white p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4A5D4A] text-white", children: /* @__PURE__ */ jsx(Brain, { className: "h-5 w-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h2", { className: "text-base font-semibold text-[#1A1A1A]", children: [
                    activeAgent.name,
                    " listo"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-6 text-[#666666]", children: activeAgent.welcome })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: activeAgent.suggestions.map((suggestion) => /* @__PURE__ */ jsx(
                PromptSuggestion,
                {
                  size: "sm",
                  className: "rounded-full border-[#D9D6D0] bg-[#FBF9F7] text-[#4A5D4A] hover:bg-white",
                  onClick: () => setInput(suggestion),
                  children: suggestion
                },
                suggestion
              )) })
            ] }),
            messages.map((message) => /* @__PURE__ */ jsxs("div", { className: `flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`, children: [
              message.role === "assistant" && /* @__PURE__ */ jsx(AssistantAvatar, { label: agents[message.agent]?.name ?? "AI" }),
              /* @__PURE__ */ jsx("div", { className: message.role === "user" ? "max-w-[82%] rounded-2xl bg-[#4A5D4A] px-4 py-3 text-sm leading-6 text-white prose-p:m-0" : "max-w-[82%] rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm leading-6 text-[#1A1A1A] prose-p:m-0", children: message.role === "assistant" ? /* @__PURE__ */ jsx(ChatMarkdown, { children: message.content }) : message.content })
            ] }, message.id)),
            isSending && /* @__PURE__ */ jsxs("div", { className: "flex justify-start gap-3", children: [
              /* @__PURE__ */ jsx(AssistantAvatar, { label: activeAgent.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#666666]", children: [
                /* @__PURE__ */ jsx(Loader, { variant: "typing", size: "sm" }),
                "Pensando"
              ] })
            ] }),
            error && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }),
            /* @__PURE__ */ jsx(ChatContainerScrollAnchor, {})
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-[#E5E5E5] bg-[#FBF9F7] px-5 py-5 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
            /* @__PURE__ */ jsxs(
              PromptInput,
              {
                value: input,
                onValueChange: setInput,
                onSubmit: sendMessage,
                isLoading: isSending,
                className: "rounded-3xl border-[#D9D6D0] bg-white p-3 shadow-none",
                children: [
                  /* @__PURE__ */ jsx(
                    PromptInputTextarea,
                    {
                      placeholder: `Escribe para ${activeAgent.name}...`,
                      className: "min-h-12 text-sm text-[#1A1A1A] placeholder:text-[#999999]"
                    }
                  ),
                  /* @__PURE__ */ jsxs(PromptInputActions, { className: "justify-between border-t border-[#EDEAE5] pt-3", children: [
                    /* @__PURE__ */ jsx(PromptInputAction, { tooltip: "Adjuntar archivos estara disponible despues", children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", disabled: true, className: "rounded-full text-[#666666]", children: /* @__PURE__ */ jsx(Paperclip, { className: "h-4 w-4" }) }) }),
                    /* @__PURE__ */ jsxs(
                      Button,
                      {
                        type: "button",
                        disabled: isSending || input.trim() === "",
                        className: "rounded-full bg-[#4A5D4A] px-4 text-white",
                        onClick: sendMessage,
                        children: [
                          isSending ? "Enviando" : "Enviar",
                          /* @__PURE__ */ jsx(ArrowUp, { className: "h-4 w-4" })
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-xs text-[#999999]", children: "Las conversaciones se guardan para tu usuario. Verifica cualquier accion operativa antes de aplicarla." })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
function AssistantAvatar({ label }) {
  return /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D9D6D0] bg-white text-[10px] font-semibold text-[#4A5D4A]", children: label.slice(0, 2).toUpperCase() });
}
function ChatMarkdown({ children }) {
  return /* @__PURE__ */ jsx(Markdown, { remarkPlugins: [remarkGfm], components: MARKDOWN_COMPONENTS, children });
}
function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
const MARKDOWN_COMPONENTS = {
  p: ({ children }) => /* @__PURE__ */ jsx("p", { className: "mb-3 last:mb-0", children }),
  ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "mb-3 flex flex-col gap-1.5 pl-0 last:mb-0", children }),
  ol: ({ children }) => /* @__PURE__ */ jsx("ol", { className: "mb-3 flex list-decimal flex-col gap-1.5 pl-5 last:mb-0", children }),
  li: ({ children }) => /* @__PURE__ */ jsx("li", { className: "relative list-none pl-5 before:absolute before:left-0 before:top-[0.72em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#4A5D4A]", children }),
  a: ({ children, href, ...rest }) => /* @__PURE__ */ jsx(
    "a",
    {
      ...rest,
      href,
      className: "font-medium text-[#4A5D4A] underline decoration-[#D9D6D0] underline-offset-4 hover:decoration-[#4A5D4A]",
      target: href?.startsWith("http") ? "_blank" : void 0,
      rel: href?.startsWith("http") ? "noopener noreferrer" : void 0,
      children
    }
  ),
  code: ({ children }) => /* @__PURE__ */ jsx("code", { className: "rounded-md bg-[#F5F3F0] px-1.5 py-0.5 font-mono text-[0.86em] text-[#4A5D4A]", children }),
  pre: ({ children }) => /* @__PURE__ */ jsx("pre", { className: "mb-3 overflow-x-auto rounded-xl bg-[#F5F3F0] p-3 text-xs leading-5 text-[#1A1A1A] last:mb-0", children }),
  strong: ({ children }) => /* @__PURE__ */ jsx("strong", { className: "font-semibold text-[#1A1A1A]", children }),
  blockquote: ({ children }) => /* @__PURE__ */ jsx("blockquote", { className: "mb-3 rounded-xl border border-[#D9D6D0] bg-[#FBF9F7] px-3 py-2 text-[#666666] last:mb-0", children })
};
export {
  AdminChatIndex as default
};
