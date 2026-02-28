import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    const res = await api.post("/auth/register", { username, email, password });
    const { token: jwt, user: userData } = res.data;
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return userData;
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: jwt, user: userData } = res.data;
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
