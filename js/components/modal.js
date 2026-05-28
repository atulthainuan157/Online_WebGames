/* ============================================
   GAMEVERSE — Modal Component JS
   Game launcher modal
   ============================================ */

const Modal = {
  init() {
    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  open(gameId) {
    const modal = document.getElementById('game-modal');
    const title = document.getElementById('game-modal-title');
    const body = document.getElementById('game-modal-body');
    if (!modal) return;

    const game = GameData.getById(gameId);
    const gameName = game ? game.title : gameId;
    const gamePath = game ? game.path : `games/arcade/${gameId}/index.html`;

    title.textContent = gameName;

    body.innerHTML = `
      <iframe
        src="${gamePath}"
        style="width:100%;max-width:800px;height:80vh;max-height:600px;
               border:2px solid rgba(139,92,246,0.2);border-radius:20px;
               background:var(--bg-primary);"
        title="${gameName}">
      </iframe>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Save to recently played
    Storage.addRecent(gameId);
    SoundManager.playClick();
  },

  close() {
    const modal = document.getElementById('game-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('game-modal-body').innerHTML = '';
  }
};

// Global function for inline onclick handlers
function launchGame(gameId) {
  Modal.open(gameId);
}

function closeGameModal() {
  Modal.close();
}
