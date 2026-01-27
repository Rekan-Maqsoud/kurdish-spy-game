// Game types and interfaces

export type CategoryId = 
  | 'places'
  | 'food'
  | 'animals'
  | 'transport'
  | 'sports'
  | 'professions'
  | 'objects'
  | 'nature'
  | 'clothes'
  | 'bodyParts'
  | 'electronics'
  | 'buildings'
  | 'tools'
  | 'furniture'
  | 'instruments'
  | 'countries'
  | 'movies'
  | 'colors'
  | 'weather'
  | 'drinks';

export interface Category {
  id: CategoryId;
  name: string; // Kurdish name
  icon: string; // Emoji icon
  color: string;
  words: string[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isSpy: boolean;
  hasVoted: boolean;
  votedFor: string | null;
  hasSeenWord: boolean;
}

export interface GameSettings {
  numberOfRounds: number;
  timePerRound: number; // in seconds, 0 for unlimited
  selectedCategories: CategoryId[];
  spyGuessOptions: number; // number of word options for spy
  numberOfSpies: number;
  pointsForFindingSpy: number;
  pointsForSpyGuessing: number;
  pointsForSpyEscape: number; // points spy gets for not being found
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  currentWord: string;
  currentCategory: CategoryId;
  players: Player[];
  spyIds: string[];
  phase: GamePhase;
  usedWords: string[];
  roundStartTime: number | null;
  spyGuessOptions: string[];
}

export type GamePhase = 
  | 'setup'          // Setting up players
  | 'distribution'   // Showing words to players
  | 'discussion'     // Players discussing/asking questions
  | 'voting'         // Players voting for spy
  | 'spyGuess'       // Spy guessing the word
  | 'roundResult'    // Showing round results
  | 'gameEnd';       // Final results

export interface RoundResult {
  round: number;
  word: string;
  category: CategoryId;
  spyIds: string[];
  spyNames: string[];
  caughtSpyIds: string[];
  spyWasFound: boolean;
  spyEscaped: boolean; // true if spy wasn't caught by majority
  spyGuessedCorrectly: boolean;
  votes: { playerId: string; votedForId: string }[];
  pointsAwarded: { playerId: string; points: number }[];
}

// Per-match player stats snapshot (stored locally per game)
export interface GamePlayerStats {
  pointsEarned: number;
  roundsPlayed: number;
  roundsWon: number;
  roundsLost: number;
  timesAsSpy: number;
  timesEscapedAsSpy: number;
  timesCorrectlyGuessedWord: number;
  timesCaughtSpy: number;
  timesSpyWasCaught: number;
}

export interface SavedGamePlayer {
  name: string;
  score: number;
  isWinner: boolean;
  stats?: GamePlayerStats;
}

export interface SavedGame {
  id: string;
  date: string;
  players: SavedGamePlayer[];
  rounds: number;
  winner: string;
}

export interface HighScore {
  playerName: string;
  score: number;
  date: string;
  rounds: number;
}

// Player statistics for leaderboard
export interface PlayerStats {
  name: string;
  totalPoints: number;
  gamesPlayed: number;        // Total games played
  gamesWon: number;           // Games where this player won (highest score)
  roundsPlayed: number;       // Total rounds played
  roundsWon: number;          // Rounds where player scored points
  roundsLost: number;         // Rounds where player got 0 points
  timesAsSpy: number;         // How many times was spy
  timesEscapedAsSpy: number;  // How many times escaped as spy (not caught)
  timesCorrectlyGuessedWord: number; // As spy, guessed the word correctly
  timesCaughtSpy: number;     // As non-spy, correctly voted for spy
  timesSpyWasCaught: number;  // As spy, got caught
  lastPlayed: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  HowToPlay: undefined;
  Settings: undefined;
  PlayerSetup: undefined;
  WordDistribution: { playerIndex: number };
  Discussion: undefined;
  Voting: undefined;
  SpyGuess: undefined;
  RoundResult: { result: RoundResult };
  GameEnd: undefined;
  CategorySelect: undefined;
  HighScores: undefined;
};
