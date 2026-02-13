import {ActionType, ActionStatus} from '@/types';
import {
  insertAction,
  getPendingActionsOrdered,
  markAsCompleted,
  incrementRetry,
  getCompletedActions,
  getAllActions,
  getRetryCount,
} from '@database/actionRepository';
import {getDatabase} from '@database/db';

jest.mock('@database/db');

const mockGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;

describe('actionRepository', () => {
  let mockExecuteSql: jest.Mock;
  let mockDb: {executeSql: jest.Mock};

  beforeEach(() => {
    jest.clearAllMocks();

    mockExecuteSql = jest.fn();
    mockDb = {executeSql: mockExecuteSql};
    mockGetDatabase.mockResolvedValue(mockDb as any);
  });

  describe('insertAction', () => {
    it('should insert a small action with correct priority', async () => {
      mockExecuteSql.mockResolvedValue([{rows: {length: 0}}]);

      const action = await insertAction(ActionType.Small, 'test payload');

      expect(action.type).toBe(ActionType.Small);
      expect(action.payload).toBe('test payload');
      expect(action.status).toBe(ActionStatus.Pending);
      expect(action.priority).toBe(1);
      expect(action.retry_count).toBe(0);
      expect(action.synced_at).toBeNull();
      expect(action.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );

      expect(mockExecuteSql).toHaveBeenCalledTimes(1);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO actions'),
        expect.arrayContaining([
          action.id,
          ActionType.Small,
          'test payload',
          ActionStatus.Pending,
          1,
          0,
        ]),
      );
    });

    it('should insert a large action with correct priority', async () => {
      mockExecuteSql.mockResolvedValue([{rows: {length: 0}}]);

      const action = await insertAction(ActionType.Large, 'large payload');

      expect(action.type).toBe(ActionType.Large);
      expect(action.priority).toBe(2);

      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO actions'),
        expect.arrayContaining([ActionType.Large, 'large payload', 2]),
      );
    });
  });

  describe('getPendingActionsOrdered', () => {
    it('should return pending actions ordered by priority and created_at', async () => {
      const mockActions = [
        {
          id: '1',
          type: ActionType.Small,
          status: ActionStatus.Pending,
          priority: 1,
        },
        {
          id: '2',
          type: ActionType.Large,
          status: ActionStatus.Pending,
          priority: 2,
        },
      ];

      mockExecuteSql.mockResolvedValue([
        {
          rows: {
            length: mockActions.length,
            item: (index: number) => mockActions[index],
          },
        },
      ]);

      const actions = await getPendingActionsOrdered();

      expect(actions).toHaveLength(2);
      expect(actions[0].id).toBe('1');
      expect(actions[1].id).toBe('2');
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining("WHERE status = 'pending'"),
      );
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY priority ASC, created_at ASC'),
      );
    });

    it('should return empty array when no pending actions', async () => {
      mockExecuteSql.mockResolvedValue([
        {
          rows: {
            length: 0,
            item: () => null,
          },
        },
      ]);

      const actions = await getPendingActionsOrdered();

      expect(actions).toHaveLength(0);
    });
  });

  describe('markAsCompleted', () => {
    it('should update action status to completed with synced_at timestamp', async () => {
      mockExecuteSql.mockResolvedValue([{rows: {length: 0}}]);

      const beforeTime = Date.now();
      await markAsCompleted('action-id');
      const afterTime = Date.now();

      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE actions'),
        expect.arrayContaining([ActionStatus.Completed, 'action-id']),
      );

      // Verify timestamp is within expected range
      const callArgs = mockExecuteSql.mock.calls[0][1];
      const syncedAt = callArgs[1];
      expect(syncedAt).toBeGreaterThanOrEqual(beforeTime);
      expect(syncedAt).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('incrementRetry', () => {
    it('should increment retry count for action', async () => {
      mockExecuteSql.mockResolvedValue([{rows: {length: 0}}]);

      await incrementRetry('action-id');

      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('retry_count = retry_count + 1'),
        ['action-id'],
      );
    });
  });

  describe('getCompletedActions', () => {
    it('should return completed actions ordered by synced_at DESC', async () => {
      const mockActions = [
        {id: '2', status: ActionStatus.Completed, synced_at: 2000},
        {id: '1', status: ActionStatus.Completed, synced_at: 1000},
      ];

      mockExecuteSql.mockResolvedValue([
        {
          rows: {
            length: mockActions.length,
            item: (index: number) => mockActions[index],
          },
        },
      ]);

      const actions = await getCompletedActions();

      expect(actions).toHaveLength(2);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining("WHERE status = 'completed'"),
      );
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY synced_at DESC'),
      );
    });
  });

  describe('getAllActions', () => {
    it('should return all actions with pending first, then completed', async () => {
      const mockActions = [
        {id: '1', status: ActionStatus.Pending, priority: 1},
        {id: '2', status: ActionStatus.Pending, priority: 2},
        {id: '3', status: ActionStatus.Completed, synced_at: 2000},
      ];

      mockExecuteSql.mockResolvedValue([
        {
          rows: {
            length: mockActions.length,
            item: (index: number) => mockActions[index],
          },
        },
      ]);

      const actions = await getAllActions();

      expect(actions).toHaveLength(3);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM actions'),
      );
    });
  });

  describe('getRetryCount', () => {
    it('should return retry count for existing action', async () => {
      mockExecuteSql.mockResolvedValue([
        {
          rows: {
            length: 1,
            item: () => ({retry_count: 3}),
          },
        },
      ]);

      const count = await getRetryCount('action-id');

      expect(count).toBe(3);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining('SELECT retry_count FROM actions'),
        ['action-id'],
      );
    });

    it('should return 0 for non-existing action', async () => {
      mockExecuteSql.mockResolvedValue([
        {
          rows: {
            length: 0,
            item: () => null,
          },
        },
      ]);

      const count = await getRetryCount('non-existing');

      expect(count).toBe(0);
    });
  });
});
