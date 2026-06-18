function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
}
export {
  formatCurrency as f
};
