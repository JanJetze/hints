import { WordGrid, HintViewer } from './components';
import { useGameState } from './hooks/useGameState';
import { useHintViewer } from './hooks/useHintViewer';
// import { calculateGameProgress } from './utils/gameUtils';
import './App.css';

function App() {
  const {
    gameState,
    gameMode,
    error: gameError,
    updateLetter,
    clearLetter,
    resetGame
  } = useGameState();

  const {
    hintViewerState,
    currentHint,
    canGoPrevious,
    canGoNext,
    loading: hintsLoading,
    error: hintsError,
    goToPreviousHint,
    goToNextHint,
    toggleViewMode,
    selectHint
  } = useHintViewer();

  if (gameMode === 'loading' || !gameState) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  if (gameError) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Error</h2>
          <p>{gameError}</p>
          <button onClick={resetGame} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Removed progressPercentage as progress display is no longer shown

  return (
    <div className="app">
      <main className="app-main">
        <section className="word-section">
          <WordGrid
            words={gameState.words}
            hints={gameState.hints}
            availableHints={hintViewerState.availableHints}
            onLetterChange={updateLetter}
            onLetterClear={clearLetter}
            highlightedWordIndex={hintViewerState.viewMode === 'single' && currentHint ? currentHint.word_index : null}
          />
          
          {gameMode === 'victory' && (
            <div className="victory-banner">
              <h2>🎉 Congratulations!</h2>
              <p>You've filled all the words!</p>
              {gameState.targetSentence && (
                <p className="victory-sentence">
                  Hidden message: <strong>{gameState.targetSentence}</strong>
                </p>
              )}
              <button onClick={resetGame} className="play-again-button">
                Play Again
              </button>
            </div>
          )}
        </section>

        <section className="hint-section">
          <HintViewer
            currentHint={currentHint}
            availableHints={hintViewerState.availableHints}
            viewMode={hintViewerState.viewMode}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            loading={hintsLoading}
            error={hintsError}
            onPreviousHint={goToPreviousHint}
            onNextHint={goToNextHint}
            onToggleViewMode={toggleViewMode}
            onSelectHint={selectHint}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
