import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, RoundResult } from '../types';
import { GradientBackground, GlassCard, GlassButton } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';

type SpyGuessNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SpyGuess'>;

const { width } = Dimensions.get('window');

const SpyGuessScreen: React.FC = () => {
  const navigation = useNavigation<SpyGuessNavigationProp>();
  const { gameState, submitSpyGuess, settings, calculateRoundResults } = useGame();
  
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);

  useEffect(() => {
    if (!gameState) {
      navigation.navigate('Home');
    }
  }, [gameState, navigation]);

  if (!gameState) {
    return null;
  }

  const spies = gameState.players.filter(p => gameState.spyIds.includes(p.id));
  const spyNames = spies.map(s => s.name).join('، ');

  const handleGuess = () => {
    if (!selectedWord) return;
    
    const correct = submitSpyGuess(selectedWord);
    setGuessedCorrectly(correct);
    setHasGuessed(true);
  };

  const proceedToResults = () => {
    const finalResult = calculateRoundResults(guessedCorrectly);
    navigation.navigate('RoundResult', { result: finalResult });
  };

  if (hasGuessed) {
    return (
      <GradientBackground variant={guessedCorrectly ? 'spy' : 'success'}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>تەخمینی سیخوڕ</Text>
          </View>

          <View style={styles.resultContainer}>
            <GlassCard style={styles.resultCard}>
              {guessedCorrectly ? (
                <Image source={require('../../assets/spy-icon.png')} style={{width: 60, height: 60, marginBottom: 16}} resizeMode="contain" />
              ) : (
                <Ionicons name="close-circle" size={60} color="#ff6b6b" style={{marginBottom: 16}} />
              )}
              <Text style={styles.resultTitle}>
                {guessedCorrectly ? 'سیخوڕ وشەکەی دۆزیەوە!' : 'سیخوڕ هەڵەی کرد!'}
              </Text>
              
              <View style={styles.wordReveal}>
                <Text style={styles.wordLabel}>وشەکە:</Text>
                <Text style={styles.revealedWord}>{gameState.currentWord}</Text>
              </View>

              {guessedCorrectly && (
                <View style={styles.pointsEarned}>
                  <Text style={styles.pointsText}>
                    {spyNames} {settings.pointsForSpyGuessing} خاڵی برد!
                  </Text>
                </View>
              )}

              <View style={styles.guessInfo}>
                <Text style={styles.guessLabel}>تەخمینی سیخوڕ:</Text>
                <Text style={[
                  styles.guessWord,
                  guessedCorrectly ? styles.correctGuess : styles.wrongGuess
                ]}>
                  {selectedWord}
                </Text>
              </View>
            </GlassCard>
          </View>

          <View style={styles.footer}>
            <GlassButton
              title="ئەنجامی گەڕ"
              icon={<Ionicons name="stats-chart" size={22} color="#fff" />}
              onPress={proceedToResults}
              variant={guessedCorrectly ? 'danger' : 'success'}
              size="large"
              fullWidth
            />
          </View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="spy">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>تەخمینی سیخوڕ</Text>
        </View>

        <GlassCard style={styles.spyCard}>
          <Image source={require('../../assets/spy-icon.png')} style={{width: 60, height: 60, marginBottom: 8}} resizeMode="contain" />
          <Text style={styles.spyName}>{spyNames}</Text>
          <Text style={styles.spyHint}>
            ئێستا دەتوانیت وشەکە تەخمین بکەیت!{'\n'}
            ئەگەر وشەکەت دۆزیەوە {settings.pointsForSpyGuessing} خاڵ دەبیت.
          </Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>کام وشەیە؟</Text>
        <View style={styles.optionsContainer}>
          {gameState.spyGuessOptions.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedWord === word && styles.optionSelected,
              ]}
              onPress={() => setSelectedWord(word)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                selectedWord === word && styles.optionTextSelected,
              ]}>
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <GlassButton
            title={selectedWord ? "تەخمین بکە" : "وشەیەک هەڵبژێرە"}
            icon={selectedWord ? <Ionicons name="search" size={22} color="#fff" /> : undefined}
            onPress={handleGuess}
            variant={selectedWord ? 'primary' : 'ghost'}
            size="large"
            fullWidth
            disabled={!selectedWord}
          />
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    ...Typography.h2,
  },
  spyCard: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 30,
  },
  spyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  spyName: {
    ...Typography.h2,
    color: Colors.spy.primary,
    marginBottom: 12,
  },
  spyHint: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  sectionTitle: {
    ...Typography.h3,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.accent.gold,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    flex: 1,
  },
  optionButton: {
    width: (width - 60) / 2,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.glass.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderColor: Colors.primary.start,
  },
  optionText: {
    ...Typography.h4,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.primary.start,
  },
  footer: {
    paddingTop: 15,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  resultCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  resultEmoji: {
    fontSize: 70,
    marginBottom: 20,
  },
  resultTitle: {
    ...Typography.h2,
    marginBottom: 24,
    textAlign: 'center',
  },
  wordReveal: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.glass.backgroundLight,
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 16,
  },
  wordLabel: {
    ...Typography.label,
    color: Colors.text.muted,
    marginBottom: 8,
  },
  revealedWord: {
    ...Typography.h2,
    color: Colors.accent.gold,
  },
  pointsEarned: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  pointsText: {
    ...Typography.body,
    color: Colors.spy.primary,
    fontWeight: 'bold',
  },
  guessInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  guessLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  guessWord: {
    ...Typography.h4,
  },
  correctGuess: {
    color: Colors.accent.success,
  },
  wrongGuess: {
    color: Colors.accent.error,
    textDecorationLine: 'line-through',
  },
});

export default SpyGuessScreen;
