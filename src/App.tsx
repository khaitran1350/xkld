import { useState, useEffect } from 'react';
import type { KanaItem, UserStats } from './types/kana';
import { ALL_KANA } from './data/kanaData';
import {
  loadSettings,
  saveSettings,
  loadStats,
  saveStats,
} from './utils/storage';
import type { AppSettings } from './utils/storage';
import { Header } from './components/Header';
import { PracticeDojo } from './components/PracticeDojo';
import { KanaChart } from './components/KanaChart';
import { StatsView } from './components/StatsView';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { soundFx } from './utils/audio';

export function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [stats, setStats] = useState<UserStats>(() => loadStats());
  const [activeTab, setActiveTab] = useState<'practice' | 'chart' | 'stats'>('practice');
  const [detailKana, setDetailKana] = useState<KanaItem | null>(null);

  // Sync theme and font with HTML document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-font', settings.fontStyle);
    soundFx.setSoundEnabled(settings.soundEffects);
  }, [settings.theme, settings.fontStyle, settings.soundEffects]);

  // Update settings and persist
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  // Record practice attempt in stats
  const handleRecordAttempt = (kanaId: string, isCorrect: boolean) => {
    setStats((prev) => {
      const prevChar = prev.characterStats[kanaId] || {
        attempts: 0,
        correct: 0,
        lastAttemptCorrect: true,
      };

      const newCurrentStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);

      const updated: UserStats = {
        totalAttempts: prev.totalAttempts + 1,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        characterStats: {
          ...prev.characterStats,
          [kanaId]: {
            attempts: prevChar.attempts + 1,
            correct: prevChar.correct + (isCorrect ? 1 : 0),
            lastAttemptCorrect: isCorrect,
          },
        },
      };

      saveStats(updated);
      return updated;
    });
  };

  // Reset stats handler
  const handleResetStats = () => {
    const emptyStats: UserStats = {
      totalAttempts: 0,
      correctCount: 0,
      currentStreak: 0,
      bestStreak: 0,
      characterStats: {},
    };
    setStats(emptyStats);
    saveStats(emptyStats);
  };

  // Action: Practice a specific row from Chart
  const handlePracticeRow = (groupId: string) => {
    handleUpdateSettings({
      selectedGroups: [groupId],
    });
    setActiveTab('practice');
  };

  // Action: Practice troubled characters from Stats
  const handlePracticeTroubled = (troubledIds: string[]) => {
    // Find all groups that contain troubled items
    const groups = Array.from(
      new Set(
        ALL_KANA.filter((k) => troubledIds.includes(k.id)).map((k) => k.group)
      )
    );
    handleUpdateSettings({
      selectedGroups: groups.length > 0 ? groups : settings.selectedGroups,
    });
    setActiveTab('practice');
  };

  return (
    <div className="app-wrapper">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSettings={handleUpdateSettings}
        currentStreak={stats.currentStreak}
      />

      <main className="main-content">
        {activeTab === 'practice' && (
          <PracticeDojo
            settings={settings}
            updateSettings={handleUpdateSettings}
            stats={stats}
            onRecordAttempt={handleRecordAttempt}
            onOpenCharacterDetail={(item) => setDetailKana(item)}
          />
        )}

        {activeTab === 'chart' && (
          <KanaChart
            stats={stats}
            onSelectKana={(item) => setDetailKana(item)}
            onPracticeRow={handlePracticeRow}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            stats={stats}
            onSelectKana={(item) => setDetailKana(item)}
            onPracticeTroubled={handlePracticeTroubled}
            onResetStats={handleResetStats}
          />
        )}
      </main>

      {/* Character Detail Modal */}
      {detailKana && (
        <CharacterDetailModal
          item={detailKana}
          stats={stats}
          onClose={() => setDetailKana(null)}
          onPracticeSingle={(item) => {
            handlePracticeRow(item.group);
          }}
        />
      )}

      {/* Zen Footer */}
      <footer className="zen-footer">
        <span className="footer-quote">千里の道も一歩から — "A journey of a thousand miles begins with a single step."</span>
        <span>XKLD • かな道場</span>
      </footer>
    </div>
  );
}

export default App;
