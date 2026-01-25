import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');

interface WordCardProps {
  word: string;
  isSpy: boolean;
  categoryName?: string;
  categoryIcon?: string;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  isSpy,
  categoryName,
  categoryIcon,
}) => {
  const gradientColors = isSpy
    ? [Colors.spy.primary, Colors.spy.secondary, '#9c1f1f']
    : [Colors.primary.start, Colors.primary.end, '#5a4fcf'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Decorative elements */}
          <View style={styles.decorationTop}>
            {isSpy ? (
              <Image source={require('../../assets/spy-icon.png')} style={{width: 40, height: 40}} resizeMode="contain" />
            ) : (
              <MaterialCommunityIcons name="target" size={40} color="#fff" />
            )}
          </View>
          
          {/* Category badge */}
          {categoryName && !isSpy && (
            <View style={styles.categoryBadge}>
              <Ionicons name={(categoryIcon || 'help-circle') as any} size={20} color="#fff" style={{marginLeft: 8}} />
              <Text style={styles.categoryName}>{categoryName}</Text>
            </View>
          )}
          
          {/* Main content */}
          <View style={styles.mainContent}>
            {isSpy ? (
              <>
                <Image source={require('../../assets/spy-icon.png')} style={{width: 100, height: 100, marginBottom: 20}} resizeMode="contain" />
                <Text style={styles.spyTitle}>تۆ سیخوڕیت!</Text>
                <Text style={styles.spySubtitle}>
                  وشەکە نازانیت{'\n'}هەوڵبدە وشەکە بدۆزیتەوە
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.wordLabel}>وشەکەت:</Text>
                <View style={styles.wordBox}>
                  <Text style={styles.word}>{word}</Text>
                </View>
                <Text style={styles.wordHint}>
                  ئەم وشەیە بە کەسی دیکە مەڵێ!
                </Text>
              </>
            )}
          </View>
          
          {/* Decorative bottom */}
          <View style={styles.decorationBottom}>
            <View style={styles.stars}>
              <Ionicons name="sparkles" size={24} color="#fff" style={{marginHorizontal: 10}} />
              <Ionicons name="star" size={24} color="#ffd700" style={{marginHorizontal: 10}} />
              <Ionicons name="sparkles" size={24} color="#fff" style={{marginHorizontal: 10}} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    aspectRatio: 0.7,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 32,
    zIndex: 10,
    position: 'relative',
  },
  decorationTop: {
    alignItems: 'center',
  },
  decorationEmoji: {
    fontSize: 40,
  },
  categoryBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  categoryIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  wordLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  wordBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 36,
    marginVertical: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 100,
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    zIndex: 101,
  },
  wordHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 20,
    textAlign: 'center',
  },
  spyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  spyTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  spySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 28,
  },
  decorationBottom: {
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  star: {
    fontSize: 24,
    marginHorizontal: 10,
  },
});

export default WordCard;
