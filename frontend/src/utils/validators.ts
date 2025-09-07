/**
 * Type guards and validation utilities
 */

import type { GameWord, Hint, GameState } from '../types/game';

/**
 * Helper to safely access object properties
 */
const hasProperty = <K extends string>(obj: unknown, key: K): obj is Record<K, unknown> => {
  return typeof obj === 'object' && obj !== null && key in obj;
};

/**
 * Type guard to check if a value is a valid GameWord
 */
export const isGameWord = (obj: unknown): obj is GameWord => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    hasProperty(obj, 'word') &&
    typeof obj.word === 'string' &&
    hasProperty(obj, 'guessedLetters') &&
    Array.isArray(obj.guessedLetters) &&
    hasProperty(obj, 'index') &&
    typeof obj.index === 'number'
  );
};

/**
 * Type guard to check if a value is a valid Hint
 */
export const isHint = (obj: unknown): obj is Hint => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    hasProperty(obj, 'word_index') &&
    typeof obj.word_index === 'number' &&
    hasProperty(obj, 'day') &&
    typeof obj.day === 'number' &&
    hasProperty(obj, 'image_url') &&
    typeof obj.image_url === 'string' &&
    hasProperty(obj, 'letter_count') &&
    typeof obj.letter_count === 'number' &&
    hasProperty(obj, 'highlighted_letter_index') &&
    typeof obj.highlighted_letter_index === 'number' &&
    hasProperty(obj, 'id') &&
    typeof obj.id === 'string'
  );
};

/**
 * Type guard to check if a value is a valid GameState
 */
export const isGameState = (obj: unknown): obj is GameState => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    hasProperty(obj, 'words') &&
    Array.isArray(obj.words) &&
    obj.words.every(isGameWord) &&
    hasProperty(obj, 'hints') &&
    Array.isArray(obj.hints) &&
    obj.hints.every(isHint) &&
    hasProperty(obj, 'highlightedColumn') &&
    typeof obj.highlightedColumn === 'number' &&
    hasProperty(obj, 'currentDay') &&
    typeof obj.currentDay === 'number'
  );
};

/**
 * Validate that a letter index is within bounds for a word
 */
export const isValidLetterIndex = (word: GameWord, letterIndex: number): boolean => {
  return letterIndex >= 0 && letterIndex < word.word.length;
};

/**
 * Validate that a word index is within bounds for the game
 */
export const isValidWordIndex = (gameState: GameState, wordIndex: number): boolean => {
  return wordIndex >= 0 && wordIndex < gameState.words.length;
};

/**
 * Validate that a hint exists for a given day
 */
export const isHintAvailableForDay = (hints: Hint[]): boolean => {
  // No day property anymore, always return true if hints exist
  return hints.length > 0;
};


/**
 * Validate URL format (basic check)
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  } catch {
    return false;
  }
};

/**
 * Sanitize user input for letter entry
 */
export const sanitizeLetter = (input: string): string | null => {
  const cleaned = input.trim().toUpperCase();
  return /^[A-Z]$/.test(cleaned) ? cleaned : null;
};

/**
 * Generate a unique ID for game sessions
 */
export const generateGameSessionId = (): string => {
  return `game-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if two game states are equivalent
 */
export const areGameStatesEqual = (state1: GameState, state2: GameState): boolean => {
  return JSON.stringify(state1) === JSON.stringify(state2);
};
