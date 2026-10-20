import React, { useState } from 'react';
import type { KanaItem, UserStats } from '../types/kana';
import { ALL_KANA } from '../data/kanaData';
import { soundFx } from '../utils/audio';

interface StatsViewProps {
  stats: UserStats;
  onSelectKana: (item: KanaItem) => void;
  onPracticeTroubled: (troubledIds: string[]) => void;
  onResetStats: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  onSelectKana,
  onPracticeTroubled,
  onResetStats,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'mastered' | 'troubled' | 'new'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Identify troubled characters
  const troubledList: { item: KanaItem; accuracy: number; attempts: number }[] = [];
  const masteredList: KanaItem[] = [];
  const learningList: KanaItem[] = [];
  const untouchedList: KanaItem[] = [];

  ALL_KANA.forEach((kana) => {
    const s = stats.characterStats[kana.id];
    if (!s || s.attempts === 0) {
      untouchedList.push(kana);
    } else {
      const acc = Math.round((s.correct / s.attempts) * 100);
      if (s.attempts >= 3 && acc >= 80) {
        masteredList.push(kana);
      } else if (acc < 70 || !s.lastAttemptCorrect) {
        troubledList.push({ item: kana, accuracy: acc, attempts: s.attempts });
        learningList.push(kana);
      } else {
        learningList.push(kana);
      }
    }
  });

  const overallAccuracy =
    stats.totalAttempts > 0
      ? Math.round((stats.correctCount / stats.totalAttempts) * 100)
      : 0;

  // Filter list for display
  const filteredKana = ALL_KANA.filter((k) => {
    // Search query match
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchesRomaji = k.romaji.toLowerCase().includes(q);
      const matchesHira = k.hiragana.includes(q);
      const matchesKata = k.katakana.includes(q);
      const matchesEn = k.exampleWord.english.toLowerCase().includes(q);
      if (!matchesRomaji && !matchesHira && !matchesKata && !matchesEn) {
        return false;
      }
    }

    const s = stats.characterStats[k.id];
    if (filterType === 'all') return true;
    if (filterType === 'new') return !s || s.attempts === 0;
    if (filterType === 'mastered') {
      return s && s.attempts >= 3 && Math.round((s.correct / s.attempts) * 100) >= 80;
    }
    if (filterType === 'troubled') {
      return s && s.attempts > 0 && (Math.round((s.correct / s.attempts) * 100) < 70 || !s.lastAttemptCorrect);
    }
    return true;
  });

  const handleStartTroubledPractice = () => {
    if (troubledList.length === 0) return;
    const ids = troubledList.map((t) => t.item.id);
    onPracticeTroubled(ids);
  };

  const confirmReset = () => {
    if (window.confirm('Are you sure you want to reset all your practice progress and streak records?')) {
      onResetStats();
    }
  };

  return (
    <div className="stats-container">
      {/* Overview Metrics Cards */}
      <div className="metrics-summary-grid">
        <div className="metric-card">
          <span className="card-glyph">🎯</span>
          <div className="card-data">
            <span className="card-value">{overallAccuracy}%</span>
            <span className="card-label">Overall Accuracy</span>
          </div>
        </div>

        <div className="metric-card">
          <span className="card-glyph">🔥</span>
          <div className="card-data">
            <span className="card-value">{stats.bestStreak}</span>
            <span className="card-label">Best Streak Record</span>
          </div>
        </div>

        <div className="metric-card">
          <span className="card-glyph">🏆</span>
          <div className="card-data">
            <span className="card-value">{masteredList.length}</span>
            <span className="card-label">Kana Mastered</span>
          </div>
        </div>

        <div className="metric-card">
          <span className="card-glyph">📝</span>
          <div className="card-data">
            <span className="card-value">{stats.totalAttempts}</span>
            <span className="card-label">Total Answers Checked</span>
          </div>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="mastery-progress-card">
        <div className="progress-header">
          <h2 className="progress-title">Mastery Progress ({masteredList.length}/{ALL_KANA.length})</h2>
          <span className="progress-pct">
            {Math.round((masteredList.length / ALL_KANA.length) * 100)}%
          </span>
        </div>
        <div className="progress-multi-bar">
          <div
            className="bar-segment mastered"
            style={{ width: `${(masteredList.length / ALL_KANA.length) * 100}%` }}
            title={`Mastered: ${masteredList.length}`}
          />
          <div
            className="bar-segment learning"
            style={{ width: `${(learningList.length / ALL_KANA.length) * 100}%` }}
            title={`Learning: ${learningList.length}`}
          />
          <div
            className="bar-segment untouched"
            style={{ width: `${(untouchedList.length / ALL_KANA.length) * 100}%` }}
            title={`Not Yet Practiced: ${untouchedList.length}`}
          />
        </div>
        <div className="progress-legend">
          <span className="legend-item"><span className="dot mastered" /> Mastered ({masteredList.length})</span>
          <span className="legend-item"><span className="dot learning" /> In Progress ({learningList.length})</span>
          <span className="legend-item"><span className="dot untouched" /> Untouched ({untouchedList.length})</span>
        </div>
      </div>

      {/* Troubled Characters Targeted Practice Callout */}
      {troubledList.length > 0 && (
        <div className="troubled-callout-card">
          <div className="callout-content">
            <div className="callout-header">
              <span className="callout-icon">⚡</span>
              <div>
                <h3 className="callout-title">Troubled Characters Needing Review ({troubledList.length})</h3>
                <p className="callout-desc">
                  Characters you have missed or have lower accuracy with. Drill them together to build muscle memory!
                </p>
              </div>
            </div>

            <div className="troubled-chips">
              {troubledList.map(({ item, accuracy }) => (
                <button
                  key={item.id}
                  type="button"
                  className="troubled-chip"
                  onClick={() => onSelectKana(item)}
                  title={`${item.hiragana} / ${item.katakana} (${item.romaji}) - Accuracy: ${accuracy}%`}
                >
                  <span className="chip-kana">{item.hiragana}</span>
                  <span className="chip-rom">{item.romaji}</span>
                  <span className="chip-acc">{accuracy}%</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="focus-practice-btn"
            onClick={handleStartTroubledPractice}
          >
            🥋 Focus Drill Weak Kana Now
          </button>
        </div>
      )}

      {/* Detailed Kana Breakdown */}
      <div className="breakdown-section">
        <div className="breakdown-header">
          <h2 className="breakdown-title">Character Mastery Directory</h2>

          <div className="breakdown-filters">
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kana, romaji, word..."
            />

            <div className="filter-pill-group">
              <button
                type="button"
                className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All ({ALL_KANA.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${filterType === 'mastered' ? 'active' : ''}`}
                onClick={() => setFilterType('mastered')}
              >
                Mastered ({masteredList.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${filterType === 'troubled' ? 'active' : ''}`}
                onClick={() => setFilterType('troubled')}
              >
                Troubled ({troubledList.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${filterType === 'new' ? 'active' : ''}`}
                onClick={() => setFilterType('new')}
              >
                New ({untouchedList.length})
              </button>
            </div>
          </div>
        </div>

        <div className="character-table-grid">
          {filteredKana.map((kana) => {
            const s = stats.characterStats[kana.id];
            const attempts = s?.attempts || 0;
            const correct = s?.correct || 0;
            const rate = attempts > 0 ? Math.round((correct / attempts) * 100) : null;

            return (
              <div
                key={kana.id}
                className="stat-tile"
                onClick={() => onSelectKana(kana)}
                role="button"
                tabIndex={0}
              >
                <div className="stat-tile-top">
                  <span className="stat-tile-romaji">{kana.romaji}</span>
                  <button
                    type="button"
                    className="tile-speak"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.speakJapanese(kana.hiragana);
                    }}
                    title="Pronounce"
                  >
                    🔊
                  </button>
                </div>

                <div className="stat-tile-chars">
                  <span className="hira">{kana.hiragana}</span>
                  <span className="kata">{kana.katakana}</span>
                </div>

                <div className="stat-tile-metrics">
                  {attempts > 0 ? (
                    <>
                      <span className={`rate-badge ${rate! >= 80 ? 'green' : rate! >= 50 ? 'yellow' : 'red'}`}>
                        {rate}%
                      </span>
                      <span className="attempts-text">{attempts}x</span>
                    </>
                  ) : (
                    <span className="untested-text">Untested</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="danger-zone">
        <button type="button" className="reset-btn" onClick={confirmReset}>
          🗑 Reset All Mastery Data
        </button>
      </div>
    </div>
  );
};
