import {StyleSheet} from 'react-native';
import {Theme} from '@theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    countText: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    list: {
      paddingBottom: 20,
    },
    emptyList: {
      flex: 1,
      justifyContent: 'center',
    },
    logItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      shadowColor: theme.colors.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    logItemPending: {
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.status.pending.text,
    },
    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    badgesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    typeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    smallBadge: {
      backgroundColor: theme.colors.badge.small.background,
    },
    largeBadge: {
      backgroundColor: theme.colors.badge.large.background,
    },
    typeBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.badge.small.text,
    },
    smallBadgeText: {
      color: theme.colors.badge.small.text,
    },
    largeBadgeText: {
      color: theme.colors.badge.large.text,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    pendingBadge: {
      backgroundColor: theme.colors.status.pending.background,
    },
    syncedBadge: {
      backgroundColor: theme.colors.status.synced.background,
    },
    statusBadgeText: {
      fontSize: 9,
      fontWeight: '700',
    },
    pendingBadgeText: {
      color: theme.colors.status.pending.text,
    },
    syncedBadgeText: {
      color: theme.colors.status.synced.text,
    },
    timestamp: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    payload: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    retryText: {
      fontSize: 11,
      color: theme.colors.status.pending.text,
      marginTop: 6,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.colors.text.disabled,
    },
  });
