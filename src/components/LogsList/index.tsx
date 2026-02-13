import React, {useMemo, Fragment} from 'react';
import {View, Text, FlatList} from 'react-native';
import {
  Action,
  ActionType,
  ActionStatus,
  ActionTypeLabel,
  ActionStatusLabel,
} from '@/types';
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

  const formatTimestamp = (action: Action): string => {
    if (action.status === ActionStatus.Pending) {
      return new Date(action.created_at).toLocaleString();
    }
    if (action.synced_at) {
      return new Date(action.synced_at).toLocaleString();
    }
    return 'Unknown';
  };

  const renderItem = ({item}: {item: Action}) => {
    const isPending = item.status === ActionStatus.Pending;
    const isSmall = item.type === ActionType.Small;

    return (
      <View style={[styles.logItem, isPending && styles.logItemPending]}>
        <View style={styles.logHeader}>
          <View style={styles.badgesContainer}>
            <View
              style={[
                styles.typeBadge,
                isSmall ? styles.smallBadge : styles.largeBadge,
              ]}>
              <Text
                style={[
                  styles.typeBadgeText,
                  isSmall ? styles.smallBadgeText : styles.largeBadgeText,
                ]}>
                {ActionTypeLabel[item.type]}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                isPending ? styles.pendingBadge : styles.syncedBadge,
              ]}>
              <Text
                style={[
                  styles.statusBadgeText,
                  isPending ? styles.pendingBadgeText : styles.syncedBadgeText,
                ]}>
                {ActionStatusLabel[item.status]}
              </Text>
            </View>
          </View>
          <Text style={styles.timestamp}>{formatTimestamp(item)}</Text>
        </View>
        <Text style={styles.payload} numberOfLines={1}>
          {item.payload}
        </Text>
        {isPending && item.retry_count > 0 && (
          <Text style={styles.retryText}>
            Retry attempt: {item.retry_count}
          </Text>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading ? 'Loading...' : 'No actions yet'}
      </Text>
      <Text style={styles.emptySubtext}>
        Press Small or Large to queue an action
      </Text>
    </View>
  );

  const pendingCount = actions.filter(
    a => a.status === ActionStatus.Pending,
  ).length;
  const syncedCount = actions.filter(
    a => a.status === ActionStatus.Completed,
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Actions</Text>
        {actions.length > 0 && (
          <Text style={styles.countText}>
            {[
              pendingCount > 0 && `${pendingCount} pending`,
              syncedCount > 0 && `${syncedCount} synced`,
            ]
              .filter(Boolean)
              .map((text, index, arr) => (
                <Fragment key={text as string}>
                  {text}
                  {index < arr.length - 1 && ' • '}
                </Fragment>
              ))}
          </Text>
        )}
      </View>
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
