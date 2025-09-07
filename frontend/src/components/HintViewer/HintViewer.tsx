import React from 'react';
import type { Hint } from '../../types/game';
import './HintViewer.css';

interface HintViewerProps {
  currentHint: Hint | null;
  availableHints: Hint[];
  viewMode: 'single' | 'grid';
  canGoPrevious: boolean;
  canGoNext: boolean;
  loading: boolean;
  error: string | null;
  onPreviousHint: () => void;
  onNextHint: () => void;
  onToggleViewMode: () => void;
  onSelectHint: (hintIndex: number) => void;
}

export const HintViewer: React.FC<HintViewerProps> = ({
  currentHint,
  availableHints,
  viewMode,
  canGoPrevious,
  canGoNext,
  loading,
  error,
  onPreviousHint,
  onNextHint,
  onToggleViewMode,
  onSelectHint
}) => {
  // Track which hint is hovered in grid view
  const [hoveredHintId, setHoveredHintId] = React.useState<string | null>(null);
  // Listen for showHintImage event from WordGrid
  React.useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      const { imageUrl, wordIndex } = custom.detail || {};
      if (!imageUrl) return;
      // Find the hint with this imageUrl and wordIndex
      const idx = availableHints.findIndex((h: Hint) => h.image_url === imageUrl && h.word_index === wordIndex);
      if (idx !== -1) {
        onSelectHint(idx);
      }
    };
    window.addEventListener('showHintImage', handler);
    return () => window.removeEventListener('showHintImage', handler);
  }, [availableHints, onSelectHint]);

  // Listen for highlightHintImage event from WordGrid
  React.useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      const { hintId } = custom.detail || {};
      setHoveredHintId(hintId || null);
    };
    window.addEventListener('highlightHintImage', handler);
    return () => window.removeEventListener('highlightHintImage', handler);
  }, []);
  // Listen for showHintImage event from WordGrid
  React.useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      const { imageUrl, wordIndex } = custom.detail || {};
      if (!imageUrl) return;
      // Find the hint with this imageUrl and wordIndex
      const idx = availableHints.findIndex((h: Hint) => h.image_url === imageUrl && h.word_index === wordIndex);
      if (idx !== -1) {
        onSelectHint(idx);
      }
    };
    window.addEventListener('showHintImage', handler);
    return () => window.removeEventListener('showHintImage', handler);
  }, [availableHints, onSelectHint]);
  if (loading) {
    return (
      <div className="hint-viewer">
        <div className="hint-loading">
          <div className="loading-spinner"></div>
          <p>Loading hints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hint-viewer">
        <div className="hint-error">
          <p>Error loading hints: {error}</p>
        </div>
      </div>
    );
  }

  if (availableHints.length === 0) {
    return (
      <div className="hint-viewer">
        <div className="no-hints">
          <p>No hints available yet. Check back tomorrow!</p>
        </div>
      </div>
    );
  }

  // Only show hints with a valid image_url (not empty)
  const validImageHints = availableHints.filter(h => h.image_url && h.image_url.trim() !== '');
  if (viewMode === 'grid') {
    return (
      <div className="hint-viewer">
        <div className="hint-viewer-header">
          <h3 style={{ margin: 0 }}>All Available Hints</h3>
          <div className="hint-viewer-header-right" style={{ marginLeft: 'auto' }}>
            {/* You can add a right-aligned element here if needed, e.g., a counter or button */}
          </div>
        </div>

        <div className="hints-grid">
          {validImageHints.map((hint) => (
            <div
              key={hint.id}
              className={`hint-thumbnail${hoveredHintId === hint.id ? ' highlighted' : ''}`}
              onClick={() => onSelectHint(availableHints.findIndex(h => h.id === hint.id))}
              onMouseEnter={() => {
                setHoveredHintId(hint.id);
                // Custom event for highlighting word row
                const event = new CustomEvent('highlightWordRow', { detail: { wordIndex: hint.word_index } });
                window.dispatchEvent(event);
              }}
              onMouseLeave={() => {
                setHoveredHintId(null);
                const event = new CustomEvent('highlightWordRow', { detail: { wordIndex: null } });
                window.dispatchEvent(event);
              }}
            >
              <img
                src={hint.image_url}
                alt="Hint image"
                className="thumbnail-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.svg';
                }}
              />
              <div className="thumbnail-overlay">
                {/* No word info shown */}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hint-viewer">
      <div className="hint-viewer-header">
        <h3>Hint Viewer</h3>
        <div className="hint-counter">
          {availableHints.findIndex(h => h.id === currentHint?.id) + 1} of {availableHints.length}
        </div>
      </div>

      {currentHint && (
        <div className="main-hint-display">
          <div className="hint-image-container">
            <img 
              src={currentHint.image_url || '/placeholder-image.svg'} 
              alt="Hint image"
              className="main-hint-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.svg';
              }}
            />
            <div className="hint-overlay">
              {/* No word info shown */}
            </div>
          </div>
        </div>
      )}

      <div className="hint-navigation">
        <button 
          className={`nav-button previous ${!canGoPrevious ? 'disabled' : ''}`}
          onClick={onPreviousHint}
          disabled={!canGoPrevious}
          aria-label="Previous hint"
        >
          ← Previous
        </button>

        <button 
          className="nav-button grid-toggle"
          onClick={onToggleViewMode}
          aria-label="Toggle grid view"
        >
          ⊞ Grid View
        </button>

        <button 
          className={`nav-button next ${!canGoNext ? 'disabled' : ''}`}
          onClick={onNextHint}
          disabled={!canGoNext}
          aria-label="Next hint"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
