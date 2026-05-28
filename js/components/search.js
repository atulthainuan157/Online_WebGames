/* ============================================
   GAMEVERSE — Search Component JS
   Full-screen search overlay with filtering
   ============================================ */

const Search = {
  init() {
    const btn = document.getElementById('search-btn');
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const close = document.getElementById('search-close');
    const results = document.getElementById('search-results');
    if (!btn || !overlay) return;

    btn.addEventListener('click', () => {
      overlay.classList.add('active');
      setTimeout(() => input.focus(), 300);
    });

    close.addEventListener('click', () => {
      overlay.classList.remove('active');
      input.value = '';
      results.innerHTML = '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.classList.remove('active');
      }
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => input.focus(), 300);
      }
    });

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        results.innerHTML = '';
        return;
      }

      const matches = GameData.search(query);

      results.innerHTML = matches.map(game => `
        <div class="search-result-item" onclick="launchGame('${game.id}')">
          <div class="search-result-icon">${game.icon}</div>
          <div class="search-result-info">
            <h4>${game.title}</h4>
            <p>${game.category} • ⭐ ${game.rating}</p>
          </div>
        </div>
      `).join('');

      if (matches.length === 0) {
        results.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px;">No games found</p>';
      }
    });
  }
};
