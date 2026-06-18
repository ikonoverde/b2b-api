const statusLabels = {
  payment_pending: "Pago Pendiente",
  pending: "Pagado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado"
};
const statusColors = {
  payment_pending: "bg-orange-100 text-orange-800",
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};
export {
  statusColors as a,
  statusLabels as s
};
