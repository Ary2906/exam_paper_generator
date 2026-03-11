import React, { createContext, useState, useCallback } from 'react';
import type { User, AuthContextType } from '../types';
import { dataStore } from '../store/dataStore';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('current_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((username: string, password: string): boolean => {
    const user = dataStore.getUserByUsername(username);
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem('current_user', JSON.stringify(user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('current_user');
  }, []);

  const register = useCallback(
    (newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
      // Check if username already exists
      if (dataStore.getUserByUsername(newUser.username)) {
        return false;
      }
      const user = dataStore.addUser(newUser);
      setCurrentUser(user);
      localStorage.setItem('current_user', JSON.stringify(user));
      return true;
    },
    []
  );

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: currentUser !== null,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
