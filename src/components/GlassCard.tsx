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
        return Colors.glass.backgroundLight;
      case 'dark':
        return Colors.glass.backgroundDark;
      default:
        return Colors.glass.background;
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
    borderColor: Colors.glass.border,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  noPadding: {
    padding: 0,
  },
});

export default GlassCard;
