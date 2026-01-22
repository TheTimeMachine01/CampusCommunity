import { Notification, NotificationType } from '../constants/types';
import { notificationsCache } from './storage';

/**
 * Centralized notification service for managing alerts lifecycle
 * - Generate notifications for sync events
 * - Manage read/unread status
 * - Persist notifications to cache
 */
class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string,
    clubId?: string
  ): Promise<Notification> {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      isRead: false,
      relatedId,
      clubId,
    };

    await notificationsCache.addNotification(notification);
    console.log('[NotificationService] Created notification:', notification);
    return notification;
  }

  /**
   * Notification for successful sync of offline action
   */
  async createSyncSuccessNotification(actionType: string, details: string): Promise<Notification> {
    return this.createNotification(
      'system',
      '✅ Sync Complete',
      `Your ${actionType} has been synced: ${details}`
    );
  }

  /**
   * Notification for new news
   */
  async createNewsNotification(
    title: string,
    author: string,
    newsId?: string
  ): Promise<Notification> {
    return this.createNotification(
      'news',
      '📰 New Announcement',
      `${author} posted: ${title}`,
      newsId
    );
  }

  /**
   * Notification for club update
   */
  async createClubNotification(
    clubName: string,
    updateTitle: string,
    clubId: string
  ): Promise<Notification> {
    return this.createNotification(
      'club',
      `🎭 ${clubName} Update`,
      updateTitle,
      undefined,
      clubId
    );
  }

  /**
   * Notification for admin broadcast
   */
  async createAdminNotification(title: string, message: string): Promise<Notification> {
    return this.createNotification('admin', `👑 ${title}`, message);
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await notificationsCache.markAsRead(notificationId);
    console.log('[NotificationService] Marked notification as read:', notificationId);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await notificationsCache.markAllAsRead();
    console.log('[NotificationService] Marked all notifications as read');
  }

  /**
   * Get all notifications
   */
  async getAll(): Promise<Notification[]> {
    const notifications = await notificationsCache.get();
    return notifications || [];
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const notifications = await this.getAll();
    return notifications.filter((n) => !n.isRead).length;
  }

  /**
   * Get notifications for user based on role
   */
  async getNotificationsForRole(role: string, clubId?: string): Promise<Notification[]> {
    const notifications = await this.getAll();

    if (role === 'admin') {
      // Admins see all notifications
      return notifications;
    }

    if (role === 'club_lead' && clubId) {
      // Club leads see system + their club notifications
      return notifications.filter(
        (n) => n.type === 'system' || n.type === 'news' || n.clubId === clubId
      );
    }

    if (role === 'student') {
      // Students see system, news, and club notifications they subscribed to
      return notifications.filter((n) => n.type !== 'admin');
    }

    // Guests see only public news
    return notifications.filter((n) => n.type === 'news' || n.type === 'system');
  }

  /**
   * Clear all notifications (admin only)
   */
  async clearAll(): Promise<void> {
    await notificationsCache.clear();
    console.log('[NotificationService] Cleared all notifications');
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
