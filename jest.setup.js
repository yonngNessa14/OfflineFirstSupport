/* eslint-disable no-undef */
// Jest matchers are built-in with @testing-library/react-native v12.4+

// Mock react-native-sqlite-storage
jest.mock('react-native-sqlite-storage', () => {
  const mockExecuteSql = jest.fn().mockResolvedValue([{rows: {length: 0, item: jest.fn()}}]);
  const mockDb = {
    executeSql: mockExecuteSql,
    close: jest.fn().mockResolvedValue(undefined),
  };

  return {
    DEBUG: jest.fn(),
    enablePromise: jest.fn(),
    openDatabase: jest.fn().mockResolvedValue(mockDb),
    __mockDb: mockDb,
    __mockExecuteSql: mockExecuteSql,
  };
});

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn().mockResolvedValue({isConnected: true}),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: ({children, style}) =>
      React.createElement('View', {style}, children),
    useSafeAreaInsets: () => ({top: 0, right: 0, bottom: 0, left: 0}),
  };
});

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
