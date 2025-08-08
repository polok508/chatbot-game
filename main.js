let game = null;
let gameStarted = false;

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


async function tryFullscreen() {
  if (document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen();
      return true;
    } catch {}
  } else if (document.documentElement.webkitRequestFullscreen) {
    try {
      await document.documentElement.webkitRequestFullscreen();
      return true;
    } catch {}
  }
  return false;
}


function hideAddressBar() {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    setTimeout(() => window.scrollTo(0, 1), 1000);
  } else {
    window.scrollTo(0, 1);
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



window.addEventListener('resize', () => {
  if (game) {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
  checkOrientation();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    if (game) {
      game.scale.resize(window.innerWidth, window.innerHeight);
    }
    checkOrientation();
    hideAddressBar();
  }, 300);
});

document.addEventListener('DOMContentLoaded', () => {
  checkOrientation();
  hideAddressBar();
});



startBtn.addEventListener('click', async () => {
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
});
