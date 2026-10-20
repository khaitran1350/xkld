import React from 'react';
import type { AppSettings } from '../utils/storage';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  activeTab: 'practice' | 'chart' | 'stats';
  setActiveTab: (tab: 'practice' | 'chart' | 'stats') => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  currentStreak: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  updateSettings,
  currentStreak,
}) => {
  const toggleSound = () => {
    const next = !settings.soundEffects;
    updateSettings({ soundEffects: next });
    soundFx.setSoundEnabled(next);
  };

  const toggleTheme = () => {
    const next = settings.theme === 'zen-light' ? 'zen-dark' : 'zen-light';
    updateSettings({ theme: next });
  };

  return (
    <header className="zen-header">
      <div className="header-top">
        <div className="brand" onClick={() => setActiveTab('practice')} role="button" tabIndex={0}>
          <div className="hanko-seal" title="Kana Dojo Seal">
            <span>道場</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">かな道場 <span className="brand-sub">XKLD Dojo</span></h1>
            <p className="brand-tagline">Japanese Hiragana & Katakana Mastery • XKLD</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Streak indicator in header */}
          <div className={`streak-badge ${currentStreak > 0 ? 'active' : ''}`} title="Current Correct Streak">
            <span className="flame-icon">🔥</span>
            <span className="streak-count">{currentStreak}</span>
            <span className="streak-label">streak</span>
          </div>

          {/* Script mode switch */}
          <div className="script-mode-toggle" role="group" aria-label="Script selection">
            <button
              type="button"
              className={`mode-btn ${settings.kanaMode === 'hiragana' ? 'active' : ''}`}
              onClick={() => updateSettings({ kanaMode: 'hiragana' })}
              title="Study Hiragana"
            >
              ひらがな
            </button>
            <button
              type="button"
              className={`mode-btn ${settings.kanaMode === 'katakana' ? 'active' : ''}`}
              onClick={() => updateSettings({ kanaMode: 'katakana' })}
              title="Study Katakana"
            >
              カタカナ
            </button>
            <button
              type="button"
              className={`mode-btn ${settings.kanaMode === 'mixed' ? 'active' : ''}`}
              onClick={() => updateSettings({ kanaMode: 'mixed' })}
              title="Mix Hiragana & Katakana"
            >
              混 (Mix)
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            className="icon-btn sound-btn"
            onClick={toggleSound}
            aria-label={settings.soundEffects ? 'Mute sound effects' : 'Enable sound effects'}
            title={settings.soundEffects ? 'Sound: On' : 'Sound: Muted'}
          >
            {settings.soundEffects ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="icon-btn theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={settings.theme === 'zen-light' ? 'Switch to Zen Night' : 'Switch to Washi Day'}
          >
            {settings.theme === 'zen-light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="zen-nav" aria-label="Main Navigation">
        <button
          type="button"
          className={`nav-tab ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <span className="tab-kanji">錬</span>
          <span className="tab-title">Practice Dojo</span>
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          <span className="tab-kanji">表</span>
          <span className="tab-title">Kana Chart</span>
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="tab-kanji">記</span>
          <span className="tab-title">Mastery & Stats</span>
        </button>
      </nav>
    </header>
  );
};
