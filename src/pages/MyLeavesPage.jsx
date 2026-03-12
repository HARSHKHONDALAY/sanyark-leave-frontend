import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Alert from "../components/Alert";
import StatusBadge from "../components/StatusBadge";
import { getMyLeaves, cancelLeave } from "../api/api";
import { formatLeaveType } from "../utils/formatters";

export default function MyLeavesPage() {

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaves();
  }, []);

  async function loadLeaves() {
    try {

      const res = await getMyLeaves();

      const data = res?.data ?? res ?? [];

      setLeaves(data);

    } catch (err) {

      setError(err.message || "Failed to load leave requests.");

    } finally {

      setLoading(false);

    }
  }

  async function handleCancel(leaveId) {

    if (!window.confirm("Cancel this leave request?")) return;

    try {

      await cancelLeave(leaveId);

      loadLeaves();

    } catch (err) {

      alert(err.message || "Failed to cancel leave.");

    }

  }

  return (
    <PageShell>

      <div className="slm-card">

        <div className="slm-page-topbar">

          <button
            className="slm-button slm-button-secondary slm-back-button"
            onClick={() => navigate("/employee-dashboard")}
          >
            ← Back to Dashboard
          </button>

        </div>

        <div className="slm-hero-copy">

          <span className="slm-kicker">LEAVE HISTORY</span>

          <h2 className="slm-title">My Leave Requests</h2>

          <p className="slm-subtitle">
            Track the status of your submitted leave requests.
          </p>

        </div>

        {error && <Alert type="error">{error}</Alert>}

        {loading ? (
          <p className="slm-muted">Loading leave requests...</p>
        ) : leaves.length === 0 ? (
          <div className="slm-empty">
            No leave requests submitted yet.
          </div>
        ) : (

          <div className="slm-table-wrap">

            <table className="slm-table">

              <thead>

                <tr>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {leaves.map((leave) => (

                  <tr key={leave.id}>

                    <td>
                      {formatLeaveType(leave.leaveType)}
                    </td>

                    <td>
                      {leave.startDate} → {leave.endDate}
                    </td>

                    <td>
                      {leave.reason}
                    </td>

                    <td>
                      <StatusBadge status={leave.status} />
                    </td>

                    <td>

                      {leave.status === "PENDING" && (

                        <button
                          className="slm-button slm-button-danger"
                          onClick={() => handleCancel(leave.id)}
                        >
                          Cancel
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </PageShell>
  );
}