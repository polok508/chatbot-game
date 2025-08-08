let gameStarted = false;
let game = null;

const orientationOverlay = document.getElementById('orientation-overlay');
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const scrollWrapper = document.getElementById('scroll-wrapper');


function checkOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  if (!gameStarted) {
    if (isLandscape) {
      orientationOverlay.classList.add('hidden');
      startOverlay.classList.remove('hidden');
    } else {
      startOverlay.classList.add('hidden');
      orientationOverlay.classList.remove('hidden');
    }
  }
}


function activateScrollWrapper() {
  scrollWrapper.style.display = 'block';
  document.body.style.overflow = 'hidden';
  scrollWrapper.scrollTop = window.innerHeight;
  scrollWrapper.addEventListener('scroll', () => {
    if (scrollWrapper.scrollTop < window.innerHeight) {
      scrollWrapper.scrollTop = window.innerHeight;
    }
  });
  gameContainer.style.height = window.innerHeight + 'px';
  gameContainer.style.width = window.innerWidth + 'px';
  gameContainer.style.position = 'fixed';
  gameContainer.style.top = '0';
  gameContainer.style.left = '0';
  gameContainer.style.zIndex = '10000';
}


async function tryFullscreen() {
  if (document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen();
      return true;
    } catch {
      return false;
    }
  } else if (document.documentElement.webkitRequestFullscreen) {
    try {
      await document.documentElement.webkitRequestFullscreen();
      return true;
    } catch {
      return false;
    }
  }
  return false;
}


function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.body.appendChild(s);
  });
}


async function launchGame() {
  if (game) return;


  await loadScript("https://cdn.jsdelivr.net/npm/phaser@3.88.2/dist/phaser.js");
  await loadScript("scenes/scene1.js");
  await loadScript("scenes/scene2.js");
  await loadScript("scenes/scene3.js");
  await loadScript("scenes/scene4.js");
  await loadScript("config.secret.js");
  await loadScript("forms/leadForm.js");
  await loadScript("scenes/scene5.js");
  await loadScript("config.js");
  

  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1440,
    height: 992,
    backgroundColor: '#ffffff',
    scene: [Scene1, Scene2, Scene3, Scene4, Scene5],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      orientation: Phaser.Scale.LANDSCAPE,
    }
  };

  game = new Phaser.Game(config);
}


function adjustGameSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  gameContainer.style.width = width + 'px';
  gameContainer.style.height = height + 'px';

  if (game && game.scale) {
    game.scale.resize(width, height);
  }

  if (width < height) {
    orientationOverlay.classList.remove('hidden');
    startOverlay.classList.add('hidden');
    gameContainer.style.display = 'none';
  } else {
    orientationOverlay.classList.add('hidden');
    if (gameStarted) {
      gameContainer.style.display = 'block';
    } else {
      startOverlay.classList.remove('hidden');
    }
  }
}


window.addEventListener('resize', adjustGameSize);
window.addEventListener('orientationchange', () => setTimeout(adjustGameSize, 300));
document.addEventListener('DOMContentLoaded', () => {
  checkOrientation();
  adjustGameSize();
});

startBtn.addEventListener('click', async () => {
  if (gameStarted) return;

  const isLandscape = window.innerWidth > window.innerHeight;
  if (!isLandscape) return;

  startOverlay.classList.add('hidden');
  orientationOverlay.classList.add('hidden');
  gameContainer.style.display = 'block';
  gameStarted = true;

  const fullscreenWorked = await tryFullscreen();
  if (!fullscreenWorked) {
    activateScrollWrapper();
  }

  launchGame();
  adjustGameSize();
});
