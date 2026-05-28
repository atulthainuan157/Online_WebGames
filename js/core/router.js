/* ============================================
   GAMEVERSE — Simple Router
   Hash-based page navigation
   ============================================ */

const Router = {
  routes: {},
  currentRoute: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  init() {
    window.addEventListener('hashchange', () => this.navigate());
    this.navigate();
  },

  navigate(path) {
    if (path) {
      window.location.hash = path;
      return;
    }

    const hash = window.location.hash.slice(1) || '/';
    this.currentRoute = hash;

    if (this.routes[hash]) {
      this.routes[hash]();
    }
  },

  getCurrentRoute() {
    return this.currentRoute || '/';
  }
};
