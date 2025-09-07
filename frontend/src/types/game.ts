export interface Hint {
  word_index: number;
  image_url: string;
  letter_count: number;
  highlighted_letter_index: number;
  id: string;
}

export interface GameWord {
  word: string;
  guessedLetters: (string | null)[];
  index: number;
}

export interface GameState {
  words: GameWord[];
  hints: Hint[];
  currentDay: number;
  targetSentence?: string;
}

export interface HintViewerState {
  currentHintIndex: number;
  viewMode: 'single' | 'grid';
  availableHints: Hint[];
}

export type GameMode = 'play' | 'victory' | 'loading';

export interface GameProgress {
  solvedWords: number;
  totalWords: number;
  isComplete: boolean;
}
