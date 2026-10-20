export type KanaType = 'hiragana' | 'katakana';

export type KanaGroup =
  | 'vowels'
  | 'k'
  | 's'
  | 't'
  | 'n'
  | 'h'
  | 'm'
  | 'y'
  | 'r'
  | 'w'
  | 'g'
  | 'z'
  | 'd'
  | 'b'
  | 'p';

export interface ExampleWord {
  japanese: string;
  romaji: string;
  english: string;
}

export interface KanaItem {
  id: string; // Unique identifier, typically the primary romaji (e.g. 'a', 'ka', 'shi')
  hiragana: string; // e.g. 'あ'
  katakana: string; // e.g. 'ア'
  romaji: string; // Primary romaji: 'shi'
  alternatives?: string[]; // Alternative valid romaji inputs: ['si']
  group: KanaGroup;
  rowName: string; // e.g. "Vowels (あ行)", "K-row (か行)"
  mnemonic: string; // Memory aid explanation
  exampleWord: ExampleWord;
  strokeCount: number;
  strokeGuide?: string[];
  isDakuon?: boolean;
}

export interface KanaAttempt {
  kanaId: string;
  userAnswer: string;
  correct: boolean;
  timestamp: number;
}

export interface CharacterStat {
  attempts: number;
  correct: number;
  lastAttemptCorrect: boolean;
}

export interface UserStats {
  totalAttempts: number;
  correctCount: number;
  currentStreak: number;
  bestStreak: number;
  characterStats: Record<string, CharacterStat>;
}
