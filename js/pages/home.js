/* ============================================
   GAMEVERSE — Home Page Logic
   Renders all home page sections
   ============================================ */

const HomePage = {
  init() {
    this.initHeroParallax();
    this.renderGames();
    this.renderCategories();
    this.renderTrending();
    this.renderArena();
    this.renderLeaderboard();
    this.renderChallenges();
    this.bindFilterButtons();
  },

  /* ---- Hero Parallax ---- */
  initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      hero.querySelectorAll('.hero-glow').forEach((glow, i) => {
        const factor = (i + 1) * 15;
        glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });

      hero.querySelectorAll('.hero-floating-element').forEach((el, i) => {
        const factor = (i + 1) * 10;
        el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
  },

  /* ---- Featured Games ---- */
  renderGames(filter = 'All') {
    const grid = document.getElementById('games-grid');
    if (!grid) return;

    const games = filter === 'All'
      ? GameData.getAll()
      : GameData.getByCategory(filter);

    grid.innerHTML = games.map(game => `
      <div class="game-card reveal" data-category="${game.category}">
        <div class="game-card-image">
          <div class="game-thumbnail" style="display:flex;align-items:center;justify-content:center;font-size:4rem;background:linear-gradient(135deg, ${game.color}22, ${game.color}08);">
            ${game.icon}
          </div>
          <div class="game-card-overlay">
            <button class="play-btn-sm" onclick="launchGame('${game.id}')">▶ Play Now</button>
          </div>
          <span class="game-card-badge">${game.badge}</span>
          <button class="game-card-fav ${Storage.isFavorite(game.id) ? 'active' : ''}" onclick="HomePage.toggleFav('${game.id}', this, event)">
            ${Storage.isFavorite(game.id) ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="game-card-info">
          <h3 class="game-card-title">${game.title}</h3>
          <div class="game-card-meta">
            <span class="game-card-category">${game.category}</span>
            <span class="game-card-rating">⭐ ${game.rating}</span>
          </div>
        </div>
      </div>
    `).join('');

    Utils.initScrollReveals();
  },

  toggleFav(gameId, btn, event) {
    event.stopPropagation();
    const favs = Storage.toggleFavorite(gameId);
    const isFav = favs.includes(gameId);
    btn.classList.toggle('active', isFav);
    btn.innerHTML = isFav ? '❤️' : '🤍';
    SoundManager.playClick();
  },

  bindFilterButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.renderGames(e.target.dataset.filter);
      }
    });
  },

  /* ---- Categories ---- */
  renderCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = GameData.categories.map(cat => `
      <div class="category-card reveal" onclick="HomePage.filterByCategory('${cat.name}')">
        <span class="category-icon">${cat.icon}</span>
        <h3 class="category-name">${cat.name}</h3>
        <p class="category-count">${cat.count} games</p>
      </div>
    `).join('');
  },

  filterByCategory(name) {
    const section = document.getElementById('games');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const btn = document.querySelector(`.filter-btn[data-filter="${name}"]`);
      if (btn) btn.click();
      else this.renderGames('All');
    }, 600);
  },

  /* ---- Trending ---- */
  renderTrending() {
    const track = document.getElementById('trending-track');
    if (!track) return;

    const all = [...GameData.getAll(), ...GameData.getAll()];
    track.innerHTML = all.map((game, i) => `
      <div class="trending-card" onclick="launchGame('${game.id}')">
        <div class="trending-card-img" style="background:linear-gradient(135deg, ${game.color}22, ${game.color}08);">
          <span style="font-size:3rem">${game.icon}</span>
          <span class="trending-rank">#${(i % GameData.getAll().length) + 1}</span>
        </div>
        <div class="trending-card-body">
          <h4 class="trending-card-title">${game.title}</h4>
          <span class="trending-card-players">🟢 ${game.players} playing</span>
        </div>
      </div>
    `).join('');
  },

  /* ---- Multiplayer Arena ---- */
  renderArena() {
    const grid = document.getElementById('arena-grid');
    if (!grid) return;

    grid.innerHTML = GameData.arena.map(arena => `
      <div class="arena-card reveal">
        <div class="arena-header">
          <span class="arena-game-icon">${arena.icon}</span>
          <span class="arena-live-badge">
            <span class="arena-live-dot"></span> LIVE
          </span>
        </div>
        <h3 class="arena-title">${arena.title}</h3>
        <p class="arena-desc">${arena.desc}</p>
        <div class="arena-stats">
          <span class="arena-stat"><span class="stat-icon">🏠</span> ${arena.rooms} Rooms</span>
          <span class="arena-stat"><span class="stat-icon">👤</span> ${arena.players} Online</span>
          <span class="arena-stat"><span class="stat-icon">🎮</span> ${arena.mode}</span>
        </div>
        <button class="arena-join-btn" onclick="launchGame('${arena.gameId || 'chess'}')">Join Arena</button>
      </div>
    `).join('');
  },

  /* ---- Leaderboard ---- */
  renderLeaderboard() {
    const table = document.getElementById('leaderboard-table');
    if (!table) return;

    table.innerHTML = GameData.leaderboard.map(player => {
      const rankCls = player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : player.rank === 3 ? 'bronze' : '';
      const rowCls = player.rank <= 3 ? `top-${player.rank}` : '';
      return `
        <div class="leaderboard-row ${rowCls} reveal">
          <span class="lb-rank ${rankCls}">${player.rank}</span>
          <span class="lb-avatar">${player.avatar}</span>
          <span class="lb-name">${player.name}</span>
          <span class="lb-xp">${player.xp.toLocaleString()} XP</span>
          <span class="lb-trophy">${player.trophy}</span>
        </div>
      `;
    }).join('');
  },

  /* ---- Daily Challenges ---- */
  renderChallenges() {
    const grid = document.getElementById('challenges-grid');
    if (!grid) return;

    grid.innerHTML = GameData.challenges.map(ch => `
      <div class="challenge-card reveal">
        <div class="challenge-top">
          <div class="challenge-icon">${ch.icon}</div>
          <span class="challenge-xp">⚡ +${ch.xp} XP</span>
        </div>
        <h3 class="challenge-title">${ch.title}</h3>
        <p class="challenge-desc">${ch.desc}</p>
        <div class="challenge-progress-bar">
          <div class="challenge-progress-fill" style="width:${ch.progress}%"></div>
        </div>
        <div class="challenge-footer">
          <span class="challenge-timer">⏱ ${ch.timeLeft} left</span>
          <button class="challenge-claim-btn" ${ch.progress < 100 ? 'disabled' : ''}>
            ${ch.progress >= 100 ? 'Claim' : ch.progress + '%'}
          </button>
        </div>
      </div>
    `).join('');
  }
};
