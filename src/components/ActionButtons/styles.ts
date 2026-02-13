import {StyleSheet} from 'react-native';
import {Theme} from '@theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 16,
    },
    button: {
      flex: 1,
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    smallButton: {
      backgroundColor: theme.colors.button.small.background,
    },
    largeButton: {
      backgroundColor: theme.colors.button.large.background,
    },
    buttonText: {
      color: theme.colors.button.small.text,
      fontSize: 18,
      fontWeight: '600',
    },
    buttonSubtext: {
      color: theme.colors.button.small.text,
      opacity: 0.8,
      fontSize: 12,
      marginTop: 4,
    },
  });
