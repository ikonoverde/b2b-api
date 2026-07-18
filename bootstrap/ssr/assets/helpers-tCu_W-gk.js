import { a as statusColors } from "./order-BWzUrFgY.js";
const paymentStatusLabels = {
  pending: "Pendiente",
  completed: "Completado",
  failed: "Fallido",
  refunded: "Reembolsado"
};
const getStatusColor = (status) => {
  return statusColors[status] || "bg-muted text-foreground";
};
const getPaymentStatusColor = (status) => {
  const colors = {
    pending: "bg-muted text-muted-foreground",
    completed: "bg-primary/10 text-primary",
    failed: "bg-destructive/10 text-destructive",
    refunded: "bg-accent text-accent-foreground"
  };
  return colors[status] || "bg-muted text-foreground";
};
const allowedTransitions = {
  payment_pending: ["pending", "cancelled"],
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: []
};
export {
  getPaymentStatusColor as a,
  allowedTransitions as b,
  getStatusColor as g,
  paymentStatusLabels as p
};
