import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Colors from '../constants/colors';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  variant?: 'default' | 'light' | 'dark';
  noPadding?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 40,
  variant = 'default',
  noPadding = false,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'light':
        return 'rgba(255, 255, 255, 0.15)';
      case 'dark':
        return 'rgba(0, 0, 0, 0.3)';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
        },
        noPadding && styles.noPadding,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  noPadding: {
    padding: 0,
  },
});

export default GlassCard;
