import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('usuario_sesion');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('jwt_token') || null;
  });

  const login = (userData, jwtToken = 'demo-jwt-token') => {
    setUser(userData);
    setToken(jwtToken);
    try {
      localStorage.setItem('usuario_sesion', JSON.stringify(userData));
      localStorage.setItem('jwt_token', jwtToken);
    } catch (e) {
      console.error('Error guardando sesión:', e);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('usuario_sesion');
      localStorage.removeItem('jwt_token');
    } catch (e) {
      console.error('Error limpiando sesión:', e);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;
