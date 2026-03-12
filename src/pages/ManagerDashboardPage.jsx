import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Alert from "../components/Alert";
import StatCard from "../components/StatCard";
import { getAllLeaves, getManagerDashboard } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { formatLeaveType } from "../utils/formatters";

export default function ManagerDashboardPage() {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [allLeaves, setAllLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setError("");
    setLoading(true);

    try {
      const [dashboardRes, leavesRes] = await Promise.all([
        getManagerDashboard(),
        getAllLeaves()
      ]);

      const dashboard = dashboardRes?.data ?? dashboardRes ?? {};
      const leaves = leavesRes?.data ?? leavesRes ?? [];

      setDashboardData(dashboard);
      setAllLeaves(Array.isArray(leaves) ? leaves : []);
    } catch (err) {
      setError(err.message || "Failed to load manager dashboard.");
    } finally {
      setLoading(false);
    }
  }

  const derivedSections = useMemo(() => {
    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];

    const next14 = new Date();
    next14.setDate(next14.getDate() + 14);
    const next14Key = next14.toISOString().split("T")[0];

    const current = [];
    const upcoming = [];
    const pending = [];

    allLeaves.forEach((leave) => {
      const status = String(leave.status || "").toUpperCase();
      const startDate = leave.startDate || "";
      const endDate = leave.endDate || "";

      if (status === "PENDING") {
        pending.push(leave);
      }

      if (
        status === "APPROVED" &&
        startDate &&
        endDate &&
        startDate <= todayKey &&
        endDate >= todayKey
      ) {
        current.push(leave);
      }

      if (
        status === "APPROVED" &&
        startDate &&
        startDate > todayKey &&
        startDate <= next14Key
      ) {
        upcoming.push(leave);
      }
    });

    current.sort((a, b) =>
      String(a.startDate || "").localeCompare(String(b.startDate || ""))
    );

    upcoming.sort((a, b) =>
      String(a.startDate || "").localeCompare(String(b.startDate || ""))
    );

    pending.sort((a, b) =>
      String(a.startDate || "").localeCompare(String(b.startDate || ""))
    );

    return {
      currentPreview: current.slice(0, 6),
      upcomingPreview: upcoming.slice(0, 6),
      pendingPreview: pending.slice(0, 5)
    };
  }, [allLeaves]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  if (loading) {
    return (
      <PageShell>
        <div className="slm-card">
          <p className="slm-muted">Loading dashboard...</p>
        </div>
      </PageShell>
    );
  }

  const totalEmployees = Number(dashboardData?.totalEmployees ?? 0);
  const pendingApprovals = Number(dashboardData?.pendingApprovals ?? 0);
  const currentlyOnLeave = Number(dashboardData?.employeesCurrentlyOnLeave ?? 0);
  const leavesThisWeek = Number(dashboardData?.leavesThisWeek ?? 0);
  const leavesThisMonth = Number(dashboardData?.leavesThisMonth ?? 0);

  return (
    <PageShell>
      <div className="slm-card">
        <div className="slm-hero-copy">
          <span className="slm-kicker">MANAGER CONSOLE</span>
          <h2 className="slm-title">Leave Command Dashboard</h2>
          <p className="slm-subtitle">
            Welcome, {user?.fullName || "Manager"}. Review requests, monitor live
            team availability, and keep operations stable with a clear view of who
            is away now and who will be away soon.
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="slm-grid slm-grid-5">
          <StatCard
            label="Total Employees"
            value={totalEmployees}
            description="Employees available in the organization."
          />

          <StatCard
            label="Pending Approvals"
            value={pendingApprovals}
            description="Requests still waiting for a manager decision."
          />

          <StatCard
            label="Currently On Leave"
            value={currentlyOnLeave}
            description="Employees unavailable today."
          />

          <StatCard
            label="Leaves This Week"
            value={leavesThisWeek}
            description="Approved or scheduled during the current week."
          />

          <StatCard
            label="Leaves This Month"
            value={leavesThisMonth}
            description="Approved or scheduled during the current month."
          />
        </div>

        <div className="slm-grid slm-grid-3 slm-dashboard-sections">
          <div className="slm-card-sm slm-equal-card">
            <h3>On Leave Today</h3>

            {derivedSections.currentPreview.length === 0 ? (
              <div className="slm-empty">No employees are on leave today.</div>
            ) : (
              <div className="slm-list-wrap">
                {derivedSections.currentPreview.map((leave) => (
                  <div className="slm-list-item" key={`current-${leave.id}`}>
                    <div className="slm-list-main">
                      <strong>{leave.employeeName || leave.employee?.fullName || "-"}</strong>
                      <span>
                        {leave.employeeCode || leave.employee?.employeeCode || "-"} ·{" "}
                        {formatLeaveType(leave.leaveType)}
                      </span>
                      <span>
                        {leave.startDate || "-"} to {leave.endDate || "-"}
                      </span>
                    </div>
                    <div className="slm-list-side">Today</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="slm-card-sm slm-equal-card">
            <h3>Upcoming Approved Leaves</h3>

            {derivedSections.upcomingPreview.length === 0 ? (
              <div className="slm-empty">
                No approved upcoming leaves in the next 14 days.
              </div>
            ) : (
              <div className="slm-list-wrap">
                {derivedSections.upcomingPreview.map((leave) => (
                  <div className="slm-list-item" key={`upcoming-${leave.id}`}>
                    <div className="slm-list-main">
                      <strong>{leave.employeeName || leave.employee?.fullName || "-"}</strong>
                      <span>
                        {leave.employeeCode || leave.employee?.employeeCode || "-"} ·{" "}
                        {formatLeaveType(leave.leaveType)}
                      </span>
                      <span>
                        {leave.startDate || "-"} to {leave.endDate || "-"}
                      </span>
                    </div>
                    <div className="slm-list-side">Approved</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="slm-card-sm slm-equal-card">
            <h3>Pending Request Snapshot</h3>

            {derivedSections.pendingPreview.length === 0 ? (
              <div className="slm-empty">No pending leave requests right now.</div>
            ) : (
              <div className="slm-list-wrap">
                {derivedSections.pendingPreview.map((leave) => (
                  <div className="slm-list-item" key={`pending-${leave.id}`}>
                    <div className="slm-list-main">
                      <strong>{leave.employeeName || leave.employee?.fullName || "-"}</strong>
                      <span>
                        {leave.employeeCode || leave.employee?.employeeCode || "-"} ·{" "}
                        {formatLeaveType(leave.leaveType)}
                      </span>
                      <span>
                        {leave.startDate || "-"} to {leave.endDate || "-"}
                      </span>
                    </div>
                    <div className="slm-list-side">Pending</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="slm-grid slm-grid-3 slm-dashboard-sections">
          <div className="slm-card-sm slm-action-card">
            <h3>Review Active Requests</h3>
            <p className="slm-muted">
              Open the full request queue, read employee context, and approve or
              reject pending requests with manager comments.
            </p>
            <div className="slm-actions slm-actions-bottom">
              <button
                className="slm-button"
                type="button"
                onClick={() => navigate("/manage-leaves")}
              >
                Manage Leave Requests
              </button>
            </div>
          </div>

          <div className="slm-card-sm slm-action-card">
            <h3>Team Leave Calendar</h3>
            <p className="slm-muted">
              View the full monthly leave calendar to understand team availability
              day by day across approved and pending requests.
            </p>
            <div className="slm-actions slm-actions-bottom">
              <button
                className="slm-button slm-button-secondary"
                type="button"
                onClick={() => navigate("/team-calendar")}
              >
                Open Team Calendar
              </button>
            </div>
          </div>

          <div className="slm-card-sm slm-action-card">
            <h3>Secure Session</h3>
            <p className="slm-muted">
              Close your current session securely when managerial review is complete.
            </p>
            <div className="slm-actions slm-actions-bottom">
              <button
                className="slm-button slm-button-danger"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}