let game = null;
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

// Масштаб и позиционирование canvas — ВАЖНО!
// При вертикальном повороте после запуска игры не прячем игру и не показываем уведомление
function resizeGame() {
  if (!game || !game.canvas) return;

  const canvas = game.canvas;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const baseWidth = game.config.width;
  const baseHeight = game.config.height;

  // На мобилках подгоняем canvas под экран и центрируем абсолютно
  if (isMobile()) {
    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    const canvasWidth = baseWidth * scale;
    const canvasHeight = baseHeight * scale;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    canvas.style.position = 'absolute';
    canvas.style.left = `${(windowWidth - canvasWidth) / 2}px`;
    canvas.style.top = `${(windowHeight - canvasHeight) / 2}px`;
  } else {
    // На ПК canvas занимает 100% контейнера
    canvas.style.position = 'relative';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.left = '0';
    canvas.style.top = '0';
  }
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
        // После запуска игры — игра всегда показывается, даже если вертикаль
        showElement('game-container');
        document.body.style.height = '100vh';
        document.body.style.overflowY = 'hidden';
      }
    }
  } else {
    // ПК — сразу игра
    showElement('game-container');
    document.body.style.height = '100vh';
    document.body.style.overflowY = 'hidden';

    if (!game) {
      game = new Phaser.Game(config);
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

  if (!game) {
    game = new Phaser.Game(config);
  }
  gameStarted = true;
  resizeGame();
}

window.addEventListener('resize', () => {
  checkOrientation();
  resizeGame();
});

window.addEventListener('orientationchange', () => {
  checkOrientation();

  // При смене ориентации в ландшафт поднимаем страницу, чтобы скрыть панель браузера
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
