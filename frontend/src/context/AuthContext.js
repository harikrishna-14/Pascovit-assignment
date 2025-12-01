import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; 
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

 const register = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/register',
      { name, email, password, passwordConfirm },
      { withCredentials: true }
    );

    setUser(res.data.user);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Registration failed"
    );
  }
};


const login = async (email, password) => {
  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/login',
      { email, password },
      { withCredentials: true }
    );

    setUser(res.data.user);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Login failed"
    );
  }
};


  const logout = async () => {
    await axios.post(
      'http://localhost:5000/api/auth/logout',
      {},
      { withCredentials: true }
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
