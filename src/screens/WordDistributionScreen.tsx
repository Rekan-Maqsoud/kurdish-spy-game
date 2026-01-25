import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { GradientBackground, GlassCard, GlassButton, SimpleWordDisplay } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';
import { getCategoryById } from '../data/words';

type WordDistributionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WordDistribution'>;
type WordDistributionRouteProp = RouteProp<RootStackParamList, 'WordDistribution'>;

const { height } = Dimensions.get('window');

const WordDistributionScreen: React.FC = () => {
  const navigation = useNavigation<WordDistributionNavigationProp>();
  const route = useRoute<WordDistributionRouteProp>();
  const { playerIndex } = route.params;
  
  const { gameState, markPlayerAsSeenWord } = useGame();
  const [showWord, setShowWord] = useState(false);

  console.log('[WordDistribution] Rendered - playerIndex:', playerIndex, 'gameState:', gameState ? {
    currentRound: gameState.currentRound,
    currentWord: gameState.currentWord,
    spyId: gameState.spyId,
    phase: gameState.phase
  } : null);

  useEffect(() => {
    if (!gameState) {
      console.log('[WordDistribution] No gameState, navigating home');
      navigation.navigate('Home');
    }
  }, [gameState, navigation]);

  if (!gameState) {
    return null;
  }

  const currentPlayer = gameState.players[playerIndex];
  const isSpy = currentPlayer.id === gameState.spyId;
  const category = getCategoryById(gameState.currentCategory);

  const handleShowWord = () => {
    console.log('[WordDistribution] handleShowWord - showing word for', currentPlayer.name);
    setShowWord(true);
  };

  const handleNext = () => {
    console.log('[WordDistribution] handleNext - playerIndex:', playerIndex, 'totalPlayers:', gameState.players.length);
    markPlayerAsSeenWord(currentPlayer.id);
    
    if (playerIndex < gameState.players.length - 1) {
      // More players to show
      console.log('[WordDistribution] More players, navigating to next player');
      setShowWord(false);
      navigation.navigate('WordDistribution', { playerIndex: playerIndex + 1 });
    } else {
      // All players have seen their words
      console.log('[WordDistribution] All players seen, navigating to Discussion');
      navigation.navigate('Discussion');
    }
  };

  return (
    <GradientBackground variant={isSpy && showWord ? 'spy' : 'game'}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.roundBadge}>
            <Text style={styles.roundText}>
              گەڕی {gameState.currentRound} لە {gameState.totalRounds}
            </Text>
          </View>
          <View style={styles.playerProgress}>
            <Text style={styles.progressText}>
              {playerIndex + 1} / {gameState.players.length}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {!showWord ? (
            // Player name screen
            <View style={styles.playerPrompt}>
              <GlassCard style={styles.promptCard}>
                <Ionicons name="phone-portrait" size={48} color="#fff" style={{marginBottom: 16}} />
                <Text style={styles.promptText}>مۆبایلەکە بدە بۆ</Text>
                <Text style={styles.playerName}>{currentPlayer.name}</Text>
                <Text style={styles.promptHint}>
                  پێش کلیک کردن، دڵنیابە کە کەسی دیکە سەیری ئەکران ناکات
                </Text>
              </GlassCard>
              
              <GlassButton
                title="وشەکەم پیشان بدە"
                icon={<Ionicons name="eye" size={22} color="#fff" />}
                onPress={handleShowWord}
                variant="primary"
                size="large"
                fullWidth
                style={styles.showButton}
              />
            </View>
          ) : (
            // Word card screen
            <View style={styles.wordContainer}>
              <GlassCard style={styles.wordCard}>
                <SimpleWordDisplay
                  word={gameState.currentWord}
                  isSpy={isSpy}
                  categoryName={category?.name}
                  categoryIcon={category?.icon}
                />
              </GlassCard>
              
              <GlassButton
                title={playerIndex < gameState.players.length - 1 
                  ? "باشە، دواتر" 
                  : "دەستپێکردنی یاری"}
                icon={playerIndex < gameState.players.length - 1 
                  ? <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  : <Ionicons name="play" size={22} color="#fff" />}
                onPress={handleNext}
                variant={isSpy ? 'danger' : 'success'}
                size="large"
                fullWidth
                style={styles.nextButton}
              />
            </View>
          )}
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
  playerProgress: {
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerPrompt: {
    width: '100%',
    alignItems: 'center',
  },
  promptCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 30,
  },
  promptEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  promptText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
    textAlign: 'center',
  },
  playerName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  promptHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  showButton: {
    marginTop: 20,
  },
  wordContainer: {
    alignItems: 'center',
    width: '100%',
  },
  wordCard: {
    width: '100%',
    paddingVertical: 20,
  },
  nextButton: {
    marginTop: 30,
  },
});

export default WordDistributionScreen;
