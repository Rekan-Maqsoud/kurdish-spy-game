import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { GradientBackground, GlassCard, GlassButton } from '../components';
import Colors from '../constants/colors';
import { loadPlayerStats } from '../utils/storage';
import { PlayerStats } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HighScoresScreen: React.FC = () => {
  const navigation = useNavigation();
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'points' | 'wins' | 'games'>('points');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const stats = await loadPlayerStats();
    setPlayerStats(stats);
    setLoading(false);
  };

  const handleClearStats = () => {
    Alert.alert(
      'سڕینەوەی هەموو',
      'دڵنیایت لە سڕینەوەی هەموو تۆمارەکان؟',
      [
        { text: 'نەخێر', style: 'cancel' },
        {
          text: 'بەڵێ',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('@spy_game_player_stats');
            setPlayerStats([]);
          },
        },
      ]
    );
  };

  const getTrophyIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FontAwesome5 name="crown" size={20} color="#ffd700" />;
      case 1:
        return <FontAwesome5 name="medal" size={20} color="#c0c0c0" />;
      case 2:
        return <FontAwesome5 name="medal" size={20} color="#cd7f32" />;
      default:
        return <Text style={styles.rankNumber}>{index + 1}</Text>;
    }
  };

  const getSortedStats = () => {
    return [...playerStats].sort((a, b) => {
      switch (sortBy) {
        case 'wins':
          return b.gamesWon - a.gamesWon;
        case 'games':
          return b.gamesPlayed - a.gamesPlayed;
        case 'points':
        default:
          return b.totalPoints - a.totalPoints;
      }
    });
  };

  const sortedStats = getSortedStats();

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>تۆماری یاریزانەکان</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>چاوەڕوانبە...</Text>
          </View>
        ) : playerStats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy" size={80} color="#ffd700" style={{marginBottom: 16}} />
            <Text style={styles.emptyTitle}>هێشتا تۆمارێک نییە!</Text>
            <Text style={styles.emptyText}>
              یاری بکە بۆ ئەوەی تۆمارەکانت لێرە دەربکەون
            </Text>
            <GlassButton
              title="دەستپێکردنی یاری"
              icon={<Ionicons name="game-controller" size={22} color="#fff" />}
              onPress={() => navigation.navigate('PlayerSetup' as never)}
              variant="primary"
              size="large"
              style={styles.startButton}
            />
          </View>
        ) : (
          <>
            {/* Sort Buttons */}
            <View style={styles.sortContainer}>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'points' && styles.sortButtonActive]}
                onPress={() => setSortBy('points')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'points' && styles.sortButtonTextActive]}>
                  خاڵەکان
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'wins' && styles.sortButtonActive]}
                onPress={() => setSortBy('wins')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'wins' && styles.sortButtonTextActive]}>
                  بردنەوە
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'games' && styles.sortButtonActive]}
                onPress={() => setSortBy('games')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'games' && styles.sortButtonTextActive]}>
                  یاریەکان
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {sortedStats.map((stat, index) => (
                <GlassCard key={stat.name} style={styles.scoreCard}>
                  <View style={styles.scoreRow}>
                    <View style={styles.rankContainer}>
                      {getTrophyIcon(index)}
                    </View>
                    <View style={styles.scoreInfo}>
                      <Text style={styles.playerName}>{stat.name}</Text>
                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <Ionicons name="trophy" size={14} color="#ffd700" />
                          <Text style={styles.statValue}>{stat.gamesWon}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="game-controller" size={14} color="#4ecdc4" />
                          <Text style={styles.statValue}>{stat.gamesPlayed}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[
                      styles.scoreBadge,
                      index === 0 && styles.goldBadge,
                      index === 1 && styles.silverBadge,
                      index === 2 && styles.bronzeBadge,
                    ]}>
                      <Text style={styles.scoreValue}>{stat.totalPoints}</Text>
                      <Text style={styles.scoreLabel}>خاڵ</Text>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <GlassButton
                title="سڕینەوەی هەموو"
                icon={<Ionicons name="trash" size={20} color="#fff" />}
                onPress={handleClearStats}
                variant="danger"
                size="medium"
              />
            </View>
          </>
        )}
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
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: -40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    marginTop: 20,
  },
  sortContainer: {
    flexDirection: 'row-reverse',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  sortButtonActive: {
    backgroundColor: Colors.primary.start,
  },
  sortButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scoreCard: {
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginLeft: 12,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scoreInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scoreBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  goldBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  silverBadge: {
    backgroundColor: 'rgba(192, 192, 192, 0.3)',
  },
  bronzeBadge: {
    backgroundColor: 'rgba(205, 127, 50, 0.3)',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  scoreLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footer: {
    paddingTop: 15,
    alignItems: 'center',
  },
});

export default HighScoresScreen;
