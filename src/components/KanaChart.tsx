import React, { useState } from 'react';
import type { KanaItem, UserStats } from '../types/kana';
import { BASIC_KANA, DAKUON_KANA } from '../data/kanaData';
import { soundFx } from '../utils/audio';

interface KanaChartProps {
  stats: UserStats;
  onSelectKana: (item: KanaItem) => void;
  onPracticeRow: (groupId: string) => void;
}

export const KanaChart: React.FC<KanaChartProps> = ({
  stats,
  onSelectKana,
  onPracticeRow,
}) => {
  const [chartScript, setChartScript] = useState<'hiragana' | 'katakana'>('hiragana');
  const [chartSection, setChartSection] = useState<'basic' | 'dakuon'>('basic');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const currentList = chartSection === 'basic' ? BASIC_KANA : DAKUON_KANA;

  const handlePlayAudio = (item: KanaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingId(item.id);
    const char = chartScript === 'hiragana' ? item.hiragana : item.katakana;
    soundFx.speakJapanese(char);
    setTimeout(() => {
      setPlayingId(null);
    }, 600);
  };

  // Group items by rowName
  const groupedRows: { rowName: string; group: string; items: KanaItem[] }[] = [];
  currentList.forEach((item) => {
    let existing = groupedRows.find((g) => g.group === item.group);
    if (!existing) {
      existing = { rowName: item.rowName, group: item.group, items: [] };
      groupedRows.push(existing);
    }
    existing.items.push(item);
  });

  return (
    <div className="kana-chart-container">
      {/* Chart Control Bar */}
      <div className="chart-controls">
        <div className="chart-mode-toggles">
          <div className="button-group">
            <button
              type="button"
              className={`ctrl-btn ${chartScript === 'hiragana' ? 'active' : ''}`}
              onClick={() => setChartScript('hiragana')}
            >
              ひらがな (Hiragana)
            </button>
            <button
              type="button"
              className={`ctrl-btn ${chartScript === 'katakana' ? 'active' : ''}`}
              onClick={() => setChartScript('katakana')}
            >
              カタカナ (Katakana)
            </button>
          </div>

          <div className="button-group">
            <button
              type="button"
              className={`ctrl-btn ${chartSection === 'basic' ? 'active' : ''}`}
              onClick={() => setChartSection('basic')}
            >
              Basic Gojūon (五十音)
            </button>
            <button
              type="button"
              className={`ctrl-btn ${chartSection === 'dakuon' ? 'active' : ''}`}
              onClick={() => setChartSection('dakuon')}
            >
              Dakuon (濁音・半濁音)
            </button>
          </div>
        </div>

        <p className="chart-hint">
          Click any character to hear pronunciation, or click details to explore memory mnemonics and examples.
        </p>
      </div>

      {/* Grid of Rows */}
      <div className="kana-grid-table">
        {groupedRows.map((row) => (
          <div key={row.group} className="kana-row-card">
            <div className="row-header-info">
              <span className="row-title-jp">{row.rowName}</span>
              <button
                type="button"
                className="practice-row-link"
                onClick={() => onPracticeRow(row.group)}
                title={`Practice only ${row.rowName} in the Dojo`}
              >
                🥋 Practice Row
              </button>
            </div>

            <div className="row-tiles">
              {row.items.map((item) => {
                const char = chartScript === 'hiragana' ? item.hiragana : item.katakana;
                const charStat = stats.characterStats[item.id];
                const attempts = charStat?.attempts || 0;
                const correct = charStat?.correct || 0;
                const rate = attempts > 0 ? Math.round((correct / attempts) * 100) : null;
                const isMastered = attempts >= 3 && rate !== null && rate >= 80;
                const isPlaying = playingId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`kana-tile ${isMastered ? 'mastered' : ''} ${isPlaying ? 'playing' : ''}`}
                    onClick={() => onSelectKana(item)}
                    role="button"
                    tabIndex={0}
                    title={`${item.romaji} - Click for details & memory mnemonic`}
                  >
                    <div className="tile-top">
                      <span className="tile-romaji">{item.romaji}</span>
                      <button
                        type="button"
                        className="tile-audio-btn"
                        onClick={(e) => handlePlayAudio(item, e)}
                        aria-label={`Pronounce ${char}`}
                        title="Listen"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      </button>
                    </div>

                    <div className="tile-char">{char}</div>

                    <div className="tile-footer">
                      {rate !== null ? (
                        <span className={`tile-rate ${rate >= 80 ? 'good' : rate >= 50 ? 'med' : 'low'}`}>
                          {rate}%
                        </span>
                      ) : (
                        <span className="tile-new">new</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
