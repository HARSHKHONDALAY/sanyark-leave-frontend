import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import ParticlesBackground from "./components/ParticlesBackground";
import LoginPage from "./pages/LoginPage";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import MyLeavesPage from "./pages/MyLeavesPage";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import ManageLeavesPage from "./pages/ManageLeavesPage";
import TeamCalendarPage from "./pages/TeamCalendarPage";

export default function App() {
  return (
    <>
      <ParticlesBackground />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeDashboardPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <ApplyLeavePage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <MyLeavesPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerDashboardPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-leaves"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["MANAGER"]}>
                <ManageLeavesPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/team-calendar"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["MANAGER"]}>
                <TeamCalendarPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}