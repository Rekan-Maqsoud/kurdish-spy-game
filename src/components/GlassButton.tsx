import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  style,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) => {
  const getGradientColors = (): [string, string] => {
    if (disabled) return ['rgba(100, 100, 100, 0.3)', 'rgba(80, 80, 80, 0.3)'];
    
    switch (variant) {
      case 'primary':
        return [Colors.primary.start, Colors.primary.end];
      case 'secondary':
        return [Colors.secondary.start, Colors.secondary.end];
      case 'danger':
        return [Colors.spy.primary, Colors.spy.secondary];
      case 'success':
        return [Colors.player.primary, Colors.player.secondary];
      case 'ghost':
        return ['transparent', 'transparent'];
      default:
        return [Colors.primary.start, Colors.primary.end];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case 'small':
        return Typography.buttonSmall;
      case 'large':
        return Typography.h4;
      default:
        return Typography.button;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, variant === 'ghost' && styles.ghostGradient]}
      >
        {variant !== 'ghost' && (
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        )}
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator color={Colors.text.primary} />
          ) : (
            <>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text
                style={[
                  getTextStyle(),
                  disabled && styles.disabledText,
                  variant === 'ghost' && styles.ghostText,
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostGradient: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    position: 'relative',
  },
  iconContainer: {
    marginRight: 8,
  },
  small: {
    minWidth: 80,
  },
  medium: {
    minWidth: 120,
  },
  large: {
    minWidth: 160,
  },
  fullWidth: {
    width: '100%',
  },
  disabledText: {
    opacity: 0.5,
  },
  ghostText: {
    color: Colors.text.secondary,
  },
});

// Add padding based on size
const sizeStyles = {
  small: { paddingVertical: 10, paddingHorizontal: 16 },
  medium: { paddingVertical: 14, paddingHorizontal: 24 },
  large: { paddingVertical: 18, paddingHorizontal: 32 },
};

// Override gradient style with size-specific padding
styles.gradient = {
  ...styles.gradient,
  ...sizeStyles.medium,
};

export default GlassButton;
