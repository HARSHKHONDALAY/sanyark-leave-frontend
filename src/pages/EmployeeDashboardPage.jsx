import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import StatCard from "../components/StatCard";
import Alert from "../components/Alert";
import { getEmployeeDashboard } from "../api/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { formatLeaveType } from "../utils/formatters";

export default function EmployeeDashboardPage() {

  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {

      const res = await getEmployeeDashboard();

      const dashboard = res?.data ?? res ?? {};

      setData(dashboard);

    } catch (err) {

      setError(err.message || "Failed to load dashboard");

    } finally {

      setLoading(false);

    }
  }

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

  const total = data?.totalLeaves ?? 0;
  const used = data?.usedLeaves ?? 0;
  const remaining = data?.remainingLeaves ?? 0;
  const pending = data?.pendingLeaves ?? 0;

  const holidays = data?.upcomingHolidays ?? [];
  const approvedLeaves = data?.upcomingApprovedLeaves ?? [];

  return (
    <PageShell>

      <div className="slm-card">

        <div className="slm-hero-copy">

          <span className="slm-kicker">EMPLOYEE PORTAL</span>

          <h2 className="slm-title">Leave Operations Dashboard</h2>

          <p className="slm-subtitle">
            Welcome, {user?.fullName || "Team Member"}.
            Review your leave balance and upcoming schedule.
          </p>

        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="slm-grid slm-grid-4">

          <StatCard
            label="Total Leaves"
            value={total}
            description="Allocated leave balance"
          />

          <StatCard
            label="Used Leaves"
            value={used}
            description="Approved leave days used"
          />

          <StatCard
            label="Remaining Leaves"
            value={remaining}
            description="Available leave balance"
          />

          <StatCard
            label="Pending Requests"
            value={pending}
            description="Requests waiting approval"
          />

        </div>

        <div className="slm-grid slm-grid-2 slm-dashboard-sections">

          <div className="slm-card-sm slm-equal-card">

            <h3>Upcoming Holidays</h3>

            {holidays.length === 0 ? (
              <div className="slm-empty">
                No upcoming holidays available.
              </div>
            ) : (

              <div className="slm-list-wrap">

                {holidays.slice(0,6).map((holiday, index) => (

                  <div key={index} className="slm-list-item">

                    <div className="slm-list-main">

                      <strong>{holiday.holidayName}</strong>

                      <span>{holiday.holidayDate}</span>

                      {holiday.description && (
                        <span>{holiday.description}</span>
                      )}

                    </div>

                    <div className="slm-list-side">
                      {holiday.holidayType}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          <div className="slm-card-sm slm-equal-card">

            <h3>Upcoming Approved Leaves</h3>

            {approvedLeaves.length === 0 ? (
              <div className="slm-empty">
                No upcoming approved leaves.
              </div>
            ) : (

              <div className="slm-list-wrap">

                {approvedLeaves.slice(0,6).map((leave, index) => (

                  <div key={index} className="slm-list-item">

                    <div className="slm-list-main">

                      <strong>
                        {formatLeaveType(leave.leaveType)}
                      </strong>

                      <span>
                        {leave.startDate} to {leave.endDate}
                      </span>

                      {leave.managerComment && (
                        <span>
                          Manager Note: {leave.managerComment}
                        </span>
                      )}

                    </div>

                    <div className="slm-list-side">
                      <StatusBadge status={leave.status}/>
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        <div className="slm-grid slm-grid-3 slm-dashboard-sections">

          <div className="slm-card-sm slm-action-card">

            <h3>Submit New Request</h3>

            <p className="slm-muted">
              Create a fresh leave request for manager approval.
            </p>

            <div className="slm-actions slm-actions-bottom">

              <button
                className="slm-button"
                onClick={() => navigate("/apply-leave")}
              >
                Apply for Leave
              </button>

            </div>

          </div>

          <div className="slm-card-sm slm-action-card">

            <h3>Track Leave Status</h3>

            <p className="slm-muted">
              Review all your leave requests and their status.
            </p>

            <div className="slm-actions slm-actions-bottom">

              <button
                className="slm-button slm-button-secondary"
                onClick={() => navigate("/my-leaves")}
              >
                View My Leaves
              </button>

            </div>

          </div>

          <div className="slm-card-sm slm-action-card">

            <h3>Secure Session</h3>

            <p className="slm-muted">
              End your session securely.
            </p>

            <div className="slm-actions slm-actions-bottom">

              <button
                className="slm-button slm-button-danger"
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