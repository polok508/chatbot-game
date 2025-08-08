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

function checkOrientation() {
  const isDesktop = !isMobile();
  const body = document.body;
  const gameContainer = document.getElementById('game-container');

  if (isDesktop) {
    body.classList.add('desktop');
    body.classList.remove('mobile');
    gameContainer.classList.add('desktop');
    gameContainer.classList.remove('mobile');
  } else {
    body.classList.add('mobile');
    body.classList.remove('desktop');
    gameContainer.classList.add('mobile');
    gameContainer.classList.remove('desktop');
  }

  resetVisibility();

  const isPortrait = window.innerHeight > window.innerWidth;

  if (!isDesktop) {
    if (!rotatedToLandscape) {
      if (isPortrait) {
        showElement('rotate-notice');
        body.style.overflowY = 'hidden';
        body.style.height = '100vh';
        return;
      } else {
        rotatedToLandscape = true;
        showElement('scroll-notice');
        body.style.overflowY = 'auto';
        body.style.height = '100vh'; // уменьшили scroll area
        return;
      }
    } else {
      if (!gameStarted) {
        showElement('scroll-notice');
        body.style.overflowY = 'auto';
        body.style.height = '100vh'; // уменьшили scroll area
      } else {
        showElement('game-container');
        body.style.overflowY = 'hidden';
        body.style.height = '100vh';
      }
    }
  } else {
    showElement('game-container');
    body.style.overflowY = 'hidden';
    body.style.height = '100vh';

    if (!window.game) {
      window.game = new Phaser.Game(config);
      window.game.renderer.clearBeforeRender = false;
      gameStarted = true;
    }
  }
}

function startGame() {
  hideElement('scroll-notice');
  showElement('game-container');

  document.body.style.overflowY = 'hidden';
  document.body.style.height = '100vh';
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
