import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { GradientBackground, GlassCard, GlassButton, PlayerCard } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';
import { getCategoryById } from '../data/words';

type RoundResultNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoundResult'>;
type RoundResultRouteProp = RouteProp<RootStackParamList, 'RoundResult'>;

const RoundResultScreen: React.FC = () => {
  const navigation = useNavigation<RoundResultNavigationProp>();
  const route = useRoute<RoundResultRouteProp>();
  const { result } = route.params;
  
  const { gameState, proceedToNextPhase, startNewRound } = useGame();
  const [shouldNavigateHome, setShouldNavigateHome] = useState(false);

  // Apply scores when entering screen
  useEffect(() => {
    // Scores are already calculated in the result, we need to update game state
  }, []);

  useEffect(() => {
    if (!gameState || shouldNavigateHome) {
      navigation.navigate('Home');
    }
  }, [gameState, shouldNavigateHome, navigation]);

  if (!gameState) {
    return null;
  }

  const category = getCategoryById(result.category);
  const isLastRound = gameState.currentRound >= gameState.totalRounds;

  // Calculate updated scores including this round
  const getPlayerScore = (playerId: string): number => {
    const player = gameState.players.find(p => p.id === playerId);
    const pointsThisRound = result.pointsAwarded.find(p => p.playerId === playerId)?.points || 0;
    return (player?.score || 0) + pointsThisRound;
  };

  const sortedPlayers = [...gameState.players].sort(
    (a, b) => getPlayerScore(b.id) - getPlayerScore(a.id)
  );

  const handleNext = () => {
    if (isLastRound) {
      // Apply final scores and go to game end
      navigation.navigate('GameEnd');
    } else {
      // Start new round
      startNewRound();
      navigation.navigate('WordDistribution', { playerIndex: 0 });
    }
  };

  return (
    <GradientBackground variant="game">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ئەنجامی گەڕی {result.round}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Round Summary */}
          <GlassCard style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Ionicons name={(category?.icon || 'help-circle') as any} size={28} color="#fff" style={{marginBottom: 4}} />
                <Text style={styles.summaryLabel}>پۆل</Text>
                <Text style={styles.summaryValue}>{category?.name}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Ionicons name="document-text" size={24} color="#fff" style={{marginBottom: 4}} />
                <Text style={styles.summaryLabel}>وشە</Text>
                <Text style={styles.summaryValue}>{result.word}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Spy Info */}
          <GlassCard style={styles.spyInfoCard}>
            <View style={styles.spyHeader}>
              <Image source={require('../../assets/spy-icon.png')} style={{width: 40, height: 40, marginRight: 12}} resizeMode="contain" />
              <View style={styles.spyDetails}>
                <Text style={styles.spyLabel}>سیخوڕ</Text>
                <Text style={styles.spyName}>{result.spyName}</Text>
              </View>
            </View>
            
            <View style={styles.spyResults}>
              <View style={[
                styles.resultBadge,
                result.spyWasFound ? styles.badgeNegative : styles.badgePositive
              ]}>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                  {result.spyWasFound ? (
                    <Ionicons name="close-circle" size={16} color="#fff" style={{marginLeft: 4}} />
                  ) : (
                    <Ionicons name="checkmark-circle" size={16} color="#fff" style={{marginLeft: 4}} />
                  )}
                  <Text style={styles.badgeText}>
                    {result.spyWasFound ? 'دۆزرایەوە' : 'دەرباز بوو'}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.resultBadge,
                result.spyGuessedCorrectly ? styles.badgePositive : styles.badgeNegative
              ]}>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                  {result.spyGuessedCorrectly ? (
                    <Ionicons name="checkmark-circle" size={16} color="#fff" style={{marginLeft: 4}} />
                  ) : (
                    <Ionicons name="close-circle" size={16} color="#fff" style={{marginLeft: 4}} />
                  )}
                  <Text style={styles.badgeText}>
                    {result.spyGuessedCorrectly ? 'وشەکەی دۆزیەوە' : 'نەیتوانی بدۆزێتەوە'}
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Points This Round */}
          {result.pointsAwarded.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>خاڵەکانی ئەم گەڕە</Text>
              <GlassCard style={styles.pointsCard}>
                {result.pointsAwarded.map((award, index) => {
                  const player = gameState.players.find(p => p.id === award.playerId);
                  return (
                    <View key={index} style={styles.pointRow}>
                      <Text style={styles.pointPlayerName}>{player?.name}</Text>
                      <View style={styles.pointBadge}>
                        <Text style={styles.pointValue}>+{award.points}</Text>
                      </View>
                    </View>
                  );
                })}
              </GlassCard>
            </>
          )}

          {/* Leaderboard */}
          <Text style={styles.sectionTitle}>خشتەی خاڵەکان</Text>
          {sortedPlayers.map((player, index) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              score={getPlayerScore(player.id)}
              index={index}
              isSpy={player.id === result.spyId}
              revealed={true}
              showScore={true}
            />
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <GlassButton
            title={isLastRound ? "ئەنجامی کۆتایی" : `گەڕی ${gameState.currentRound + 1}`}
            icon={isLastRound ? <Ionicons name="trophy" size={22} color="#fff" /> : <Ionicons name="play" size={22} color="#fff" />}
            onPress={handleNext}
            variant="primary"
            size="large"
            fullWidth
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
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  summaryValue: {
    ...Typography.h4,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.glass.border,
    marginHorizontal: 20,
  },
  spyInfoCard: {
    marginBottom: 20,
  },
  spyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  spyEmoji: {
    fontSize: 40,
    marginLeft: 16,
  },
  spyDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  spyLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  spyName: {
    ...Typography.h3,
    color: Colors.spy.primary,
  },
  spyResults: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 10,
  },
  resultBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgePositive: {
    backgroundColor: 'rgba(0, 210, 106, 0.2)',
  },
  badgeNegative: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  badgeText: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  sectionTitle: {
    ...Typography.h4,
    textAlign: 'right',
    marginBottom: 12,
    color: Colors.accent.gold,
  },
  pointsCard: {
    marginBottom: 20,
  },
  pointRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pointPlayerName: {
    ...Typography.body,
  },
  pointBadge: {
    backgroundColor: Colors.accent.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointValue: {
    ...Typography.button,
    color: Colors.text.dark,
  },
  footer: {
    paddingTop: 15,
  },
});

export default RoundResultScreen;
