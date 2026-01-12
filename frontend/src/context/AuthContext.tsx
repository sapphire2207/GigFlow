import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../lib/axiosInstance';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
      });
      toast.success(response.data.message || 'Registration successful!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      
      const { user: userData, accessToken } = response.data.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', accessToken);
      
      toast.success(response.data.message || 'Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.post('/auth/logout');
      
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      
      toast.success('Logged out successfully');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Logout failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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