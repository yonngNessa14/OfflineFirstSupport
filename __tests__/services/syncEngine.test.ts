import { syncEngine } from '@services/syncEngine';
import * as actionRepository from '@database/actionRepository';
import * as api from '@services/api';
import { ActionType, ActionStatus } from '@/types';

// Mock dependencies
jest.mock('@database/actionRepository');
jest.mock('@services/api');

const mockActionRepository = actionRepository as jest.Mocked<
  typeof actionRepository
>;
const mockApi = api as jest.Mocked<typeof api>;

describe('SyncEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset sync engine state
    syncEngine.setOnline(false);
    syncEngine.setOnSyncComplete(() => {});
  });

  describe('setOnline / getOnlineStatus', () => {
    it('should set and get online status', () => {
      expect(syncEngine.getOnlineStatus()).toBe(false);

      syncEngine.setOnline(true);
      expect(syncEngine.getOnlineStatus()).toBe(true);

      syncEngine.setOnline(false);
      expect(syncEngine.getOnlineStatus()).toBe(false);
    });
  });

  describe('setOnSyncComplete', () => {
    it('should set callback and call it after sync completes', async () => {
      const callback = jest.fn();
      syncEngine.setOnSyncComplete(callback);
      syncEngine.setOnline(true);

      mockActionRepository.getPendingActionsOrdered.mockResolvedValue([]);

      await syncEngine.run();

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('run', () => {
    it('should not sync when offline', async () => {
      syncEngine.setOnline(false);

      await syncEngine.run();

      expect(
        mockActionRepository.getPendingActionsOrdered,
      ).not.toHaveBeenCalled();
    });

    it('should sync when online', async () => {
      syncEngine.setOnline(true);
      mockActionRepository.getPendingActionsOrdered.mockResolvedValue([]);

      await syncEngine.run();

      expect(
        mockActionRepository.getPendingActionsOrdered,
      ).toHaveBeenCalledTimes(1);
    });

    it('should process pending actions in order', async () => {
      syncEngine.setOnline(true);

      const mockActions = [
        {
          id: '1',
          type: ActionType.Small,
          payload: 'test1',
          status: ActionStatus.Pending,
          priority: 1,
          retry_count: 0,
          created_at: Date.now(),
          synced_at: null,
        },
        {
          id: '2',
          type: ActionType.Large,
          payload: 'test2',
          status: ActionStatus.Pending,
          priority: 2,
          retry_count: 0,
          created_at: Date.now(),
          synced_at: null,
        },
      ];

      mockActionRepository.getPendingActionsOrdered.mockResolvedValue(
        mockActions,
      );
      mockApi.sendAction.mockResolvedValue(undefined);
      mockActionRepository.markAsCompleted.mockResolvedValue(undefined);

      await syncEngine.run();

      expect(mockApi.sendAction).toHaveBeenCalledTimes(2);
      expect(mockApi.sendAction).toHaveBeenNthCalledWith(1, ActionType.Small);
      expect(mockApi.sendAction).toHaveBeenNthCalledWith(2, ActionType.Large);
      expect(mockActionRepository.markAsCompleted).toHaveBeenCalledTimes(2);
      expect(mockActionRepository.markAsCompleted).toHaveBeenNthCalledWith(
        1,
        '1',
      );
      expect(mockActionRepository.markAsCompleted).toHaveBeenNthCalledWith(
        2,
        '2',
      );
    });

    it('should skip actions that exceeded max retry count', async () => {
      syncEngine.setOnline(true);

      const mockActions = [
        {
          id: '1',
          type: ActionType.Small,
          payload: 'test1',
          status: ActionStatus.Pending,
          priority: 1,
          retry_count: 5, // Max retry count reached
          created_at: Date.now(),
          synced_at: null,
        },
        {
          id: '2',
          type: ActionType.Large,
          payload: 'test2',
          status: ActionStatus.Pending,
          priority: 2,
          retry_count: 0,
          created_at: Date.now(),
          synced_at: null,
        },
      ];

      mockActionRepository.getPendingActionsOrdered.mockResolvedValue(
        mockActions,
      );
      mockApi.sendAction.mockResolvedValue(undefined);
      mockActionRepository.markAsCompleted.mockResolvedValue(undefined);

      await syncEngine.run();

      // Should only process the second action
      expect(mockApi.sendAction).toHaveBeenCalledTimes(1);
      expect(mockApi.sendAction).toHaveBeenCalledWith(ActionType.Large);
      expect(mockActionRepository.markAsCompleted).toHaveBeenCalledTimes(1);
      expect(mockActionRepository.markAsCompleted).toHaveBeenCalledWith('2');
    });

    it('should increment retry count and stop on failure', async () => {
      syncEngine.setOnline(true);

      const mockActions = [
        {
          id: '1',
          type: ActionType.Small,
          payload: 'test1',
          status: ActionStatus.Pending,
          priority: 1,
          retry_count: 0,
          created_at: Date.now(),
          synced_at: null,
        },
        {
          id: '2',
          type: ActionType.Large,
          payload: 'test2',
          status: ActionStatus.Pending,
          priority: 2,
          retry_count: 0,
          created_at: Date.now(),
          synced_at: null,
        },
      ];

      mockActionRepository.getPendingActionsOrdered.mockResolvedValue(
        mockActions,
      );
      mockApi.sendAction.mockRejectedValueOnce(new Error('Network error'));
      mockActionRepository.incrementRetry.mockResolvedValue(undefined);

      await syncEngine.run();

      // Should stop after first failure
      expect(mockApi.sendAction).toHaveBeenCalledTimes(1);
      expect(mockActionRepository.incrementRetry).toHaveBeenCalledWith('1');
      expect(mockActionRepository.markAsCompleted).not.toHaveBeenCalled();
    });

    it('should not run multiple syncs concurrently', async () => {
      syncEngine.setOnline(true);

      mockActionRepository.getPendingActionsOrdered.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100)),
      );

      // Start two syncs at the same time
      const sync1 = syncEngine.run();
      const sync2 = syncEngine.run();

      await Promise.all([sync1, sync2]);

      // Should only call getPendingActionsOrdered once
      expect(
        mockActionRepository.getPendingActionsOrdered,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
