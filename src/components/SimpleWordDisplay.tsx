import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface SimpleWordDisplayProps {
  word: string;
  isSpy: boolean;
  categoryName?: string;
  categoryIcon?: string;
}

const SimpleWordDisplay: React.FC<SimpleWordDisplayProps> = ({
  word,
  isSpy,
  categoryName,
  categoryIcon,
}) => {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle pulse animation for word box
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (isSpy) {
    return (
      <Animated.View style={[
        styles.spyContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}>
        <Image 
          source={require('../../assets/spy-icon.png')} 
          style={styles.spyIcon} 
          resizeMode="contain" 
        />
        <Text style={styles.spyTitle}>تۆ سیخوڕیت!</Text>
        <View style={styles.spyInfoBox}>
          <Ionicons name="eye-off" size={24} color="rgba(255,255,255,0.6)" style={{marginBottom: 8}} />
          <Text style={styles.spySubtitle}>
            وشەکە نازانیت{' '}🤫
          </Text>
          <Text style={styles.spyHint}>
            گوێ لە یەکتر بگرن و وشەکە بدۆزەرەوە!
          </Text>
        </View>
      </Animated.View>
    );
  }

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      {/* Category Badge */}
      {categoryName && (
        <View style={styles.categoryBadge}>
          <Ionicons 
            name={(categoryIcon || 'help-circle') as any} 
            size={18} 
            color="rgba(255,255,255,0.9)" 
            style={styles.categoryIcon} 
          />
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>
      )}

      {/* Word Label */}
      <Text style={styles.wordLabel}>وشەکەت ئەمەیە:</Text>

      {/* Word Box - Dark theme friendly, no bright colors */}
      <Animated.View style={[
        styles.wordBoxOuter,
        { transform: [{ scale: pulseAnim }] }
      ]}>
        <Animated.View style={[
          styles.wordBoxGlow,
          { opacity: glowOpacity }
        ]} />
        <View style={styles.wordBox}>
          <Text style={styles.wordText}>{word}</Text>
        </View>
      </Animated.View>

      {/* Warning */}
      <View style={styles.warningContainer}>
        <View style={styles.warningRow}>
          <Ionicons name="finger-print" size={20} color="#ff6b6b" />
          <Text style={styles.warningText}>وشەکە مەڵێ!</Text>
        </View>
        <Text style={styles.warningSubtext}>تەنها تۆ دەتزانیت</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  categoryBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryIcon: {
    marginLeft: 8,
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '600',
  },
  wordLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 20,
  },
  wordBoxOuter: {
    position: 'relative',
    marginBottom: 30,
  },
  wordBoxGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: 'rgba(102, 126, 234, 0.4)',
    borderRadius: 24,
  },
  // DARK THEME WORD BOX - No bright white that could be seen from far
  wordBox: {
    backgroundColor: 'rgba(30, 30, 50, 0.95)',
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 45,
    minWidth: 220,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.5)',
    // Subtle shadow - not bright
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  wordText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(102, 126, 234, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  warningContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  warningRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningSubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 4,
  },
  // Spy styles - also dark theme friendly
  spyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  spyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  spyTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(255, 107, 107, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  spyInfoBox: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    minWidth: 250,
  },
  spySubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  spyHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SimpleWordDisplay;
