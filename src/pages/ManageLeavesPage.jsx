import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Alert from "../components/Alert";
import StatusBadge from "../components/StatusBadge";
import {
  getAllLeaves,
  approveLeave,
  rejectLeave
} from "../api/api";
import { formatLeaveType } from "../utils/formatters";

export default function ManageLeavesPage() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaves();
  }, []);

  useEffect(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      setFilteredLeaves(leaves);
      return;
    }

    const filtered = leaves.filter((leave) => {
      const employeeName = String(
        leave.employeeName || leave.employee?.fullName || ""
      ).toLowerCase();

      const employeeCode = String(
        leave.employeeCode || leave.employee?.employeeCode || ""
      ).toLowerCase();

      const leaveType = String(leave.leaveType || "").toLowerCase();
      const reason = String(leave.reason || "").toLowerCase();
      const status = String(leave.status || "").toLowerCase();

      return (
        employeeName.includes(value) ||
        employeeCode.includes(value) ||
        leaveType.includes(value) ||
        reason.includes(value) ||
        status.includes(value)
      );
    });

    setFilteredLeaves(filtered);
  }, [search, leaves]);

  async function loadLeaves() {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await getAllLeaves();
      const data = res?.data ?? res ?? [];

      const sortedLeaves = Array.isArray(data) ? [...data] : [];

      sortedLeaves.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") {
          return -1;
        }

        if (b.status === "PENDING" && a.status !== "PENDING") {
          return 1;
        }

        return String(b.startDate || "").localeCompare(String(a.startDate || ""));
      });

      setLeaves(sortedLeaves);
      setFilteredLeaves(sortedLeaves);
    } catch (err) {
      setError(err.message || "Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  }

  function handleCommentChange(id, value) {
    setComments((prev) => ({
      ...prev,
      [id]: value
    }));
  }

  async function handleApprove(id) {
    const confirmed = window.confirm("Approve this leave request?");
    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const res = await approveLeave(id, {
        comment: comments[id] || ""
      });

      setSuccess(res?.message || "Leave request approved successfully.");
      await loadLeaves();
    } catch (err) {
      setError(err.message || "Failed to approve leave request.");
    }
  }

  async function handleReject(id) {
    const confirmed = window.confirm("Reject this leave request?");
    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const res = await rejectLeave(id, {
        comment: comments[id] || ""
      });

      setSuccess(res?.message || "Leave request rejected successfully.");
      await loadLeaves();
    } catch (err) {
      setError(err.message || "Failed to reject leave request.");
    }
  }

  return (
    <PageShell>
      <div className="slm-card">
        <div className="slm-page-topbar">
          <button
            className="slm-button slm-button-secondary slm-back-button"
            onClick={() => navigate("/manager-dashboard")}
            type="button"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="slm-hero-copy">
          <span className="slm-kicker">APPROVAL WORKFLOW</span>
          <h2 className="slm-title">Manage Leave Requests</h2>
          <p className="slm-subtitle">
            Review team availability with full context. Prioritize pending
            requests, capture manager comments, and keep internal operations
            predictable and well coordinated.
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        {loading ? (
          <p className="slm-muted">Loading leave requests...</p>
        ) : leaves.length === 0 ? (
          <div className="slm-empty">No leave requests found right now.</div>
        ) : (
          <>
            <div className="slm-filter-bar">
              <input
                className="slm-input"
                type="text"
                placeholder="Search employee name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="slm-grid">
              {filteredLeaves.map((leave) => (
                <div className="slm-card-sm" key={leave.id}>
                  <div className="slm-meta-grid">
                    <div className="slm-meta-item">
                      <strong>Employee</strong>
                      {leave.employeeName || leave.employee?.fullName || "-"}
                    </div>

                    <div className="slm-meta-item">
                      <strong>Employee Code</strong>
                      {leave.employeeCode || leave.employee?.employeeCode || "-"}
                    </div>

                    <div className="slm-meta-item">
                      <strong>Leave Type</strong>
                      {formatLeaveType(leave.leaveType)}
                    </div>

                    <div className="slm-meta-item">
                      <strong>Start Date</strong>
                      {leave.startDate || "-"}
                    </div>

                    <div className="slm-meta-item">
                      <strong>End Date</strong>
                      {leave.endDate || "-"}
                    </div>

                    <div className="slm-meta-item">
                      <strong>Status</strong>
                      <StatusBadge status={leave.status || "PENDING"} />
                    </div>
                  </div>

                  <div className="slm-form-group">
                    <label className="slm-label">Employee Reason</label>
                    <div className="slm-muted">{leave.reason || "-"}</div>
                  </div>

                  <div className="slm-form-group">
                    <label className="slm-label">Current Manager Comment</label>
                    <div className="slm-muted">{leave.managerComment || "-"}</div>
                  </div>

                  {leave.status === "PENDING" ? (
                    <>
                      <div className="slm-form-group">
                        <label className="slm-label" htmlFor={`comment-${leave.id}`}>
                          Manager Comment
                        </label>
                        <textarea
                          className="slm-textarea"
                          id={`comment-${leave.id}`}
                          rows="4"
                          placeholder="Add optional context for approval or rejection."
                          value={comments[leave.id] || ""}
                          onChange={(event) =>
                            handleCommentChange(leave.id, event.target.value)
                          }
                        />
                      </div>

                      <div className="slm-manager-actions">
                        <button
                          className="slm-button slm-button-success"
                          type="button"
                          onClick={() => handleApprove(leave.id)}
                        >
                          Approve Request
                        </button>

                        <button
                          className="slm-button slm-button-danger"
                          type="button"
                          onClick={() => handleReject(leave.id)}
                        >
                          Reject Request
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="slm-empty">
                      This request has already been processed.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}