import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then(r => { setUser(r.data.data); localStorage.setItem('user', JSON.stringify(r.data.data)); })
      .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const r    = await authApi.login(credentials);
    const data = r.data.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const r    = await authApi.register(payload);
    const data = r.data.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
