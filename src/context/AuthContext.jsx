import { createContext, useContext, useMemo, useState } from "react";
import {
  clearAuthData,
  getStoredToken,
  getStoredUser,
  setAuthData
} from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());

  const loginUser = (apiResponse) => {
    const data = apiResponse?.data ?? apiResponse ?? {};
    const authToken = data.token;

    const authUser = {
      id: data.id ?? data.userId ?? null,
      fullName: data.fullName ?? data.name ?? "User",
      email: data.email ?? "",
      role: data.role ?? ""
    };

    setAuthData(authToken, authUser);
    setToken(authToken);
    setUser(authUser);
  };

  const logoutUser = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loginUser,
      logoutUser
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}