"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/AuthService/auth.service';
import { IAuthContextType } from '@/types/authContext.types';
import { LoginCredentials, User } from '@/types/auth.types';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser({
              username: currentUser.username,
              token: currentUser.token,
              expiredIn: currentUser.expiredIn
            });
          }
        }
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      const userData: User = {
        username: response.user.username,
        token: response.token,
        expiredIn: response.expiredIn
      };
      
      setUser(userData);
      router.push('/authenticatedPages/welcome');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao fazer login');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
    router.push('/login');
  };

  const contextValue = useMemo(() => ({
    user,
    loading,
    _error: error,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, loading, error, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};