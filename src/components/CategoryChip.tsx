import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

// Map icon names to actual icons
const iconMap: { [key: string]: { type: 'ionicons' | 'material'; name: string } } = {
  'location': { type: 'ionicons', name: 'location' },
  'fast-food': { type: 'ionicons', name: 'fast-food' },
  'paw': { type: 'ionicons', name: 'paw' },
  'car': { type: 'ionicons', name: 'car' },
  'football': { type: 'ionicons', name: 'football' },
  'briefcase': { type: 'ionicons', name: 'briefcase' },
  'cube': { type: 'ionicons', name: 'cube' },
  'leaf': { type: 'ionicons', name: 'leaf' },
  'shirt': { type: 'ionicons', name: 'shirt' },
  'body': { type: 'ionicons', name: 'body' },
  'phone-portrait': { type: 'ionicons', name: 'phone-portrait' },
  'home': { type: 'ionicons', name: 'home' },
  'construct': { type: 'ionicons', name: 'construct' },
  'bed': { type: 'ionicons', name: 'bed' },
  'musical-notes': { type: 'ionicons', name: 'musical-notes' },
  'globe': { type: 'ionicons', name: 'globe' },
  'film': { type: 'ionicons', name: 'film' },
  'color-palette': { type: 'ionicons', name: 'color-palette' },
  'cloudy': { type: 'ionicons', name: 'cloudy' },
  'cafe': { type: 'ionicons', name: 'cafe' },
};

interface CategoryChipProps {
  name: string;
  icon: string;
  color: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  name,
  icon,
  color,
  selected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        selected && { borderColor: color, borderWidth: 2 },
        style,
      ]}
      activeOpacity={0.7}
    >
      <BlurView intensity={selected ? 50 : 30} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          styles.content,
          { backgroundColor: selected ? `${color}30` : Colors.glass.background },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={(iconMap[icon]?.name || 'help-circle') as any} size={24} color={selected ? color : '#fff'} />
        </View>
        <Text
          style={[
            styles.name,
            selected && { color },
          ]}
        >
          {name}
        </Text>
        {selected && (
          <View style={[styles.checkmark, { backgroundColor: color }]}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glass.border,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  content: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  name: {
    ...Typography.body,
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CategoryChip;
