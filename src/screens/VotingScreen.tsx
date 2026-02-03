import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { GradientBackground, GlassCard, GlassButton, PlayerCard, GameMenu } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';

type VotingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Voting'>;

type Phase = 'voting' | 'spyGuess' | 'results';

const VotingScreen: React.FC = () => {
  const navigation = useNavigation<VotingNavigationProp>();
  const {
    gameState,
    submitVote,
    startNewRound,
    submitSpyGuess,
    skipSpyGuess,
    changeCurrentWord,
    resetGame,
    addPlayerToGame,
  } = useGame();
  
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('voting');
  const [selectedGuessWord, setSelectedGuessWord] = useState<string | null>(null);
  const [spyGuessedCorrectly, setSpyGuessedCorrectly] = useState(false);

  const currentVoter = gameState?.players[currentVoterIndex];
  const hasEveryoneVoted = gameState?.players.every(p => p.hasVoted) ?? false;

  useEffect(() => {
    console.log('[VotingScreen] useEffect - hasEveryoneVoted:', hasEveryoneVoted, 'phase:', phase);
    if (hasEveryoneVoted && phase === 'voting') {
      console.log('[VotingScreen] Everyone voted, moving to spy guess phase');
      setPhase('spyGuess');
    }
  }, [hasEveryoneVoted, phase]);

  useEffect(() => {
    if (!gameState) {
      console.log('[VotingScreen] No gameState, navigating home');
      navigation.navigate('Home');
    }
  }, [gameState, navigation]);

  if (!gameState || !currentVoter) {
    return null;
  }

  const handleVote = () => {
    console.log('[VotingScreen] handleVote - voter:', currentVoter.name, 'suspect:', selectedSuspect);
    if (!selectedSuspect || !currentVoter) {
      Alert.alert('ئاگاداری', 'تکایە یەکێک هەڵبژێرە');
      return;
    }

    submitVote(currentVoter.id, selectedSuspect);
    
    if (currentVoterIndex < gameState.players.length - 1) {
      setCurrentVoterIndex(currentVoterIndex + 1);
      setSelectedSuspect(null);
    }
  };

  const handleSpyGuess = () => {
    if (!selectedGuessWord) {
      Alert.alert('ئاگاداری', 'تکایە وشەیەک هەڵبژێرە');
      return;
    }
    
    const correct = submitSpyGuess(selectedGuessWord);
    console.log('[VotingScreen] Spy guess:', selectedGuessWord, 'Correct:', correct);
    setSpyGuessedCorrectly(correct);
    setPhase('results');
  };

  const handleSkipGuess = () => {
    console.log('[VotingScreen] Spy skipped guessing');
    skipSpyGuess();
    setSpyGuessedCorrectly(false);
    setPhase('results');
  };

  const handleNextRound = () => {
    console.log('[VotingScreen] handleNextRound called');
    console.log('[VotingScreen] currentRound:', gameState.currentRound, 'totalRounds:', gameState.totalRounds);
    
    if (gameState.currentRound >= gameState.totalRounds) {
      console.log('[VotingScreen] Last round, navigating to GameEnd');
      navigation.navigate('GameEnd');
    } else {
      console.log('[VotingScreen] Starting new round');
      startNewRound();
      // Reset local state for new round
      setCurrentVoterIndex(0);
      setSelectedSuspect(null);
      setPhase('voting');
      setSelectedGuessWord(null);
      setSpyGuessedCorrectly(false);
      // Navigate to word distribution for new round
      console.log('[VotingScreen] Navigating to WordDistribution');
      navigation.navigate('WordDistribution', { playerIndex: 0 });
    }
  };

  const spyIds = gameState.spyIds;
  const spies = gameState.players.filter(p => spyIds.includes(p.id));
  const spyNames = spies.map(s => s.name).join('، ');

  const nonSpyIds = gameState.players
    .filter(p => !spyIds.includes(p.id))
    .map(p => p.id);

  const voteCounts = new Map<string, number>();
  gameState.players.forEach(p => {
    if (!nonSpyIds.includes(p.id)) return;
    if (!p.votedFor) return;
    voteCounts.set(p.votedFor, (voteCounts.get(p.votedFor) || 0) + 1);
  });
  const maxVotes = voteCounts.size > 0 ? Math.max(...voteCounts.values()) : 0;
  const topVotedIds = Array.from(voteCounts.entries())
    .filter(([, count]) => count === maxVotes)
    .map(([id]) => id);
  const spyFound = maxVotes > nonSpyIds.length / 2 && topVotedIds.some(id => spyIds.includes(id));

  const resetLocalState = () => {
    setCurrentVoterIndex(0);
    setSelectedSuspect(null);
    setPhase('voting');
    setSelectedGuessWord(null);
    setSpyGuessedCorrectly(false);
  };

  const handleGoHome = () => {
    Alert.alert('ئاگاداری', 'دڵنیایت دەتەوێت یاریەکە بەدەست بەرەو ماڵ؟', [
      { text: 'نەخێر', style: 'cancel' },
      {
        text: 'بەڵێ',
        style: 'destructive',
        onPress: () => {
          resetGame();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  const handleChangeWord = () => {
    const changed = changeCurrentWord();
    if (!changed) {
      Alert.alert('ئاگاداری', 'هیچ وشەیەک نەماوە');
      return;
    }
    resetLocalState();
    navigation.navigate('WordDistribution', { playerIndex: 0 });
  };

  const handleAddPlayer = (name: string) => {
    if (!gameState) {
      return { success: false, message: 'هیچ یارییەک دەستپێنەکراوە' };
    }
    const result = addPlayerToGame(name);
    if (result.success) {
      resetLocalState();
      navigation.navigate('WordDistribution', { playerIndex: gameState.players.length });
    }
    return result;
  };

  // Spy Guess Phase
  if (phase === 'spyGuess') {
    if (spies.length === 0) return null;

    return (
      <GradientBackground variant="spy">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>تەخمینی سیخوڕ</Text>
            <View style={styles.roundBadge}>
              <Text style={styles.roundText}>
                گەڕی {gameState.currentRound} / {gameState.totalRounds}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <GameMenu
                onGoHome={handleGoHome}
                onChangeWord={handleChangeWord}
                onAddPlayer={handleAddPlayer}
              />
            </View>
          </View>

          <GlassCard style={styles.spyGuessCard}>
            <Image 
              source={require('../../assets/spy-icon.png')} 
              style={styles.spyGuessIcon} 
              resizeMode="contain" 
            />
            <Text style={styles.spyGuessTitle}>{spyNames}</Text>
            <Text style={styles.spyGuessSubtitle}>
              {spyFound 
                ? 'دۆزراویتەوە! ئەگەر وشەکە بزانیت، دەتوانیت خاڵ بەدەستبێنیت'
                : 'دەرباز بوویت! هەوڵبدە وشەکە بدۆزیتەوە بۆ خاڵی زیاتر'
              }
            </Text>
          </GlassCard>

          <Text style={styles.sectionTitle}>وشەکە چییە؟</Text>
          <ScrollView style={styles.guessScroll} showsVerticalScrollIndicator={false}>
            {gameState.spyGuessOptions.map((word, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.guessOption,
                  selectedGuessWord === word && styles.guessOptionSelected
                ]}
                onPress={() => setSelectedGuessWord(word)}
              >
                <Text style={[
                  styles.guessOptionText,
                  selectedGuessWord === word && styles.guessOptionTextSelected
                ]}>
                  {word}
                </Text>
                {selectedGuessWord === word && (
                  <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <GlassButton
              title={selectedGuessWord ? "تەخمین بکە" : "وشەیەک هەڵبژێرە"}
              icon={<Ionicons name="eye" size={22} color="#fff" />}
              onPress={handleSpyGuess}
              variant={selectedGuessWord ? 'primary' : 'ghost'}
              size="large"
              fullWidth
              disabled={!selectedGuessWord}
            />
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipGuess}>
              <Text style={styles.skipText}>نازانم، بەردەوام بە</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    );
  }

  // Results Phase
  if (phase === 'results') {
    if (spies.length === 0) {
      console.log('[VotingScreen] Spy not found in results!');
      return null;
    }
    
    const isLastRound = gameState.currentRound >= gameState.totalRounds;

    // Sort players by score
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

    console.log('[VotingScreen] Showing results - spyFound:', spyFound, 'spyGuessedCorrectly:', spyGuessedCorrectly);

    return (
      <GradientBackground variant={spyFound && !spyGuessedCorrectly ? 'success' : 'spy'}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>ئەنجامی گەڕی {gameState.currentRound}</Text>
            <View style={styles.roundBadge}>
              <Text style={styles.roundText}>
                {gameState.currentRound} / {gameState.totalRounds}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <GameMenu
                onGoHome={handleGoHome}
                onChangeWord={handleChangeWord}
                onAddPlayer={handleAddPlayer}
              />
            </View>
          </View>

          {/* Word Reveal */}
          <GlassCard style={styles.wordRevealCard}>
            <Text style={styles.wordRevealLabel}>وشەکە بوو:</Text>
            <Text style={styles.wordRevealText}>{gameState.currentWord}</Text>
          </GlassCard>

          {/* Spy Reveal Card */}
          <GlassCard style={styles.spyRevealCard}>
            <View style={styles.spyRevealContent}>
              <Image 
                source={require('../../assets/spy-icon.png')} 
                style={styles.spyIcon} 
                resizeMode="contain" 
              />
              <View style={styles.spyInfo}>
                <Text style={styles.spyLabel}>سیخوڕ بوو:</Text>
                <Text style={styles.spyNameText}>{spyNames}</Text>
              </View>
            </View>
            
            {/* Spy Status Badges */}
            <View style={styles.badgesRow}>
              <View style={[
                styles.resultBadge,
                spyFound ? styles.badgeDanger : styles.badgeSuccess
              ]}>
                {spyFound ? (
                  <Ionicons name="close-circle" size={18} color="#fff" />
                ) : (
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                )}
                <Text style={styles.resultBadgeText}>
                  {spyFound ? 'دۆزرایەوە' : 'دەرباز بوو'}
                </Text>
              </View>
              
              <View style={[
                styles.resultBadge,
                spyGuessedCorrectly ? styles.badgeSuccess : styles.badgeDanger
              ]}>
                {spyGuessedCorrectly ? (
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                ) : (
                  <Ionicons name="close-circle" size={18} color="#fff" />
                )}
                <Text style={styles.resultBadgeText}>
                  {spyGuessedCorrectly ? 'وشەکەی زانی' : 'وشەکەی نەزانی'}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Current Scores */}
          <Text style={styles.sectionTitle}>خاڵەکان</Text>
          <ScrollView style={styles.scoresScroll} showsVerticalScrollIndicator={false}>
            {sortedPlayers.map((player, index) => {
              return (
                <GlassCard key={player.id} style={styles.playerScoreCard}>
                  <View style={styles.playerScoreRow}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>{index + 1}</Text>
                    </View>
                    <View style={styles.playerInfo}>
                      <View style={styles.playerNameRow}>
                        <Text style={styles.playerName}>{player.name}</Text>
                        {gameState.spyIds.includes(player.id) && (
                          <Image 
                            source={require('../../assets/spy-icon.png')} 
                            style={styles.miniSpyIcon} 
                            resizeMode="contain" 
                          />
                        )}
                      </View>
                    </View>
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreValue}>{player.score}</Text>
                      <Text style={styles.scoreLabel}>خاڵ</Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </ScrollView>

          {/* Next Round Button */}
          <View style={styles.footer}>
            <GlassButton
              title={isLastRound ? "ئەنجامی کۆتایی" : `گەڕی ${gameState.currentRound + 1}`}
              icon={isLastRound 
                ? <Ionicons name="trophy" size={22} color="#fff" /> 
                : <Ionicons name="play" size={22} color="#fff" />
              }
              onPress={handleNextRound}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        </View>
      </GradientBackground>
    );
  }

  // Voting in progress
  return (
    <GradientBackground variant="game">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.roundBadge}>
            <Text style={styles.roundText}>
              گەڕی {gameState.currentRound} لە {gameState.totalRounds}
            </Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>
              {currentVoterIndex + 1} / {gameState.players.length}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <GameMenu
              onGoHome={handleGoHome}
              onChangeWord={handleChangeWord}
              onAddPlayer={handleAddPlayer}
            />
          </View>
        </View>

        <GlassCard style={styles.voterCard}>
          <Text style={styles.voterPrompt}>نۆبەی دەنگدانی</Text>
          <Text style={styles.voterName}>{currentVoter.name}</Text>
          <Text style={styles.voterHint}>بە ڕات کێ سیخوڕە؟</Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>دەنگ بدە بۆ</Text>
        <ScrollView style={styles.playersScroll} showsVerticalScrollIndicator={false}>
          {gameState.players.map((player, index) => (
            player.id !== currentVoter.id && (
              <PlayerCard
                key={player.id}
                name={player.name}
                score={player.score}
                index={index}
                selected={selectedSuspect === player.id}
                onPress={() => setSelectedSuspect(player.id)}
                showScore={false}
              />
            )
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <GlassButton
            title={selectedSuspect ? "دەنگ بدە" : "یەکێک هەڵبژێرە"}
            icon={selectedSuspect ? <Ionicons name="checkmark-circle" size={22} color="#fff" /> : undefined}
            onPress={handleVote}
            variant={selectedSuspect ? 'primary' : 'ghost'}
            size="large"
            fullWidth
            disabled={!selectedSuspect}
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
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    flex: 1,
    textAlign: 'center',
  },
  roundBadge: {
    backgroundColor: Colors.glass.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  roundText: {
    ...Typography.body,
    color: Colors.accent.gold,
  },
  progressBadge: {
    backgroundColor: Colors.primary.start,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    ...Typography.body,
    color: '#fff',
    fontWeight: 'bold',
  },
  voterCard: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  voterPrompt: {
    ...Typography.label,
    color: Colors.text.muted,
    marginBottom: 8,
  },
  voterName: {
    ...Typography.h2,
    marginBottom: 8,
  },
  voterHint: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  sectionTitle: {
    ...Typography.h4,
    textAlign: 'right',
    marginBottom: 12,
    color: Colors.text.secondary,
  },
  playersScroll: {
    flex: 1,
  },
  footer: {
    paddingTop: 15,
  },
  // Spy Guess styles
  spyGuessCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  spyGuessIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  spyGuessTitle: {
    ...Typography.h2,
    marginBottom: 8,
  },
  spyGuessSubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  guessScroll: {
    flex: 1,
  },
  guessOption: {
    backgroundColor: Colors.glass.background,
    borderWidth: 2,
    borderColor: Colors.glass.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guessOptionSelected: {
    borderColor: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
  },
  guessOptionText: {
    ...Typography.body,
    fontSize: 18,
    color: Colors.text.primary,
  },
  guessOptionTextSelected: {
    color: '#4ade80',
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  skipText: {
    ...Typography.body,
    color: Colors.text.muted,
    textDecorationLine: 'underline',
  },
  // Results styles
  wordRevealCard: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  wordRevealLabel: {
    ...Typography.body,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  wordRevealText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.accent.gold,
  },
  spyRevealCard: {
    marginBottom: 16,
    padding: 16,
  },
  spyRevealContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  spyIcon: {
    width: 50,
    height: 50,
  },
  spyInfo: {
    flex: 1,
    marginRight: 16,
    alignItems: 'flex-end',
  },
  spyLabel: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  spyNameText: {
    ...Typography.h3,
    color: Colors.spy.primary,
  },
  badgesRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 10,
  },
  resultBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 6,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(74, 222, 128, 0.3)',
  },
  badgeDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  resultBadgeText: {
    ...Typography.caption,
    color: '#fff',
    fontWeight: 'bold',
  },
  scoresScroll: {
    flex: 1,
  },
  playerScoreCard: {
    marginBottom: 10,
  },
  playerScoreRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.start,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playerInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  playerNameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  miniSpyIcon: {
    width: 20,
    height: 20,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: Colors.accent.gold + '30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreValue: {
    ...Typography.h3,
    color: Colors.accent.gold,
  },
  scoreLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
});

export default VotingScreen;
