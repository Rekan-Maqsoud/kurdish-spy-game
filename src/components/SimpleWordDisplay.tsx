import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
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
  if (isSpy) {
    return (
      <View style={styles.spyContainer}>
        <Image 
          source={require('../../assets/spy-icon.png')} 
          style={styles.spyIcon} 
          resizeMode="contain" 
        />
        <Text style={styles.spyTitle}>تۆ سیخوڕیت!</Text>
        <Text style={styles.spySubtitle}>
          وشەکە نازانیت{'\n'}هەوڵبدە وشەکە بدۆزیتەوە
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Category */}
      {categoryName && (
        <View style={styles.categoryBadge}>
          <Ionicons 
            name={(categoryIcon || 'help-circle') as any} 
            size={20} 
            color="#fff" 
            style={styles.categoryIcon} 
          />
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>
      )}

      {/* Word Label */}
      <Text style={styles.wordLabel}>وشەکەت:</Text>

      {/* Word Box - The main word display */}
      <View style={styles.wordBox}>
        <Text style={styles.wordText}>{word}</Text>
      </View>

      {/* Warning */}
      <View style={styles.warningRow}>
        <Ionicons name="warning" size={18} color="#ffd700" />
        <Text style={styles.warningText}>ئەم وشەیە بە کەسی دیکە مەڵێ!</Text>
      </View>
    </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  categoryIcon: {
    marginLeft: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
  },
  wordLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    marginBottom: 16,
  },
  wordBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 50,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
  },
  wordText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  warningRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  warningText: {
    color: '#ffd700',
    fontSize: 14,
    marginRight: 8,
  },
  // Spy styles
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
    fontSize: 40,
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
});

export default SimpleWordDisplay;
