import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { GradientBackground, GlassCard, GlassButton } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';
import { updatePlayerStats } from '../utils/storage';

type GameEndNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameEnd'>;

const { width } = Dimensions.get('window');

const GameEndScreen: React.FC = () => {
  const navigation = useNavigation<GameEndNavigationProp>();
  const { gameState, roundResults, resetGame } = useGame();

  useEffect(() => {
    if (!gameState) {
      navigation.navigate('Home');
    }
  }, [gameState, navigation]);

  // Save player stats when game ends
  useEffect(() => {
    if (gameState && gameState.players.length > 0) {
      const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
      const winnerScore = sortedPlayers[0].score;
      
      // Save each player's stats
      gameState.players.forEach(player => {
        const isWinner = player.score === winnerScore;
        updatePlayerStats(player.name, player.score, isWinner);
      });
    }
  }, []); // Run once when component mounts

  if (!gameState) {
    return null;
  }

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isTeam = sortedPlayers.filter(p => p.score === winner.score).length > 1;

  const getTrophyIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FontAwesome5 name="medal" size={24} color="#ffd700" />;
      case 1:
        return <FontAwesome5 name="medal" size={24} color="#c0c0c0" />;
      case 2:
        return <FontAwesome5 name="medal" size={24} color="#cd7f32" />;
      default:
        return <Ionicons name="ribbon" size={24} color="#8b5cf6" />;
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate('PlayerSetup');
  };

  const handleGoHome = () => {
    resetGame();
    navigation.navigate('Home');
  };

  // Stats
  const totalRounds = roundResults.length;
  const spyWins = roundResults.filter(r => !r.spyWasFound || r.spyGuessedCorrectly).length;
  const playerWins = totalRounds - spyWins;

  return (
    <GradientBackground variant="success">
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Winner Celebration */}
          <View style={styles.celebration}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16}}>
              <Ionicons name="sparkles" size={40} color="#ffd700" />
              <Ionicons name="trophy" size={60} color="#ffd700" style={{marginHorizontal: 16}} />
              <Ionicons name="sparkles" size={40} color="#ffd700" />
            </View>
            <Text style={styles.congratsText}>پیرۆزە!</Text>
            <Text style={styles.winnerName}>
              {isTeam ? 'یەکسان!' : winner.name}
            </Text>
            <View style={styles.winnerScore}>
              <Text style={styles.winnerScoreLabel}>خاڵی کۆتایی</Text>
              <Text style={styles.winnerScoreValue}>{winner.score}</Text>
            </View>
          </View>

          {/* Final Standings */}
          <Text style={styles.sectionTitle}>ڕیزبەندی کۆتایی</Text>
          <GlassCard style={styles.standingsCard}>
            {sortedPlayers.map((player, index) => (
              <View 
                key={player.id} 
                style={[
                  styles.standingRow,
                  index === 0 && styles.winnerRow,
                ]}
              >
                <View style={styles.trophy}>{getTrophyIcon(index)}</View>
                <View style={styles.playerInfo}>
                  <Text style={[
                    styles.playerName,
                    index === 0 && styles.winnerPlayerName,
                  ]}>
                    {player.name}
                  </Text>
                </View>
                <View style={[
                  styles.scoreBadge,
                  index === 0 && styles.winnerScoreBadge,
                ]}>
                  <Text style={[
                    styles.scoreText,
                    index === 0 && styles.winnerScoreText,
                  ]}>
                    {player.score}
                  </Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Game Stats */}
          <Text style={styles.sectionTitle}>ئامارەکان</Text>
          <GlassCard style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="target" size={28} color="#fff" style={{marginBottom: 4}} />
                <Text style={styles.statValue}>{totalRounds}</Text>
                <Text style={styles.statLabel}>گەڕ</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="people" size={28} color="#fff" style={{marginBottom: 4}} />
                <Text style={styles.statValue}>{playerWins}</Text>
                <Text style={styles.statLabel}>بردنەوەی یاریزان</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Image source={require('../../assets/spy-icon.png')} style={{width: 28, height: 28, marginBottom: 4}} resizeMode="contain" />
                <Text style={styles.statValue}>{spyWins}</Text>
                <Text style={styles.statLabel}>بردنەوەی سیخوڕ</Text>
              </View>
            </View>
          </GlassCard>

          {/* Fun Message */}
          <GlassCard style={styles.funCard}>
            <Ionicons name="sparkles" size={32} color="#ffd700" style={{marginBottom: 8}} />
            <Text style={styles.funText}>
              یاریەکی خۆش بوو!{'\n'}
              ئومێدوارم کەیفتان لێ هاتبێت
            </Text>
          </GlassCard>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <GlassButton
            title="یەکجارێکی دیکە"
            icon={<Ionicons name="refresh" size={22} color="#fff" />}
            onPress={handlePlayAgain}
            variant="primary"
            size="large"
            fullWidth
            style={styles.button}
          />
          <GlassButton
            title="گەڕانەوە بۆ سەرەتا"
            icon={<Ionicons name="home" size={22} color="#fff" />}
            onPress={handleGoHome}
            variant="ghost"
            size="large"
            fullWidth
            style={styles.button}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  celebration: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  celebrationEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  congratsText: {
    ...Typography.h3,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  winnerName: {
    ...Typography.h1,
    fontSize: 44,
    color: Colors.accent.gold,
    marginBottom: 20,
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  winnerScore: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  winnerScoreLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  winnerScoreValue: {
    ...Typography.score,
    fontSize: 56,
  },
  sectionTitle: {
    ...Typography.h4,
    textAlign: 'right',
    marginBottom: 12,
    color: Colors.accent.gold,
  },
  standingsCard: {
    marginBottom: 20,
  },
  standingRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.border,
  },
  winnerRow: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    marginHorizontal: -10,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
  },
  trophy: {
    fontSize: 28,
    marginLeft: 12,
  },
  playerInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  playerName: {
    ...Typography.h4,
  },
  winnerPlayerName: {
    color: Colors.accent.gold,
  },
  scoreBadge: {
    backgroundColor: Colors.glass.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  winnerScoreBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  scoreText: {
    ...Typography.h4,
  },
  winnerScoreText: {
    color: Colors.accent.gold,
  },
  statsCard: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    ...Typography.h3,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.glass.border,
  },
  funCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  funEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  funText: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    paddingTop: 10,
  },
  button: {
    marginVertical: 6,
  },
});

export default GameEndScreen;
