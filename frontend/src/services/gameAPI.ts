import type { GameState, Hint } from '../types/game';

// Mock data for demonstration
// No highlighted column anymore. All words will be padded so that their highlighted letter aligns in the same column.

const MOCK_HINTS: Hint[] = [
  {
    id: 'hint-1',
    word_index: 0,
    letter_count: 6,
    highlighted_letter_index: 1, // PUZZLE -> Z
    image_url: 'https://fastly.picsum.photos/id/451/200/200.jpg?hmac=ZxfTfjtPhONiVjaPd1HG3lQuTRy_puiwOF6qStaMe7g',
  },
  {
    id: 'hint-2',
    word_index: 1,
    letter_count: 4,
    highlighted_letter_index: 3, // GAME -> M
    image_url: 'https://fastly.picsum.photos/id/130/200/200.jpg?hmac=pMGv0FZ4yiuwOp40JbbSUg8DSKRdq2Rx70VXtqMrbjI',
  },
  {
    id: 'hint-3',
    word_index: 2,
    letter_count: 8,
    highlighted_letter_index: 5, // SOLUTION -> L
    image_url: 'https://fastly.picsum.photos/id/393/200/200.jpg?hmac=1cxlqmpLdS274Utq1s9nhhevcTHNffgX3_0tnKc4Kgw',
  },
  {
    id: 'hint-4',
    word_index: 3,
    letter_count: 5,
    highlighted_letter_index: 2, // BRAIN -> A
    image_url: 'https://fastly.picsum.photos/id/1014/1000/1000.jpg?hmac=puppfTJ8CDHey9VMPYjS20kYsOWUP1H5XM5djiHtbuo',
  },
  {
    id: 'hint-5',
    word_index: 4,
    letter_count: 7,
    highlighted_letter_index: 3, // MYSTERY -> S
    image_url: '',
  },
  {
    id: 'hint-6',
    word_index: 5,
    letter_count: 10,
    highlighted_letter_index: 2, // ART -> T
    image_url: '',
  },
  {
    id: 'hint-7',
    word_index: 6,
    letter_count: 10,
    highlighted_letter_index: 4, // ADVENTURE -> V
    image_url: '',
  },
];

// Actual target words (hidden from user) - highlighted column spells "ZMLASTV"
const ACTUAL_WORDS = ["PUZZLE", "GAME", "SOLUTION", "BRAIN", "MYSTERY", "ART", "ADVENTURE"];

export class MockGameAPI {
  private static instance: MockGameAPI;
  private gameState: GameState;

  private constructor() {
    // Find the max highlighted_letter_index among all hints
    const maxHighlight = Math.max(...MOCK_HINTS.map(h => h.highlighted_letter_index));
    // Align all words so that their highlighted letter is at the same column (maxHighlight)
    const wordsFromHints = MOCK_HINTS.map(hint => {
      const word = this.generateWordFromHint(hint);
      const leftPad = maxHighlight - hint.highlighted_letter_index;
  // Pad left and right with spaces so highlighted letter aligns
  const rightPad = Math.max(0, (maxHighlight - hint.highlighted_letter_index) + (word.length - 1 - hint.highlighted_letter_index));
  const paddedWord = ' '.repeat(leftPad) + word + ' '.repeat(rightPad);
      return {
        word: paddedWord,
        guessedLetters: new Array(paddedWord.length).fill(null),
        index: hint.word_index
      };
    });

    this.gameState = {
      words: wordsFromHints,
      hints: MOCK_HINTS,
      currentDay: this.getCurrentDay(),
      targetSentence: undefined
    };
  }

  private generateWordFromHint(hint: Hint): string {
    // Use actual words for internal validation (not shown to user)
    return ACTUAL_WORDS[hint.word_index] || '?'.repeat(hint.letter_count);
  }

  public static getInstance(): MockGameAPI {
    if (!MockGameAPI.instance) {
      MockGameAPI.instance = new MockGameAPI();
    }
    return MockGameAPI.instance;
  }

  private getCurrentDay(): number {
    // For demo purposes, return a day between 1-7 to show multiple hints
    return Math.min(7, Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 7 + 1);
  }

  public async getGameState(): Promise<GameState> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...this.gameState };
  }

  public async getAvailableHints(): Promise<Hint[]> {
  // Return all hints (no day filtering)
  await new Promise(resolve => setTimeout(resolve, 200));
  return this.gameState.hints;
  }

  public async updateWordGuess(wordIndex: number, letterIndex: number, letter: string): Promise<GameState> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const word = this.gameState.words[wordIndex];
    if (word) {
      word.guessedLetters[letterIndex] = letter.toUpperCase();
      
      // Check if all words are fully filled for target sentence generation
      const allFilled = this.gameState.words.every(w => 
        w.guessedLetters.every(letter => letter !== null)
      );
      if (allFilled && !this.gameState.targetSentence) {
        this.gameState.targetSentence = this.generateTargetSentence();
      }
    }
    
    return { ...this.gameState };
  }

  public async clearLetter(wordIndex: number, letterIndex: number): Promise<GameState> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const word = this.gameState.words[wordIndex];
    if (word) {
      word.guessedLetters[letterIndex] = null;
      this.gameState.targetSentence = undefined;
    }
    
    return { ...this.gameState };
  }

  private generateTargetSentence(): string {
    // Extract letters from the aligned highlighted column (maxHighlight)
    const maxHighlight = Math.max(...MOCK_HINTS.map(h => h.highlighted_letter_index));
    const letters = this.gameState.words.map(word => {
      const col = maxHighlight;
      const letter = word.guessedLetters[col];
      return letter || '?';
    });
    return letters.join('');
  }

  public async resetGame(): Promise<GameState> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.gameState.words.forEach(word => {
      word.guessedLetters.fill(null);
    });
    this.gameState.targetSentence = undefined;
    
    return { ...this.gameState };
  }
}
