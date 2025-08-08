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
  resetVisibility();

  const isPortrait = window.innerHeight > window.innerWidth;

  if (isMobile()) {
    if (!rotatedToLandscape) {
      if (isPortrait) {
        showElement('rotate-notice');
        document.body.style.height = '100vh';
        document.body.style.overflowY = 'hidden';
        return;
      } else {
        rotatedToLandscape = true;
        showElement('scroll-notice');
        document.body.style.height = '200vh';
        document.body.style.overflowY = 'auto';
        return;
      }
    } else {
      if (!gameStarted) {
        showElement('scroll-notice');
        document.body.style.height = '200vh';
        document.body.style.overflowY = 'auto';
      } else {
        showElement('game-container');
        document.body.style.height = '100vh';
        document.body.style.overflowY = 'hidden';
      }
    }
  } else {
    showElement('game-container');
    document.body.style.height = '100vh';
    document.body.style.overflowY = 'hidden';

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

  document.body.style.height = '100vh';
  document.body.style.overflowY = 'hidden';

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
