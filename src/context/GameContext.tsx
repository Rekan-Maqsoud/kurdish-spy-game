import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, GameSettings, Player, CategoryId, GamePhase, RoundResult, SavedGamePlayer, GamePlayerStats } from '../types';
import { getRandomWord, getSpyGuessOptions, getCategoryById } from '../data/words';
import { loadSettings, saveSettings, DEFAULT_SETTINGS, saveHighScore, saveGame } from '../utils/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface GameContextType {
  gameState: GameState | null;
  settings: GameSettings;
  roundResults: RoundResult[];
  initializeGame: (players: Player[]) => void;
  startNewRound: () => void;
  markPlayerAsSeenWord: (playerId: string) => void;
  submitVote: (voterId: string, suspectId: string) => void;
  submitSpyGuess: (word: string) => boolean;
  skipSpyGuess: () => void;
  calculateRoundResults: () => RoundResult;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetGame: () => void;
  proceedToNextPhase: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Action types
type GameAction =
  | { type: 'SET_SETTINGS'; payload: GameSettings }
  | { type: 'INITIALIZE_GAME'; payload: { 
      players: Player[]; 
      settings: GameSettings;
      firstRound: {
        word: string;
        categoryId: CategoryId;
        spyId: string;
        spyGuessOptions: string[];
      }
    } }
  | { type: 'START_ROUND'; payload: { word: string; categoryId: CategoryId; spyId: string; spyGuessOptions: string[] } }
  | { type: 'MARK_SEEN_WORD'; payload: string }
  | { type: 'SUBMIT_VOTE'; payload: { voterId: string; suspectId: string } }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'ADD_ROUND_RESULT'; payload: RoundResult }
  | { type: 'ADD_USED_WORD'; payload: string }
  | { type: 'UPDATE_PLAYER_SCORES'; payload: { playerId: string; points: number }[] }
  | { type: 'RESET_FOR_NEW_ROUND' }
  | { type: 'RESET_GAME' };

interface State {
  gameState: GameState | null;
  settings: GameSettings;
  roundResults: RoundResult[];
}

const initialState: State = {
  gameState: null,
  settings: DEFAULT_SETTINGS,
  roundResults: [],
};

function gameReducer(state: State, action: GameAction): State {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };

    case 'INITIALIZE_GAME':
      console.log('[GameReducer] INITIALIZE_GAME with first round - word:', action.payload.firstRound.word);
      return {
        ...state,
        gameState: {
          currentRound: 1, // Start at round 1
          totalRounds: action.payload.settings.numberOfRounds,
          currentWord: action.payload.firstRound.word,
          currentCategory: action.payload.firstRound.categoryId,
          players: action.payload.players.map(p => ({
            ...p,
            isSpy: p.id === action.payload.firstRound.spyId,
            hasVoted: false,
            votedFor: null,
            hasSeenWord: false,
          })),
          spyId: action.payload.firstRound.spyId,
          phase: 'distribution',
          usedWords: [action.payload.firstRound.word],
          roundStartTime: Date.now(),
          spyGuessOptions: action.payload.firstRound.spyGuessOptions,
        },
        roundResults: [],
      };

    case 'START_ROUND':
      console.log('[GameReducer] START_ROUND - word:', action.payload.word, 'spyId:', action.payload.spyId);
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentRound: state.gameState.currentRound + 1,
          currentWord: action.payload.word,
          currentCategory: action.payload.categoryId,
          spyId: action.payload.spyId,
          phase: 'distribution',
          roundStartTime: Date.now(),
          spyGuessOptions: action.payload.spyGuessOptions,
          players: state.gameState.players.map(p => ({
            ...p,
            isSpy: p.id === action.payload.spyId,
            hasVoted: false,
            votedFor: null,
            hasSeenWord: false,
          })),
        },
      };

    case 'MARK_SEEN_WORD':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: state.gameState.players.map(p =>
            p.id === action.payload ? { ...p, hasSeenWord: true } : p
          ),
        },
      };

    case 'SUBMIT_VOTE':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: state.gameState.players.map(p =>
            p.id === action.payload.voterId
              ? { ...p, hasVoted: true, votedFor: action.payload.suspectId }
              : p
          ),
        },
      };

    case 'SET_PHASE':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: action.payload,
        },
      };

    case 'ADD_ROUND_RESULT':
      return {
        ...state,
        roundResults: [...state.roundResults, action.payload],
      };

    case 'ADD_USED_WORD':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          usedWords: [...state.gameState.usedWords, action.payload],
        },
      };

    case 'UPDATE_PLAYER_SCORES':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: state.gameState.players.map(p => {
            const scoreUpdate = action.payload.find(s => s.playerId === p.id);
            return scoreUpdate ? { ...p, score: p.score + scoreUpdate.points } : p;
          }),
        },
      };

    case 'RESET_FOR_NEW_ROUND':
      console.log('[GameReducer] RESET_FOR_NEW_ROUND');
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          phase: 'setup',
          players: state.gameState.players.map(p => ({
            ...p,
            isSpy: false,
            hasVoted: false,
            votedFor: null,
            hasSeenWord: false,
          })),
        },
      };

    case 'RESET_GAME':
      console.log('[GameReducer] RESET_GAME');
      return { ...initialState, settings: state.settings };

    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load settings on mount
  useEffect(() => {
    loadSettings().then(settings => {
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    });
  }, []);

  const updateSettings = async (newSettings: Partial<GameSettings>) => {
    const updated = { ...state.settings, ...newSettings };
    dispatch({ type: 'SET_SETTINGS', payload: updated });
    await saveSettings(updated);
  };

  const initializeGame = (players: Player[]) => {
    console.log('[GameContext] initializeGame called with', players.length, 'players');
    
    // Get the first word immediately
    const wordData = getRandomWord(state.settings.selectedCategories, []);
    
    if (!wordData) {
      console.error('[GameContext] No words available for selected categories');
      return;
    }
    
    console.log('[GameContext] First word selected:', wordData.word);
    
    // Random spy selection
    const spyIndex = Math.floor(Math.random() * players.length);
    const spyId = players[spyIndex].id;
    console.log('[GameContext] First spy selected:', players[spyIndex].name);
    
    // Generate spy guess options
    const spyGuessOptions = getSpyGuessOptions(
      wordData.word,
      wordData.categoryId,
      state.settings.spyGuessOptions
    );
    
    dispatch({
      type: 'INITIALIZE_GAME',
      payload: { 
        players, 
        settings: state.settings,
        firstRound: {
          word: wordData.word,
          categoryId: wordData.categoryId,
          spyId,
          spyGuessOptions,
        }
      },
    });
  };

  const startNewRound = () => {
    console.log('[GameContext] startNewRound called');
    if (!state.gameState) {
      console.log('[GameContext] No game state, returning');
      return;
    }

    console.log('[GameContext] Current round:', state.gameState.currentRound, 'Total rounds:', state.gameState.totalRounds);
    console.log('[GameContext] Used words:', state.gameState.usedWords);

    const wordData = getRandomWord(
      state.settings.selectedCategories,
      state.gameState.usedWords
    );

    if (!wordData) {
      console.error('[GameContext] No more words available');
      return;
    }

    console.log('[GameContext] Selected word:', wordData.word, 'Category:', wordData.categoryId);

    // Random spy selection
    const spyIndex = Math.floor(Math.random() * state.gameState.players.length);
    const spyId = state.gameState.players[spyIndex].id;
    console.log('[GameContext] Selected spy:', state.gameState.players[spyIndex].name);

    // Generate spy guess options
    const spyGuessOptions = getSpyGuessOptions(
      wordData.word,
      wordData.categoryId,
      state.settings.spyGuessOptions
    );

    dispatch({
      type: 'START_ROUND',
      payload: {
        word: wordData.word,
        categoryId: wordData.categoryId,
        spyId,
        spyGuessOptions,
      },
    });

    dispatch({ type: 'ADD_USED_WORD', payload: wordData.word });
    console.log('[GameContext] New round started successfully');
  };

  const markPlayerAsSeenWord = (playerId: string) => {
    console.log('[GameContext] markPlayerAsSeenWord:', playerId);
    dispatch({ type: 'MARK_SEEN_WORD', payload: playerId });
  };

  const submitVote = (voterId: string, suspectId: string) => {
    console.log('[GameContext] submitVote - voter:', voterId, 'suspect:', suspectId);
    dispatch({ type: 'SUBMIT_VOTE', payload: { voterId, suspectId } });
  };

  const submitSpyGuess = (word: string): boolean => {
    if (!state.gameState) return false;
    const correct = word === state.gameState.currentWord;
    
    const { players, spyId, currentWord, currentCategory, currentRound } = state.gameState;
    const spy = players.find(p => p.id === spyId)!;
    
    // Count votes for spy
    const votesForSpy = players.filter(p => p.votedFor === spyId).length;
    const spyWasFound = votesForSpy > players.length / 2;
    const spyEscaped = !spyWasFound;
    
    const allScoreUpdates: { playerId: string; points: number }[] = [];
    const pointsAwarded: { playerId: string; points: number }[] = [];
    
    // IMPROVEMENT 1: Award points to players who voted correctly for the spy
    // (even if spy wasn't found by majority, correct individual votes still count)
    players.forEach(p => {
      if (p.votedFor === spyId && p.id !== spyId) {
        allScoreUpdates.push({
          playerId: p.id,
          points: state.settings.pointsForFindingSpy,
        });
        pointsAwarded.push({ playerId: p.id, points: state.settings.pointsForFindingSpy });
      }
    });
    
    // IMPROVEMENT 2: Spy gets escape points if they weren't found (independent of guessing)
    if (spyEscaped) {
      const escapePoints = state.settings.pointsForSpyEscape || 1;
      allScoreUpdates.push({ playerId: spyId, points: escapePoints });
      pointsAwarded.push({ playerId: spyId, points: escapePoints });
    }
    
    // IMPROVEMENT 2: Spy gets guessing points if they guessed correctly (independent of escape)
    if (correct) {
      allScoreUpdates.push({ 
        playerId: spyId, 
        points: state.settings.pointsForSpyGuessing 
      });
      pointsAwarded.push({ playerId: spyId, points: state.settings.pointsForSpyGuessing });
    }
    
    // Apply all score updates
    if (allScoreUpdates.length > 0) {
      dispatch({ type: 'UPDATE_PLAYER_SCORES', payload: allScoreUpdates });
    }
    
    // Create votes array
    const votes = players.map(p => ({
      playerId: p.id,
      votedForId: p.votedFor || '',
    }));
    
    // Add round result
    const roundResult: RoundResult = {
      round: currentRound,
      word: currentWord,
      category: currentCategory,
      spyId,
      spyName: spy.name,
      spyWasFound,
      spyEscaped,
      spyGuessedCorrectly: correct,
      votes,
      pointsAwarded,
    };
    
    dispatch({ type: 'ADD_ROUND_RESULT', payload: roundResult });
    console.log('[GameContext] Round result added:', roundResult);
    
    return correct;
  };

  const skipSpyGuess = () => {
    if (!state.gameState) return;
    
    const { players, spyId, currentWord, currentCategory, currentRound } = state.gameState;
    const spy = players.find(p => p.id === spyId)!;
    
    // Count votes for spy
    const votesForSpy = players.filter(p => p.votedFor === spyId).length;
    const spyWasFound = votesForSpy > players.length / 2;
    const spyEscaped = !spyWasFound;
    
    const allScoreUpdates: { playerId: string; points: number }[] = [];
    const pointsAwarded: { playerId: string; points: number }[] = [];
    
    // IMPROVEMENT 1: Award points to players who voted correctly for the spy
    // (even if spy wasn't found by majority, correct individual votes still count)
    players.forEach(p => {
      if (p.votedFor === spyId && p.id !== spyId) {
        allScoreUpdates.push({
          playerId: p.id,
          points: state.settings.pointsForFindingSpy,
        });
        pointsAwarded.push({ playerId: p.id, points: state.settings.pointsForFindingSpy });
      }
    });
    
    // IMPROVEMENT 2: Spy gets escape points if they weren't found
    if (spyEscaped) {
      const escapePoints = state.settings.pointsForSpyEscape || 1;
      allScoreUpdates.push({ playerId: spyId, points: escapePoints });
      pointsAwarded.push({ playerId: spyId, points: escapePoints });
    }
    
    // Apply all score updates
    if (allScoreUpdates.length > 0) {
      dispatch({ type: 'UPDATE_PLAYER_SCORES', payload: allScoreUpdates });
    }
    
    // Create votes array
    const votes = players.map(p => ({
      playerId: p.id,
      votedForId: p.votedFor || '',
    }));
    
    // Add round result (spy skipped guessing)
    const roundResult: RoundResult = {
      round: currentRound,
      word: currentWord,
      category: currentCategory,
      spyId,
      spyName: spy.name,
      spyWasFound,
      spyEscaped,
      spyGuessedCorrectly: false,
      votes,
      pointsAwarded,
    };
    
    dispatch({ type: 'ADD_ROUND_RESULT', payload: roundResult });
    console.log('[GameContext] Round result added (spy skipped):', roundResult);
  };

  const calculateRoundResults = (): RoundResult => {
    if (!state.gameState) {
      throw new Error('No game state');
    }

    const { players, spyId, currentWord, currentCategory, currentRound } = state.gameState;
    const spy = players.find(p => p.id === spyId)!;

    // Count votes for spy
    const votesForSpy = players.filter(p => p.votedFor === spyId).length;
    const spyWasFound = votesForSpy > players.length / 2;

    const votes = players.map(p => ({
      playerId: p.id,
      votedForId: p.votedFor || '',
    }));

    const pointsAwarded: { playerId: string; points: number }[] = [];

    // Award points for correct votes
    players.forEach(p => {
      if (p.votedFor === spyId && p.id !== spyId) {
        pointsAwarded.push({
          playerId: p.id,
          points: state.settings.pointsForFindingSpy,
        });
      }
    });

    const result: RoundResult = {
      round: currentRound,
      word: currentWord,
      category: currentCategory,
      spyId,
      spyName: spy.name,
      spyWasFound,
      spyEscaped: !spyWasFound,
      spyGuessedCorrectly: false, // Will be updated in spy guess phase
      votes,
      pointsAwarded,
    };

    return result;
  };

  const proceedToNextPhase = () => {
    if (!state.gameState) return;

    const { phase, players, currentRound, totalRounds } = state.gameState;

    const buildGamePlayerDetails = (
      gamePlayers: Player[],
      results: RoundResult[]
    ): SavedGamePlayer[] => {
      const winnerScore = Math.max(...gamePlayers.map(p => p.score));
      const statsById = new Map<string, GamePlayerStats>();

      gamePlayers.forEach(p => {
        statsById.set(p.id, {
          pointsEarned: 0,
          roundsPlayed: 0,
          roundsWon: 0,
          roundsLost: 0,
          timesAsSpy: 0,
          timesEscapedAsSpy: 0,
          timesCorrectlyGuessedWord: 0,
          timesCaughtSpy: 0,
          timesSpyWasCaught: 0,
        });
      });

      results.forEach(result => {
        gamePlayers.forEach(player => {
          const stats = statsById.get(player.id);
          if (!stats) return;

          stats.roundsPlayed += 1;
          const pointsThisRound =
            result.pointsAwarded.find(p => p.playerId === player.id)?.points || 0;
          stats.pointsEarned += pointsThisRound;
          if (pointsThisRound > 0) stats.roundsWon += 1;
          else stats.roundsLost += 1;

          if (player.id === result.spyId) {
            stats.timesAsSpy += 1;
            if (result.spyEscaped) stats.timesEscapedAsSpy += 1;
            if (result.spyGuessedCorrectly) stats.timesCorrectlyGuessedWord += 1;
            if (result.spyWasFound) stats.timesSpyWasCaught += 1;
          } else {
            const vote = result.votes.find(v => v.playerId === player.id);
            if (vote?.votedForId === result.spyId) stats.timesCaughtSpy += 1;
          }
        });
      });

      return gamePlayers.map(player => ({
        name: player.name,
        score: player.score,
        isWinner: player.score === winnerScore && winnerScore > 0,
        stats: statsById.get(player.id),
      }));
    };

    switch (phase) {
      case 'setup':
        startNewRound();
        break;
      case 'distribution':
        // Check if all players have seen their word
        const allSeen = players.every(p => p.hasSeenWord);
        if (allSeen) {
          dispatch({ type: 'SET_PHASE', payload: 'discussion' });
        }
        break;
      case 'discussion':
        dispatch({ type: 'SET_PHASE', payload: 'voting' });
        break;
      case 'voting':
        // Check if all players have voted
        const allVoted = players.every(p => p.hasVoted);
        if (allVoted) {
          dispatch({ type: 'SET_PHASE', payload: 'spyGuess' });
        }
        break;
      case 'spyGuess':
        dispatch({ type: 'SET_PHASE', payload: 'roundResult' });
        break;
      case 'roundResult':
        if (currentRound >= totalRounds) {
          dispatch({ type: 'SET_PHASE', payload: 'gameEnd' });
          // Save game history
          const winner = [...players].sort((a, b) => b.score - a.score)[0];
          saveGame({
            id: uuidv4(),
            date: new Date().toISOString(),
            players: buildGamePlayerDetails(players, state.roundResults),
            rounds: totalRounds,
            winner: winner.name,
          });
          // Save high scores
          players.forEach(p => {
            saveHighScore({
              playerName: p.name,
              score: p.score,
              date: new Date().toISOString(),
              rounds: totalRounds,
            });
          });
        } else {
          dispatch({ type: 'RESET_FOR_NEW_ROUND' });
        }
        break;
      case 'gameEnd':
        dispatch({ type: 'RESET_GAME' });
        break;
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const updatePlayerScores = (scores: { playerId: string; points: number }[]) => {
    dispatch({ type: 'UPDATE_PLAYER_SCORES', payload: scores });
  };

  const value: GameContextType = {
    gameState: state.gameState,
    settings: state.settings,
    roundResults: state.roundResults,
    initializeGame,
    startNewRound,
    markPlayerAsSeenWord,
    submitVote,
    submitSpyGuess,
    skipSpyGuess,
    calculateRoundResults,
    updateSettings,
    resetGame,
    proceedToNextPhase,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
