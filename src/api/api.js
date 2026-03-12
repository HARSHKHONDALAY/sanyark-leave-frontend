import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://35.154.197.206";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
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
    throw new Error(extractErrorMessage(error, "Failed to fetch leave history."));
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

export async function getAllLeaves() {
  try {
    const response = await api.get("/api/manager/leaves");
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch leave requests."));
  }
}

export async function approveLeave(id, payload) {
  try {
    const response = await api.put(`/api/manager/leaves/${id}/approve`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to approve leave request.")
    );
  }
}

export async function rejectLeave(id, payload) {
  try {
    const response = await api.put(`/api/manager/leaves/${id}/reject`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to reject leave request.")
    );
  }
}
const API_BASE = import.meta.env.VITE_API_BASE_URL;
export default api;