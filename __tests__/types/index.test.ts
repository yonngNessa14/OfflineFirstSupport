import {
  ActionType,
  ActionStatus,
  ActionTypeLabel,
  ActionStatusLabel,
} from '@/types';

describe('ActionType enum', () => {
  it('should have correct values', () => {
    expect(ActionType.Small).toBe('small');
    expect(ActionType.Large).toBe('large');
  });

  it('should have exactly 2 action types', () => {
    const types = Object.values(ActionType);
    expect(types).toHaveLength(2);
    expect(types).toContain('small');
    expect(types).toContain('large');
  });
});

describe('ActionStatus enum', () => {
  it('should have correct values', () => {
    expect(ActionStatus.Pending).toBe('pending');
    expect(ActionStatus.Completed).toBe('completed');
  });

  it('should have exactly 2 statuses', () => {
    const statuses = Object.values(ActionStatus);
    expect(statuses).toHaveLength(2);
    expect(statuses).toContain('pending');
    expect(statuses).toContain('completed');
  });
});

describe('ActionTypeLabel', () => {
  it('should return correct labels for action types', () => {
    expect(ActionTypeLabel[ActionType.Small]).toBe('SMALL');
    expect(ActionTypeLabel[ActionType.Large]).toBe('LARGE');
  });

  it('should have labels for all action types', () => {
    Object.values(ActionType).forEach(type => {
      expect(ActionTypeLabel[type]).toBeDefined();
      expect(typeof ActionTypeLabel[type]).toBe('string');
    });
  });
});

describe('ActionStatusLabel', () => {
  it('should return correct labels for action statuses', () => {
    expect(ActionStatusLabel[ActionStatus.Pending]).toBe('PENDING');
    expect(ActionStatusLabel[ActionStatus.Completed]).toBe('SYNCED');
  });

  it('should have labels for all action statuses', () => {
    Object.values(ActionStatus).forEach(status => {
      expect(ActionStatusLabel[status]).toBeDefined();
      expect(typeof ActionStatusLabel[status]).toBe('string');
    });
  });
});
