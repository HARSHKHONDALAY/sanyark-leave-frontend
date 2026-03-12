import { getStatusBadgeClass } from "../utils/formatters";

export default function StatusBadge({ status }) {
  return <span className={getStatusBadgeClass(status)}>{status || "PENDING"}</span>;
}