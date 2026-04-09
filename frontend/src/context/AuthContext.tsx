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
    // Check for existing token on app load
    const storedToken = localStorage.getItem('token');
    const storedFullName = localStorage.getItem('fullName');

    if (storedToken && storedFullName) {
      // For now, we'll trust the stored token
      // In a real app, you'd validate the token with the backend
      setToken(storedToken);
      // We don't have full user data stored, so we'll set a basic user object
      setUser({
        id: 0,
        email: '',
        username: '',
        firstName: storedFullName.split(' ')[0] || '',
        lastName: storedFullName.split(' ')[1] || '',
        role: 'STUDENT',
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
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};