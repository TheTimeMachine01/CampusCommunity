import axios from 'axios';
import { API_ROUTES } from '../constants/apiRoutes';
import { mockNews, mockClubs, mockDelay } from './mockData';
import { LoginCredentials, SignupCredentials, AuthTokens, NewsItem, Club } from '../constants/types';

// Create axios instance
const api = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API responses
const mockApiResponses = {
  // Auth endpoints
  [API_ROUTES.AUTH.LOGIN]: async (data: LoginCredentials): Promise<{ data: AuthTokens }> => {
    await mockDelay(1500);
    if (data.email === 'test@example.com' && data.password === 'password') {
      return {
        data: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  [API_ROUTES.AUTH.SIGNUP]: async (data: SignupCredentials): Promise<{ data: { message: string } }> => {
    await mockDelay(2000);
    return {
      data: {
        message: 'User registered successfully. Please log in.',
      },
    };
  },

  [API_ROUTES.AUTH.REFRESH]: async (data: { refreshToken: string }): Promise<{ data: AuthTokens }> => {
    await mockDelay(1000);
    return {
      data: {
        accessToken: 'new_mock_access_token_' + Date.now(),
        refreshToken: 'new_mock_refresh_token_' + Date.now(),
      },
    };
  },

  [API_ROUTES.NEWS]: async (): Promise<{ data: NewsItem[] }> => {
    await mockDelay(800);
    return { data: mockNews };
  },

  [API_ROUTES.CLUBS]: async (): Promise<{ data: Club[] }> => {
    await mockDelay(600);
    return { data: mockClubs.filter(club => club.isSubscribed) };
  },
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Token will be added by AuthContext
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null; // In real app, use SecureStore
        if (refreshToken) {
          const response = await api.post(API_ROUTES.AUTH.REFRESH, { refreshToken });
          const { accessToken } = response.data;
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error('Token refresh failed:', refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Mock API functions
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    return mockApiResponses[API_ROUTES.AUTH.LOGIN](credentials);
  },
  
  signup: async (credentials: SignupCredentials) => {
    return mockApiResponses[API_ROUTES.AUTH.SIGNUP](credentials);
  },
  
  refreshToken: async (refreshToken: string) => {
    return mockApiResponses[API_ROUTES.AUTH.REFRESH]({ refreshToken });
  },
};

export const newsApi = {
  getNews: async () => {
    return mockApiResponses[API_ROUTES.NEWS]();
  },
};

export const clubsApi = {
  getClubs: async () => {
    return mockApiResponses[API_ROUTES.CLUBS]();
  },
  
  getClubUpdates: async (clubId: string) => {
    await mockDelay(500);
    const club = mockClubs.find(c => c.id === clubId);
    return { data: club?.updates || [] };
  },
};

export default api;
