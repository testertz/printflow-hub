import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'admin' | 'leader' | 'runner' | 'stationary';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  classId?: string;
  className?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      // In production, replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 
              email.includes('leader') ? 'leader' :
              email.includes('runner') ? 'runner' :
              email.includes('stationary') ? 'stationary' : 'student',
        classId: email.includes('leader') || email.includes('student') ? 'CS101' : undefined,
        className: email.includes('leader') || email.includes('student') ? 'Computer Science 101' : undefined,
      };
      const mockToken = 'mock-jwt-token-' + Math.random();
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setUser(mockUser);
      setToken(mockToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call
      const mockUser: User = {
        id: Math.random().toString(),
        email,
        name,
        role: 'student',
      };
      const mockToken = 'mock-jwt-token-' + Math.random();
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setUser(mockUser);
      setToken(mockToken);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
