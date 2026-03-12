export function formatLeaveType(type) {
  switch (String(type || "").toUpperCase()) {
    case "CASUAL":
      return "Casual Leave";
    case "SICK":
      return "Sick Leave";
    case "PAID":
      return "Paid Leave";
    case "MATERNITY":
      return "Maternity Leave";
    default:
      return type || "-";
  }
}

export function normalizeApiData(response) {
  return response?.data ?? response ?? {};
}

export function getStatusBadgeClass(status) {
  switch (String(status || "").toUpperCase()) {
    case "APPROVED":
      return "slm-badge slm-badge-approved";
    case "REJECTED":
      return "slm-badge slm-badge-rejected";
    case "CANCELLED":
      return "slm-badge slm-badge-cancelled";
    default:
      return "slm-badge slm-badge-pending";
  }
}

export function getCalendarEventClass(status) {
  switch (String(status || "").toUpperCase()) {
    case "APPROVED":
      return "slm-calendar-pill-approved";
    case "REJECTED":
      return "slm-calendar-pill-rejected";
    case "CANCELLED":
      return "slm-calendar-pill-cancelled";
    default:
      return "slm-calendar-pill-pending";
  }
}