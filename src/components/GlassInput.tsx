import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

interface GlassInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  label?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  textAlign?: 'left' | 'center' | 'right';
  onFocus?: () => void;
  onBlur?: () => void;
}

const GlassInput: React.FC<GlassInputProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
  label,
  keyboardType = 'default',
  maxLength,
  autoCapitalize = 'sentences',
  textAlign = 'right', // RTL for Kurdish
  onFocus,
  onBlur,
}) => {
  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          style={[styles.input, { textAlign }]}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    ...Typography.label,
    marginBottom: 8,
    textAlign: 'right',
  },
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    backgroundColor: Colors.glass.backgroundLight,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    writingDirection: 'rtl',
  },
});

export default GlassInput;
