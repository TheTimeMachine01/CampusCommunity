export type UserRole = 'admin' | 'club_lead' | 'student' | 'guest';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  clubId?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  timestamp: Date;
  category: 'event' | 'announcement' | 'achievement';
  author: string;
  readCount: number;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isSubscribed: boolean;
  imageUrl?: string;
  category: 'academic' | 'sports' | 'cultural' | 'technical' | 'social';
  updates: Update[];
}

export interface Update {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  type: 'event' | 'announcement' | 'achievement';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Plan 4: Notification Center & Discovery System
export type NotificationType = 'system' | 'club' | 'admin' | 'news';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  relatedId?: string; // Reference to news/club/update
  clubId?: string; // For club-specific notifications
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}
