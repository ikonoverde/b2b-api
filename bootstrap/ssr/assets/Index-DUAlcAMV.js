import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BjsYRyw5.js";
import { Search, ExternalLink, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
const statusLabels = {
  pending: "Pendiente",
  contacted: "Contactado",
  approved: "Aprobado",
  rejected: "Rechazado"
};
function buildPageUrl(page, filters) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  return `/admin/sample-requests?${params.toString()}`;
}
function formatDate(value) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function SearchAndFilters({ filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const handleSubmit = (event) => {
    event.preventDefault();
    router.get(
      "/admin/sample-requests",
      { search, status },
      { preserveState: true, preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-3 lg:flex-row lg:items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full lg:max-w-sm", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Buscar negocio, contacto, correo o telefono...",
          value: search,
          onChange: (event) => setSearch(event.target.value),
          className: "h-10 w-full rounded-lg border border-[#E5E5E5] bg-[#FBF9F7] pl-10 pr-4 font-[Outfit] text-sm outline-none transition-colors focus:border-[#4A5D4A]"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        value: status,
        onChange: (event) => setStatus(event.target.value),
        className: "h-10 rounded-lg border border-[#E5E5E5] bg-[#FBF9F7] px-3 font-[Outfit] text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#4A5D4A]",
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Todos los estados" }),
          Object.entries(statusLabels).map(([value, label]) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        className: "h-10 rounded-lg bg-[#4A5D4A] px-5 font-[Outfit] text-sm font-medium text-white transition-colors hover:bg-[#3d4d3d]",
        children: "Filtrar"
      }
    )
  ] });
}
function DetailList({ title, items }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-[11px] font-medium text-[#999999]", children: title }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: items.map((item) => /* @__PURE__ */ jsx(
      "span",
      {
        className: "rounded-full border border-[#E5E5E5] bg-[#FBF9F7] px-2 py-1 font-[Outfit] text-xs text-[#666666]",
        children: item
      },
      item
    )) })
  ] });
}
function SampleRequestRow({ sampleRequest }) {
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5] align-top hover:bg-gray-50", children: [
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm font-medium text-[#1A1A1A]", children: sampleRequest.business_name }),
      /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-xs text-[#666666]", children: [
        sampleRequest.business_type,
        " · ",
        sampleRequest.client_volume
      ] }),
      sampleRequest.social_url && /* @__PURE__ */ jsxs(
        "a",
        {
          href: sampleRequest.social_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-1 font-[Outfit] text-xs text-[#4A5D4A] hover:underline",
          children: [
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" }),
            "Perfil social"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm font-medium text-[#1A1A1A]", children: sampleRequest.contact_name }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `mailto:${sampleRequest.email}`,
          className: "inline-flex items-center gap-1 font-[Outfit] text-xs text-[#666666] hover:text-[#1A1A1A]",
          children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }),
            sampleRequest.email
          ]
        }
      ),
      sampleRequest.phone && /* @__PURE__ */ jsxs(
        "a",
        {
          href: `tel:${sampleRequest.phone}`,
          className: "inline-flex items-center gap-1 font-[Outfit] text-xs text-[#666666] hover:text-[#1A1A1A]",
          children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
            sampleRequest.phone
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex min-w-[260px] flex-col gap-3", children: [
      /* @__PURE__ */ jsx(DetailList, { title: "Productos", items: sampleRequest.products_interested }),
      /* @__PURE__ */ jsx(DetailList, { title: "Busca mejorar", items: sampleRequest.improvement_goals })
    ] }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-[#F5F3F0] px-2.5 py-1 font-[Outfit] text-xs font-medium text-[#666666]", children: statusLabels[sampleRequest.status] || sampleRequest.status }) }),
    /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("span", { className: "font-[Outfit] text-sm text-[#666666]", children: formatDate(sampleRequest.created_at) }),
      sampleRequest.user && /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-xs text-[#999999]", children: [
        "Usuario: ",
        sampleRequest.user.name
      ] })
    ] }) })
  ] });
}
function Pagination({ sampleRequests, filters }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-[#E5E5E5] px-6 py-4", children: [
    /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-sm text-[#666666]", children: [
      "Mostrando ",
      sampleRequests.from,
      " a ",
      sampleRequests.to,
      " de ",
      sampleRequests.total,
      " solicitudes"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildPageUrl(sampleRequests.current_page - 1, filters),
          className: `rounded-lg border border-[#E5E5E5] p-2 ${sampleRequests.current_page === 1 ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:bg-gray-50"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 text-[#666666]" })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "font-[Outfit] text-sm text-[#1A1A1A]", children: [
        sampleRequests.current_page,
        " / ",
        sampleRequests.last_page
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildPageUrl(sampleRequests.current_page + 1, filters),
          className: `rounded-lg border border-[#E5E5E5] p-2 ${sampleRequests.current_page === sampleRequests.last_page ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:bg-gray-50"}`,
          preserveScroll: true,
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-[#666666]" })
        }
      )
    ] })
  ] });
}
function MeridaSampleRequestsIndex() {
  const { sampleRequests, filters } = usePage().props;
  return /* @__PURE__ */ jsx(AppLayout, { title: "Muestras gratis", active: "sample-requests", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-10 pr-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]", children: "Muestras gratis" }),
      /* @__PURE__ */ jsx("p", { className: "font-[Outfit] text-sm text-[#666666]", children: "Negocios que solicitaron muestras gratuitas en Merida." })
    ] }),
    /* @__PURE__ */ jsx(SearchAndFilters, { filters }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-[#E5E5E5] bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[1100px]", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E5E5E5]", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Negocio" }) }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Contacto" }) }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Interes" }) }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Estado" }) }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#666666]", children: "Solicitado" }) })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: sampleRequests.data.map((sampleRequest) => /* @__PURE__ */ jsx(SampleRequestRow, { sampleRequest }, sampleRequest.id)) })
      ] }) }),
      sampleRequests.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-12", children: /* @__PURE__ */ jsx("p", { className: "font-[Outfit] text-sm text-[#666666]", children: "No hay solicitudes de muestras con estos filtros." }) }),
      sampleRequests.last_page > 1 && /* @__PURE__ */ jsx(Pagination, { sampleRequests, filters })
    ] })
  ] }) });
}
export {
  MeridaSampleRequestsIndex as default
};
