const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
const formatDateShort = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};
const formatDateTimeLong = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
const formatDateMonthYear = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric"
  });
};
export {
  formatDate as a,
  formatDateTimeLong as b,
  formatDateMonthYear as c,
  formatDateShort as f
};
