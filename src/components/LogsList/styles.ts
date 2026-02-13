import {StyleSheet} from 'react-native';
import {Theme} from '@theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: theme.colors.text.primary,
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
    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
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
    timestamp: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    payload: {
      fontSize: 14,
      color: theme.colors.text.secondary,
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
