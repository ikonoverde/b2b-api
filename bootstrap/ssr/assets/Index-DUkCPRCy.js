import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { n as cn, T as TooltipProvider, o as Tooltip, p as TooltipTrigger, q as TooltipContent, B as Button, k as SidebarProvider, S as Sidebar, a as SidebarHeader, b as SidebarContent, c as SidebarGroup, d as SidebarGroupLabel, f as SidebarMenu, h as SidebarMenuButton, l as SidebarInset, m as SidebarTrigger } from "./sidebar-DK9OU6Q6.js";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { DropdownMenu as DropdownMenu$1 } from "radix-ui";
import Markdown$1 from "react-markdown";
import remarkGfm from "remark-gfm";
import React__default, { useState, useRef, useLayoutEffect, createContext, useContext, useEffect } from "react";
import { ChevronDown, Bot, ArrowLeft, MessageSquarePlus, Sparkles, Copy, Plus, Paperclip, Mic, ArrowUp } from "lucide-react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
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
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenu$1.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenu$1.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenu$1.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenu$1.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenu$1.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
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
const DEFAULT_COMPONENTS = {
  a: ({ href, children, ...props }) => /* @__PURE__ */ jsx(
    "a",
    {
      ...props,
      href,
      target: href?.startsWith("http") ? "_blank" : void 0,
      rel: href?.startsWith("http") ? "noopener noreferrer" : void 0,
      children
    }
  )
};
function Markdown({ children, className, components, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(className), ...props, children: /* @__PURE__ */ jsx(Markdown$1, { remarkPlugins: [remarkGfm], components: { ...DEFAULT_COMPONENTS, ...components }, children }) });
}
const Message = ({ children, className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex gap-3", className), ...props, children });
const MessageContent = ({ children, markdown = false, className, ...props }) => {
  const classNames = cn(
    "rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal",
    className
  );
  return markdown ? /* @__PURE__ */ jsx(Markdown, { className: classNames, ...props, children }) : /* @__PURE__ */ jsx("div", { className: classNames, ...props, children });
};
const MessageActions = ({ children, className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("text-muted-foreground flex items-center gap-2", className), ...props, children });
const MessageAction = ({ tooltip, children, className, side = "top", ...props }) => {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { ...props, children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children }),
    /* @__PURE__ */ jsx(TooltipContent, { side, className, children: tooltip })
  ] }) });
};
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
const PromptInputContext = createContext({
  isLoading: false,
  value: "",
  setValue: () => {
  },
  maxHeight: 240,
  onSubmit: void 0,
  disabled: false,
  textareaRef: React__default.createRef()
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
function ScrollButton({ className, variant = "outline", size = "sm", ...props }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant,
      size,
      className: cn(
        "h-10 w-10 rounded-full transition-all duration-150 ease-out",
        !isAtBottom ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0",
        className
      ),
      onClick: () => scrollToBottom(),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5" })
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
  const copyMessage = (content) => {
    navigator.clipboard?.writeText(content).catch(() => void 0);
  };
  const conversationGroups = groupConversations(conversationList);
  const headerTitle = activeConversation?.title ?? `${activeAgent.name} · Nueva conversacion`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Chat" }),
    /* @__PURE__ */ jsxs(SidebarProvider, { children: [
      /* @__PURE__ */ jsxs(Sidebar, { children: [
        /* @__PURE__ */ jsxs(SidebarHeader, { className: "gap-4 px-2 py-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2 px-2", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md", children: /* @__PURE__ */ jsx(Bot, { className: "size-4" }) }),
            /* @__PURE__ */ jsx("div", { className: "text-md text-foreground font-medium tracking-tight", children: "Ikonoverde AI" })
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/admin",
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 px-2 text-xs font-medium",
              children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }),
                "Volver al admin"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(SidebarContent, { className: "pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "mb-2 flex w-full items-center gap-2", onClick: startNewConversation, children: [
            /* @__PURE__ */ jsx(MessageSquarePlus, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { children: "Nueva conversacion" })
          ] }) }),
          conversationGroups.length === 0 ? /* @__PURE__ */ jsxs(SidebarGroup, { children: [
            /* @__PURE__ */ jsx(SidebarGroupLabel, { children: "Conversaciones" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground px-2 text-xs leading-5", children: "Todavia no hay conversaciones. Escribe un mensaje para guardar la primera." })
          ] }) : conversationGroups.map((group) => /* @__PURE__ */ jsxs(SidebarGroup, { children: [
            /* @__PURE__ */ jsx(SidebarGroupLabel, { children: group.period }),
            /* @__PURE__ */ jsx(SidebarMenu, { children: group.conversations.map((conversation) => /* @__PURE__ */ jsx(
              SidebarMenuButton,
              {
                isActive: activeConversation?.id === conversation.id,
                onClick: () => router.get(`/admin/chat?conversation=${conversation.id}`),
                children: /* @__PURE__ */ jsx("span", { className: "truncate", children: conversation.title })
              },
              conversation.id
            )) })
          ] }, group.period))
        ] })
      ] }),
      /* @__PURE__ */ jsx(SidebarInset, { children: /* @__PURE__ */ jsxs("main", { className: "flex h-svh flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxs("header", { className: "bg-background z-10 flex h-16 w-full shrink-0 items-center gap-2 border-b px-4", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1" }),
          /* @__PURE__ */ jsx("div", { className: "text-foreground truncate", children: headerTitle })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxs(ChatContainerRoot, { className: "h-full", children: [
          /* @__PURE__ */ jsxs(ChatContainerContent, { className: "space-y-0 px-5 py-12", children: [
            messages.length === 0 && /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-3xl px-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-3xl border p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl", children: /* @__PURE__ */ jsx(Sparkles, { className: "size-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h2", { className: "text-foreground text-base font-semibold", children: [
                    activeAgent.name,
                    " listo"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 text-sm leading-6", children: activeAgent.welcome })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: activeAgent.suggestions.map((suggestion) => /* @__PURE__ */ jsx(PromptSuggestion, { size: "sm", onClick: () => setInput(suggestion), children: suggestion }, suggestion)) })
            ] }) }),
            messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const isLastMessage = index === messages.length - 1;
              return /* @__PURE__ */ jsx(
                Message,
                {
                  className: cn(
                    "mx-auto flex w-full max-w-3xl flex-col gap-2 px-6",
                    isAssistant ? "items-start" : "items-end"
                  ),
                  children: isAssistant ? /* @__PURE__ */ jsxs("div", { className: "group flex w-full flex-col gap-0", children: [
                    /* @__PURE__ */ jsx(
                      MessageContent,
                      {
                        className: "text-foreground prose dark:prose-invert flex-1 rounded-lg bg-transparent p-0",
                        markdown: true,
                        children: message.content
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      MessageActions,
                      {
                        className: cn(
                          "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                          isLastMessage && "opacity-100"
                        ),
                        children: /* @__PURE__ */ jsx(MessageAction, { tooltip: "Copiar", children: /* @__PURE__ */ jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "icon",
                            className: "rounded-full",
                            onClick: () => copyMessage(message.content),
                            children: /* @__PURE__ */ jsx(Copy, {})
                          }
                        ) })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "group flex flex-col items-end gap-1", children: [
                    /* @__PURE__ */ jsx(MessageContent, { className: "bg-muted text-foreground max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]", children: message.content }),
                    /* @__PURE__ */ jsx(MessageActions, { className: "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100", children: /* @__PURE__ */ jsx(MessageAction, { tooltip: "Copiar", children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "rounded-full",
                        onClick: () => copyMessage(message.content),
                        children: /* @__PURE__ */ jsx(Copy, {})
                      }
                    ) }) })
                  ] })
                },
                message.id
              );
            }),
            isSending && /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-3xl items-center gap-3 px-6 py-2", children: [
              /* @__PURE__ */ jsx(Loader, { variant: "typing", size: "sm" }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "Pensando" })
            ] }),
            error && /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-3xl px-6", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive dark:border-destructive/50 dark:bg-destructive/40 dark:text-destructive", children: error }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-end px-5", children: /* @__PURE__ */ jsx(ScrollButton, { className: "shadow-sm" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
          /* @__PURE__ */ jsx(
            PromptInput,
            {
              isLoading: isSending,
              value: input,
              onValueChange: setInput,
              onSubmit: sendMessage,
              className: "border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs",
              children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx(
                  PromptInputTextarea,
                  {
                    placeholder: `Escribe para ${activeAgent.name}...`,
                    className: "min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
                  }
                ),
                /* @__PURE__ */ jsxs(PromptInputActions, { className: "mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(PromptInputAction, { tooltip: "Nueva conversacion", children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "icon",
                        className: "size-9 rounded-full",
                        onClick: startNewConversation,
                        children: /* @__PURE__ */ jsx(Plus, { size: 18 })
                      }
                    ) }),
                    /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                        Button,
                        {
                          variant: "ghost",
                          className: "h-9 gap-1.5 rounded-full px-3 text-sm font-medium",
                          children: [
                            /* @__PURE__ */ jsx(Sparkles, { className: "size-4" }),
                            /* @__PURE__ */ jsx("span", { className: "max-w-[10rem] truncate", children: activeAgent.name }),
                            /* @__PURE__ */ jsx(ChevronDown, { className: "text-muted-foreground size-4" })
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsx(DropdownMenuContent, { align: "start", side: "top", className: "w-72", children: Object.entries(agents).map(([key, agent]) => /* @__PURE__ */ jsxs(
                        DropdownMenuItem,
                        {
                          onSelect: () => setActiveAgentKey(key),
                          className: "flex-col items-start gap-0.5 py-2",
                          children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-2", children: [
                              /* @__PURE__ */ jsx("span", { className: "font-medium", children: agent.name }),
                              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground ml-auto text-[10px] tracking-wide uppercase", children: agent.status })
                            ] }),
                            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs leading-5", children: agent.description })
                          ]
                        },
                        key
                      )) })
                    ] }),
                    /* @__PURE__ */ jsx(PromptInputAction, { tooltip: "Adjuntar archivos estara disponible despues", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", disabled: true, className: "size-9 rounded-full", children: /* @__PURE__ */ jsx(Paperclip, { size: 18 }) }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(PromptInputAction, { tooltip: "Dictado estara disponible despues", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", disabled: true, className: "size-9 rounded-full", children: /* @__PURE__ */ jsx(Mic, { size: 18 }) }) }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        size: "icon",
                        disabled: !input.trim() || isSending,
                        onClick: sendMessage,
                        className: "size-9 rounded-full",
                        children: !isSending ? /* @__PURE__ */ jsx(ArrowUp, { size: 18 }) : /* @__PURE__ */ jsx("span", { className: "size-3 rounded-xs bg-card" })
                      }
                    )
                  ] })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-3 text-center text-xs", children: "Las conversaciones se guardan para tu usuario. Verifica cualquier accion operativa antes de aplicarla." })
        ] }) })
      ] }) })
    ] })
  ] });
}
function groupConversations(conversations) {
  const now = /* @__PURE__ */ new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = 864e5;
  const startOfYesterday = startOfToday - day;
  const sevenDaysAgo = startOfToday - 7 * day;
  const thirtyDaysAgo = startOfToday - 30 * day;
  const groups = [
    { period: "Hoy", conversations: [] },
    { period: "Ayer", conversations: [] },
    { period: "Ultimos 7 dias", conversations: [] },
    { period: "Ultimos 30 dias", conversations: [] },
    { period: "Anteriores", conversations: [] }
  ];
  for (const conversation of conversations) {
    const timestamp = conversation.updated_at ? new Date(conversation.updated_at).getTime() : 0;
    if (timestamp >= startOfToday) {
      groups[0].conversations.push(conversation);
    } else if (timestamp >= startOfYesterday) {
      groups[1].conversations.push(conversation);
    } else if (timestamp >= sevenDaysAgo) {
      groups[2].conversations.push(conversation);
    } else if (timestamp >= thirtyDaysAgo) {
      groups[3].conversations.push(conversation);
    } else {
      groups[4].conversations.push(conversation);
    }
  }
  return groups.filter((group) => group.conversations.length > 0);
}
export {
  AdminChatIndex as default
};
