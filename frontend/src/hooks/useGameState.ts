import { useState, useEffect, useCallback } from 'react';
import type { GameState, GameProgress, GameMode } from '../types/game';
import { MockGameAPI } from '../services/gameAPI';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('loading');
  const [error, setError] = useState<string | null>(null);

  const gameAPI = MockGameAPI.getInstance();

  // Load initial game state
  useEffect(() => {
    const loadGame = async () => {
      try {
        setGameMode('loading');
        const state = await gameAPI.getGameState();
        setGameState(state);
        setGameMode('play');
        setError(null);
      } catch (err) {
        setError('Failed to load game');
        console.error('Game loading error:', err);
      }
    };

    loadGame();
  }, [gameAPI]);

  // Update letter in word
  const updateLetter = useCallback(async (wordIndex: number, letterIndex: number, letter: string) => {
    if (!gameState) return;

    try {
      const updatedState = await gameAPI.updateWordGuess(wordIndex, letterIndex, letter);
      setGameState(updatedState);

      // Check for victory condition - when all words are completely filled
      const allFilled = updatedState.words.every(word => !word.guessedLetters.includes(null));
      if (allFilled) {
        setGameMode('victory');
      }
    } catch (err) {
      setError('Failed to update letter');
      console.error('Update letter error:', err);
    }
  }, [gameState, gameAPI]);

  // Clear letter from word
  const clearLetter = useCallback(async (wordIndex: number, letterIndex: number) => {
    if (!gameState) return;

    try {
      const updatedState = await gameAPI.clearLetter(wordIndex, letterIndex);
      setGameState(updatedState);
      if (gameMode === 'victory') {
        setGameMode('play');
      }
    } catch (err) {
      setError('Failed to clear letter');
      console.error('Clear letter error:', err);
    }
  }, [gameState, gameMode, gameAPI]);

  // Reset game
  const resetGame = useCallback(async () => {
    try {
      setGameMode('loading');
      const resetState = await gameAPI.resetGame();
      setGameState(resetState);
      setGameMode('play');
      setError(null);
    } catch (err) {
      setError('Failed to reset game');
      console.error('Reset game error:', err);
    }
  }, [gameAPI]);

  // Calculate game progress
  const gameProgress: GameProgress | null = gameState ? {
    solvedWords: gameState.words.filter(word => !word.guessedLetters.includes(null)).length,
    totalWords: gameState.words.length,
    isComplete: gameState.words.every(word => !word.guessedLetters.includes(null))
  } : null;

  return {
    gameState,
    gameMode,
    gameProgress,
    error,
    updateLetter,
    clearLetter,
    resetGame
  };
};
