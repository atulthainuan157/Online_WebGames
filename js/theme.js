/* ===================================================
   THEME.JS — Dark/Light mode toggle
   =================================================== */

const ThemeManager = {
    storageKey: 'gameverse-theme',

    init() {
        const saved = localStorage.getItem(this.storageKey) || 'dark';
        this.apply(saved);
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        this.apply(next);
        localStorage.setItem(this.storageKey, next);
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
};

ThemeManager.init();
