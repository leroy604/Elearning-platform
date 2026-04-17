import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginUser, registerUser } from '../api/auth';
import type { User, LoginRequest, RegisterRequest } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isInstructor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedFullName = localStorage.getItem('fullName');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedFullName) {
      setToken(storedToken);
      setUser({
        id: Number(storedUserId) || 0,
        email: '',
        username: '',
        firstName: storedFullName.split(' ')[0] || '',
        lastName: storedFullName.split(' ')[1] || '',
        role: (storedRole as 'STUDENT' | 'INSTRUCTOR') || 'STUDENT',
        enabled: true,
        createdAt: '',
        updatedAt: ''
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);
      const { user: userData, token: authToken } = response.data;

      setUser(userData);
      setToken(authToken);

      localStorage.setItem('token', authToken);
      localStorage.setItem('fullName', `${userData.firstName} ${userData.lastName}`.trim());
      localStorage.setItem('role', userData.role || 'STUDENT');
      localStorage.setItem('userId', String(userData.id || 0));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await registerUser(userData);
      const { user: userResponse, token: authToken } = response.data;

      setUser(userResponse);
      setToken(authToken);

      localStorage.setItem('token', authToken);
      localStorage.setItem('fullName', `${userResponse.firstName} ${userResponse.lastName}`.trim());
      localStorage.setItem('role', userResponse.role || 'STUDENT');
      localStorage.setItem('userId', String(userResponse.id || 0));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isInstructor: user?.role === 'INSTRUCTOR'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};