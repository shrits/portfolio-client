import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      const savedToken = sessionStorage.getItem('admin_token');
      if (savedToken) {
        window.__adminToken = savedToken;
        return savedToken;
      }
    } catch {
      // Storage unavailable or disabled
    }
    return null;
  });

  const [username, setUsername] = useState(() => {
    try {
      return sessionStorage.getItem('admin_username') || null;
    } catch {
      return null;
    }
  });

  const login = useCallback((tokenValue, usernameValue) => {
    setToken(tokenValue);
    setUsername(usernameValue);
    window.__adminToken = tokenValue;
    try {
      sessionStorage.setItem('admin_token', tokenValue);
      sessionStorage.setItem('admin_username', usernameValue);
    } catch (e) {
      console.warn('Session storage write failed:', e);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsername(null);
    window.__adminToken = null;
    try {
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_username');
    } catch (e) {
      console.warn('Session storage remove failed:', e);
    }
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
