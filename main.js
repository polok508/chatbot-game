window.game = window.game || null;

let gameStarted = false;
let rotatedToLandscape = false;

const MOBILE_LANDSCAPE_SCALE = 1.0; // масштаб игры по диагонали
const HEIGHT_BUFFER = 20; // запас по высоте в пикселях, можно подбирать

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

function getSafeAreaInset(name) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(`env(safe-area-inset-${name})`);
  return val ? parseInt(val) : 0;
}

function getViewportHeight() {
  return window.visualViewport ? window.visualViewport.height : window.innerHeight;
}

function updateVhCssVar() {
  const vh = getViewportHeight();
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

function checkOrientation() {
  const isDesktop = !isMobile();
  const body = document.body;
  const gameWrapper = document.getElementById('game-wrapper');
  const gameContainer = document.getElementById('game-container');

  const vh = getViewportHeight();

  if (isDesktop) {
    body.classList.add('desktop');
    body.classList.remove('mobile', 'landscape');
    gameContainer.classList.add('desktop');
    gameContainer.classList.remove('mobile');

    gameWrapper.style.transform = 'none';
    gameWrapper.style.width = '100vw';
    gameWrapper.style.height = 'calc(var(--vh, 100vh))';
    gameWrapper.style.padding = '0';
    gameWrapper.style.margin = '0';

    resetVisibility();
    showElement('game-container');
    body.style.overflowY = 'hidden';
    body.style.height = 'calc(var(--vh, 100vh))';

    if (!window.game) {
      window.game = new Phaser.Game(config);
      window.game.renderer.clearBeforeRender = false;
      gameStarted = true;
    }

  } else {
    body.classList.add('mobile');
    body.classList.remove('desktop');

    resetVisibility();

    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait && !gameStarted) {
      body.classList.remove('landscape');
      showElement('rotate-notice');
      body.style.overflowY = 'hidden';
      body.style.height = vh + 'px';

      gameWrapper.style.transform = 'none';
      gameWrapper.style.width = '100vw';
      gameWrapper.style.height = 'calc(var(--vh, 100vh))';
      gameWrapper.style.padding = 'env(safe-area-inset-bottom, 20px)';
      gameWrapper.style.margin = '0';
      return;
    } else {
      body.classList.add('landscape');

      const scale = MOBILE_LANDSCAPE_SCALE;

      const safeTop = getSafeAreaInset('top');
      const safeBottom = getSafeAreaInset('bottom');

      gameWrapper.style.transform = `scale(${scale})`;
      gameWrapper.style.padding = '0';
      gameWrapper.style.margin = '0';

      const adjustedHeight = (vh + HEIGHT_BUFFER + safeTop + safeBottom) / scale;
      const adjustedWidth = window.innerWidth / scale;

      gameWrapper.style.width = adjustedWidth + 'px';
      gameWrapper.style.height = adjustedHeight + 'px';

      if (!rotatedToLandscape && !gameStarted) {
        rotatedToLandscape = true;
        showElement('scroll-notice');
        body.style.overflowY = 'auto';
        body.style.height = (vh * 1.5) + 'px';
        return;
      } else {
        if (!gameStarted) {
          showElement('scroll-notice');
          body.style.overflowY = 'auto';
          body.style.height = (vh * 1.5) + 'px';
        } else {
          showElement('game-container');
          body.style.overflowY = 'hidden';
          body.style.height = vh + 'px';
        }
      }
    }
  }
}

function startGame() {
  hideElement('scroll-notice');
  showElement('game-container');

  document.body.style.overflowY = 'hidden';
  document.body.style.height = getViewportHeight() + 'px';
  window.scrollTo(0, 0);

  if (!window.game) {
    window.game = new Phaser.Game(config);
    window.game.renderer.clearBeforeRender = false;
  }
  gameStarted = true;
}

window.addEventListener('resize', () => {
  updateVhCssVar();
  checkOrientation();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    updateVhCssVar();
    checkOrientation();

    if (isMobile() && !window.matchMedia("(orientation: portrait)").matches) {
      window.scrollTo(0, 1);
    }
  }, 300);
});

window.addEventListener('load', () => {
  updateVhCssVar();
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
