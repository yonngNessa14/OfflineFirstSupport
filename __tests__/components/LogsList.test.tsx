import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {LogsList} from '@components';
import {Action, ActionType, ActionStatus} from '@/types';
import {ThemeProvider} from '@theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const createMockAction = (overrides: Partial<Action> = {}): Action => ({
  id: 'test-id',
  type: ActionType.Small,
  payload: 'Test payload',
  status: ActionStatus.Pending,
  priority: 1,
  retry_count: 0,
  created_at: 1700000000000,
  synced_at: null,
  ...overrides,
});

describe('LogsList', () => {
  describe('Empty state', () => {
    it('should show loading text when isLoading is true', () => {
      renderWithTheme(<LogsList actions={[]} isLoading={true} />);

      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('should show empty message when no actions and not loading', () => {
      renderWithTheme(<LogsList actions={[]} isLoading={false} />);

      expect(screen.getByText('No actions yet')).toBeTruthy();
      expect(
        screen.getByText('Press Small or Large to queue an action'),
      ).toBeTruthy();
    });
  });

  describe('With actions', () => {
    it('should render pending action with correct badges', () => {
      const action = createMockAction({
        id: '1',
        type: ActionType.Small,
        status: ActionStatus.Pending,
        payload: 'Test small action',
      });

      renderWithTheme(<LogsList actions={[action]} />);

      expect(screen.getByText('SMALL')).toBeTruthy();
      expect(screen.getByText('PENDING')).toBeTruthy();
      expect(screen.getByText('Test small action')).toBeTruthy();
    });

    it('should render completed action with SYNCED badge', () => {
      const action = createMockAction({
        id: '1',
        type: ActionType.Large,
        status: ActionStatus.Completed,
        payload: 'Test large action',
        synced_at: 1700000000000,
      });

      renderWithTheme(<LogsList actions={[action]} />);

      expect(screen.getByText('LARGE')).toBeTruthy();
      expect(screen.getByText('SYNCED')).toBeTruthy();
      expect(screen.getByText('Test large action')).toBeTruthy();
    });

    it('should show retry count for pending actions with retries', () => {
      const action = createMockAction({
        id: '1',
        status: ActionStatus.Pending,
        retry_count: 3,
      });

      renderWithTheme(<LogsList actions={[action]} />);

      expect(screen.getByText('Retry attempt: 3')).toBeTruthy();
    });

    it('should not show retry count when retry_count is 0', () => {
      const action = createMockAction({
        id: '1',
        status: ActionStatus.Pending,
        retry_count: 0,
      });

      renderWithTheme(<LogsList actions={[action]} />);

      expect(screen.queryByText(/Retry attempt/)).toBeNull();
    });

    it('should not show retry count for completed actions', () => {
      const action = createMockAction({
        id: '1',
        status: ActionStatus.Completed,
        retry_count: 2,
        synced_at: 1700000000000,
      });

      renderWithTheme(<LogsList actions={[action]} />);

      expect(screen.queryByText(/Retry attempt/)).toBeNull();
    });
  });

  describe('Count display', () => {
    it('should show pending count when there are pending actions', () => {
      const actions = [
        createMockAction({id: '1', status: ActionStatus.Pending}),
        createMockAction({id: '2', status: ActionStatus.Pending}),
      ];

      renderWithTheme(<LogsList actions={actions} />);

      expect(screen.getByText(/2 pending/)).toBeTruthy();
    });

    it('should show synced count when there are completed actions', () => {
      const actions = [
        createMockAction({
          id: '1',
          status: ActionStatus.Completed,
          synced_at: 1700000000000,
        }),
        createMockAction({
          id: '2',
          status: ActionStatus.Completed,
          synced_at: 1700000000000,
        }),
        createMockAction({
          id: '3',
          status: ActionStatus.Completed,
          synced_at: 1700000000000,
        }),
      ];

      renderWithTheme(<LogsList actions={actions} />);

      expect(screen.getByText(/3 synced/)).toBeTruthy();
    });

    it('should show both counts when there are pending and completed actions', () => {
      const actions = [
        createMockAction({id: '1', status: ActionStatus.Pending}),
        createMockAction({
          id: '2',
          status: ActionStatus.Completed,
          synced_at: 1700000000000,
        }),
      ];

      renderWithTheme(<LogsList actions={actions} />);

      expect(screen.getByText(/1 pending/)).toBeTruthy();
      expect(screen.getByText(/1 synced/)).toBeTruthy();
    });

    it('should not show count text when no actions', () => {
      renderWithTheme(<LogsList actions={[]} />);

      expect(screen.queryByText(/pending/)).toBeNull();
      expect(screen.queryByText(/synced/)).toBeNull();
    });
  });

  describe('Multiple actions', () => {
    it('should render all actions in the list', () => {
      const actions = [
        createMockAction({id: '1', payload: 'First action'}),
        createMockAction({id: '2', payload: 'Second action'}),
        createMockAction({id: '3', payload: 'Third action'}),
      ];

      renderWithTheme(<LogsList actions={actions} />);

      expect(screen.getByText('First action')).toBeTruthy();
      expect(screen.getByText('Second action')).toBeTruthy();
      expect(screen.getByText('Third action')).toBeTruthy();
    });
  });
});
