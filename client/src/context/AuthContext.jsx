import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// Provides the logged-in user (or null) to the whole app,
// backed by the httpOnly JWT cookie set by the server.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the server who we are (if the cookie is valid).
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password, role) => {
    const res = await api.post("/auth/login", { email, password, role });
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
