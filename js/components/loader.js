/* ============================================
   GAMEVERSE — Loader Component JS
   Animated loading screen
   ============================================ */

const Loader = {
  init() {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');
    if (!screen) return;

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

      bar.style.width = progress + '%';

      if (progress > (msgIndex + 1) * 20 && msgIndex < messages.length - 1) {
        msgIndex++;
        text.textContent = messages[msgIndex];
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          screen.classList.add('hidden');
        }, 500);
      }
    }, 200);
  }
};
