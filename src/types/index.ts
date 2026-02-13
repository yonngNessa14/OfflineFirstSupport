export enum ActionType {
  Small = 'small',
  Large = 'large',
}

export enum ActionStatus {
  Pending = 'pending',
  Completed = 'completed',
}

export const ActionTypeLabel: Record<ActionType, string> = {
  [ActionType.Small]: 'SMALL',
  [ActionType.Large]: 'LARGE',
};

export const ActionStatusLabel: Record<ActionStatus, string> = {
  [ActionStatus.Pending]: 'PENDING',
  [ActionStatus.Completed]: 'SYNCED',
};

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
