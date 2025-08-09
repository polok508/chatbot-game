window.game = window.game || null;

let gameStarted = false;
let rotatedToLandscape = false;

const MOBILE_LANDSCAPE_SCALE = 0.95; // Можно менять для сжатия по диагонали

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function showElement(id) {
  document.getElementById(id).classList.add('visible');
}

function hideElement(id) {
  document.getElementById(id).classList.remove('visible');
}

function resetVisibility() {
  hideElement('rotate-notice');
  hideElement('scroll-notice');
  hideElement('game-container');
}

function checkOrientation() {
  const isDesktop = !isMobile();
  const body = document.body;
  const gameWrapper = document.getElementById('game-wrapper');
  const gameContainer = document.getElementById('game-container');

  if (isDesktop) {
    body.classList.add('desktop');
    body.classList.remove('mobile', 'landscape');
    gameContainer.classList.add('desktop');
    gameContainer.classList.remove('mobile');

    resetVisibility();
    showElement('game-container');
    body.style.overflowY = 'hidden';
    body.style.height = '100vh';

    if (!window.game) {
      window.game = new Phaser.Game(config);
      window.game.renderer.clearBeforeRender = false;
      gameStarted = true;
    }

    gameWrapper.style.transform = 'none';
    gameWrapper.style.padding = '0';
    gameWrapper.style.margin = '0';

  } else {
    body.classList.add('mobile');
    body.classList.remove('desktop');

    resetVisibility();

    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait && !gameStarted) {
      body.classList.remove('landscape');
      showElement('rotate-notice');
      body.style.overflowY = 'hidden';
      body.style.height = window.innerHeight + 'px';

      gameWrapper.style.transform = 'none';
      gameWrapper.style.padding = 'env(safe-area-inset-bottom, 20px)';
      gameWrapper.style.margin = '0';
      return;
    } else {
      body.classList.add('landscape');

      // Мобильная горизонтальная ориентация 
      gameWrapper.style.transform = `scale(${MOBILE_LANDSCAPE_SCALE})`;
      gameWrapper.style.padding = '0';
      gameWrapper.style.margin = '0';

      if (!rotatedToLandscape && !gameStarted) {
        rotatedToLandscape = true;
        showElement('scroll-notice');
        body.style.overflowY = 'auto';
        body.style.height = (window.innerHeight * 1.5) + 'px';
        return;
      } else {
        if (!gameStarted) {
          showElement('scroll-notice');
          body.style.overflowY = 'auto';
          body.style.height = (window.innerHeight * 1.5) + 'px';
        } else {
          showElement('game-container');
          body.style.overflowY = 'hidden';
          body.style.height = window.innerHeight + 'px';
        }
      }
    }
  }
}

function startGame() {
  hideElement('scroll-notice');
  showElement('game-container');

  document.body.style.overflowY = 'hidden';
  document.body.style.height = window.innerHeight + 'px';
  window.scrollTo(0, 0);

  if (!window.game) {
    window.game = new Phaser.Game(config);
    window.game.renderer.clearBeforeRender = false;
  }
  gameStarted = true;
}

window.addEventListener('resize', () => {
  checkOrientation();
});

window.addEventListener('orientationchange', () => {
  checkOrientation();

  if (isMobile() && !window.matchMedia("(orientation: portrait)").matches) {
    setTimeout(() => window.scrollTo(0, 1), 300);
  }
});

window.addEventListener('load', () => {
  checkOrientation();

  if (isMobile()) {
    window.addEventListener('scroll', () => {
      const rotateVisible = document.getElementById('rotate-notice').classList.contains('visible');
      if (window.scrollY > 100 && !gameStarted && !rotateVisible) {
        startGame();
      }
    });
  }
});
