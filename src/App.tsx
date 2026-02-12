import React, {useEffect, useState, useCallback} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getDatabase} from './database/db';
import {getCompletedActions} from './database/actionRepository';
import {syncEngine} from './services/syncEngine';
import {
  subscribeToNetwork,
  getNetworkState,
} from './services/networkListener';
import {ActionButtons, LogsList} from './components';
import {Action} from './types';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [completedActions, setCompletedActions] = useState<Action[]>([]);

  const refreshCompletedActions = useCallback(async () => {
    try {
      const actions = await getCompletedActions();
      setCompletedActions(actions);
    } catch (error) {
      console.error('[App] Error fetching completed actions:', error);
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

  useEffect(() => {
    const initialize = async () => {
      try {
        await getDatabase();

        syncEngine.setOnSyncComplete(() => {
          refreshCompletedActions();
        });

        const initialOnline = await getNetworkState();
        setIsOnline(initialOnline);
        syncEngine.setOnline(initialOnline);

        await refreshCompletedActions();

        setIsInitialized(true);

        if (initialOnline) {
          syncEngine.run();
        }
      } catch (error) {
        console.error('[App] Initialization error:', error);
      }
    };

    initialize();
  }, [refreshCompletedActions]);

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
    setTimeout(() => {
      refreshCompletedActions();
    }, 100);
  }, [refreshCompletedActions]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.textLight]}>
            Offline Sync Demo
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                isOnline ? styles.statusOnline : styles.statusOffline,
              ]}
            />
            <Text style={[styles.statusText, isDarkMode && styles.textLight]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <ActionButtons onActionQueued={handleActionQueued} />

        <LogsList actions={completedActions} isLoading={!isInitialized} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    color: '#333',
  },
  textLight: {
    color: '#fff',
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
  statusOnline: {
    backgroundColor: '#4CAF50',
  },
  statusOffline: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
});

export default App;
