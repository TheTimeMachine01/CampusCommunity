import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../services/api';
import { User, LoginCredentials, SignupCredentials } from '../constants/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const segments = useSegments();

  // Token management functions
  const getTokens = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      return { accessToken, refreshToken };
    } catch (e) {
      console.error("AuthContext: Failed to retrieve tokens from SecureStore:", e);
      return { accessToken: null, refreshToken: null };
    }
  };

  const setTokens = async (accessToken: string, refreshToken: string) => {
    try {
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    } catch (e) {
      console.error("AuthContext: Failed to store tokens in SecureStore:", e);
    }
  };

  const removeTokens = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    } catch (e) {
      console.error("AuthContext: Failed to remove tokens from SecureStore:", e);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const { refreshToken } = await getTokens();

      if (!refreshToken) throw new Error('No refresh token available. User must re-login');

      const response = await authApi.refreshToken(refreshToken);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      if (!newAccessToken || !newRefreshToken) throw new Error('Refresh response missing tokens');

      await setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;

    } catch (error: any) {
      console.error("AuthContext: Refresh token failed. Redirecting to login.", error);
      await removeTokens();
      setUser(null);
      return null;
    }
  };

  // Initial auth check on app load
  useEffect(() => {
    const loadAuthStatus = async () => {
      try {
        const { accessToken } = await getTokens();
        if (accessToken) {
          // In a real app, you'd validate the token with the backend
          setUser({ 
            id: 'user_123', 
            email: 'user@example.com',
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("AuthContext: Error loading initial auth status:", error);
        setUser(null);
        await removeTokens();
      } finally {
        setIsLoadingAuth(false);
      }
    };
    loadAuthStatus();
  }, []);

  // Expo Router redirection logic
  useEffect(() => {
    if (!isLoadingAuth) {
      const inAuthGroup = segments[0] === '(auth)';
      console.log('AuthContext: redirect effect - user:', user?.email || 'null', 'inAuthGroup:', inAuthGroup, 'isLoadingAuth:', isLoadingAuth);

      if (user && inAuthGroup) {
        console.log('AuthContext: redirecting to dashboard');
        router.replace('/(tabs)/dashboard');
      } else if (!user && !inAuthGroup) {
        console.log('AuthContext: redirecting to login');
        router.replace('/(auth)/login');
      }
    }
  }, [user, isLoadingAuth, segments]);

  // Authentication functions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      console.log('AuthContext: login called with email:', credentials.email);
      const response = await authApi.login(credentials);
      console.log('AuthContext: login response received:', response);
      const { accessToken, refreshToken } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Login response missing tokens from backend.");
      }

      await setTokens(accessToken, refreshToken);
      setUser({ 
        id: 'user_123', 
        email: credentials.email,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
      });
      console.log('AuthContext: login successful, user set');
      return true;
    } catch (error: any) {
      console.error("AuthContext: Login failed:", error.message);
      setUser(null);
      await removeTokens();
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const response = await authApi.signup(credentials);
      console.log('AuthContext: Signup successful, please log in.', response.data);
      return true;
    } catch (error: any) {
      console.error("AuthContext: Signup failed:", error.message);
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoadingAuth(true);
    try {
      await removeTokens();
      setUser(null);
    } catch (error) {
      console.error("AuthContext: Logout failed:", error);
      setUser(null);
      await removeTokens();
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const value = { 
    user, 
    isAuthenticated: !!user, 
    login, 
    signup, 
    logout, 
    isLoadingAuth 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export { AuthProvider };
