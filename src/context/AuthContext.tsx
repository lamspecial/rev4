import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserAccount } from '../lib/mockData';
import { useData } from './DataContext';

interface AuthContextType {
  user: UserAccount | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { users } = useData();
  const [user, setUser] = useState<UserAccount | null>(() => {
    const savedUserId = localStorage.getItem('auth_user_id');
    if (savedUserId && users.length > 0) {
      return users.find(u => u.id === savedUserId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (!user) {
      const savedUserId = localStorage.getItem('auth_user_id');
      if (savedUserId && users.length > 0) {
        const foundUser = users.find(u => u.id === savedUserId);
        if (foundUser) setUser(foundUser);
      }
    }
  }, [users, user]);

  const login = (email: string, pass: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('auth_user_id', foundUser.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
