import axios from 'axios';
import { API_ROUTES } from '../constants/apiRoutes';
import { mockNews as initialMockNews, mockClubs as initialMockClubs, mockUsers, mockDelay } from './mockData';
import { LoginCredentials, SignupCredentials, AuthTokens, NewsItem, Club, Update } from '../constants/types';
import { newsCache, clubsCache, syncMetadata } from './storage';

// Mutable state for mock data to allow simulated persistence
let mockNewsState: NewsItem[] = JSON.parse(JSON.stringify(initialMockNews));
let mockClubsState: Club[] = JSON.parse(JSON.stringify(initialMockClubs));

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
  [API_ROUTES.AUTH.LOGIN]: async (data: LoginCredentials): Promise<{ data: AuthTokens & { role: string; userId: string; clubId?: string } }> => {
    await mockDelay(1500);
    // Look up user from mockUsers
    const user = mockUsers[data.email];
    if (user) {
      return {
        data: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
          role: user.role,
          userId: user.id,
          clubId: user.clubId,
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
    const data = mockNewsState;
    // Cache the response
    await newsCache.save(data);
    await syncMetadata.setLastSync();
    return { data };
  },

  [API_ROUTES.CLUBS]: async (): Promise<{ data: Club[] }> => {
    await mockDelay(600);
    const data = mockClubsState.filter(club => club.isSubscribed);
    // Cache the response
    await clubsCache.save(data);
    await syncMetadata.setLastSync();
    return { data };
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

  createNews: async (newsData: Partial<NewsItem>) => {
    await mockDelay(1200);
    
    const newNews: NewsItem = {
      id: 'news_' + Date.now(),
      title: newsData.title || '',
      description: newsData.description || '',
      imageUrl: newsData.imageUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
      timestamp: new Date(),
      category: (newsData.category as 'event' | 'announcement' | 'achievement') || 'announcement',
      author: newsData.author || 'Campus Admin',
      readCount: 0,
    };
    
    // Add to the beginning of the news array
    mockNewsState.unshift(newNews);
    return { data: newNews };
  },
};

export const clubsApi = {
  getClubs: async () => {
    return mockApiResponses[API_ROUTES.CLUBS]();
  },
  
  getClubUpdates: async (clubId: string) => {
    await mockDelay(500);
    const club = mockClubsState.find(c => c.id === clubId);
    return { data: club?.updates || [] };
  },

  addClubUpdate: async (clubId: string, updateData: Partial<Update>) => {
    await mockDelay(1000);
    const club = mockClubsState.find(c => c.id === clubId);
    if (!club) {
      throw new Error('Club not found');
    }
    
    const newUpdate: Update = {
      id: 'update_' + Date.now(),
      title: updateData.title || '',
      content: updateData.content || '',
      timestamp: new Date(),
      type: updateData.type || 'announcement',
    };
    
    // Add to the beginning of the updates array
    club.updates.unshift(newUpdate);
    return { data: newUpdate };
  },
};

export default api;
