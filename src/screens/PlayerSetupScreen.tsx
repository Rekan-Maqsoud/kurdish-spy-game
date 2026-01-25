import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Player } from '../types';
import { GradientBackground, GlassCard, GlassButton, GlassInput } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';
import { loadPlayerNames } from '../utils/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type PlayerSetupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerSetup'>;

const PlayerSetupScreen: React.FC = () => {
  const navigation = useNavigation<PlayerSetupNavigationProp>();
  const { settings, initializeGame } = useGame();
  
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([
    { id: uuidv4(), name: '' },
    { id: uuidv4(), name: '' },
    { id: uuidv4(), name: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null);
  const [focusedPlayerId, setFocusedPlayerId] = useState<string | null>(null);

  // Load previously used player names
  useEffect(() => {
    const loadNames = async () => {
      const names = await loadPlayerNames();
      setSavedNames(names);
    };
    loadNames();
  }, []);

  const addPlayer = () => {
    if (players.length < 10) {
      setPlayers([...players, { id: uuidv4(), name: '' }]);
    } else {
      Alert.alert('ئاگاداری', 'زۆرترین ژمارەی یاریزان ١٠ کەسە');
    }
  };

  const removePlayer = (id: string) => {
    if (players.length > 3) {
      setPlayers(players.filter(p => p.id !== id));
    } else {
      Alert.alert('ئاگاداری', 'لانیکەم ٣ یاریزان پێویستە');
    }
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(p => (p.id === id ? { ...p, name } : p)));
    setFocusedPlayerId(id);
  };

  const selectSuggestedName = (id: string, name: string) => {
    setPlayers(players.map(p => (p.id === id ? { ...p, name } : p)));
    setShowSuggestions(null);
    setFocusedPlayerId(null);
  };

  const getFilteredSuggestions = (currentName: string, playerId: string) => {
    const usedNames = players.filter(p => p.id !== playerId).map(p => p.name.trim().toLowerCase());
    return savedNames.filter(name => {
      const nameLower = name.toLowerCase();
      const inputLower = currentName.toLowerCase();
      return nameLower.includes(inputLower) && !usedNames.includes(nameLower);
    }).slice(0, 5);
  };

  const startGame = () => {
    // Validate all players have names
    const emptyPlayers = players.filter(p => !p.name.trim());
    if (emptyPlayers.length > 0) {
      Alert.alert('ئاگاداری', 'تکایە ناوی هەموو یاریزانەکان بنووسە');
      return;
    }

    // Check for duplicate names
    const names = players.map(p => p.name.trim().toLowerCase());
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== names.length) {
      Alert.alert('ئاگاداری', 'ناوەکان دەبێت جیاواز بن');
      return;
    }

    // Create player objects
    const gamePlayers: Player[] = players.map(p => ({
      id: p.id,
      name: p.name.trim(),
      score: 0,
      isSpy: false,
      hasVoted: false,
      votedFor: null,
      hasSeenWord: false,
    }));

    initializeGame(gamePlayers);
    // Note: startNewRound is now called inside initializeGame
    navigation.navigate('WordDistribution', { playerIndex: 0 });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>یاریزانەکان</Text>
        </View>

        {/* Info Card */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="game-controller" size={20} color="#fff" style={{marginLeft: 8}} />
            <Text style={styles.infoText}>
              {settings.numberOfRounds} گەڕ • {settings.selectedCategories.length} پۆل
            </Text>
          </View>
        </GlassCard>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Players List */}
          {players.map((player, index) => {
            const suggestions = focusedPlayerId === player.id ? getFilteredSuggestions(player.name, player.id) : [];
            return (
              <View key={player.id} style={styles.playerContainer}>
                <View style={styles.playerRow}>
                  <View style={styles.playerNumber}>
                    <Text style={styles.playerNumberText}>{index + 1}</Text>
                  </View>
                  
                  <GlassInput
                    value={player.name}
                    onChangeText={(text) => updatePlayerName(player.id, text)}
                    placeholder={`یاریزانی ${index + 1}`}
                    style={styles.playerInput}
                    textAlign="right"
                    onFocus={() => setFocusedPlayerId(player.id)}
                    onBlur={() => setTimeout(() => setFocusedPlayerId(null), 200)}
                  />
                  
                  {players.length > 3 && (
                    <TouchableOpacity
                      onPress={() => removePlayer(player.id)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="close" size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  )}
                </View>
                
                {/* Name Suggestions */}
                {suggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                      {suggestions.map((name, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.suggestionChip}
                          onPress={() => selectSuggestedName(player.id, name)}
                        >
                          <Ionicons name="person" size={14} color={Colors.primary.start} />
                          <Text style={styles.suggestionText}>{name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          })}

          {/* Add Player Button */}
          {players.length < 10 && (
            <TouchableOpacity onPress={addPlayer} style={styles.addButton}>
              <View style={styles.addButtonContent}>
                <Ionicons name="add" size={24} color={Colors.primary.start} />
                <Text style={styles.addButtonText}>یاریزانی نوێ زیاد بکە</Text>
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.playerCount}>
            {players.length} یاریزان
          </Text>
        </ScrollView>

        {/* Start Button */}
        <View style={styles.footer}>
          <GlassButton
            title="دەستپێکردن"
            icon={<Ionicons name="rocket" size={22} color="#fff" />}
            onPress={startGame}
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
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 28,
    color: Colors.text.primary,
  },
  title: {
    ...Typography.h2,
    flex: 1,
    textAlign: 'center',
    marginRight: -40,
  },
  infoCard: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginLeft: 10,
  },
  infoText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  playerContainer: {
    marginBottom: 12,
  },
  playerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  playerNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.start,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  playerNumberText: {
    ...Typography.h4,
    color: '#fff',
  },
  playerInput: {
    flex: 1,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  removeButtonText: {
    fontSize: 18,
    color: Colors.spy.primary,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.glass.border,
    borderRadius: 16,
    padding: 16,
  },
  addButtonContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    fontSize: 24,
    color: Colors.primary.start,
    marginLeft: 10,
  },
  addButtonText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  playerCount: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.text.muted,
    marginTop: 16,
  },
  suggestionsContainer: {
    marginTop: 8,
    marginRight: 50,
    marginLeft: 50,
  },
  suggestionsScroll: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 4,
  },
  suggestionChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  suggestionText: {
    ...Typography.caption,
    color: Colors.text.primary,
    marginRight: 6,
  },
  footer: {
    paddingTop: 15,
  },
});

export default PlayerSetupScreen;
