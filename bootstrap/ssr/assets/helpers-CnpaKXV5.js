import { a as statusColors } from "./order-BWzUrFgY.js";
const paymentStatusLabels = {
  pending: "Pendiente",
  completed: "Completado",
  failed: "Fallido",
  refunded: "Reembolsado"
};
const getStatusColor = (status) => {
  return statusColors[status] || "bg-gray-100 text-gray-800";
};
const getPaymentStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
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
