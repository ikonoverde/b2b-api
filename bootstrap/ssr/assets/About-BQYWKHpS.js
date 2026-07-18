import { jsxs, jsx } from "react/jsx-runtime";
import { D as DocumentSheet, S as Section, P, L as List, I as Item, a as Strong, C as ContactList } from "./DocumentSheet-Brg6S_QH.js";
import "@inertiajs/react";
import "./PublicShell-nawmX4QX.js";
import "./SiteFooter-BfzQHT4y.js";
import "./date-CuQtAuCG.js";
const UPDATED_AT = "2026-07-18T01:02:35.000Z";
function About(contact) {
  return /* @__PURE__ */ jsxs(
    DocumentSheet,
    {
      title: "Acerca de Nosotros",
      eyebrow: "La marca",
      updatedAt: UPDATED_AT,
      related: [
        { href: "/catalog", label: "Catálogo" },
        { href: "/faq", label: "Preguntas frecuentes" }
      ],
      children: [
        /* @__PURE__ */ jsx(Section, { title: "Nuestra Historia", children: /* @__PURE__ */ jsx(P, { children: "Ikonoverde nació con la misión de hacer accesibles productos de cuidado corporal de calidad profesional para cualquier comprador, sin barreras ni cantidades mínimas. Desde nuestros inicios en Yucatán, México, atendemos por igual a spas, hoteles, centros de masaje y a quienes buscan un producto profesional para uso personal." }) }),
        /* @__PURE__ */ jsx(Section, { title: "Nuestra Misión", children: /* @__PURE__ */ jsx(P, { children: "Hacer que comprar productos de alta calidad sea fácil, rápido y transparente: el mismo precio para todos, desde una sola unidad, sin trámites." }) }),
        /* @__PURE__ */ jsx(Section, { title: "Nuestra Visión", children: /* @__PURE__ */ jsx(P, { children: "Ser la tienda en línea de cuidado corporal de referencia en México, reconocida por la calidad de los productos, la claridad de los precios y una experiencia de compra sin fricciones." }) }),
        /* @__PURE__ */ jsx(Section, { title: "¿Por qué Elegirnos?", children: /* @__PURE__ */ jsxs(List, { children: [
          /* @__PURE__ */ jsxs(Item, { children: [
            /* @__PURE__ */ jsx(Strong, { children: "Sin cantidad mínima" }),
            ": Compra desde una unidad"
          ] }),
          /* @__PURE__ */ jsxs(Item, { children: [
            /* @__PURE__ */ jsx(Strong, { children: "Mismo precio para todos" }),
            ": Sin tarifas exclusivas ni gates de acceso"
          ] }),
          /* @__PURE__ */ jsxs(Item, { children: [
            /* @__PURE__ */ jsx(Strong, { children: "Catálogo curado" }),
            ": Productos seleccionados, sin relleno"
          ] }),
          /* @__PURE__ */ jsxs(Item, { children: [
            /* @__PURE__ */ jsx(Strong, { children: "Envío Rápido" }),
            ": Entregas eficientes en todo México"
          ] }),
          /* @__PURE__ */ jsxs(Item, { children: [
            /* @__PURE__ */ jsx(Strong, { children: "Soporte Dedicado" }),
            ": Equipo disponible cuando lo necesitas"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Section, { title: "Contacto", children: /* @__PURE__ */ jsx(ContactList, { ...contact }) })
      ]
    }
  );
}
export {
  About as default
};
