
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'voter' | 'candidate';
  hasVoted?: boolean;
  twoFactorEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'voter' | 'candidate') => Promise<boolean>;
  logout: () => void;
  enableTwoFactor: () => Promise<string>;
  verifyTwoFactor: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize with admin user
    const initialUsers: User[] = [
      {
        id: 'admin-1',
        email: 'kumaransenthilarasu@gmail.com',
        name: 'Admin User',
        role: 'admin',
        twoFactorEnabled: true
      }
    ];
    
    const storedUsers = localStorage.getItem('voting_users');
    const storedCurrentUser = localStorage.getItem('voting_current_user');
    
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
    } else {
      setUsers(initialUsers);
      localStorage.setItem('voting_users', JSON.stringify(initialUsers));
    }
    
    if (storedCurrentUser) {
      setUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  const login = async (email: string, password: string, twoFactorCode?: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) return false;
    
    // For demo purposes, accept the hardcoded admin password or any password for other users
    const isValidPassword = (email === 'kumaransenthilarasu@gmail.com' && password === 'SK29@2006') || 
                           (email !== 'kumaransenthilarasu@gmail.com' && password.length >= 6);
    
    if (!isValidPassword) return false;
    
    // Check 2FA for admin
    if (foundUser.twoFactorEnabled && !twoFactorCode) {
      return false; // Need 2FA code
    }
    
    if (foundUser.twoFactorEnabled && twoFactorCode !== '123456') {
      return false; // Invalid 2FA code
    }
    
    setUser(foundUser);
    localStorage.setItem('voting_current_user', JSON.stringify(foundUser));
    return true;
  };

  const register = async (email: string, password: string, name: string, role: 'voter' | 'candidate'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (users.find(u => u.email === email)) {
      return false; // User already exists
    }
    
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role,
      hasVoted: false,
      twoFactorEnabled: false
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('voting_users', JSON.stringify(updatedUsers));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voting_current_user');
  };

  const enableTwoFactor = async (): Promise<string> => {
    // Simulate API call to generate QR code
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'JBSWY3DPEHPK3PXP'; // Mock secret key
  };

  const verifyTwoFactor = (code: string): boolean => {
    return code === '123456'; // Mock verification
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    enableTwoFactor,
    verifyTwoFactor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
