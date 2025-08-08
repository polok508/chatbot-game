window.game = window.game || null;

let gameStarted = false;
let rotatedToLandscape = false;

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

function adjustHeight() {
  const height = window.innerHeight;
  const gameContainer = document.getElementById('game-container');
  document.body.style.height = `${height}px`;
  gameContainer.style.height = `${height}px`;
}

function resizeGame() {
  if (!window.game || !window.game.canvas) return;

  const canvas = window.game.canvas;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (isMobile()) {
    const scaleX = windowWidth / window.game.config.width;
    const scaleY = windowHeight / window.game.config.height;
    const scale = Math.min(scaleX, scaleY);

    const canvasWidth = window.game.config.width * scale;
    const canvasHeight = window.game.config.height * scale;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    canvas.style.position = 'absolute';
    canvas.style.left = `${(windowWidth - canvasWidth) / 2}px`;
    canvas.style.top = `${(windowHeight - canvasHeight) / 2}px`;
  } else {
    canvas.style.position = 'relative';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.left = '0';
    canvas.style.top = '0';
  }
}

function checkOrientation() {
  resetVisibility();
  adjustHeight();

  const isPortrait = window.innerHeight > window.innerWidth;

  if (isMobile()) {
    if (!rotatedToLandscape) {
      if (isPortrait) {
        showElement('rotate-notice');
        document.body.style.overflowY = 'hidden';
        return;
      } else {
        rotatedToLandscape = true;
        showElement('scroll-notice');
        document.body.style.height = `${window.innerHeight * 2}px`;
        document.body.style.overflowY = 'auto';
        return;
      }
    } else {
      if (!gameStarted) {
        showElement('scroll-notice');
        document.body.style.height = `${window.innerHeight * 2}px`;
        document.body.style.overflowY = 'auto';
      } else {
        showElement('game-container');
        document.body.style.overflowY = 'hidden';
        adjustHeight();
      }
    }
  } else {
    showElement('game-container');
    document.body.style.overflowY = 'hidden';

    if (!window.game) {
      window.game = new Phaser.Game(config);
      window.game.renderer.clearBeforeRender = false;
      gameStarted = true;
    }
    adjustHeight();
  }
}

function startGame() {
  hideElement('scroll-notice');
  showElement('game-container');

  document.body.style.overflowY = 'hidden';
  adjustHeight();

  window.scrollTo(0, 0);

  if (!window.game) {
    window.game = new Phaser.Game(config);
    window.game.renderer.clearBeforeRender = false;
  }
  gameStarted = true;
  resizeGame();
}

window.addEventListener('resize', () => {
  adjustHeight();
  resizeGame();
  checkOrientation();
});

window.addEventListener('orientationchange', () => {
  adjustHeight();
  checkOrientation();

  if (isMobile() && !window.matchMedia("(orientation: portrait)").matches) {
    setTimeout(() => window.scrollTo(0, 1), 300);
  }
  resizeGame();
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
