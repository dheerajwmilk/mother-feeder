import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'caregiver' | 'admin';
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fname: string, lname: string, phone: string | undefined, otp: string, role?: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  sendResetOTP: (email: string) => Promise<any>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
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

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('neonest_token');
    const storedUser = localStorage.getItem('neonest_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('neonest_user');
        localStorage.removeItem('neonest_token');
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for popup messages from Google callback window
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // Only accept messages from the same origin
      if (event.origin !== window.location.origin) return;
      if (!event.data) return;
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.useGoogleSignIn) {
          toast.error('This account uses Google Sign-In. Please sign in with Google.');
          return;
        }
        if (data.userNotFound) {
          toast.error('Account not found. Please sign up.');
          return;
        }
        throw new Error(data.message || 'Login failed');
      }
      setUser(data.user);
      localStorage.setItem('neonest_token', data.token);
      localStorage.setItem('neonest_user', JSON.stringify(data.user));
      toast.success('Logged in');
    } catch (error: any) {
      toast.error(error.message || 'Error logging in');
      throw error;
    }
  };

  const sendOTP = async (email: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      toast.success('OTP sent successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error sending OTP');
      throw error;
    }
  };

  const sendResetOTP = async (email: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset OTP');
      }
      toast.success('If an account exists, a reset code was sent to the email');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Error sending reset OTP');
      throw error;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      toast.success('Password reset successful');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Error resetting password');
      throw error;
    }
  };

  const register = async (email: string, password: string, fname: string, lname: string, phone: string | undefined, otp: string, role: string = 'user') => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fname, lname, phone, otp, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.isExistingUser) {
          toast.error('Account already exists. Please log in.');
          return;
        }
        throw new Error(data.message || 'Registration failed');
      }
      setUser(data.user);
      localStorage.setItem('neonest_token', data.token);
      localStorage.setItem('neonest_user', JSON.stringify(data.user));
      toast.success('Account created');
    } catch (error: any) {
      toast.error(error.message || 'Error creating account');
      throw error;
    }
  };

 
  const logout = () => {
    setUser(null);
    localStorage.removeItem('neonest_token');
    localStorage.removeItem('neonest_user');
    toast.success('Logged out');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    sendOTP,
    sendResetOTP,
    resetPassword,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
