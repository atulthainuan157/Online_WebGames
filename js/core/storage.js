/* ============================================
   GAMEVERSE — Storage Utility
   LocalStorage wrapper with namespacing
   ============================================ */

const Storage = {
  PREFIX: 'gv-',

  get(key) {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  },

  remove(key) {
    localStorage.removeItem(this.PREFIX + key);
  },

  // Favorites management
  getFavorites() {
    return this.get('favorites') || [];
  },

  toggleFavorite(gameId) {
    const favs = this.getFavorites();
    const index = favs.indexOf(gameId);
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(gameId);
    }
    this.set('favorites', favs);
    return favs;
  },

  isFavorite(gameId) {
    return this.getFavorites().includes(gameId);
  },

  // Recently played
  getRecent() {
    return this.get('recent') || [];
  },

  addRecent(gameId) {
    let recent = this.getRecent();
    recent = recent.filter(id => id !== gameId);
    recent.unshift(gameId);
    if (recent.length > 10) recent.pop();
    this.set('recent', recent);
    return recent;
  },

  // High scores
  getHighScore(gameId) {
    return this.get(`hs-${gameId}`) || 0;
  },

  setHighScore(gameId, score) {
    const current = this.getHighScore(gameId);
    if (score > current) {
      this.set(`hs-${gameId}`, score);
      return true;
    }
    return false;
  },

  // Theme
  getTheme() {
    return this.get('theme') || 'dark';
  },

  setTheme(theme) {
    this.set('theme', theme);
  }
};
