import type { UserStats } from '../types/kana';

const STATS_KEY = 'kana_dojo_stats_v1';
const SETTINGS_KEY = 'kana_dojo_settings_v1';

export interface AppSettings {
  kanaMode: 'hiragana' | 'katakana' | 'mixed';
  fontStyle: 'modern' | 'handwriting';
  includeDakuon: boolean;
  selectedGroups: string[];
  theme: 'zen-light' | 'zen-dark';
  autoPronounce: boolean;
  soundEffects: boolean;
}

export const DEFAULT_STATS: UserStats = {
  totalAttempts: 0,
  correctCount: 0,
  currentStreak: 0,
  bestStreak: 0,
  characterStats: {},
};

export const DEFAULT_SETTINGS: AppSettings = {
  kanaMode: 'hiragana',
  fontStyle: 'modern',
  includeDakuon: false,
  selectedGroups: ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'], // All basic Gojuon rows by default
  theme: 'zen-light',
  autoPronounce: true,
  soundEffects: true,
};

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage errors
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}
