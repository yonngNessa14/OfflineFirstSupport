export type ActionType = 'small' | 'large';
export type ActionStatus = 'pending' | 'completed';

export interface Action {
  id: string;
  type: ActionType;
  payload: string;
  status: ActionStatus;
  priority: number;
  retry_count: number;
  created_at: number;
  synced_at: number | null;
}

export interface CreateActionParams {
  type: ActionType;
  payload: string;
}
