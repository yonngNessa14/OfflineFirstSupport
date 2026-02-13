import {sendSmall, sendLarge, sendAction} from '@services/api';

describe('API Service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('sendSmall', () => {
    it('should resolve after 500ms delay', async () => {
      const promise = sendSmall();

      // Should not resolve immediately
      jest.advanceTimersByTime(499);
      expect(jest.getTimerCount()).toBe(1);

      // Should resolve after 500ms
      jest.advanceTimersByTime(1);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('sendLarge', () => {
    it('should resolve after 2000ms delay', async () => {
      const promise = sendLarge();

      // Should not resolve at 1999ms
      jest.advanceTimersByTime(1999);
      expect(jest.getTimerCount()).toBe(1);

      // Should resolve after 2000ms
      jest.advanceTimersByTime(1);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('sendAction', () => {
    it('should call sendSmall for small type', async () => {
      const promise = sendAction('small');

      jest.advanceTimersByTime(500);
      await expect(promise).resolves.toBeUndefined();
    });

    it('should call sendLarge for large type', async () => {
      const promise = sendAction('large');

      // Should not resolve at 500ms (small delay)
      jest.advanceTimersByTime(500);
      expect(jest.getTimerCount()).toBe(1);

      // Should resolve at 2000ms (large delay)
      jest.advanceTimersByTime(1500);
      await expect(promise).resolves.toBeUndefined();
    });
  });
});
