import {Action, ActionType, ActionStatus} from '@/types';
import {getDatabase} from '@database/db';

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.trunc(Math.random() * 16);
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const ActionPriority: Record<ActionType, number> = {
  [ActionType.Small]: 1,
  [ActionType.Large]: 2,
};

export const insertAction = async (
  type: ActionType,
  payload: string,
): Promise<Action> => {
  const db = await getDatabase();

  const action: Action = {
    id: generateUUID(),
    type,
    payload,
    status: ActionStatus.Pending,
    priority: ActionPriority[type],
    retry_count: 0,
    created_at: Date.now(),
    synced_at: null,
  };

  await db.executeSql(
    `INSERT INTO actions (id, type, payload, status, priority, retry_count, created_at, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      action.id,
      action.type,
      action.payload,
      action.status,
      action.priority,
      action.retry_count,
      action.created_at,
      action.synced_at,
    ],
  );

  return action;
};

export const getPendingActionsOrdered = async (): Promise<Action[]> => {
  const db = await getDatabase();

  const [results] = await db.executeSql(
    `SELECT * FROM actions 
     WHERE status = 'pending' 
     ORDER BY priority ASC, created_at ASC`,
  );

  const actions: Action[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    actions.push(results.rows.item(i) as Action);
  }

  return actions;
};

export const markAsCompleted = async (id: string): Promise<void> => {
  const db = await getDatabase();

  await db.executeSql(
    `UPDATE actions 
     SET status = ?, synced_at = ? 
     WHERE id = ?`,
    [ActionStatus.Completed, Date.now(), id],
  );
};

export const incrementRetry = async (id: string): Promise<void> => {
  const db = await getDatabase();

  await db.executeSql(
    `UPDATE actions 
     SET retry_count = retry_count + 1 
     WHERE id = ?`,
    [id],
  );
};

export const getCompletedActions = async (): Promise<Action[]> => {
  const db = await getDatabase();

  const [results] = await db.executeSql(
    `SELECT * FROM actions 
     WHERE status = 'completed' 
     ORDER BY synced_at DESC`,
  );

  const actions: Action[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    actions.push(results.rows.item(i) as Action);
  }

  return actions;
};

export const getAllActions = async (): Promise<Action[]> => {
  const db = await getDatabase();

  // Order: pending actions first (by priority, then created_at), then completed (by synced_at desc)
  const [results] = await db.executeSql(
    `SELECT * FROM actions 
     ORDER BY 
       CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
       CASE WHEN status = 'pending' THEN priority END ASC,
       CASE WHEN status = 'pending' THEN created_at END ASC,
       CASE WHEN status = 'completed' THEN synced_at END DESC`,
  );

  const actions: Action[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    actions.push(results.rows.item(i) as Action);
  }

  return actions;
};

export const getRetryCount = async (id: string): Promise<number> => {
  const db = await getDatabase();

  const [results] = await db.executeSql(
    `SELECT retry_count FROM actions WHERE id = ?`,
    [id],
  );

  if (results.rows.length > 0) {
    return results.rows.item(0).retry_count;
  }

  return 0;
};
