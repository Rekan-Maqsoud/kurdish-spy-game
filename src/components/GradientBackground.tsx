import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'react-native';
import Colors from '../constants/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'game' | 'spy' | 'success';
}

const { height } = Dimensions.get('window');

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'default',
}) => {
  const getGradientColors = (): [string, string, string] => {
    switch (variant) {
      case 'game':
        return ['#1a1a2e', '#16213e', '#0f3460'];
      case 'spy':
        return ['#2d1f3d', '#4a1942', '#6b1839'];
      case 'success':
        return ['#1a3a2e', '#16423e', '#0f4a60'];
      default:
        return [Colors.dark.start, Colors.dark.middle, Colors.dark.end];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 500,
    opacity: 0.1,
  },
  circle1: {
    width: 400,
    height: 400,
    backgroundColor: Colors.primary.start,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: Colors.secondary.start,
    bottom: height * 0.3,
    left: -100,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: Colors.accent.gold,
    bottom: -50,
    right: -50,
  },
});

export default GradientBackground;
