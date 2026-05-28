/* ============================================
   GAMEVERSE — Sound Manager
   UI sound effects and background music
   ============================================ */

const SoundManager = {
  enabled: true,
  volume: 0.3,

  // Pre-defined UI sounds using Web Audio API (no external files needed)
  ctx: null,

  init() {
    this.enabled = Storage.get('sound-enabled') !== false;
  },

  getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.ctx;
  },

  // Generate a short beep/click sound
  playClick() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.value = this.volume * 0.3;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch { /* Audio not supported */ }
  },

  playSuccess() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const notes = [523, 659, 784]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.value = this.volume * 0.2;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15 + i * 0.1);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + 0.15 + i * 0.1);
      });
    } catch { /* Audio not supported */ }
  },

  playHover() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      osc.type = 'sine';
      gain.gain.value = this.volume * 0.1;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch { /* Audio not supported */ }
  },

  toggle() {
    this.enabled = !this.enabled;
    Storage.set('sound-enabled', this.enabled);
    return this.enabled;
  }
};
