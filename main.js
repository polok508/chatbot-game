let game = null;

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

// Масштабирование и позиционирование canvas
function resizeGame() {
  if (!game || !game.canvas) return;

  const canvas = game.canvas;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (isMobile()) {
    const scaleX = windowWidth / game.config.width;
    const scaleY = windowHeight / game.config.height;
    const scale = Math.min(scaleX, scaleY);

    canvas.style.width = `${game.config.width * scale}px`;
    canvas.style.height = `${game.config.height * scale}px`;
    canvas.style.position = 'absolute';
    canvas.style.top = `${(windowHeight - game.config.height * scale) / 2}px`;
    canvas.style.left = `${(windowWidth - game.config.width * scale) / 2}px`;
  } else {
    canvas.style.position = 'relative';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.top = '0';
    canvas.style.left = '0';
  }
}

function checkOrientation() {
  resetVisibility();

  const isPortrait = window.innerHeight > window.innerWidth;

  if (isMobile()) {
    if (isPortrait) {
      // Портрет - просим повернуть устройство
      showElement('rotate-notice');
      document.body.style.height = '100vh';
      document.body.style.overflowY = 'hidden';
    } else {
      // Ландшафт - показываем прокрутку
      showElement('scroll-notice');
      document.body.style.height = '200vh';
      document.body.style.overflowY = 'auto';
    }
  } else {
    // ПК - сразу игра
    showElement('game-container');
    document.body.style.height = '100vh';
    document.body.style.overflowY = 'hidden';

    if (!game) {
      game = new Phaser.Game(config);
      resizeGame();
    }
  }
}

window.addEventListener('resize', () => {
  checkOrientation();
  resizeGame();
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
    let gameStarted = false;

    window.addEventListener('scroll', () => {
      const rotateVisible = document.getElementById('rotate-notice').classList.contains('visible');
      if (window.scrollY > 100 && !gameStarted && !rotateVisible) {
        gameStarted = true;

        hideElement('scroll-notice');
        showElement('game-container');

        document.body.style.height = '100vh';
        document.body.style.overflowY = 'hidden';

        window.scrollTo(0, 0);

        if (!game) {
          game = new Phaser.Game(config);
        }
        resizeGame();
      }
    });
  }
});
