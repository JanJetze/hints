import React, { useState, useRef, useEffect } from 'react';
import type { GameWord, Hint } from '../../types/game';
import './WordGrid.css';

interface WordGridProps {
  words: GameWord[];
  hints: Hint[];
  availableHints: Hint[];
  onLetterChange: (wordIndex: number, letterIndex: number, letter: string) => void;
  onLetterClear: (wordIndex: number, letterIndex: number) => void;
  highlightedWordIndex?: number | null;
}

interface FocusPosition {
  wordIndex: number;
  letterIndex: number;
}

export const WordGrid: React.FC<WordGridProps> = ({
  words,
  hints,
  availableHints,
  onLetterChange,
  onLetterClear,
  highlightedWordIndex
}) => {
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);
  const [focusedCell, setFocusedCell] = useState<FocusPosition | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // Initialize input refs array
  useEffect(() => {
    inputRefs.current = words.map(word => new Array(hints.find(h => h.word_index === word.index)?.letter_count || 0).fill(null));
  }, [words, hints]);

  const handleInputChange = (wordIndex: number, letterIndex: number, value: string) => {
    const letter = value.slice(-1).toUpperCase(); // Take only the last character
    
    if (letter && /^[A-Z]$/.test(letter)) {
      onLetterChange(wordIndex, letterIndex, letter);
      
      // Auto-advance to next cell
      const nextPosition = getNextPosition(wordIndex, letterIndex);
      if (nextPosition) {
        focusCell(nextPosition.wordIndex, nextPosition.letterIndex);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    wordIndex: number,
    letterIndex: number
  ) => {
    switch (e.key) {
      case 'Backspace': {
        e.preventDefault();
        const currentValue = words[wordIndex].guessedLetters[letterIndex];
        if (currentValue) {
          onLetterClear(wordIndex, letterIndex);
        } else {
          // Move to previous cell and clear it
          const prevPosition = getPreviousPosition(wordIndex, letterIndex);
          if (prevPosition) {
            onLetterClear(prevPosition.wordIndex, prevPosition.letterIndex);
            focusCell(prevPosition.wordIndex, prevPosition.letterIndex);
          }
        }
        break;
      }
        
      case 'ArrowLeft': {
        e.preventDefault();
        const leftPosition = getPreviousPosition(wordIndex, letterIndex);
        if (leftPosition) {
          focusCell(leftPosition.wordIndex, leftPosition.letterIndex);
        }
        break;
      }
        
      case 'ArrowRight': {
        e.preventDefault();
        const rightPosition = getNextPosition(wordIndex, letterIndex);
        if (rightPosition) {
          focusCell(rightPosition.wordIndex, rightPosition.letterIndex);
        }
        break;
      }
        
      case 'ArrowUp':
        e.preventDefault();
        if (wordIndex > 0) {
          focusCell(wordIndex - 1, letterIndex);
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (wordIndex < words.length - 1) {
          focusCell(wordIndex + 1, letterIndex);
        }
        break;
    }
  };

  const getNextPosition = (wordIndex: number, letterIndex: number): FocusPosition | null => {
    const currentWordHint = hints.find(h => h.word_index === words[wordIndex].index);
    const currentWordLength = currentWordHint?.letter_count || 0;
    
    if (letterIndex < currentWordLength - 1) {
      return { wordIndex, letterIndex: letterIndex + 1 };
    }
    if (wordIndex < words.length - 1) {
      return { wordIndex: wordIndex + 1, letterIndex: 0 };
    }
    return null;
  };

  const getPreviousPosition = (wordIndex: number, letterIndex: number): FocusPosition | null => {
    if (letterIndex > 0) {
      return { wordIndex, letterIndex: letterIndex - 1 };
    }
    if (wordIndex > 0) {
      const prevWordHint = hints.find(h => h.word_index === words[wordIndex - 1].index);
      const prevWordLength = prevWordHint?.letter_count || 0;
      return { wordIndex: wordIndex - 1, letterIndex: prevWordLength - 1 };
    }
    return null;
  };

  const focusCell = (wordIndex: number, letterIndex: number) => {
    const inputRef = inputRefs.current[wordIndex]?.[letterIndex];
    if (inputRef) {
      inputRef.focus();
      setFocusedCell({ wordIndex, letterIndex });
    }
  };

  const handleCellClick = (wordIndex: number, letterIndex: number) => {
    focusCell(wordIndex, letterIndex);
  };

  // Find the max highlighted_letter_index among all hints (the aligned column)
  // Calculate max left and right padding for all words
  const leftPads = hints.map(h => h.highlighted_letter_index);
  const rightPads = hints.map(h => (h.letter_count - h.highlighted_letter_index - 1));
  const maxLeftPad = Math.max(...leftPads);
  const maxRightPad = Math.max(...rightPads);

  // Listen for highlightWordRow events from HintViewer
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      setHoveredWordIndex(custom.detail.wordIndex);
    };
    window.addEventListener('highlightWordRow', handler);
    return () => window.removeEventListener('highlightWordRow', handler);
  }, []);

  // Helper to open image in HintViewer
  const openHintImage = (wordIndex: number) => {
    const wordHint = hints.find(h => h.word_index === words[wordIndex].index);
    if (wordHint && wordHint.image_url) {
      const event = new CustomEvent('showHintImage', { detail: { imageUrl: wordHint.image_url, wordIndex: words[wordIndex].index } });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="word-grid">
      <div className="hint-viewer-header">
        <h3>Antwoorden</h3>
        <div className="word-grid-header-right" style={{ marginLeft: 'auto' }}>
          {/* You can add a right-aligned element here if needed, e.g., a counter or button */}
        </div>
      </div>
      <div className="words-container">
        {words.map((word, wordIndex) => {
          const wordHint = hints.find(h => h.word_index === word.index);
          const isAvailable = availableHints.some(h => h.word_index === word.index);
          const letterCount = wordHint?.letter_count || 0;
          const highlightedLetterIndex = wordHint?.highlighted_letter_index ?? -1;
          // Calculate left and right padding for this word
          const leftPad = maxLeftPad - highlightedLetterIndex;
          const rightPad = maxRightPad - (letterCount - highlightedLetterIndex - 1);
          // Render leftPad empty cells, then the word's input cells, then rightPad empty cells
          const isHighlighted = highlightedWordIndex === word.index || hoveredWordIndex === word.index;
          return (
            <div
              key={wordIndex}
              className={`word-row${isHighlighted ? ' highlighted' : ''}${!isAvailable || !wordHint?.image_url ? ' word-row-unavailable' : ''}`}
              onMouseEnter={() => {
                setHoveredWordIndex(word.index);
                // Dispatch event to highlight corresponding hint image
                const wordHint = hints.find(h => h.word_index === word.index);
                if (wordHint) {
                  const event = new CustomEvent('highlightHintImage', { detail: { hintId: wordHint.id } });
                  window.dispatchEvent(event);
                }
              }}
              onMouseLeave={() => {
                setHoveredWordIndex(null);
                // Remove highlight from hint image
                const event = new CustomEvent('highlightHintImage', { detail: { hintId: null } });
                window.dispatchEvent(event);
              }}
              onClick={e => {
                // Only trigger if click is NOT on a letter cell or its children
                if (
                  isAvailable && wordHint?.image_url &&
                  !(e.target instanceof HTMLElement && e.target.closest('.letter-cell'))
                ) {
                  openHintImage(wordIndex);
                }
              }}
              style={{ cursor: isAvailable && wordHint?.image_url ? 'pointer' : undefined }}
            >
              <div className="word-label" style={{ minWidth: 60, display: 'flex', alignItems: 'center', marginRight: 8 }}>
                <span style={{ fontWeight: 'bold', marginRight: 4 }}>{wordIndex + 1}.</span>
                <span style={{ fontSize: '0.95em', color: '#888' }}>({letterCount})</span>
              </div>
              <div className="word-cells">
                {/* Left padding for alignment */}
                {Array.from({ length: leftPad > 0 ? leftPad : 0 }, (_, i) => (
                  <div key={`pad-left-${i}`} className="letter-cell" style={{ visibility: 'hidden' }} />
                ))}
                {/* Actual word input cells */}
                {Array.from({ length: letterCount }, (_, letterIndex) => {
                  const globalLetterIndex = leftPad + letterIndex;
                  return (
                    <input
                      key={letterIndex}
                      ref={el => {
                        if (inputRefs.current[wordIndex]) {
                          inputRefs.current[wordIndex][letterIndex] = el;
                        }
                      }}
                      type="text"
                      className={`letter-cell ${
                        globalLetterIndex === maxLeftPad ? 'highlighted' : ''
                      } ${
                        focusedCell?.wordIndex === wordIndex &&
                        focusedCell?.letterIndex === letterIndex ? 'focused' : ''
                      }`}
                      value={word.guessedLetters[letterIndex] || ''}
                      onChange={(e) => handleInputChange(wordIndex, letterIndex, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, wordIndex, letterIndex)}
                      onClick={() => handleCellClick(wordIndex, letterIndex)}
                      onFocus={() => setFocusedCell({ wordIndex, letterIndex })}
                      onBlur={() => setFocusedCell(null)}
                      maxLength={1}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  );
                })}
                {/* Right padding for alignment */}
                {Array.from({ length: rightPad > 0 ? rightPad : 0 }, (_, i) => (
                  <div key={`pad-right-${i}`} className="letter-cell" style={{ visibility: 'hidden' }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

  {/* Hidden message and highlighted column display removed as requested */}
    </div>
  );
};
