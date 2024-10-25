import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, loginService } from '../services/api';

interface AuthContextData {
  user: any;
  loading: boolean;
  signed: boolean;
  signIn: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem('@auth:user'),
        AsyncStorage.getItem('@auth:token'),
      ]);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error loading stored auth data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(username: string, password: string, rememberMe: boolean) {
    try {
      const response = await loginService.login({ username, password });
      const { token } = response.data.data;
      setUser(response.data.data.user);

      if (rememberMe) {
        await AsyncStorage.setItem('@auth:user', JSON.stringify(user));
        await AsyncStorage.setItem('@auth:token', token);
      }

      api.defaults.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async function signOut() {
    try {
      setUser(null);
      delete api.defaults.headers.Authorization;
      await AsyncStorage.multiRemove(['@auth:user', '@auth:token']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
