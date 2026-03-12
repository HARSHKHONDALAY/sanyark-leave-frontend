export default function Alert({ type = "error", children }) {
  const className =
    type === "success"
      ? "slm-alert slm-alert-success"
      : "slm-alert slm-alert-error";

  return <div className={className}>{children}</div>;
}