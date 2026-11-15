import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api.js';

const AuthContext = createContext(undefined);

const SESSION_KEY = 'arbaazpay_session_user';

// Clean up any legacy persistent auth tokens from localStorage so the application always starts at the login page
try {
  localStorage.removeItem('arbaazpay_auth_user');
  localStorage.removeItem('paypulse_auth_user');
} catch {
  // Ignore in environments where localStorage is restricted
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email === 'user@merchant.com') {
          parsed.name = 'Test Merchant';
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    // Application starts with login page first by default (no user session)
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        if (user.email === 'user@merchant.com' && user.name !== 'Test Merchant') {
          user.name = 'Test Merchant';
        }
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Fallback
    }
  }, [user]);

  const login = async (email, password) => {
    const newUser = await loginUser(email, password);
    setUser(newUser);
    return newUser;
  };

  const register = async (userData) => {
    const newUser = await registerUser(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('arbaazpay_auth_user');
      localStorage.removeItem('paypulse_auth_user');
    } catch {
      // Fallback
    }
  };

  const switchRole = async (targetRole) => {
    if (targetRole === 'admin') {
      const newUser = await loginUser('arbaaz@admin.com', '00006789');
      setUser(newUser);
    } else {
      const newUser = await loginUser('user@merchant.com', '00001234');
      setUser(newUser);
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.permissions.includes('read:all');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'merchant',
        isAuthenticated: !!user,
        login,
        logout,
        register,
        switchRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

