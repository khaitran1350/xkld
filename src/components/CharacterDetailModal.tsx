import React from 'react';
import type { KanaItem, UserStats } from '../types/kana';
import { getStrokeGuide } from '../data/strokeGuides';
import { soundFx } from '../utils/audio';

interface CharacterDetailModalProps {
  item: KanaItem | null;
  stats: UserStats;
  onClose: () => void;
  onPracticeSingle: (item: KanaItem) => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  item,
  stats,
  onClose,
  onPracticeSingle,
}) => {
  if (!item) return null;

  const charStat = stats.characterStats[item.id];
  const attempts = charStat?.attempts || 0;
  const correct = charStat?.correct || 0;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  const strokeGuide = getStrokeGuide(item.id);

  const playPronunciation = (char: string) => {
    soundFx.speakJapanese(char);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <div className="glyph-duo">
            <div className="glyph-box hiragana" onClick={() => playPronunciation(item.hiragana)} title="Click to listen">
              <span className="glyph-label">Hiragana</span>
              <span className="glyph-char">{item.hiragana}</span>
            </div>
            <div className="glyph-box katakana" onClick={() => playPronunciation(item.katakana)} title="Click to listen">
              <span className="glyph-label">Katakana</span>
              <span className="glyph-char">{item.katakana}</span>
            </div>
          </div>

          <div className="modal-title-info">
            <h2 className="modal-romaji">【{item.romaji}】</h2>
            <p className="modal-row-tag">{item.rowName} • {item.strokeCount}画 ({item.strokeCount} strokes)</p>
            {item.alternatives && item.alternatives.length > 0 && (
              <p className="modal-alt-romaji">
                Also accepted: <code>{item.alternatives.join(', ')}</code>
              </p>
            )}

            <button
              type="button"
              className="modal-audio-btn"
              onClick={() => playPronunciation(item.hiragana)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              <span>Listen Pronunciation</span>
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Stroke Order Guide */}
          {strokeGuide && (
            <div className="info-section">
              <h3 className="section-title">
                <span className="section-icon">✍️</span> How to Write ({item.strokeCount} strokes)
              </h3>
              <ul className="stroke-steps-list">
                {strokeGuide.steps.map((step, i) => (
                  <li key={i} className="stroke-step-item">{step}</li>
                ))}
              </ul>
              {strokeGuide.tips && (
                <p className="stroke-tips-note">
                  💡 <strong>Writing Tip:</strong> {strokeGuide.tips}
                </p>
              )}
            </div>
          )}

          {/* Mnemonic Section */}
          <div className="info-section">
            <h3 className="section-title">
              <span className="section-icon">💡</span> Memory Mnemonic
            </h3>
            <p className="mnemonic-narrative">{item.mnemonic}</p>
          </div>

          {/* Example Word */}
          <div className="info-section">
            <h3 className="section-title">
              <span className="section-icon">🌸</span> Vocabulary Example
            </h3>
            <div className="example-card" onClick={() => playPronunciation(item.exampleWord.japanese)}>
              <div className="word-jp">{item.exampleWord.japanese}</div>
              <div className="word-meta">
                <span className="word-romaji">{item.exampleWord.romaji}</span>
                <span className="word-en">{item.exampleWord.english}</span>
              </div>
              <button type="button" className="mini-audio-btn" title="Listen to word">
                🔊
              </button>
            </div>
          </div>

          {/* User Performance Stats */}
          <div className="info-section">
            <h3 className="section-title">
              <span className="section-icon">📊</span> Your Mastery History
            </h3>
            <div className="stats-mini-grid">
              <div className="stat-pill">
                <span className="stat-num">{attempts}</span>
                <span className="stat-name">Attempts</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num">{correct}</span>
                <span className="stat-name">Correct</span>
              </div>
              <div className="stat-pill">
                <span className={`stat-num ${accuracy >= 80 ? 'green' : accuracy >= 50 ? 'yellow' : 'red'}`}>
                  {attempts > 0 ? `${accuracy}%` : '—'}
                </span>
                <span className="stat-name">Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="action-btn primary"
            onClick={() => {
              onPracticeSingle(item);
              onClose();
            }}
          >
            🥋 Practice this row in Dojo
          </button>
        </div>
      </div>
    </div>
  );
};
