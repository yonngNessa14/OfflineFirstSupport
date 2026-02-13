import React, {useMemo} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {insertAction} from '@database/actionRepository';
import {syncEngine} from '@services/syncEngine';
import {useTheme} from '@theme';
import {ActionType} from '@/types';
import {createStyles} from './styles';

interface ActionButtonsProps {
  onActionQueued?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onActionQueued,
}) => {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleSmallPress = async () => {
    const timestamp = new Date().toISOString();
    await insertAction(ActionType.Small, `Small action at ${timestamp}`);

    onActionQueued?.();
    syncEngine.run();
  };

  const handleLargePress = async () => {
    const timestamp = new Date().toISOString();
    await insertAction(ActionType.Large, `Large action at ${timestamp}`);

    onActionQueued?.();
    syncEngine.run();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.smallButton]}
        onPress={handleSmallPress}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>Small</Text>
        <Text style={styles.buttonSubtext}>Priority 1 • 500ms</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.largeButton]}
        onPress={handleLargePress}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>Large</Text>
        <Text style={styles.buttonSubtext}>Priority 2 • 2000ms</Text>
      </TouchableOpacity>
    </View>
  );
};
