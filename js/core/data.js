/* ============================================
   GAMEVERSE — Game Data Registry
   Central data store for all games & content
   ============================================ */

const GameData = {
  /* ---- All Games ---- */
  games: [
    {
      id: 'snake', title: 'Neon Snake', category: 'Arcade', rating: 4.8,
      badge: 'Popular', icon: '🐍', color: '#10b981', players: '12.4K',
      description: 'Classic snake with neon visuals',
      path: 'games/arcade/snake/index.html'
    },
    {
      id: 'tictactoe', title: 'Tic Tac Toe', category: 'Board', rating: 4.5,
      badge: 'Classic', icon: '⭕', color: '#8b5cf6', players: '8.2K',
      description: 'Strategic board game',
      path: 'games/board/tic-tac-toe/index.html'
    },
    {
      id: 'flappy', title: 'Flappy Neon', category: 'Arcade', rating: 4.7,
      badge: 'Trending', icon: '🐦', color: '#f59e0b', players: '15.1K',
      description: 'Dodge obstacles and fly high',
      path: 'games/arcade/flappy-bird/index.html'
    },
    {
      id: 'chess', title: 'Cyber Chess', category: 'Board', rating: 4.9,
      badge: 'Featured', icon: '♟️', color: '#06b6d4', players: '9.7K',
      description: 'The ultimate strategy game',
      path: 'games/board/chess/index.html'
    },
    {
      id: '2048', title: '2048 Fusion', category: 'Puzzle', rating: 4.6,
      badge: 'Addictive', icon: '🔢', color: '#ec4899', players: '18.3K',
      description: 'Merge tiles to reach 2048',
      path: 'games/puzzle/2048/index.html'
    },
    {
      id: 'pacman', title: 'Pac Runner', category: 'Arcade', rating: 4.8,
      badge: 'Retro', icon: '👾', color: '#f59e0b', players: '11.5K',
      description: 'Classic maze chase game',
      path: 'games/arcade/pacman/index.html'
    },
    {
      id: 'racing', title: 'Turbo Racer', category: 'Racing', rating: 4.4,
      badge: 'New', icon: '🏎️', color: '#ef4444', players: '7.8K',
      description: 'High-speed racing action',
      path: 'games/sports/racing/index.html'
    },
    {
      id: 'memory', title: 'Memory Matrix', category: 'Puzzle', rating: 4.3,
      badge: 'Brain', icon: '🧠', color: '#8b5cf6', players: '6.1K',
      description: 'Match pairs and test memory',
      path: 'games/puzzle/memory-game/index.html'
    }
  ],

  /* ---- Categories ---- */
  categories: [
    { name: 'Arcade', icon: '🕹️', count: 24 },
    { name: 'Puzzle', icon: '🧩', count: 18 },
    { name: 'Action', icon: '⚔️', count: 15 },
    { name: 'Adventure', icon: '🗺️', count: 12 },
    { name: 'Racing', icon: '🏁', count: 9 },
    { name: 'Sports', icon: '⚽', count: 11 },
    { name: 'Multiplayer', icon: '👥', count: 8 },
    { name: 'Board Games', icon: '🎲', count: 14 },
    { name: 'Retro', icon: '👾', count: 20 },
    { name: 'Horror', icon: '💀', count: 6 }
  ],

  /* ---- Leaderboard ---- */
  leaderboard: [
    { rank: 1, name: 'ShadowStrike', avatar: '🦊', xp: 28450, trophy: '🏆' },
    { rank: 2, name: 'NeonPhantom', avatar: '🐺', xp: 25200, trophy: '🥈' },
    { rank: 3, name: 'CyberWolf', avatar: '🦅', xp: 22180, trophy: '🥉' },
    { rank: 4, name: 'PixelKnight', avatar: '🐉', xp: 19400, trophy: '⭐' },
    { rank: 5, name: 'GameForge', avatar: '🦁', xp: 17850, trophy: '⭐' },
    { rank: 6, name: 'VoidRunner', avatar: '🐼', xp: 15300, trophy: '⭐' },
    { rank: 7, name: 'BlazeMaster', avatar: '🦈', xp: 13720, trophy: '⭐' },
    { rank: 8, name: 'QuantumAce', avatar: '🦉', xp: 12100, trophy: '⭐' }
  ],

  /* ---- Arena ---- */
  arena: [
    { title: 'Chess Arena', icon: '♟️', desc: 'Challenge players worldwide in real-time chess matches. Ranked and casual modes available.', rooms: 42, players: 186, mode: 'PvP', gameId: 'chess' },
    { title: 'Ludo Royale', icon: '🎲', desc: 'Classic Ludo with a competitive twist. Race your tokens and dominate the board.', rooms: 28, players: 112, mode: 'Party', gameId: 'tictactoe' },
    { title: 'Quiz Battle', icon: '🧠', desc: 'Test your knowledge against other players in fast-paced trivia showdowns.', rooms: 35, players: 247, mode: 'Team', gameId: 'memory' },
    { title: 'Battle Arena', icon: '⚔️', desc: 'Enter the arena, choose your fighter, and battle for glory and XP rewards.', rooms: 19, players: 94, mode: 'PvP', gameId: 'snake' }
  ],

  /* ---- Challenges ---- */
  challenges: [
    { icon: '🎯', title: 'Perfect Score', desc: 'Score 100 points in any arcade game without losing a life.', xp: 500, progress: 65, timeLeft: '5h 23m' },
    { icon: '⚡', title: 'Speed Demon', desc: 'Complete 3 puzzle games in under 10 minutes total.', xp: 750, progress: 33, timeLeft: '8h 12m' },
    { icon: '🔥', title: 'Win Streak', desc: 'Win 5 multiplayer matches in a row without losing.', xp: 1200, progress: 80, timeLeft: '2h 45m' }
  ],

  /* ---- Query Methods ---- */
  getAll() { return this.games; },
  getById(id) { return this.games.find(g => g.id === id); },
  getByCategory(cat) { return this.games.filter(g => g.category === cat); },
  search(query) {
    const q = query.toLowerCase();
    return this.games.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q)
    );
  }
};
