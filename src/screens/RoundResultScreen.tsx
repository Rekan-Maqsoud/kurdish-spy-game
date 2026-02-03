import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Animated, Easing, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { GradientBackground, GlassCard, GlassButton, PlayerCard, GameMenu } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';
import { getCategoryById } from '../data/words';
// Round stats are saved in GameContext when round ends

type RoundResultNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoundResult'>;
type RoundResultRouteProp = RouteProp<RootStackParamList, 'RoundResult'>;

const RoundResultScreen: React.FC = () => {
  const navigation = useNavigation<RoundResultNavigationProp>();
  const route = useRoute<RoundResultRouteProp>();
  const { result } = route.params;
  
  const { gameState, proceedToNextPhase, startNewRound, changeCurrentWord, resetGame, addPlayerToGame } = useGame();
  const [shouldNavigateHome, setShouldNavigateHome] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const spyCardAnim = useRef(new Animated.Value(0)).current;
  const pointsAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const playerCardAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    // Initial animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(spyCardAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(pointsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Bounce animation for badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animate player cards with stagger
    if (gameState) {
      gameState.players.forEach((_, index) => {
        if (!playerCardAnims[index]) {
          playerCardAnims[index] = new Animated.Value(0);
        }
      });

      const animations = playerCardAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        })
      );

      Animated.stagger(100, animations).start();
    }
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
      navigation.navigate('GameEnd');
    } else {
      startNewRound();
      navigation.navigate('WordDistribution', { playerIndex: 0 });
    }
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
    navigation.navigate('WordDistribution', { playerIndex: 0 });
  };

  const handleAddPlayer = (name: string) => {
    if (!gameState) {
      return { success: false, message: 'هیچ یارییەک دەستپێنەکراوە' };
    }
    const result = addPlayerToGame(name);
    if (result.success) {
      navigation.navigate('WordDistribution', { playerIndex: gameState.players.length });
    }
    return result;
  };

  const bounceInterpolation = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <GradientBackground variant="game">
      <View style={styles.container}>
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.title}>ئەنجامی گەڕی {result.round}</Text>
          <View style={styles.headerActions}>
            <GameMenu
              onGoHome={handleGoHome}
              onChangeWord={handleChangeWord}
              onAddPlayer={handleAddPlayer}
            />
          </View>
        </Animated.View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Round Summary */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
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
          </Animated.View>

          {/* Spy Info */}
          <Animated.View
            style={{
              opacity: spyCardAnim,
              transform: [
                { 
                  scale: spyCardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  })
                },
                {
                  translateY: spyCardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                }
              ],
            }}
          >
            <GlassCard style={styles.spyInfoCard}>
              <View style={styles.spyHeader}>
                <Image source={require('../../assets/spy-icon.png')} style={{width: 40, height: 40, marginRight: 12}} resizeMode="contain" />
                <View style={styles.spyDetails}>
                  <Text style={styles.spyLabel}>سیخوڕ</Text>
                  <Text style={styles.spyName}>{result.spyNames.join('، ')}</Text>
                </View>
              </View>
              
              <View style={styles.spyResults}>
                <Animated.View 
                  style={[
                    styles.resultBadge,
                    result.spyWasFound ? styles.badgeNegative : styles.badgePositive,
                    { transform: [{ scale: bounceInterpolation }] }
                  ]}
                >
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
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.resultBadge,
                    result.spyGuessedCorrectly ? styles.badgePositive : styles.badgeNegative,
                    { transform: [{ scale: bounceInterpolation }] }
                  ]}
                >
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
                </Animated.View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Points This Round */}
          {result.pointsAwarded.length > 0 && (
            <Animated.View
              style={{
                opacity: pointsAnim,
                transform: [
                  {
                    translateX: pointsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
                    })
                  }
                ],
              }}
            >
              <Text style={styles.sectionTitle}>خاڵەکانی ئەم گەڕە</Text>
              <GlassCard style={styles.pointsCard}>
                {result.pointsAwarded.map((award, index) => {
                  const player = gameState.players.find(p => p.id === award.playerId);
                  return (
                    <Animated.View 
                      key={index} 
                      style={[
                        styles.pointRow,
                        {
                          opacity: pointsAnim,
                          transform: [{
                            translateX: pointsAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [50 * (index + 1), 0],
                            })
                          }],
                        }
                      ]}
                    >
                      <Text style={styles.pointPlayerName}>{player?.name}</Text>
                      <Animated.View style={[
                        styles.pointBadge,
                        { transform: [{ scale: bounceInterpolation }] }
                      ]}>
                        <Text style={styles.pointValue}>+{award.points}</Text>
                      </Animated.View>
                    </Animated.View>
                  );
                })}
              </GlassCard>
            </Animated.View>
          )}

          {/* Leaderboard */}
          <Animated.View
            style={{
              opacity: pointsAnim,
            }}
          >
            <Text style={styles.sectionTitle}>خشتەی خاڵەکان</Text>
          </Animated.View>
          
          {sortedPlayers.map((player, index) => {
            const cardAnim = playerCardAnims[index] || new Animated.Value(1);
            
            return (
              <Animated.View
                key={player.id}
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
                <PlayerCard
                  name={player.name}
                  score={getPlayerScore(player.id)}
                  index={index}
                  isSpy={result.spyIds.includes(player.id)}
                  revealed={true}
                  showScore={true}
                />
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <Animated.View 
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim.interpolate({
                inputRange: [0, 30],
                outputRange: [0, 30],
              })}],
            }
          ]}
        >
          <GlassButton
            title={isLastRound ? "ئەنجامی کۆتایی" : `گەڕی ${gameState.currentRound + 1}`}
            icon={isLastRound ? <Ionicons name="trophy" size={22} color="#fff" /> : <Ionicons name="play" size={22} color="#fff" />}
            onPress={handleNext}
            variant="primary"
            size="large"
            fullWidth
          />
        </Animated.View>
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
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  headerActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
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
