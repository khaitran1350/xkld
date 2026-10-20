// Web Audio API & Web Speech API Sound Synthesis for Zen Dojo

class SoundEffects {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
  }

  public isSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  /**
   * Resonant wooden temple block (Mokugyo 木魚) sound
   * Warm, organic, soothing feedback for correct answers
   */
  public playCorrectSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Primary body tone (sine wave decaying rapidly)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Higher harmonic wood crack
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1160, now);
      clickOsc.frequency.exponentialRampToValueAtTime(500, now + 0.05);

      clickGain.gain.setValueAtTime(0.25, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.09);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Shimmering Zen temple bell (Suzu / Rin 鈴) sound
   * Celebrates streaks and mastery milestones
   */
  public playStreakSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const frequencies = [880, 1320, 1760];

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.2 / (idx + 1), now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + 0.75);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Gentle, soft low gong (Kane 鐘) tone
   * Non-punitive, contemplative indicator for wrong answer
   */
  public playIncorrectSound() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.35);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // ignore
    }
  }

  /**
   * Pronounce Japanese character or phrase using native SpeechSynthesis
   */
  public speakJapanese(text: string) {
    if (!this.speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85; // Slightly slower for clear pronunciation learning
      utterance.pitch = 1.0;

      // Try finding a Japanese voice
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang.startsWith('ja') || v.lang.includes('JP'));
      if (jaVoice) {
        utterance.voice = jaVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback
    }
  }
}

export const soundFx = new SoundEffects();
