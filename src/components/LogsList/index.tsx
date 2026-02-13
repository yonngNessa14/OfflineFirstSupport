import React, {useMemo} from 'react';
import {View, Text, FlatList} from 'react-native';
import {Action} from '@/types';
import {useTheme} from '@theme';
import {createStyles} from './styles';

interface LogsListProps {
  actions: Action[];
  isLoading?: boolean;
}

export const LogsList: React.FC<LogsListProps> = ({
  actions,
  isLoading = false,
}) => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const formatTimestamp = (timestamp: number | null): string => {
    if (!timestamp) {
      return 'Not synced';
    }
    return new Date(timestamp).toLocaleString();
  };

  const renderItem = ({item}: {item: Action}) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View
          style={[
            styles.typeBadge,
            item.type === 'small' ? styles.smallBadge : styles.largeBadge,
          ]}>
          <Text
            style={[
              styles.typeBadgeText,
              item.type === 'small'
                ? styles.smallBadgeText
                : styles.largeBadgeText,
            ]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(item.synced_at)}</Text>
      </View>
      <Text style={styles.payload} numberOfLines={1}>
        {item.payload}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading ? 'Loading...' : 'No synced actions yet'}
      </Text>
      <Text style={styles.emptySubtext}>
        Press Small or Large to queue an action
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synced Actions</Text>
      <FlatList
        data={actions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          actions.length === 0 ? styles.emptyList : styles.list
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
