import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { KanaItem, UserStats } from '../types/kana';
import { BASIC_KANA, DAKUON_KANA, ROW_CATEGORIES, checkRomajiMatch } from '../data/kanaData';
import type { AppSettings } from '../utils/storage';
import { soundFx } from '../utils/audio';

interface PracticeDojoProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  stats: UserStats;
  onRecordAttempt: (kanaId: string, isCorrect: boolean, userAnswer: string) => void;
  onOpenCharacterDetail: (item: KanaItem) => void;
}

type FeedbackState = 'idle' | 'correct' | 'incorrect' | 'revealed';

export const PracticeDojo: React.FC<PracticeDojoProps> = ({
  settings,
  updateSettings,
  stats,
  onRecordAttempt,
  onOpenCharacterDetail,
}) => {
  // Available pool of kana based on settings
  const [activePool, setActivePool] = useState<KanaItem[]>([]);
  // Review queue for items the user got wrong
  const [reviewQueue, setReviewQueue] = useState<KanaItem[]>([]);

  // Current kana item
  const [currentKana, setCurrentKana] = useState<KanaItem | null>(null);
  // Script type to show for current card: 'hiragana' or 'katakana'
  const [currentScript, setCurrentScript] = useState<'hiragana' | 'katakana'>('hiragana');

  // Input state
  const [userInput, setUserInput] = useState('');
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const [showHint, setShowHint] = useState(false);
  const [showRowSelector, setShowRowSelector] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const autoAdvanceTimeout = useRef<number | null>(null);

  // Compute active pool when settings change
  useEffect(() => {
    let pool: KanaItem[] = [];
    const sourceList = settings.includeDakuon ? [...BASIC_KANA, ...DAKUON_KANA] : BASIC_KANA;

    if (settings.selectedGroups.length === 0) {
      pool = BASIC_KANA; // fallback to all basic
    } else {
      pool = sourceList.filter((k) => settings.selectedGroups.includes(k.group));
    }

    if (pool.length === 0) {
      pool = BASIC_KANA;
    }

    setActivePool(pool);
  }, [settings.selectedGroups, settings.includeDakuon]);

  // Pick a new random Kana
  const pickNextKana = useCallback(() => {
    if (activePool.length === 0) return;

    if (autoAdvanceTimeout.current) {
      window.clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }

    let nextItem: KanaItem;

    // 35% chance to prioritize a character from the review queue if available
    if (reviewQueue.length > 0 && Math.random() < 0.35) {
      nextItem = reviewQueue[0];
      setReviewQueue((prev) => prev.slice(1));
    } else {
      // Pick random item from active pool (avoid immediate duplicate if pool > 1)
      const filtered = activePool.length > 1 && currentKana
        ? activePool.filter((k) => k.id !== currentKana.id)
        : activePool;
      const randomIndex = Math.floor(Math.random() * filtered.length);
      nextItem = filtered[randomIndex] || activePool[0];
    }

    // Determine script to show
    let script: 'hiragana' | 'katakana' = 'hiragana';
    if (settings.kanaMode === 'katakana') {
      script = 'katakana';
    } else if (settings.kanaMode === 'mixed') {
      script = Math.random() < 0.5 ? 'hiragana' : 'katakana';
    }

    setCurrentKana(nextItem);
    setCurrentScript(script);
    setUserInput('');
    setFeedbackState('idle');
    setShowHint(false);

    // Focus input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [activePool, currentKana, reviewQueue, settings.kanaMode]);

  // Initial load
  useEffect(() => {
    if (activePool.length > 0 && !currentKana) {
      pickNextKana();
    }
  }, [activePool, currentKana, pickNextKana]);

  // Automatically focus input on mount & state change
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentKana, feedbackState]);

  // Speak character using native TTS
  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentKana) return;
    const char = currentScript === 'hiragana' ? currentKana.hiragana : currentKana.katakana;
    soundFx.speakJapanese(char);
  };

  // Submit and check answer
  const handleCheckAnswer = (overrideInput?: string) => {
    if (!currentKana || feedbackState === 'correct') return;

    const answerToCheck = overrideInput !== undefined ? overrideInput : userInput;
    const isCorrect = checkRomajiMatch(answerToCheck, currentKana);

    if (isCorrect) {
      setFeedbackState('correct');
      setSessionCount((prev) => prev + 1);
      setSessionCorrect((prev) => prev + 1);
      onRecordAttempt(currentKana.id, true, answerToCheck);

      // Audio feedback
      soundFx.playCorrectSound();
      const currentStreakNext = stats.currentStreak + 1;
      if (currentStreakNext > 0 && currentStreakNext % 5 === 0) {
        soundFx.playStreakSound();
      }

      // Speak pronunciation
      if (settings.autoPronounce) {
        const char = currentScript === 'hiragana' ? currentKana.hiragana : currentKana.katakana;
        soundFx.speakJapanese(char);
      }

      // Flow-state auto advance after 950ms
      autoAdvanceTimeout.current = window.setTimeout(() => {
        pickNextKana();
      }, 950);
    } else {
      setFeedbackState('incorrect');
      setSessionCount((prev) => prev + 1);
      onRecordAttempt(currentKana.id, false, answerToCheck);

      soundFx.playIncorrectSound();

      // Add to review queue so user encounters it again soon
      setReviewQueue((prev) => {
        if (!prev.some((k) => k.id === currentKana.id)) {
          return [...prev, currentKana];
        }
        return prev;
      });
    }
  };

  // Handle typing input: live check if exact match
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trimStart();
    setUserInput(val);

    // If already in error state and user starts retyping, reset feedback
    if (feedbackState === 'incorrect') {
      setFeedbackState('idle');
    }

    // Seamless instant matching when fully typed
    if (currentKana && checkRomajiMatch(val, currentKana)) {
      handleCheckAnswer(val);
    }
  };

  // Handle Enter key or shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (feedbackState === 'correct' || feedbackState === 'revealed' || feedbackState === 'incorrect') {
        pickNextKana();
      } else {
        handleCheckAnswer();
      }
    } else if (e.key === 'Escape') {
      setShowHint(true);
    }
  };

  // Give up / Reveal answer
  const handleRevealAnswer = () => {
    if (!currentKana) return;
    setFeedbackState('revealed');
    setSessionCount((prev) => prev + 1);
    onRecordAttempt(currentKana.id, false, '(skipped)');
    soundFx.playIncorrectSound();

    // Add to review queue
    setReviewQueue((prev) => {
      if (!prev.some((k) => k.id === currentKana.id)) {
        return [...prev, currentKana];
      }
      return prev;
    });

    // Speak audio to learn the sound
    const char = currentScript === 'hiragana' ? currentKana.hiragana : currentKana.katakana;
    soundFx.speakJapanese(char);
  };

  // Toggle row group selection
  const toggleGroup = (groupId: string) => {
    const isSelected = settings.selectedGroups.includes(groupId);
    let updated: string[];
    if (isSelected) {
      if (settings.selectedGroups.length === 1) return; // keep at least one
      updated = settings.selectedGroups.filter((g) => g !== groupId);
    } else {
      updated = [...settings.selectedGroups, groupId];
    }
    updateSettings({ selectedGroups: updated });
  };

  const selectAllBasicRows = () => {
    updateSettings({
      selectedGroups: ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'],
      includeDakuon: false,
    });
  };

  const selectAllRowsWithDakuon = () => {
    updateSettings({
      selectedGroups: ROW_CATEGORIES.map((r) => r.id),
      includeDakuon: true,
    });
  };

  // Display characters
  const displayChar = currentKana
    ? currentScript === 'hiragana'
      ? currentKana.hiragana
      : currentKana.katakana
    : '…';

  const otherScriptChar = currentKana
    ? currentScript === 'hiragana'
      ? currentKana.katakana
      : currentKana.hiragana
    : '';

  const accuracyPct = sessionCount > 0 ? Math.round((sessionCorrect / sessionCount) * 100) : 100;

  return (
    <div className="practice-container">
      {/* Practice Header HUD */}
      <div className="practice-hud">
        <div className="hud-metric" title="Current session streak">
          <span className="hud-icon">🔥</span>
          <div className="hud-info">
            <span className="hud-val">{stats.currentStreak}</span>
            <span className="hud-lbl">Streak</span>
          </div>
        </div>

        <div className="hud-metric" title="Session accuracy rate">
          <span className="hud-icon">🎯</span>
          <div className="hud-info">
            <span className="hud-val">{sessionCount > 0 ? `${accuracyPct}%` : '100%'}</span>
            <span className="hud-lbl">Accuracy</span>
          </div>
        </div>

        <div className="hud-metric" title="Characters practiced this session">
          <span className="hud-icon">📝</span>
          <div className="hud-info">
            <span className="hud-val">{sessionCount}</span>
            <span className="hud-lbl">Practiced</span>
          </div>
        </div>

        {reviewQueue.length > 0 && (
          <div className="hud-metric review-badge" title="Characters queued for review repetition">
            <span className="hud-icon">🔁</span>
            <div className="hud-info">
              <span className="hud-val">{reviewQueue.length}</span>
              <span className="hud-lbl">To Review</span>
            </div>
          </div>
        )}

        <button
          type="button"
          className={`row-filter-btn ${showRowSelector ? 'open' : ''}`}
          onClick={() => setShowRowSelector(!showRowSelector)}
          title="Filter specific Kana rows to practice"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Rows ({settings.selectedGroups.length})</span>
          <span className="dropdown-arrow">{showRowSelector ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Row Selection Filter Drawer */}
      {showRowSelector && (
        <div className="row-filter-drawer">
          <div className="filter-drawer-header">
            <h2 className="filter-title">Choose Kana Rows to Practice</h2>
            <div className="filter-actions">
              <button type="button" className="pill-action-btn" onClick={selectAllBasicRows}>
                Basic 46 (あ〜ん)
              </button>
              <button type="button" className="pill-action-btn" onClick={selectAllRowsWithDakuon}>
                All + Dakuon (が〜ぽ)
              </button>
            </div>
          </div>

          <div className="row-chips-grid">
            {ROW_CATEGORIES.map((row) => {
              const active = settings.selectedGroups.includes(row.id);
              return (
                <button
                  key={row.id}
                  type="button"
                  className={`row-chip ${active ? 'active' : ''}`}
                  onClick={() => toggleGroup(row.id)}
                >
                  <span className="chip-label">{row.label}</span>
                  <span className="chip-sub">{row.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Flashcard Card */}
      <div className={`zen-card ${feedbackState}`}>
        {/* Card Header metadata */}
        <div className="card-top-meta">
          <span className="script-badge">
            {currentScript === 'hiragana' ? 'ひらがな Hiragana' : 'カタカナ Katakana'}
          </span>

          <span className="row-badge">
            {currentKana?.rowName || ''}
          </span>

          <button
            type="button"
            className="card-audio-btn"
            onClick={handleSpeak}
            title="Listen to native Japanese pronunciation"
            aria-label="Play pronunciation audio"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <span className="listen-text">Listen</span>
          </button>
        </div>

        {/* Large Kana Display with Zen Ensō Ink Stamp */}
        <div className="character-stage" onClick={handleSpeak} title="Click to listen">
          <div className="enso-circle" />
          <div className="kana-symbol">{displayChar}</div>
          <div className="counterpart-kana" title={`Equivalent in ${currentScript === 'hiragana' ? 'Katakana' : 'Hiragana'}`}>
            {otherScriptChar}
          </div>
        </div>


        {/* Typing Input Form */}
        <form
          className="practice-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (feedbackState === 'correct' || feedbackState === 'revealed') {
              pickNextKana();
            } else {
              handleCheckAnswer();
            }
          }}
        >
          <div className={`input-wrapper ${feedbackState}`}>
            <input
              ref={inputRef}
              type="text"
              className="romaji-input"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type romaji..."
              autoFocus
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              disabled={feedbackState === 'correct'}
            />

            {userInput && feedbackState === 'idle' && (
              <button
                type="button"
                className="clear-input-btn"
                onClick={() => {
                  setUserInput('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear input"
              >
                ✕
              </button>
            )}

            <button
              type="submit"
              className={`submit-check-btn ${feedbackState}`}
              disabled={feedbackState === 'correct'}
            >
              {feedbackState === 'correct' ? '✓' : 'Check'}
            </button>
          </div>
        </form>

        {/* Feedback Banner */}
        {feedbackState !== 'idle' && (
          <div className={`feedback-banner ${feedbackState}`} role="alert">
            {feedbackState === 'correct' && (
              <div className="feedback-content">
                <div className="feedback-header">
                  <span className="feedback-badge correct">正解 Correct!</span>
                  <span className="romaji-answer">【{currentKana?.romaji}】</span>
                </div>
                <div className="example-preview">
                  <span className="example-jp">{currentKana?.exampleWord.japanese}</span>
                  <span className="example-romaji">({currentKana?.exampleWord.romaji})</span>
                  <span className="example-en">"{currentKana?.exampleWord.english}"</span>
                </div>
              </div>
            )}

            {feedbackState === 'incorrect' && (
              <div className="feedback-content">
                <div className="feedback-header">
                  <span className="feedback-badge incorrect">惜しい Not quite!</span>
                  <span className="correct-reading">
                    Correct reading is: <strong>【{currentKana?.romaji}】</strong>
                  </span>
                </div>
                <p className="mnemonic-text">
                  <span className="mnemonic-tag">💡 Mnemonic:</span> {currentKana?.mnemonic}
                </p>
                <div className="example-preview">
                  <span className="example-jp">{currentKana?.exampleWord.japanese}</span>
                  <span className="example-romaji">({currentKana?.exampleWord.romaji})</span>
                  <span className="example-en">"{currentKana?.exampleWord.english}"</span>
                </div>
                <div className="incorrect-actions">
                  <button
                    type="button"
                    className="action-link-btn"
                    onClick={() => {
                      setUserInput('');
                      setFeedbackState('idle');
                      inputRef.current?.focus();
                    }}
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    className="advance-btn"
                    onClick={pickNextKana}
                  >
                    Next Kana (Enter) →
                  </button>
                </div>
              </div>
            )}

            {feedbackState === 'revealed' && (
              <div className="feedback-content">
                <div className="feedback-header">
                  <span className="feedback-badge revealed">Answer Revealed</span>
                  <span className="correct-reading">
                    Reading: <strong>【{currentKana?.romaji}】</strong>
                  </span>
                </div>
                <p className="mnemonic-text">
                  <span className="mnemonic-tag">💡 Mnemonic:</span> {currentKana?.mnemonic}
                </p>
                <div className="example-preview">
                  <span className="example-jp">{currentKana?.exampleWord.japanese}</span>
                  <span className="example-romaji">({currentKana?.exampleWord.romaji})</span>
                  <span className="example-en">"{currentKana?.exampleWord.english}"</span>
                </div>
                <div className="incorrect-actions">
                  <button
                    type="button"
                    className="advance-btn"
                    onClick={pickNextKana}
                  >
                    Next Kana (Enter) →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hint Box (when requested before answering) */}
        {showHint && feedbackState === 'idle' && (
          <div className="hint-callout">
            <span className="hint-icon">💡</span>
            <div className="hint-body">
              <strong>Memory Hint:</strong> {currentKana?.mnemonic}
            </div>
          </div>
        )}

        {/* Secondary Card Footer Controls */}
        <div className="card-footer-controls">
          <button
            type="button"
            className="footer-btn hint-btn"
            onClick={() => setShowHint(!showHint)}
            title="Show memory hint (Esc)"
          >
            💡 {showHint ? 'Hide Hint' : 'Hint'}
          </button>

          {currentKana && (
            <button
              type="button"
              className="footer-btn detail-btn"
              onClick={() => onOpenCharacterDetail(currentKana)}
              title="View stroke order & full info"
            >
              📖 View Details
            </button>
          )}

          <button
            type="button"
            className="footer-btn skip-btn"
            onClick={handleRevealAnswer}
            disabled={feedbackState === 'correct' || feedbackState === 'revealed'}
            title="I don't know this one yet - reveal answer"
          >
            ⏭ Skip / Reveal
          </button>
        </div>
      </div>

      {/* Zen pro-tip helper */}
      <div className="zen-tip-box">
        <span className="zen-tip-icon">⛩</span>
        <span className="zen-tip-text">
          <strong>Tip:</strong> Press <code>Enter</code> to submit or advance. Multiple spellings like <code>shi/si</code>, <code>tsu/tu</code>, and <code>chi/ti</code> are all supported.
        </span>
      </div>
    </div>
  );
};
