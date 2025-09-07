import { useState, useEffect, useCallback } from 'react';
import type { Hint, HintViewerState } from '../types/game';
import { MockGameAPI } from '../services/gameAPI';

export const useHintViewer = () => {
  const [hintViewerState, setHintViewerState] = useState<HintViewerState>({
    currentHintIndex: 0,
    viewMode: 'single',
    availableHints: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gameAPI = MockGameAPI.getInstance();

  // Load available hints
  useEffect(() => {
    const loadHints = async () => {
      try {
        setLoading(true);
        const hints = await gameAPI.getAvailableHints();
        setHintViewerState(prev => ({
          ...prev,
          availableHints: hints,
          currentHintIndex: Math.min(prev.currentHintIndex, hints.length - 1)
        }));
        setError(null);
      } catch (err) {
        setError('Failed to load hints');
        console.error('Hints loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHints();
  }, [gameAPI]);

  // Navigate to previous hint
  const goToPreviousHint = useCallback(() => {
    setHintViewerState(prev => ({
      ...prev,
      currentHintIndex: Math.max(0, prev.currentHintIndex - 1),
      viewMode: 'single'
    }));
  }, []);

  // Navigate to next hint
  const goToNextHint = useCallback(() => {
    setHintViewerState(prev => ({
      ...prev,
      currentHintIndex: Math.min(prev.availableHints.length - 1, prev.currentHintIndex + 1),
      viewMode: 'single'
    }));
  }, []);

  // Toggle between single and grid view
  const toggleViewMode = useCallback(() => {
    setHintViewerState(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'single' ? 'grid' : 'single'
    }));
  }, []);

  // Select specific hint (used in grid view)
  const selectHint = useCallback((hintIndex: number) => {
    setHintViewerState(prev => ({
      ...prev,
      currentHintIndex: hintIndex,
      viewMode: 'single'
    }));
  }, []);

  // Get current hint
  const currentHint: Hint | null = hintViewerState.availableHints[hintViewerState.currentHintIndex] || null;

  // Navigation state
  const canGoPrevious = hintViewerState.currentHintIndex > 0;
  // Only allow next if there is a next hint and its image_url is not empty
  const nextHint = hintViewerState.availableHints[hintViewerState.currentHintIndex + 1];
  const canGoNext =
    nextHint !== undefined && !!nextHint.image_url && nextHint.image_url.trim() !== '';

  return {
    hintViewerState,
    currentHint,
    canGoPrevious,
    canGoNext,
    loading,
    error,
    goToPreviousHint,
    goToNextHint,
    toggleViewMode,
    selectHint
  };
};
