import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDatabase } from '@database/db';
import { getAllActions } from '@database/actionRepository';
import { syncEngine } from '@services/syncEngine';
import { subscribeToNetwork, getNetworkState } from '@services/networkListener';
import { ActionButtons, LogsList } from '@components';
import { ThemeProvider, useTheme } from '@theme';
import { Action } from '@/types';

function AppContent(): React.JSX.Element {
  const { theme, isDark } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allActions, setAllActions] = useState<Action[]>([]);

  const refreshActions = useCallback(async () => {
    try {
      const actions = await getAllActions();
      setAllActions(actions);
    } catch (error) {
      console.error('[App] Error fetching actions:', error);
    }
  }, []);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    syncEngine.setOnline(true);
    syncEngine.run();
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    syncEngine.setOnline(false);
  }, []);

  const handleSyncComplete = useCallback(() => {
    refreshActions();
  }, [refreshActions]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await getDatabase();

        syncEngine.setOnSyncComplete(handleSyncComplete);

        const initialOnline = await getNetworkState();
        setIsOnline(initialOnline);
        syncEngine.setOnline(initialOnline);

        await refreshActions();

        setIsInitialized(true);

        if (initialOnline) {
          syncEngine.run();
        }
      } catch (error) {
        console.error('[App] Initialization error:', error);
      }
    };

    initialize();
  }, [refreshActions, handleSyncComplete]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const unsubscribe = subscribeToNetwork(handleOnline, handleOffline);

    return () => {
      unsubscribe();
    };
  }, [isInitialized, handleOnline, handleOffline]);

  const handleActionQueued = useCallback(() => {
    // Refresh immediately to show the new pending action
    refreshActions();
  }, [refreshActions]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshActions();
    // Also trigger sync if online
    if (isOnline) {
      syncEngine.run();
    }
    setIsRefreshing(false);
  }, [refreshActions, isOnline]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Offline Sync Demo
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isOnline
                    ? theme.colors.status.online
                    : theme.colors.status.offline,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <ActionButtons onActionQueued={handleActionQueued} />

        <LogsList
          actions={allActions}
          isLoading={!isInitialized}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
  },
});

export default App;
