import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function extractErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
}

export async function login(payload) {
  try {
    const response = await api.post("/api/auth/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Login failed."));
  }
}

export async function getEmployeeDashboard() {
  try {
    const response = await api.get("/api/dashboard/employee");
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch employee dashboard.")
    );
  }
}

export async function getManagerDashboard() {
  try {
    const response = await api.get("/api/dashboard/manager");
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch manager dashboard.")
    );
  }
}

export async function createLeave(payload) {
  try {
    const response = await api.post("/api/leaves", payload);
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to create leave request.")
    );
  }
}

export async function getMyLeaves() {
  try {
    const response = await api.get("/api/leaves/my");
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch leave history.")
    );
  }
}

export async function cancelLeave(id) {
  try {
    const response = await api.put(`/api/leaves/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to cancel leave request.")
    );
  }
}

export async function getAllLeaves() {
  try {
    const response = await api.get("/api/manager/leaves");
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch leave requests.")
    );
  }
}

export async function takeLeaveAction(payload) {
  try {
    const response = await api.post("/api/manager/leave-action", payload);
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to update leave request.")
    );
  }
}

export async function getTeamCalendar() {
  try {
    const response = await api.get("/api/calendar/team");
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch team calendar.")
    );
  }
}

export async function getHolidays() {
  try {
    const response = await api.get("/api/holidays");
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch holidays.")
    );
  }
}

export async function getNotifications() {
  try {
    const response = await api.get("/api/notifications");
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch notifications.")
    );
  }
}

export default api;