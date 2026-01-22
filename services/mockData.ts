import { NewsItem, Club, Update, User, Notification } from '../constants/types';

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Annual Tech Fest 2024 Registration Open',
    description: 'Join us for the biggest technology festival of the year featuring workshops, competitions, and networking opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    category: 'event',
    author: 'Tech Society',
    readCount: 245,
  },
  {
    id: '2',
    title: 'Campus Library Extended Hours',
    description: 'The main library will now be open 24/7 during exam periods to support student studies.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    timestamp: new Date('2024-01-14T14:30:00Z'),
    category: 'announcement',
    author: 'Library Services',
    readCount: 189,
  },
  {
    id: '3',
    title: 'Student Wins National Coding Competition',
    description: 'Congratulations to Sarah Johnson from Computer Science for winning first place in the National Coding Championship.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    timestamp: new Date('2024-01-13T16:45:00Z'),
    category: 'achievement',
    author: 'CS Department',
    readCount: 312,
  },
  {
    id: '4',
    title: 'New Sports Complex Opening Ceremony',
    description: 'Join us for the grand opening of our state-of-the-art sports complex with facilities for all major sports.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    timestamp: new Date('2024-01-12T09:00:00Z'),
    category: 'event',
    author: 'Sports Committee',
    readCount: 156,
  },
  {
    id: '5',
    title: 'Scholarship Applications Due Soon',
    description: 'Don\'t miss out on various scholarship opportunities. Application deadline is approaching fast.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    timestamp: new Date('2024-01-11T11:20:00Z'),
    category: 'announcement',
    author: 'Financial Aid Office',
    readCount: 278,
  },
];

export const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Computer Science Society',
    description: 'A community for CS students to share knowledge, collaborate on projects, and network.',
    memberCount: 245,
    isSubscribed: true,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
    category: 'technical',
    updates: [
      {
        id: '1',
        title: 'Weekly Coding Challenge',
        content: 'This week\'s challenge: Implement a binary search tree with O(log n) operations.',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        type: 'event',
      },
      {
        id: '2',
        title: 'Guest Speaker: AI in Healthcare',
        content: 'Dr. Smith from Google will discuss the latest advances in AI applications in healthcare.',
        timestamp: new Date('2024-01-14T15:00:00Z'),
        type: 'announcement',
      },
    ],
  },
  {
    id: '2',
    name: 'Photography Club',
    description: 'Capture moments, learn techniques, and explore the art of photography.',
    memberCount: 89,
    isSubscribed: true,
    imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300',
    category: 'cultural',
    updates: [
      {
        id: '3',
        title: 'Photo Walk This Weekend',
        content: 'Join us for a photo walk around the campus gardens. Bring your cameras!',
        timestamp: new Date('2024-01-13T14:00:00Z'),
        type: 'event',
      },
    ],
  },
  {
    id: '3',
    name: 'Debate Society',
    description: 'Sharpen your argumentation skills and participate in competitive debates.',
    memberCount: 67,
    isSubscribed: false,
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32a7?w=300',
    category: 'academic',
    updates: [
      {
        id: '4',
        title: 'Inter-University Debate Competition',
        content: 'Registration is now open for the annual inter-university debate competition.',
        timestamp: new Date('2024-01-12T12:00:00Z'),
        type: 'event',
      },
    ],
  },
  {
    id: '4',
    name: 'Basketball Team',
    description: 'Join our competitive basketball team and represent the university.',
    memberCount: 23,
    isSubscribed: true,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300',
    category: 'sports',
    updates: [
      {
        id: '5',
        title: 'Championship Victory!',
        content: 'Congratulations to our team for winning the regional basketball championship!',
        timestamp: new Date('2024-01-10T18:00:00Z'),
        type: 'achievement',
      },
    ],
  },
];

// Mock Users for different roles
export const mockUsers: { [key: string]: User } = {
  'admin@campus.com': {
    id: 'admin_001',
    email: 'admin@campus.com',
    name: 'Admin User',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'admin',
  },
  'lead@campus.com': {
    id: 'lead_001',
    email: 'lead@campus.com',
    name: 'Club Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    role: 'club_lead',
    clubId: '1',
  },
  'test@example.com': {
    id: 'student_001',
    email: 'test@example.com',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    role: 'student',
  },
};

// Mock API delay function
export const mockDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Plan 4: Mock Notifications - Comprehensive Test Data
export const mockNotifications: Notification[] = [
  // ========== UNREAD NOTIFICATIONS (Recent) ==========
  {
    id: 'notif_1',
    type: 'system',
    title: '✅ Sync Complete',
    message: 'Your news post "Campus Tech Fest" has been synced successfully!',
    timestamp: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    isRead: false,
    relatedId: '1',
  },
  {
    id: 'notif_2',
    type: 'news',
    title: '📰 New Announcement',
    message: 'Tech Society posted: Annual Tech Fest 2024 Registration Open - Don\'t miss out!',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    isRead: false,
    relatedId: '1',
  },
  {
    id: 'notif_3',
    type: 'club',
    title: '🎭 Computer Science Society Update',
    message: 'Weekly Coding Challenge: Implement a binary search tree with O(log n) operations',
    timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
    isRead: false,
    clubId: '1',
  },
  {
    id: 'notif_4',
    type: 'system',
    title: '✅ Club Update Synced',
    message: 'Your club update "Guest Speaker Event" has been posted successfully!',
    timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    isRead: false,
    relatedId: 'club_1',
  },
  {
    id: 'notif_5',
    type: 'club',
    title: '🎭 Photography Club Update',
    message: 'Photo Walk This Weekend: Join us for a photo walk around campus gardens. Bring your cameras!',
    timestamp: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    isRead: false,
    clubId: '2',
  },

  // ========== READ NOTIFICATIONS (Last Hour) ==========
  {
    id: 'notif_6',
    type: 'news',
    title: '📰 New Announcement',
    message: 'Library Services: Campus Library Extended Hours - Open 24/7 during exam periods',
    timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    isRead: true,
    relatedId: '2',
  },
  {
    id: 'notif_7',
    type: 'admin',
    title: '👑 System Announcement',
    message: 'Scheduled maintenance on library systems will occur this weekend from 2-6 PM',
    timestamp: new Date(Date.now() - 1 * 3600000), // 1 hour ago
    isRead: true,
  },
  {
    id: 'notif_8',
    type: 'club',
    title: '🎭 Debate Society Update',
    message: 'Registration open for Inter-University Debate Competition - Deadline: Feb 15',
    timestamp: new Date(Date.now() - 1.5 * 3600000), // 1.5 hours ago
    isRead: true,
    clubId: '3',
  },

  // ========== OLDER NOTIFICATIONS ==========
  {
    id: 'notif_9',
    type: 'news',
    title: '📰 New Achievement',
    message: 'Congratulations to Sarah Johnson for winning the National Coding Championship!',
    timestamp: new Date(Date.now() - 3 * 3600000), // 3 hours ago
    isRead: true,
    relatedId: '3',
  },
  {
    id: 'notif_10',
    type: 'system',
    title: '✅ Subscription Confirmed',
    message: 'You have successfully subscribed to Basketball Team announcements',
    timestamp: new Date(Date.now() - 5 * 3600000), // 5 hours ago
    isRead: true,
  },
  {
    id: 'notif_11',
    type: 'club',
    title: '🎭 Basketball Team Achievement',
    message: 'Championship Victory! Our team won the regional basketball championship!',
    timestamp: new Date(Date.now() - 6 * 3600000), // 6 hours ago
    isRead: true,
    clubId: '4',
  },
  {
    id: 'notif_12',
    type: 'admin',
    title: '👑 Important Notice',
    message: 'Please update your profile information in Settings for accurate records',
    timestamp: new Date(Date.now() - 8 * 3600000), // 8 hours ago
    isRead: true,
  },
  {
    id: 'notif_13',
    type: 'news',
    title: '📰 New Event',
    message: 'Sports Complex Grand Opening Ceremony this Saturday at 10 AM - State-of-the-art facilities!',
    timestamp: new Date(Date.now() - 12 * 3600000), // 12 hours ago
    isRead: true,
    relatedId: '4',
  },
  {
    id: 'notif_14',
    type: 'system',
    title: '✅ Profile Updated',
    message: 'Your profile changes have been saved successfully',
    timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
    isRead: true,
  },
  {
    id: 'notif_15',
    type: 'news',
    title: '📰 Scholarship Opportunity',
    message: 'Don\'t miss out on various scholarship opportunities. Application deadline approaching fast!',
    timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
    isRead: true,
    relatedId: '5',
  },
  {
    id: 'notif_16',
    type: 'club',
    title: '🎭 Art Club Monthly Exhibition',
    message: 'Join us for our monthly art exhibition - Showcase your creative works!',
    timestamp: new Date(Date.now() - 3 * 24 * 3600000), // 3 days ago
    isRead: true,
    clubId: '5',
  },
];

/**
 * Create mock notification for demonstration
 * Usage: Call this function to add a new mock notification
 */
export const createMockNotification = (
  type: 'system' | 'news' | 'club' | 'admin' = 'system',
  title: string = '📢 New Notification',
  message: string = 'This is a test notification'
): Notification => {
  return {
    id: `notif_${Date.now()}_${Math.random()}`,
    type,
    title,
    message,
    timestamp: new Date(),
    isRead: false,
  };
};

