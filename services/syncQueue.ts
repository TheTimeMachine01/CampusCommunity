import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsItem, Club } from '../constants/types';
import { notificationService } from './notificationService';

export type PendingActionType = 'CREATE_NEWS' | 'UPDATE_CLUB' | 'SUBSCRIBE_CLUB' | 'UNSUBSCRIBE_CLUB';

export interface PendingAction {
  id: string;
  type: PendingActionType;
  timestamp: number;
  payload: any;
  retryCount: number;
}

class SyncQueueManager {
  private queue: PendingAction[] = [];
  private readonly QUEUE_KEY = '@sync_queue';

  /**
   * Initialize queue from persistent storage
   */
  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  /**
   * Add action to queue (offline or immediate if online)
   */
  async addAction(
    type: PendingActionType,
    payload: any,
    shouldProcess: boolean = false
  ): Promise<void> {
    const action: PendingAction = {
      id: `${type}_${Date.now()}`,
      type,
      timestamp: Date.now(),
      payload,
      retryCount: 0,
    };

    this.queue.push(action);
    await this.persist();

    console.log(`[SyncQueue] Added action: ${type}`, action);
  }

  /**
   * Remove action from queue
   */
  async removeAction(actionId: string): Promise<void> {
    this.queue = this.queue.filter(a => a.id !== actionId);
    await this.persist();
    console.log(`[SyncQueue] Removed action: ${actionId}`);
  }

  /**
   * Process all pending actions
   * Uses Last-Write-Wins strategy for conflicts
   * Creates notifications on successful sync
   */
  async processPendingActions(
    apiCall: (action: PendingAction) => Promise<boolean>
  ): Promise<{ succeeded: number; failed: number }> {
    let succeeded = 0;
    let failed = 0;

    console.log(`[SyncQueue] Processing ${this.queue.length} pending actions`);

    for (const action of [...this.queue]) {
      try {
        const success = await apiCall(action);
        if (success) {
          await this.removeAction(action.id);
          succeeded++;

          // Create sync success notification
          try {
            const actionLabel = this.getActionLabel(action.type);
            await notificationService.createSyncSuccessNotification(
              actionLabel,
              action.payload?.title || action.payload?.name || 'Item'
            );
          } catch (notifError) {
            console.warn('[SyncQueue] Failed to create notification:', notifError);
          }
        } else {
          action.retryCount++;
          if (action.retryCount > 3) {
            // Max retries exceeded
            console.warn(`[SyncQueue] Max retries exceeded for ${action.id}`);
            await this.removeAction(action.id);
          }
          failed++;
        }
      } catch (error) {
        console.error(`[SyncQueue] Error processing action ${action.id}:`, error);
        action.retryCount++;
        if (action.retryCount > 3) {
          await this.removeAction(action.id);
        }
        failed++;
      }
      await this.persist();
    }

    console.log(
      `[SyncQueue] Processing complete: ${succeeded} succeeded, ${failed} failed`
    );
    return { succeeded, failed };
  }

  /**
   * Get human-readable action label
   */
  private getActionLabel(type: PendingActionType): string {
    switch (type) {
      case 'CREATE_NEWS':
        return 'News post';
      case 'UPDATE_CLUB':
        return 'Club update';
      case 'SUBSCRIBE_CLUB':
        return 'Club subscription';
      case 'UNSUBSCRIBE_CLUB':
        return 'Club unsubscription';
      default:
        return 'Action';
    }
  }

  /**
   * Get all pending actions
   */
  getQueue(): PendingAction[] {
    return [...this.queue];
  }

  /**
   * Get pending action count
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Clear queue (use with caution)
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await this.persist();
    console.log('[SyncQueue] Queue cleared');
  }

  /**
   * Persist queue to storage
   */
  private async persist(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to persist sync queue:', error);
    }
  }
}

// Export singleton instance
export const syncQueue = new SyncQueueManager();
