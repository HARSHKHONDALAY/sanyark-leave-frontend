import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Alert from "../components/Alert";
import { getAllLeaves } from "../api/api";
import { formatLeaveType } from "../utils/formatters";

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthTitle(date) {
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });
}

function buildCalendarDates(currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - firstWeekday);

  const dates = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    dates.push(date);
  }

  return dates;
}

function getEventClass(status) {
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

export default function TeamCalendarPage() {
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarLeaves, setCalendarLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const todayKey = formatDateKey(new Date());
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    loadCalendarData();
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function loadCalendarData() {
    setError("");
    setLoading(true);

    try {
      const res = await getAllLeaves();
      const rawData = res?.data ?? res ?? [];

      const leaves = Array.isArray(rawData) ? rawData : [];

      const usefulLeaves = leaves.filter((leave) =>
        ["APPROVED", "PENDING", "REJECTED", "CANCELLED"].includes(
          String(leave.status || "").toUpperCase()
        )
      );

      setCalendarLeaves(usefulLeaves);
    } catch (err) {
      setError(err.message || "Failed to load team calendar.");
    } finally {
      setLoading(false);
    }
  }

  const eventsByDay = useMemo(() => {
    const map = {};

    calendarLeaves.forEach((leave) => {
      if (!leave.startDate || !leave.endDate) {
        return;
      }

      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
        return;
      }

      const current = new Date(start);

      while (current <= end) {
        const key = formatDateKey(current);

        if (!map[key]) {
          map[key] = [];
        }

        map[key].push({
          id: leave.id,
          employeeName: leave.employeeName || leave.employee?.fullName || "-",
          employeeCode: leave.employeeCode || leave.employee?.employeeCode || "",
          leaveType: leave.leaveType || "",
          status: leave.status || "PENDING"
        });

        current.setDate(current.getDate() + 1);
      }
    });

    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => {
        const order = {
          APPROVED: 0,
          PENDING: 1,
          REJECTED: 2,
          CANCELLED: 3
        };

        const aOrder = order[String(a.status || "").toUpperCase()] ?? 9;
        const bOrder = order[String(b.status || "").toUpperCase()] ?? 9;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        return String(a.employeeName).localeCompare(String(b.employeeName));
      });
    });

    return map;
  }, [calendarLeaves]);

  const calendarDates = useMemo(
    () => buildCalendarDates(currentMonth),
    [currentMonth]
  );

  function goToPreviousMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }

  function goToToday() {
    setCurrentMonth(new Date());
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
          <span className="slm-kicker">TEAM AVAILABILITY</span>
          <h2 className="slm-title">Team Leave Calendar</h2>
          <p className="slm-subtitle">
            View the full month at a glance and monitor approved, pending, rejected,
            and cancelled leave events across the team for better planning and coordination.
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {loading ? (
          <p className="slm-muted">Loading team calendar...</p>
        ) : (
          <>
            <div className="slm-calendar-toolbar">
              <button
                className="slm-button slm-button-secondary"
                type="button"
                onClick={goToPreviousMonth}
              >
                ← Previous
              </button>

              <div className="slm-calendar-title">
                {getMonthTitle(currentMonth)}
              </div>

              <div className="slm-calendar-toolbar-actions">
                <button
                  className="slm-button slm-button-secondary"
                  type="button"
                  onClick={goToToday}
                >
                  Today
                </button>

                <button
                  className="slm-button slm-button-secondary"
                  type="button"
                  onClick={goToNextMonth}
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="slm-calendar-grid slm-calendar-weekdays">
              {weekDays.map((day) => (
                <div className="slm-calendar-weekday" key={day}>
                  {day}
                </div>
              ))}
            </div>

            <div className="slm-calendar-grid slm-calendar-days">
              {calendarDates.map((date) => {
                const dateKey = formatDateKey(date);
                const isCurrentMonth =
                  date.getMonth() === currentMonth.getMonth();
                const isToday = dateKey === todayKey;
                const dayEvents = eventsByDay[dateKey] || [];
                const visibleCount = isMobile ? 1 : 3;
                const visibleEvents = dayEvents.slice(0, visibleCount);
                const extraCount = dayEvents.length - visibleEvents.length;

                const classNames = ["slm-calendar-day"];
                if (!isCurrentMonth) {
                  classNames.push("slm-calendar-day-outside");
                }
                if (isToday) {
                  classNames.push("slm-calendar-day-today");
                }

                return (
                  <div className={classNames.join(" ")} key={dateKey}>
                    <div className="slm-calendar-day-number">
                      {date.getDate()}
                    </div>

                    <div className="slm-calendar-events">
                      {visibleEvents.map((event, index) => (
                        <div
                          className={getEventClass(event.status)}
                          key={`${dateKey}-${event.id}-${index}`}
                          title={`${event.employeeName} • ${formatLeaveType(event.leaveType)} • ${event.status}`}
                        >
                          <strong>{event.employeeName}</strong>
                          <span>{formatLeaveType(event.leaveType)}</span>
                          {!isMobile && (
                            <span>{String(event.status || "").toUpperCase()}</span>
                          )}
                        </div>
                      ))}

                      {extraCount > 0 && (
                        <div className="slm-calendar-more">
                          +{extraCount} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="slm-calendar-legend">
              <span className="slm-calendar-legend-item">
                <span className="slm-calendar-legend-dot slm-calendar-legend-approved"></span>
                Approved
              </span>
              <span className="slm-calendar-legend-item">
                <span className="slm-calendar-legend-dot slm-calendar-legend-pending"></span>
                Pending
              </span>
              <span className="slm-calendar-legend-item">
                <span className="slm-calendar-legend-dot slm-calendar-legend-rejected"></span>
                Rejected
              </span>
              <span className="slm-calendar-legend-item">
                <span className="slm-calendar-legend-dot slm-calendar-legend-cancelled"></span>
                Cancelled
              </span>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}