/* ============================================
   GAMEVERSE - Main JavaScript
   Platform logic, interactions & animations
   ============================================ */

// ==========================================
// GAME DATA
// ==========================================
const GAMES_DATA = [
  {
    id: 'snake',
    title: 'Neon Snake',
    category: 'Arcade',
    rating: 4.8,
    badge: 'Popular',
    icon: '🐍',
    color: '#10b981',
    players: '12.4K',
    description: 'Classic snake with neon visuals'
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    category: 'Board',
    rating: 4.5,
    badge: 'Classic',
    icon: '⭕',
    color: '#8b5cf6',
    players: '8.2K',
    description: 'Strategic board game'
  },
  {
    id: 'flappy',
    title: 'Flappy Neon',
    category: 'Arcade',
    rating: 4.7,
    badge: 'Trending',
    icon: '🐦',
    color: '#f59e0b',
    players: '15.1K',
    description: 'Dodge obstacles and fly high'
  },
  {
    id: 'chess',
    title: 'Cyber Chess',
    category: 'Board',
    rating: 4.9,
    badge: 'Featured',
    icon: '♟️',
    color: '#06b6d4',
    players: '9.7K',
    description: 'The ultimate strategy game'
  },
  {
    id: '2048',
    title: '2048 Fusion',
    category: 'Puzzle',
    rating: 4.6,
    badge: 'Addictive',
    icon: '🔢',
    color: '#ec4899',
    players: '18.3K',
    description: 'Merge tiles to reach 2048'
  },
  {
    id: 'pacman',
    title: 'Pac Runner',
    category: 'Arcade',
    rating: 4.8,
    badge: 'Retro',
    icon: '👾',
    color: '#f59e0b',
    players: '11.5K',
    description: 'Classic maze chase game'
  },
  {
    id: 'racing',
    title: 'Turbo Racer',
    category: 'Racing',
    rating: 4.4,
    badge: 'New',
    icon: '🏎️',
    color: '#ef4444',
    players: '7.8K',
    description: 'High-speed racing action'
  },
  {
    id: 'memory',
    title: 'Memory Matrix',
    category: 'Puzzle',
    rating: 4.3,
    badge: 'Brain',
    icon: '🧠',
    color: '#8b5cf6',
    players: '6.1K',
    description: 'Match pairs and test memory'
  }
];

const CATEGORIES_DATA = [
  { name: 'Arcade', icon: '🕹️', count: 24, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { name: 'Puzzle', icon: '🧩', count: 18, gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { name: 'Action', icon: '⚔️', count: 15, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { name: 'Adventure', icon: '🗺️', count: 12, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { name: 'Racing', icon: '🏁', count: 9, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { name: 'Sports', icon: '⚽', count: 11, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  { name: 'Multiplayer', icon: '👥', count: 8, gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  { name: 'Board Games', icon: '🎲', count: 14, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { name: 'Retro', icon: '👾', count: 20, gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { name: 'Horror', icon: '💀', count: 6, gradient: 'linear-gradient(135deg, #6b21a8, #581c87)' }
];

const LEADERBOARD_DATA = [
  { rank: 1, name: 'ShadowStrike', avatar: '🦊', xp: 28450, trophy: '🏆' },
  { rank: 2, name: 'NeonPhantom', avatar: '🐺', xp: 25200, trophy: '🥈' },
  { rank: 3, name: 'CyberWolf', avatar: '🦅', xp: 22180, trophy: '🥉' },
  { rank: 4, name: 'PixelKnight', avatar: '🐉', xp: 19400, trophy: '⭐' },
  { rank: 5, name: 'GameForge', avatar: '🦁', xp: 17850, trophy: '⭐' },
  { rank: 6, name: 'VoidRunner', avatar: '🐼', xp: 15300, trophy: '⭐' },
  { rank: 7, name: 'BlazeMaster', avatar: '🦈', xp: 13720, trophy: '⭐' },
  { rank: 8, name: 'QuantumAce', avatar: '🦉', xp: 12100, trophy: '⭐' }
];

const ARENA_DATA = [
  {
    title: 'Chess Arena',
    icon: '♟️',
    desc: 'Challenge players worldwide in real-time chess matches. Ranked and casual modes available.',
    rooms: 42,
    players: 186,
    mode: 'PvP'
  },
  {
    title: 'Ludo Royale',
    icon: '🎲',
    desc: 'Classic Ludo with a competitive twist. Race your tokens and dominate the board.',
    rooms: 28,
    players: 112,
    mode: 'Party'
  },
  {
    title: 'Quiz Battle',
    icon: '🧠',
    desc: 'Test your knowledge against other players in fast-paced trivia showdowns.',
    rooms: 35,
    players: 247,
    mode: 'Team'
  },
  {
    title: 'Battle Arena',
    icon: '⚔️',
    desc: 'Enter the arena, choose your fighter, and battle for glory and XP rewards.',
    rooms: 19,
    players: 94,
    mode: 'PvP'
  }
];

const CHALLENGES_DATA = [
  {
    icon: '🎯',
    title: 'Perfect Score',
    desc: 'Score 100 points in any arcade game without losing a life.',
    xp: 500,
    progress: 65,
    timeLeft: '5h 23m'
  },
  {
    icon: '⚡',
    title: 'Speed Demon',
    desc: 'Complete 3 puzzle games in under 10 minutes total.',
    xp: 750,
    progress: 33,
    timeLeft: '8h 12m'
  },
  {
    icon: '🔥',
    title: 'Win Streak',
    desc: 'Win 5 multiplayer matches in a row without losing.',
    xp: 1200,
    progress: 80,
    timeLeft: '2h 45m'
  }
];

// ==========================================
// DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initParticles();
  initNavbar();
  initSearch();
  initHeroParallax();
  renderGames();
  renderCategories();
  renderTrendingCarousel();
  renderArena();
  renderLeaderboard();
  renderChallenges();
  initScrollAnimations();
  initThemeToggle();
  initBackToTop();
  initCounterAnimations();
});

// ==========================================
// LOADING SCREEN
// ==========================================
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar');
  const loadingText = document.getElementById('loading-text');

  const messages = [
    'Initializing game engine...',
    'Loading assets...',
    'Connecting to servers...',
    'Preparing your experience...',
    'Almost ready...'
  ];

  let progress = 0;
  let msgIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;

    loadingBar.style.width = progress + '%';

    if (progress > (msgIndex + 1) * 20 && msgIndex < messages.length - 1) {
      msgIndex++;
      loadingText.textContent = messages[msgIndex];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 500);
    }
  }, 200);
}

// ==========================================
// PARTICLE SYSTEM
// ==========================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '139, 92, 246' : '6, 182, 212';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// NAVBAR
// ==========================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  });
}

// ==========================================
// SEARCH
// ==========================================
function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchResults = document.getElementById('search-results');

  searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 300);
  });

  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('active');
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    const results = GAMES_DATA.filter(g =>
      g.title.toLowerCase().includes(query) ||
      g.category.toLowerCase().includes(query)
    );

    searchResults.innerHTML = results.map(game => `
      <div class="search-result-item" onclick="launchGame('${game.id}')">
        <div class="search-result-icon">${game.icon}</div>
        <div class="search-result-info">
          <h4>${game.title}</h4>
          <p>${game.category} • ⭐ ${game.rating}</p>
        </div>
      </div>
    `).join('');

    if (results.length === 0) {
      searchResults.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 24px;">No games found</p>';
    }
  });
}

// ==========================================
// HERO PARALLAX
// ==========================================
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const glows = hero.querySelectorAll('.hero-glow');
    glows.forEach((glow, i) => {
      const factor = (i + 1) * 15;
      glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });

    const floats = hero.querySelectorAll('.hero-floating-element');
    floats.forEach((el, i) => {
      const factor = (i + 1) * 10;
      el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

// ==========================================
// RENDER GAMES
// ==========================================
let favoriteGames = JSON.parse(localStorage.getItem('gv-favorites') || '[]');

function renderGames(filter = 'All') {
  const grid = document.getElementById('games-grid');
  if (!grid) return;

  const filtered = filter === 'All'
    ? GAMES_DATA
    : GAMES_DATA.filter(g => g.category === filter);

  grid.innerHTML = filtered.map(game => `
    <div class="game-card reveal" data-category="${game.category}">
      <div class="game-card-image">
        <div class="game-thumbnail" style="display:flex;align-items:center;justify-content:center;font-size:4rem;background:linear-gradient(135deg, ${game.color}22, ${game.color}08);">
          ${game.icon}
        </div>
        <div class="game-card-overlay">
          <button class="play-btn-sm" onclick="launchGame('${game.id}')">▶ Play Now</button>
        </div>
        <span class="game-card-badge">${game.badge}</span>
        <button class="game-card-fav ${favoriteGames.includes(game.id) ? 'active' : ''}" onclick="toggleFavorite('${game.id}', this, event)">
          ${favoriteGames.includes(game.id) ? '❤️' : '🤍'}
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

  // Re-init scroll reveals for new elements
  initScrollAnimations();
}

function toggleFavorite(gameId, btn, event) {
  event.stopPropagation();
  if (favoriteGames.includes(gameId)) {
    favoriteGames = favoriteGames.filter(id => id !== gameId);
    btn.classList.remove('active');
    btn.innerHTML = '🤍';
  } else {
    favoriteGames.push(gameId);
    btn.classList.add('active');
    btn.innerHTML = '❤️';
  }
  localStorage.setItem('gv-favorites', JSON.stringify(favoriteGames));
}

// Filter buttons
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderGames(e.target.dataset.filter);
  }
});

// ==========================================
// RENDER CATEGORIES
// ==========================================
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES_DATA.map(cat => `
    <div class="category-card reveal" onclick="filterByCategory('${cat.name}')">
      <span class="category-icon">${cat.icon}</span>
      <h3 class="category-name">${cat.name}</h3>
      <p class="category-count">${cat.count} games</p>
    </div>
  `).join('');
}

function filterByCategory(name) {
  const gamesSection = document.getElementById('games');
  gamesSection.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const filterBtn = document.querySelector(`.filter-btn[data-filter="${name}"]`);
    if (filterBtn) {
      filterBtn.click();
    } else {
      // If there's no matching filter button, use "All"
      renderGames('All');
    }
  }, 600);
}

// ==========================================
// TRENDING CAROUSEL
// ==========================================
function renderTrendingCarousel() {
  const track = document.getElementById('trending-track');
  if (!track) return;

  // Duplicate for infinite scroll
  const allGames = [...GAMES_DATA, ...GAMES_DATA];

  track.innerHTML = allGames.map((game, i) => `
    <div class="trending-card" onclick="launchGame('${game.id}')">
      <div class="trending-card-img" style="background:linear-gradient(135deg, ${game.color}22, ${game.color}08);">
        <span style="font-size:3rem">${game.icon}</span>
        <span class="trending-rank">#${(i % GAMES_DATA.length) + 1}</span>
      </div>
      <div class="trending-card-body">
        <h4 class="trending-card-title">${game.title}</h4>
        <span class="trending-card-players">🟢 ${game.players} playing</span>
      </div>
    </div>
  `).join('');
}

// ==========================================
// MULTIPLAYER ARENA
// ==========================================
function renderArena() {
  const grid = document.getElementById('arena-grid');
  if (!grid) return;

  grid.innerHTML = ARENA_DATA.map(arena => `
    <div class="arena-card reveal">
      <div class="arena-header">
        <span class="arena-game-icon">${arena.icon}</span>
        <span class="arena-live-badge">
          <span class="arena-live-dot"></span>
          LIVE
        </span>
      </div>
      <h3 class="arena-title">${arena.title}</h3>
      <p class="arena-desc">${arena.desc}</p>
      <div class="arena-stats">
        <span class="arena-stat">
          <span class="stat-icon">🏠</span>
          ${arena.rooms} Rooms
        </span>
        <span class="arena-stat">
          <span class="stat-icon">👤</span>
          ${arena.players} Online
        </span>
        <span class="arena-stat">
          <span class="stat-icon">🎮</span>
          ${arena.mode}
        </span>
      </div>
      <button class="arena-join-btn" onclick="launchGame('${arena.title.toLowerCase().replace(/\s+/g, '')}')">Join Arena</button>
    </div>
  `).join('');
}

// ==========================================
// LEADERBOARD
// ==========================================
function renderLeaderboard() {
  const table = document.getElementById('leaderboard-table');
  if (!table) return;

  table.innerHTML = LEADERBOARD_DATA.map(player => {
    const rankClass = player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : player.rank === 3 ? 'bronze' : '';
    const rowClass = player.rank <= 3 ? `top-${player.rank}` : '';

    return `
      <div class="leaderboard-row ${rowClass} reveal">
        <span class="lb-rank ${rankClass}">${player.rank}</span>
        <span class="lb-avatar">${player.avatar}</span>
        <span class="lb-name">${player.name}</span>
        <span class="lb-xp">${player.xp.toLocaleString()} XP</span>
        <span class="lb-trophy">${player.trophy}</span>
      </div>
    `;
  }).join('');
}

// ==========================================
// DAILY CHALLENGES
// ==========================================
function renderChallenges() {
  const grid = document.getElementById('challenges-grid');
  if (!grid) return;

  grid.innerHTML = CHALLENGES_DATA.map(ch => `
    <div class="challenge-card reveal">
      <div class="challenge-top">
        <div class="challenge-icon">${ch.icon}</div>
        <span class="challenge-xp">⚡ +${ch.xp} XP</span>
      </div>
      <h3 class="challenge-title">${ch.title}</h3>
      <p class="challenge-desc">${ch.desc}</p>
      <div class="challenge-progress-bar">
        <div class="challenge-progress-fill" style="width: ${ch.progress}%"></div>
      </div>
      <div class="challenge-footer">
        <span class="challenge-timer">⏱ ${ch.timeLeft} left</span>
        <button class="challenge-claim-btn" ${ch.progress < 100 ? 'disabled' : ''}>
          ${ch.progress >= 100 ? 'Claim' : `${ch.progress}%`}
        </button>
      </div>
    </div>
  `).join('');
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ==========================================
// THEME TOGGLE
// ==========================================
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('gv-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('gv-theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// ==========================================
// BACK TO TOP
// ==========================================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==========================================
// COUNTER ANIMATIONS
// ==========================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.hero-stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 25);
}

// ==========================================
// GAME LAUNCHER
// ==========================================
function launchGame(gameId) {
  const modal = document.getElementById('game-modal');
  const modalTitle = document.getElementById('game-modal-title');
  const modalBody = document.getElementById('game-modal-body');

  const game = GAMES_DATA.find(g => g.id === gameId);
  const title = game ? game.title : gameId;

  modalTitle.textContent = title;

  // Check if a dedicated game file exists
  const gameFile = `games/${gameId}/index.html`;

  modalBody.innerHTML = `
    <iframe src="${gameFile}" style="width:100%;max-width:800px;height:80vh;max-height:600px;border:2px solid rgba(139,92,246,0.2);border-radius:20px;background:var(--bg-primary);"></iframe>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Save to recently played
  saveRecentlyPlayed(gameId);
}

function closeGameModal() {
  const modal = document.getElementById('game-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  const modalBody = document.getElementById('game-modal-body');
  modalBody.innerHTML = '';
}

function saveRecentlyPlayed(gameId) {
  let recent = JSON.parse(localStorage.getItem('gv-recent') || '[]');
  recent = recent.filter(id => id !== gameId);
  recent.unshift(gameId);
  if (recent.length > 8) recent.pop();
  localStorage.setItem('gv-recent', JSON.stringify(recent));
}

// Close modal with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGameModal();
});
