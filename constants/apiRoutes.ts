export const API_ROUTES = {
  BASE_URL: 'https://api.campuscommunity.com', // Mock base URL
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  NEWS: '/news',
  CLUBS: '/clubs',
  CLUB_UPDATES: (clubId: string) => `/clubs/${clubId}/updates`,
  USER_PROFILE: '/user/profile',
  NOTIFICATIONS: '/notifications',
} as const;
