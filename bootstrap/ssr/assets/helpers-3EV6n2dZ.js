const agentLabels = {
  content: "Contenido",
  keywords: "SEO",
  "paid-acquisition": "Pauta",
  "social-media": "Redes",
  generic: "Agente genérico",
  human: "Persona"
};
const agentDescriptions = {
  content: "Blog, plan editorial, copy de tienda.",
  keywords: "Investigación de búsqueda y clusters de contenido.",
  "paid-acquisition": "Pauta, creativos, propuestas de campaña.",
  "social-media": "Facebook e Instagram orgánicos, comunidad.",
  generic: "Un agente puede hacerlo, pero ninguno de los especialistas es el indicado.",
  human: "Ningún agente puede hacerlo. Requiere una persona: una foto real, una credencial, una firma."
};
const agentChipClasses = {
  content: "border-muted bg-muted text-primary",
  keywords: "border-muted bg-muted text-primary",
  "paid-acquisition": "border-muted bg-muted text-primary",
  "social-media": "border-muted bg-muted text-primary",
  generic: "border-border bg-muted text-muted-foreground",
  // A person has to pick this one up. It should not look like the ones that run themselves.
  human: "border-border bg-muted text-muted-foreground"
};
const statusLabels = {
  open: "Abierta",
  done: "Hecha",
  dropped: "Descartada"
};
const statusPillClasses = {
  open: "border-border bg-card text-muted-foreground",
  done: "border-muted bg-primary text-white",
  dropped: "border-border bg-muted text-muted-foreground"
};
const closedByLabels = {
  report: "Cerrada por el reporte",
  human: "Cerrada por una persona"
};
const closedByDescriptions = {
  report: "Un reporte observó que el trabajo se hizo, y la evidencia quedó registrada.",
  human: "Alguien confirmó que el trabajo se hizo. No hay una medición detrás."
};
const boardColumnLabels = {
  todo: "Por hacer",
  in_progress: "En curso",
  review: "En revisión",
  done: "Hechas"
};
const boardColumnDescriptions = {
  todo: "Trabajo abierto que nadie ha tomado.",
  in_progress: "Trabajo abierto que alguien ya tomó.",
  review: "Alguien cree que ya está hecha. Sigue abierta hasta que una persona confirme el cierre.",
  done: "Cerradas. Soltar una tarjeta aquí la cierra a tu nombre."
};
const paidGateLabels = {
  open: "Pauta permitida",
  closed: "Sin pauta"
};
function formatDate(value) {
  if (value === null) {
    return "Sin fecha";
  }
  return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
export {
  boardColumnLabels as a,
  boardColumnDescriptions as b,
  closedByLabels as c,
  agentLabels as d,
  agentChipClasses as e,
  agentDescriptions as f,
  formatDate as g,
  statusPillClasses as h,
  closedByDescriptions as i,
  paidGateLabels as p,
  statusLabels as s
};
