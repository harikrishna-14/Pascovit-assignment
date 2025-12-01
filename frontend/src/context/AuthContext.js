import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from './../services/api'; // <-- import your new API wrapper

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authAPI.getMe();
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Register
  const register = async (name, email, password, passwordConfirm) => {
    try {
      const res = await authAPI.register({ name, email, password, passwordConfirm });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // Logout
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
