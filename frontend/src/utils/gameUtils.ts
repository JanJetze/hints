import type { GameWord, GameState, Hint } from '../types/game';

/**
 * Calculate game completion percentage
 */
export const calculateGameProgress = (words: GameWord[]): number => {
  if (words.length === 0) return 0;
  
  const totalLetters = words.reduce((sum, word) => sum + word.word.length, 0);
  const filledLetters = words.reduce((sum, word) => {
    return sum + word.guessedLetters.filter(letter => letter !== null).length;
  }, 0);
  
  return Math.round((filledLetters / totalLetters) * 100);
};

/**
 * Check if all words are completely filled
 */
export const isGameComplete = (words: GameWord[]): boolean => {
  return words.every(word => word.guessedLetters.every(letter => letter !== null));
};

/**
 * Extract letters from highlighted column to form the target sentence
 */
export const extractTargetSentence = (words: GameWord[], hints: Hint[]): string => {
  // Find the max highlighted_letter_index among all hints (the aligned column)
  const maxHighlight = Math.max(...hints.map(h => h.highlighted_letter_index));
  return words
    .map(word => word.guessedLetters[maxHighlight] || '?')
    .join('');
};


/**
 * Validate if a character is a valid letter input
 */
export const isValidLetter = (char: string): boolean => {
  return /^[A-Za-z]$/.test(char);
};

/**
 * Check if a word is completely filled
 */
export const isWordFilled = (word: GameWord): boolean => {
  return !word.guessedLetters.includes(null);
};

/**
 * Get hints available for current day
 */
export const getAvailableHintsForDay = (gameState: GameState): typeof gameState.hints => {
  return gameState.hints;
};

/**
 * Format game completion time (for future leaderboard feature)
 */
export const formatGameTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

/**
 * Generate a shareable game result (for future social sharing feature)
 */
export const generateGameResult = (gameState: GameState): string => {
  const { words, hints, currentDay } = gameState;
  const filledCount = words.filter(word => isWordFilled(word)).length;
  const targetSentence = extractTargetSentence(words, hints);
  
  return `Daily Word Puzzle - Day ${currentDay}
${filledCount}/${words.length} words filled
Hidden message: ${targetSentence}
🎯🧩🎮`;
};
