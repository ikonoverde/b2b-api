import { jsxs, jsx } from "react/jsx-runtime";
import { D as DocumentSheet, S as Section, P, L as List, I as Item, a as Strong, b as DocLink, C as ContactList } from "./DocumentSheet-Brg6S_QH.js";
import "@inertiajs/react";
import "./PublicShell-nawmX4QX.js";
import "./SiteFooter-BfzQHT4y.js";
import "./date-CuQtAuCG.js";
const UPDATED_AT = "2026-06-07T04:25:07.000Z";
function Faq(contact) {
  return /* @__PURE__ */ jsxs(
    DocumentSheet,
    {
      title: "Preguntas Frecuentes",
      eyebrow: "Preguntas frecuentes",
      updatedAt: UPDATED_AT,
      related: [
        { href: "/terms", label: "Términos y condiciones" },
        { href: "/privacy", label: "Política de privacidad" }
      ],
      children: [
        /* @__PURE__ */ jsx(Section, { title: "¿Cómo puedo registrarme?", children: /* @__PURE__ */ jsx(P, { children: 'Para registrarte en Ikonoverde Profesional, haz clic en el botón "Registrarse" en la página principal. Completa el formulario con tus datos personales y de empresa. Una vez enviado, nuestro equipo revisará tu solicitud y activará tu cuenta.' }) }),
        /* @__PURE__ */ jsxs(Section, { title: "¿Cuáles son los métodos de pago aceptados?", children: [
          /* @__PURE__ */ jsx(P, { children: "Aceptamos los siguientes métodos de pago:" }),
          /* @__PURE__ */ jsxs(List, { children: [
            /* @__PURE__ */ jsx(Item, { children: "Tarjetas de crédito y débito (Visa, Mastercard, AMEX)" }),
            /* @__PURE__ */ jsx(Item, { children: "Transferencia bancaria" }),
            /* @__PURE__ */ jsx(Item, { children: "Depósito en efectivo" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "¿Cuánto tiempo tarda en llegar mi pedido?", children: [
          /* @__PURE__ */ jsx(P, { children: "Los tiempos de entrega varían según tu ubicación:" }),
          /* @__PURE__ */ jsxs(List, { children: [
            /* @__PURE__ */ jsxs(Item, { children: [
              /* @__PURE__ */ jsx(Strong, { children: "Zona Metropolitana" }),
              ": 1-3 días hábiles"
            ] }),
            /* @__PURE__ */ jsxs(Item, { children: [
              /* @__PURE__ */ jsx(Strong, { children: "Interior de la República" }),
              ": 3-7 días hábiles"
            ] }),
            /* @__PURE__ */ jsxs(Item, { children: [
              /* @__PURE__ */ jsx(Strong, { children: "Zonas remotas" }),
              ": 7-14 días hábiles"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Section, { title: "¿Puedo hacer devoluciones?", children: /* @__PURE__ */ jsxs(P, { children: [
          "Sí, aceptamos devoluciones dentro de los 30 días posteriores a la entrega. El producto debe estar en su empaque original y sin usar. Consulta nuestra sección de ",
          /* @__PURE__ */ jsx(DocLink, { href: "/terms", children: "Términos y Condiciones" }),
          " para más detalles."
        ] }) }),
        /* @__PURE__ */ jsx(Section, { title: "¿Hay un monto mínimo de compra?", children: /* @__PURE__ */ jsx(P, { children: "No hay un monto mínimo de compra. Puedes comprar desde una unidad." }) }),
        /* @__PURE__ */ jsxs(Section, { title: "¿Cómo puedo contactar al soporte?", children: [
          /* @__PURE__ */ jsx(P, { children: "Puedes contactarnos a través de:" }),
          /* @__PURE__ */ jsx(
            ContactList,
            {
              ...contact,
              contactAddress: null,
              extra: /* @__PURE__ */ jsx(Item, { children: "Chat en vivo disponible en horario laboral" })
            }
          )
        ] })
      ]
    }
  );
}
export {
  Faq as default
};
