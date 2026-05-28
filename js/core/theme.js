/* ============================================
   GAMEVERSE — Theme Manager
   Dark/Light/Neon/Retro theme toggle
   ============================================ */

const ThemeManager = {
  themes: ['dark', 'neon', 'retro'],
  currentIndex: 0,

  init() {
    const saved = Storage.getTheme();
    this.apply(saved);
    this.bindToggle();
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.setTheme(theme);
    this.currentIndex = this.themes.indexOf(theme);
    if (this.currentIndex === -1) this.currentIndex = 0;
    this.updateIcon(theme);
  },

  toggle() {
    this.currentIndex = (this.currentIndex + 1) % this.themes.length;
    const next = this.themes[this.currentIndex];
    this.apply(next);
  },

  updateIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const icons = { dark: '☀️', neon: '💜', retro: '🕹️' };
    btn.innerHTML = icons[theme] || '☀️';
    btn.title = `Theme: ${theme}`;
  },

  bindToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  }
};
