export default function StatCard({ label, value, description }) {
  return (
    <div className="slm-card-sm slm-stat-card">
      <span className="slm-stat-label">{label}</span>
      <div className="slm-stat-value">{value}</div>
      <p className="slm-muted">{description}</p>
    </div>
  );
}