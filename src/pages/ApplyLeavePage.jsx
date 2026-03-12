import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Alert from "../components/Alert";
import { createLeave } from "../api/api";

const initialForm = {
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: ""
};

export default function ApplyLeavePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await createLeave(form);
      setSuccess(res?.message || "Leave request submitted successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Failed to create leave request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="900px">
      <div className="slm-card">
        <div className="slm-page-topbar">
          <button
            className="slm-button slm-button-secondary slm-back-button"
            onClick={() => navigate("/employee-dashboard")}
            type="button"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="slm-hero-copy">
          <span className="slm-kicker">LEAVE REQUEST</span>
          <h2 className="slm-title">Submit a Leave Application</h2>
          <p className="slm-subtitle">
            Plan time away with visibility. Submit your leave details clearly so
            managers can maintain smooth team coordination and operational
            readiness.
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="slm-form-group">
            <label className="slm-label" htmlFor="slm_leave_type">
              Leave Type
            </label>
            <select
              className="slm-select"
              id="slm_leave_type"
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              required
            >
              <option value="">Select Leave Type</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="PAID">Paid Leave</option>
              <option value="MATERNITY">Maternity Leave</option>
            </select>
          </div>

          <div className="slm-grid slm-grid-2">
            <div className="slm-form-group">
              <label className="slm-label" htmlFor="slm_start_date">
                Start Date
              </label>
              <input
                className="slm-input"
                id="slm_start_date"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="slm-form-group">
              <label className="slm-label" htmlFor="slm_end_date">
                End Date
              </label>
              <input
                className="slm-input"
                id="slm_end_date"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="slm-form-group">
            <label className="slm-label" htmlFor="slm_reason">
              Reason for Leave
            </label>
            <textarea
              className="slm-textarea"
              id="slm_reason"
              name="reason"
              rows="5"
              placeholder="Provide the reason and any context your manager should know."
              value={form.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="slm-actions">
            <button className="slm-button" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}