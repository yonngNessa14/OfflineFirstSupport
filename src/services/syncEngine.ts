import {
  getPendingActionsOrdered,
  markAsCompleted,
  incrementRetry,
} from '../database/actionRepository';
import { sendAction } from './api';

const MAX_RETRY_COUNT = 5;

type SyncCallback = () => void;

class SyncEngine {
  private isSyncing: boolean = false;
  private isOnline: boolean = false;
  private onSyncComplete: SyncCallback | null = null;

  setOnSyncComplete(callback: SyncCallback): void {
    this.onSyncComplete = callback;
  }

  setOnline(status: boolean): void {
    this.isOnline = status;
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  async run(): Promise<void> {
    if (this.isSyncing) {
      return;
    }

    if (!this.isOnline) {
      return;
    }

    this.isSyncing = true;

    try {
      await this.processQueue();
    } catch (error) {
      console.error('[SyncEngine] Sync error:', error);
    } finally {
      this.isSyncing = false;

      if (this.onSyncComplete) {
        this.onSyncComplete();
      }
    }
  }

  private async processQueue(): Promise<void> {
    const pendingActions = await getPendingActionsOrdered();

    for (const action of pendingActions) {
      if (action.retry_count >= MAX_RETRY_COUNT) {
        continue;
      }

      try {
        await sendAction(action.type);
        await markAsCompleted(action.id);
      } catch (error) {
        console.error('[SyncEngine] Error sending action:', error);
        await incrementRetry(action.id);
        break;
      }
    }
  }
}

export const syncEngine = new SyncEngine();
