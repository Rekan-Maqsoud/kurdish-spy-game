import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, SavedGame, HighScore, CategoryId, PlayerStats } from '../types';

const STORAGE_KEYS = {
  SETTINGS: '@spy_game_settings',
  HIGH_SCORES: '@spy_game_high_scores',
  SAVED_GAMES: '@spy_game_saved',
  PLAYER_STATS: '@spy_game_player_stats',
  PLAYER_NAMES: '@spy_game_player_names',
};

// Default settings
export const DEFAULT_SETTINGS: GameSettings = {
  numberOfRounds: 3,
  timePerRound: 0, // 0 = unlimited
  selectedCategories: ['places', 'food', 'animals', 'objects'] as CategoryId[],
  spyGuessOptions: 4,
  pointsForFindingSpy: 1,
  pointsForSpyGuessing: 2,
};

// Settings
export const saveSettings = async (settings: GameSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<GameSettings> => {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (settings) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settings) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// High Scores
export const saveHighScore = async (score: HighScore): Promise<void> => {
  try {
    const existing = await loadHighScores();
    const updated = [...existing, score]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10
    await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

export const loadHighScores = async (): Promise<HighScore[]> => {
  try {
    const scores = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    if (scores) {
      return JSON.parse(scores);
    }
    return [];
  } catch (error) {
    console.error('Error loading high scores:', error);
    return [];
  }
};

export const clearHighScores = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.HIGH_SCORES);
  } catch (error) {
    console.error('Error clearing high scores:', error);
  }
};

// Saved Games
export const saveGame = async (game: SavedGame): Promise<void> => {
  try {
    const existing = await loadSavedGames();
    const updated = [game, ...existing].slice(0, 20); // Keep last 20
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving game:', error);
  }
};

export const loadSavedGames = async (): Promise<SavedGame[]> => {
  try {
    const games = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_GAMES);
    if (games) {
      return JSON.parse(games);
    }
    return [];
  } catch (error) {
    console.error('Error loading saved games:', error);
    return [];
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

// Player Stats - All-time leaderboard
export const loadPlayerStats = async (): Promise<PlayerStats[]> => {
  try {
    const stats = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
    if (stats) {
      return JSON.parse(stats);
    }
    return [];
  } catch (error) {
    console.error('Error loading player stats:', error);
    return [];
  }
};

export const updatePlayerStats = async (
  playerName: string,
  points: number,
  won: boolean
): Promise<void> => {
  try {
    const existing = await loadPlayerStats();
    const normalizedName = playerName.trim().toLowerCase();
    const existingIndex = existing.findIndex(
      p => p.name.trim().toLowerCase() === normalizedName
    );

    if (existingIndex >= 0) {
      existing[existingIndex].totalPoints += points;
      existing[existingIndex].gamesPlayed += 1;
      if (won) existing[existingIndex].gamesWon += 1;
      existing[existingIndex].lastPlayed = new Date().toISOString();
      // Keep original name casing
    } else {
      existing.push({
        name: playerName.trim(),
        totalPoints: points,
        gamesPlayed: 1,
        gamesWon: won ? 1 : 0,
        lastPlayed: new Date().toISOString(),
      });
    }

    await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(existing));
    
    // Also save player name for suggestions
    await savePlayerName(playerName);
  } catch (error) {
    console.error('Error updating player stats:', error);
  }
};

// Player names for autocomplete suggestions
export const savePlayerName = async (name: string): Promise<void> => {
  try {
    const names = await loadPlayerNames();
    const normalizedName = name.trim().toLowerCase();
    if (!names.some(n => n.toLowerCase() === normalizedName)) {
      names.push(name.trim());
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_NAMES, JSON.stringify(names));
    }
  } catch (error) {
    console.error('Error saving player name:', error);
  }
};

export const loadPlayerNames = async (): Promise<string[]> => {
  try {
    const names = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_NAMES);
    if (names) {
      return JSON.parse(names);
    }
    return [];
  } catch (error) {
    console.error('Error loading player names:', error);
    return [];
  }
};

export default {
  saveSettings,
  loadSettings,
  saveHighScore,
  loadHighScores,
  clearHighScores,
  saveGame,
  loadSavedGames,
  clearAllData,
  loadPlayerStats,
  updatePlayerStats,
  savePlayerName,
  loadPlayerNames,
  DEFAULT_SETTINGS,
};
