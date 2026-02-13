import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import {ActionButtons} from '@components';
import {ActionType} from '@/types';
import {ThemeProvider} from '@theme';
import * as actionRepository from '@database/actionRepository';
import {syncEngine} from '@services/syncEngine';

jest.mock('@database/actionRepository');
jest.mock('@services/syncEngine', () => ({
  syncEngine: {
    run: jest.fn(),
  },
}));

const mockInsertAction = actionRepository.insertAction as jest.MockedFunction<
  typeof actionRepository.insertAction
>;
const mockSyncEngineRun = syncEngine.run as jest.MockedFunction<
  typeof syncEngine.run
>;

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ActionButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInsertAction.mockResolvedValue({
      id: 'test-id',
      type: ActionType.Small,
      payload: 'test',
      status: 'pending' as any,
      priority: 1,
      retry_count: 0,
      created_at: Date.now(),
      synced_at: null,
    });
  });

  describe('Rendering', () => {
    it('should render Small button with correct text', () => {
      renderWithTheme(<ActionButtons />);

      expect(screen.getByText('Small')).toBeTruthy();
      expect(screen.getByText('Priority 1 • 500ms')).toBeTruthy();
    });

    it('should render Large button with correct text', () => {
      renderWithTheme(<ActionButtons />);

      expect(screen.getByText('Large')).toBeTruthy();
      expect(screen.getByText('Priority 2 • 2000ms')).toBeTruthy();
    });
  });

  describe('Small button press', () => {
    it('should insert small action when pressed', async () => {
      renderWithTheme(<ActionButtons />);

      const smallButton = screen.getByText('Small');
      fireEvent.press(smallButton);

      await waitFor(() => {
        expect(mockInsertAction).toHaveBeenCalledTimes(1);
        expect(mockInsertAction).toHaveBeenCalledWith(
          ActionType.Small,
          expect.stringContaining('Small action at'),
        );
      });
    });

    it('should trigger sync engine after inserting small action', async () => {
      renderWithTheme(<ActionButtons />);

      const smallButton = screen.getByText('Small');
      fireEvent.press(smallButton);

      await waitFor(() => {
        expect(mockSyncEngineRun).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onActionQueued callback after inserting small action', async () => {
      const onActionQueued = jest.fn();
      renderWithTheme(<ActionButtons onActionQueued={onActionQueued} />);

      const smallButton = screen.getByText('Small');
      fireEvent.press(smallButton);

      await waitFor(() => {
        expect(onActionQueued).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Large button press', () => {
    it('should insert large action when pressed', async () => {
      renderWithTheme(<ActionButtons />);

      const largeButton = screen.getByText('Large');
      fireEvent.press(largeButton);

      await waitFor(() => {
        expect(mockInsertAction).toHaveBeenCalledTimes(1);
        expect(mockInsertAction).toHaveBeenCalledWith(
          ActionType.Large,
          expect.stringContaining('Large action at'),
        );
      });
    });

    it('should trigger sync engine after inserting large action', async () => {
      renderWithTheme(<ActionButtons />);

      const largeButton = screen.getByText('Large');
      fireEvent.press(largeButton);

      await waitFor(() => {
        expect(mockSyncEngineRun).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onActionQueued callback after inserting large action', async () => {
      const onActionQueued = jest.fn();
      renderWithTheme(<ActionButtons onActionQueued={onActionQueued} />);

      const largeButton = screen.getByText('Large');
      fireEvent.press(largeButton);

      await waitFor(() => {
        expect(onActionQueued).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Without callback', () => {
    it('should not throw when onActionQueued is not provided', async () => {
      renderWithTheme(<ActionButtons />);

      const smallButton = screen.getByText('Small');

      await expect(async () => {
        fireEvent.press(smallButton);
        await waitFor(() => {
          expect(mockInsertAction).toHaveBeenCalled();
        });
      }).not.toThrow();
    });
  });

  describe('Multiple presses', () => {
    it('should handle multiple button presses', async () => {
      renderWithTheme(<ActionButtons />);

      const smallButton = screen.getByText('Small');
      const largeButton = screen.getByText('Large');

      fireEvent.press(smallButton);
      fireEvent.press(largeButton);
      fireEvent.press(smallButton);

      await waitFor(() => {
        expect(mockInsertAction).toHaveBeenCalledTimes(3);
        expect(mockSyncEngineRun).toHaveBeenCalledTimes(3);
      });
    });
  });
});
