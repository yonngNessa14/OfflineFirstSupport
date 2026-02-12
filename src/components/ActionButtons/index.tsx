import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {insertAction} from '../../database/actionRepository';
import {syncEngine} from '../../services/syncEngine';
import {styles} from './styles';

interface ActionButtonsProps {
  onActionQueued?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onActionQueued,
}) => {
  const handleSmallPress = async () => {
    const timestamp = new Date().toISOString();
    await insertAction('small', `Small action at ${timestamp}`);

    if (onActionQueued) {
      onActionQueued();
    }

    syncEngine.run();
  };

  const handleLargePress = async () => {
    const timestamp = new Date().toISOString();
    await insertAction('large', `Large action at ${timestamp}`);

    if (onActionQueued) {
      onActionQueued();
    }

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
