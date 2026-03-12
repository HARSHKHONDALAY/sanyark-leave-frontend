import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Alert from "../components/Alert";
import { login } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(form);
      loginUser(response);

      const role = response?.data?.role ?? response?.role;

      if (role === "MANAGER") {
        navigate("/manager-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell maxWidth="620px">
      <div className="slm-card">
        <div className="slm-hero-copy">
          <span className="slm-kicker">SANYARK SPACE</span>
          <h2 className="slm-title">Mission Control Login</h2>
          <p className="slm-subtitle">
            Access the Leave Management System built for a space-first team.
            Sign in to manage requests, approvals, schedules, and operational
            continuity across Sanyark Space.
          </p>
        </div>

        {error ? <Alert type="error">{error}</Alert> : null}

        <form onSubmit={handleSubmit}>
          <div className="slm-form-group">
            <label className="slm-label" htmlFor="slm_login_email">
              Work Email
            </label>
            <input
              className="slm-input"
              id="slm_login_email"
              type="email"
              name="email"
              placeholder="Enter your Sanyark email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="slm-form-group">
            <label className="slm-label" htmlFor="slm_login_password">
              Password
            </label>
            <input
              className="slm-input"
              id="slm_login_password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="slm-actions">
            <button className="slm-button" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Secure Login"}
            </button>
          </div>

          <p className="slm-section-note">
            Designed for a company building fused PNT and communications
            infrastructure from LEO satellites for secure and autonomous systems.
          </p>
        </form>
      </div>
    </PageShell>
  );
}