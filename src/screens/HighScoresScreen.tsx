import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientBackground, GlassCard, GlassButton } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { loadPlayerStats } from '../utils/storage';
import { PlayerStats, RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type HighScoresNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HighScores'>;

const HighScoresScreen: React.FC = () => {
  const navigation = useNavigation<HighScoresNavigationProp>();
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'points' | 'wins' | 'games' | 'spyEscape' | 'catchRate'>('points');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const cardAnimations = useRef<Animated.Value[]>([]).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    // Animate header when loaded
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Animate cards with stagger
      animateCards();
    }
  }, [loading, sortBy]);

  const animateCards = () => {
    // Reset and create animations for each card
    cardAnimations.length = 0;
    playerStats.forEach(() => {
      cardAnimations.push(new Animated.Value(0));
    });
    
    // Stagger animation for cards
    const animations = cardAnimations.map((anim, index) => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    
    Animated.stagger(80, animations).start();
  };

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  const openPlayerDetails = (player: PlayerStats) => {
    setSelectedPlayer(player);
    setShowModal(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      setSelectedPlayer(null);
    });
  };

  const getTrophyIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <View style={styles.trophyContainer}>
            <FontAwesome5 name="crown" size={22} color="#ffd700" />
          </View>
        );
      case 1:
        return (
          <View style={[styles.trophyContainer, styles.silverTrophy]}>
            <FontAwesome5 name="medal" size={20} color="#c0c0c0" />
          </View>
        );
      case 2:
        return (
          <View style={[styles.trophyContainer, styles.bronzeTrophy]}>
            <FontAwesome5 name="medal" size={20} color="#cd7f32" />
          </View>
        );
      default:
        return (
          <View style={styles.rankNumberContainer}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
        );
    }
  };

  // Calculate rates
  const getSpyEscapeRate = (stats: PlayerStats) => {
    if (stats.timesAsSpy === 0) return 0;
    return Math.round((stats.timesEscapedAsSpy / stats.timesAsSpy) * 100);
  };

  const getCatchSpyRate = (stats: PlayerStats) => {
    const timesAsNonSpy = stats.roundsPlayed - stats.timesAsSpy;
    if (timesAsNonSpy === 0) return 0;
    return Math.round((stats.timesCaughtSpy / timesAsNonSpy) * 100);
  };

  const getWinRate = (stats: PlayerStats) => {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
  };

  const getRoundWinRate = (stats: PlayerStats) => {
    if (stats.roundsPlayed === 0) return 0;
    return Math.round((stats.roundsWon / stats.roundsPlayed) * 100);
  };

  const getSortedStats = () => {
    return [...playerStats].sort((a, b) => {
      switch (sortBy) {
        case 'wins':
          return b.gamesWon - a.gamesWon;
        case 'games':
          return b.gamesPlayed - a.gamesPlayed;
        case 'spyEscape':
          return getSpyEscapeRate(b) - getSpyEscapeRate(a);
        case 'catchRate':
          return getCatchSpyRate(b) - getCatchSpyRate(a);
        case 'points':
        default:
          return b.totalPoints - a.totalPoints;
      }
    });
  };

  const sortedStats = getSortedStats();

  // Calculate overall stats
  const totalGames = playerStats.reduce((sum, p) => sum + p.gamesPlayed, 0);
  const totalPoints = playerStats.reduce((sum, p) => sum + p.totalPoints, 0);
  const totalRounds = playerStats.reduce((sum, p) => sum + p.roundsPlayed, 0);

  const renderPlayerModal = () => {
    if (!selectedPlayer) return null;
    
    const escapeRate = getSpyEscapeRate(selectedPlayer);
    const catchRate = getCatchSpyRate(selectedPlayer);
    const winRate = getWinRate(selectedPlayer);
    const roundWinRate = getRoundWinRate(selectedPlayer);
    const timesAsNonSpy = selectedPlayer.roundsPlayed - selectedPlayer.timesAsSpy;
    
    return (
      <Modal
        visible={showModal}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: modalAnim,
                transform: [
                  { scale: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  })},
                ],
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPlayer.name}</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                {/* Total Points Header */}
                <View style={styles.pointsHeader}>
                  <Ionicons name="star" size={32} color="#ffd700" />
                  <Text style={styles.totalPointsValue}>{selectedPlayer.totalPoints}</Text>
                  <Text style={styles.totalPointsLabel}>کۆی خاڵەکان</Text>
                </View>
                
                {/* Games Stats */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="game-controller" size={16} color="#4ecdc4" /> ئامارەکانی یاری
                  </Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statBoxValue}>{selectedPlayer.gamesPlayed}</Text>
                      <Text style={styles.statBoxLabel}>کۆی یاری</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statBoxValue, { color: '#4ecdc4' }]}>{selectedPlayer.gamesWon}</Text>
                      <Text style={styles.statBoxLabel}>بردنەوە</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statBoxValue}>{winRate}%</Text>
                      <Text style={styles.statBoxLabel}>ڕێژەی بردنەوە</Text>
                    </View>
                  </View>
                </View>
                
                {/* Rounds Stats */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="refresh" size={16} color="#ff6b6b" /> ئامارەکانی گەڕەکان
                  </Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statBoxValue}>{selectedPlayer.roundsPlayed}</Text>
                      <Text style={styles.statBoxLabel}>کۆی گەڕ</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statBoxValue, { color: '#4ecdc4' }]}>{selectedPlayer.roundsWon}</Text>
                      <Text style={styles.statBoxLabel}>بردنەوە</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statBoxValue, { color: '#ff6b6b' }]}>{selectedPlayer.roundsLost}</Text>
                      <Text style={styles.statBoxLabel}>دۆڕاندن</Text>
                    </View>
                  </View>
                </View>
                
                {/* Spy Stats */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <MaterialCommunityIcons name="incognito" size={16} color="#8b5cf6" /> کاتێک سیخوڕ بوو
                  </Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statBoxValue}>{selectedPlayer.timesAsSpy}</Text>
                      <Text style={styles.statBoxLabel}>جار سیخوڕ بوو</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statBoxValue, { color: '#4ecdc4' }]}>{selectedPlayer.timesEscapedAsSpy}</Text>
                      <Text style={styles.statBoxLabel}>دەرباز بوو</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statBoxValue, { color: escapeRate >= 50 ? '#4ecdc4' : '#ff6b6b' }]}>{escapeRate}%</Text>
                      <Text style={styles.statBoxLabel}>ڕێژەی دەربازبوون</Text>
                    </View>
                  </View>
                  <View style={styles.statsGridSmall}>
                    <View style={styles.statBoxSmall}>
                      <Text style={[styles.statBoxValueSmall, { color: '#ffd700' }]}>{selectedPlayer.timesCorrectlyGuessedWord}</Text>
                      <Text style={styles.statBoxLabelSmall}>وشەی دۆزیەوە</Text>
                    </View>
                    <View style={styles.statBoxSmall}>
                      <Text style={[styles.statBoxValueSmall, { color: '#ff6b6b' }]}>{selectedPlayer.timesSpyWasCaught}</Text>
                      <Text style={styles.statBoxLabelSmall}>گیرا</Text>
                    </View>
                  </View>
                </View>
                
                {/* Detective Stats */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="search" size={16} color="#ffd700" /> کاتێک سیخوڕ نەبوو
                  </Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statBoxValue}>{timesAsNonSpy}</Text>
                      <Text style={styles.statBoxLabel}>جار یاریزان بوو</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statBoxValue, { color: '#4ecdc4' }]}>{selectedPlayer.timesCaughtSpy}</Text>
                      <Text style={styles.statBoxLabel}>سیخوڕی گرت</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={[styles.statBoxValue, { color: catchRate >= 50 ? '#4ecdc4' : '#ff6b6b' }]}>{catchRate}%</Text>
                      <Text style={styles.statBoxLabel}>ڕێژەی گرتن</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>تۆماری یاریزانەکان</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons name="hourglass" size={50} color="#ffd700" />
            </Animated.View>
            <Text style={styles.loadingText}>چاوەڕوانبە...</Text>
          </View>
        ) : playerStats.length === 0 ? (
          <Animated.View 
            style={[
              styles.emptyContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.emptyIconContainer}>
              <Ionicons name="trophy" size={80} color="#ffd700" />
              <Ionicons name="sparkles" size={30} color="#ffd700" style={styles.sparkle1} />
              <Ionicons name="sparkles" size={24} color="#ffd700" style={styles.sparkle2} />
            </View>
            <Text style={styles.emptyTitle}>هێشتا تۆمارێک نییە!</Text>
            <Text style={styles.emptyText}>
              یاری بکە بۆ ئەوەی تۆمارەکانت لێرە دەربکەون
            </Text>
            <GlassButton
              title="دەستپێکردنی یاری"
              icon={<Ionicons name="game-controller" size={22} color="#fff" />}
              onPress={() => navigation.navigate('PlayerSetup')}
              variant="primary"
              size="large"
              style={styles.startButton}
            />
          </Animated.View>
        ) : (
          <>
            {/* Overall Stats Summary */}
            <Animated.View 
              style={[
                styles.summaryContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <GlassCard style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Ionicons name="people" size={24} color="#4ecdc4" />
                    <Text style={styles.summaryValue}>{playerStats.length}</Text>
                    <Text style={styles.summaryLabel}>یاریزان</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <MaterialCommunityIcons name="gamepad-variant" size={24} color="#ff6b6b" />
                    <Text style={styles.summaryValue}>{Math.round(totalGames / Math.max(playerStats.length, 1))}</Text>
                    <Text style={styles.summaryLabel}>یاری بۆ هەریەک</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Ionicons name="star" size={24} color="#ffd700" />
                    <Text style={styles.summaryValue}>{totalPoints}</Text>
                    <Text style={styles.summaryLabel}>کۆی خاڵ</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>

            {/* Sort Buttons */}
            <Animated.View 
              style={[
                styles.sortContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScrollContent}>
                <TouchableOpacity
                  style={[styles.sortButton, sortBy === 'points' && styles.sortButtonActive]}
                  onPress={() => setSortBy('points')}
                >
                  <Ionicons 
                    name="star" 
                    size={14} 
                    color={sortBy === 'points' ? '#fff' : 'rgba(255,255,255,0.5)'} 
                    style={styles.sortIcon}
                  />
                  <Text style={[styles.sortButtonText, sortBy === 'points' && styles.sortButtonTextActive]}>
                    خاڵ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortButton, sortBy === 'wins' && styles.sortButtonActive]}
                  onPress={() => setSortBy('wins')}
                >
                  <Ionicons 
                    name="trophy" 
                    size={14} 
                    color={sortBy === 'wins' ? '#fff' : 'rgba(255,255,255,0.5)'} 
                    style={styles.sortIcon}
                  />
                  <Text style={[styles.sortButtonText, sortBy === 'wins' && styles.sortButtonTextActive]}>
                    بردنەوە
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortButton, sortBy === 'spyEscape' && styles.sortButtonActive]}
                  onPress={() => setSortBy('spyEscape')}
                >
                  <MaterialCommunityIcons 
                    name="incognito" 
                    size={14} 
                    color={sortBy === 'spyEscape' ? '#fff' : 'rgba(255,255,255,0.5)'} 
                    style={styles.sortIcon}
                  />
                  <Text style={[styles.sortButtonText, sortBy === 'spyEscape' && styles.sortButtonTextActive]}>
                    دەرباز
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortButton, sortBy === 'catchRate' && styles.sortButtonActive]}
                  onPress={() => setSortBy('catchRate')}
                >
                  <Ionicons 
                    name="search" 
                    size={14} 
                    color={sortBy === 'catchRate' ? '#fff' : 'rgba(255,255,255,0.5)'} 
                    style={styles.sortIcon}
                  />
                  <Text style={[styles.sortButtonText, sortBy === 'catchRate' && styles.sortButtonTextActive]}>
                    گرتن
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>

            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {sortedStats.map((stat, index) => {
                const cardAnim = cardAnimations[index] || new Animated.Value(1);
                const escapeRate = getSpyEscapeRate(stat);
                const catchRate = getCatchSpyRate(stat);
                
                return (
                  <Animated.View
                    key={stat.name}
                    style={{
                      opacity: cardAnim,
                      transform: [
                        { 
                          translateX: cardAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 0],
                          })
                        },
                        {
                          scale: cardAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1],
                          })
                        }
                      ],
                    }}
                  >
                    <TouchableOpacity onPress={() => openPlayerDetails(stat)} activeOpacity={0.8}>
                      <GlassCard style={[
                        styles.scoreCard,
                        index === 0 && styles.topScoreCard,
                      ]}>
                        <View style={styles.scoreRow}>
                          <View style={styles.rankContainer}>
                            {getTrophyIcon(index)}
                          </View>
                          
                          <View style={styles.scoreInfo}>
                            <Text style={[
                              styles.playerName,
                              index === 0 && styles.topPlayerName,
                            ]}>
                              {stat.name}
                            </Text>
                            
                            {/* Detailed Stats Row */}
                            <View style={styles.detailsRow}>
                              <View style={styles.statBadge}>
                                <Ionicons name="trophy" size={10} color="#ffd700" />
                                <Text style={styles.statBadgeText}>{stat.gamesWon}</Text>
                              </View>
                              <View style={styles.statBadge}>
                                <MaterialCommunityIcons name="incognito" size={10} color="#8b5cf6" />
                                <Text style={styles.statBadgeText}>{escapeRate}%</Text>
                              </View>
                              <View style={styles.statBadge}>
                                <Ionicons name="search" size={10} color="#4ecdc4" />
                                <Text style={styles.statBadgeText}>{catchRate}%</Text>
                              </View>
                            </View>
                            
                            {/* Secondary stats */}
                            <View style={styles.secondaryStats}>
                              <Text style={styles.secondaryStatText}>
                                <Ionicons name="game-controller" size={10} color="rgba(255,255,255,0.5)" /> {stat.gamesPlayed} یاری
                              </Text>
                              <Text style={styles.secondaryStatText}>
                                <Ionicons name="refresh" size={10} color="rgba(255,255,255,0.5)" /> {stat.roundsPlayed} گەڕ
                              </Text>
                            </View>
                          </View>
                          
                          <View style={[
                            styles.scoreBadge,
                            index === 0 && styles.goldBadge,
                            index === 1 && styles.silverBadge,
                            index === 2 && styles.bronzeBadge,
                          ]}>
                            <Text style={[
                              styles.scoreValue,
                              index === 0 && styles.goldScoreValue,
                            ]}>
                              {stat.totalPoints}
                            </Text>
                            <Text style={styles.scoreLabel}>خاڵ</Text>
                          </View>
                        </View>
                        
                        {/* Tap for more indicator */}
                        <View style={styles.tapIndicator}>
                          <Text style={styles.tapIndicatorText}>کرتە بکە بۆ وردەکاری</Text>
                          <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.4)" />
                        </View>
                      </GlassCard>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
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
        
        {renderPlayerModal()}
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
    marginLeft: -10,
  },
  title: {
    ...Typography.h2,
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
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: -20,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 0,
    left: -15,
  },
  emptyTitle: {
    ...Typography.h2,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    marginTop: 20,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryCard: {
    paddingVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...Typography.h3,
    marginTop: 8,
  },
  summaryLabel: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    fontSize: 10,
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
  },
  sortScrollContent: {
    flexDirection: 'row-reverse',
  },
  sortButton: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  sortButtonActive: {
    backgroundColor: Colors.primary.start,
  },
  sortIcon: {
    marginLeft: 4,
  },
  sortButtonText: {
    fontSize: 12,
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
    marginBottom: 12,
    paddingBottom: 8,
  },
  topScoreCard: {
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  scoreRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    marginLeft: 12,
  },
  trophyContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  silverTrophy: {
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
  },
  bronzeTrophy: {
    backgroundColor: 'rgba(205, 127, 50, 0.2)',
  },
  rankNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scoreInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  playerName: {
    ...Typography.h4,
    marginBottom: 6,
  },
  topPlayerName: {
    color: '#ffd700',
  },
  detailsRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    marginBottom: 4,
  },
  statBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  statBadgeText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryStats: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  secondaryStatText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  scoreBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    minWidth: 70,
    alignItems: 'center',
  },
  goldBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  silverBadge: {
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
  },
  bronzeBadge: {
    backgroundColor: 'rgba(205, 127, 50, 0.2)',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  goldScoreValue: {
    color: '#FFD700',
  },
  scoreLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  tapIndicator: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  tapIndicatorText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  footer: {
    paddingTop: 15,
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'rgba(30, 30, 50, 0.98)',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    ...Typography.h2,
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  pointsHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
  },
  totalPointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffd700',
    marginTop: 8,
  },
  totalPointsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 8,
  },
  statsGridSmall: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  statBoxLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
    textAlign: 'center',
  },
  statBoxSmall: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statBoxValueSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statBoxLabelSmall: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
});

export default HighScoresScreen;
