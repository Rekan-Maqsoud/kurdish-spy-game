import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { GradientBackground, GlassCard, GlassButton, PlayerCard } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';
import { getCategoryById } from '../data/words';

type DiscussionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Discussion'>;

const DiscussionScreen: React.FC = () => {
  const navigation = useNavigation<DiscussionNavigationProp>();
  const { gameState, settings } = useGame();
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    if (settings.timePerRound > 0) {
      setTimer(settings.timePerRound);
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev && prev <= 1) {
            clearInterval(interval);
            navigation.navigate('Voting');
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (!gameState) {
      navigation.navigate('Home');
    }
  }, [gameState, navigation]);

  if (!gameState) {
    return null;
  }

  const category = getCategoryById(gameState.currentCategory);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const proceedToVoting = () => {
    navigation.navigate('Voting');
  };

  return (
    <GradientBackground variant="game">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.roundBadge}>
            <Text style={styles.roundText}>
              گەڕی {gameState.currentRound} لە {gameState.totalRounds}
            </Text>
          </View>
          {timer !== null && (
            <View style={[styles.timerBadge, timer < 30 && styles.timerWarning]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="timer-outline" size={18} color="#fff" style={{marginRight: 4}} />
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Category Info */}
        <GlassCard style={styles.categoryCard}>
          <View style={styles.categoryContent}>
            <Ionicons name={(category?.icon || 'help-circle') as any} size={32} color="#fff" />
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryLabel}>پۆلی ئەم گەڕەیە</Text>
              <Text style={styles.categoryName}>{category?.name}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Discussion Tips */}
        <GlassCard style={styles.tipsCard}>
          <View style={{flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 8}}>
            <Ionicons name="chatbubbles" size={24} color="#fff" style={{marginLeft: 8}} />
            <Text style={styles.tipsTitle}>کاتی گفتوگۆ!</Text>
          </View>
          <Text style={styles.tipsText}>
            • پرسیار لە یەکتری بکەن دەربارەی وشەکە{'\n'}
            • وەڵام بدەنەوە بەبێ گوتنی وشەکە{'\n'}
            • هەوڵبدەن سیخوڕەکە بدۆزنەوە!
          </Text>
        </GlassCard>

        {/* Players */}
        <Text style={styles.sectionTitle}>یاریزانەکان</Text>
        <ScrollView 
          style={styles.playersScroll}
          showsVerticalScrollIndicator={false}
        >
          {gameState.players.map((player, index) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              score={player.score}
              index={index}
              showScore={true}
            />
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <GlassButton
            title="دەستپێکردنی دەنگدان"
            icon={<MaterialCommunityIcons name="vote" size={22} color="#fff" />}
            onPress={proceedToVoting}
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
  timerBadge: {
    backgroundColor: Colors.glass.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  timerWarning: {
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
    borderColor: Colors.spy.primary,
  },
  timerText: {
    ...Typography.body,
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryCard: {
    marginBottom: 16,
  },
  categoryContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 40,
    marginLeft: 15,
  },
  categoryInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  categoryLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  categoryName: {
    ...Typography.h3,
  },
  tipsCard: {
    marginBottom: 20,
  },
  tipsTitle: {
    ...Typography.h4,
    textAlign: 'right',
    marginBottom: 12,
    color: Colors.accent.gold,
  },
  tipsText: {
    ...Typography.body,
    textAlign: 'right',
    lineHeight: 26,
    writingDirection: 'rtl',
  },
  sectionTitle: {
    ...Typography.h4,
    textAlign: 'right',
    marginBottom: 12,
    color: Colors.text.secondary,
  },
  playersScroll: {
    flex: 1,
    marginBottom: 10,
  },
  footer: {
    paddingTop: 10,
  },
});

export default DiscussionScreen;
