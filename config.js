const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isYandex = navigator.userAgent.includes('YaBrowser');

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1440,
  height: 992,
  backgroundColor: '#ffffff',
  scene: [Scene1, Scene2, Scene3, Scene4, Scene5],
  scale: {
    mode: isMobile ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    max: {
      width: 1440,
      height: 992
    },
    min: {
      width: 400,
      height: 600
    }
  }
};


const orientationEvent = isSafari ? 'resize' : 'orientationchange';

function initGame() {
  if (isMobile) {
    checkOrientation();
  
    if (isYandex) {
      setupYandexBrowser();
    }
  } else {
    new Phaser.Game(config);
  }
}

function checkOrientation() {
  if (!isLandscape()) {
    showOrientationWarning();
    window.addEventListener(orientationEvent, handleOrientationChange);
  } else {
    startGame();
  }
}

function isLandscape() {

  return window.innerWidth > window.innerHeight || 
         window.matchMedia("(orientation: landscape)").matches;
}

function handleOrientationChange() {
  if (!isLandscape()) {
    showOrientationWarning();
  } else {
    hideOrientationWarning();
    if (!window.game) {
      startGame();
    }
  }
}

function startGame() {

  enterFullscreen();
  
  window.game = new Phaser.Game(config);
  
 
  if (isMobile) {
    window.addEventListener('resize', () => {
      if (window.game && isLandscape()) {
        setTimeout(() => {
          window.game.scale.refresh();
        }, 300);
      }
    });
  }
}

function enterFullscreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen().catch(e => console.log(e));
  } else if (element.webkitRequestFullscreen) { 
    element.webkitRequestFullscreen().catch(e => console.log(e));
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen().catch(e => console.log(e));
  }
}

function setupYandexBrowser() {

  document.addEventListener('click', function yandexHide() {
    enterFullscreen();
    document.removeEventListener('click', yandexHide);
  });
  

  setInterval(() => {
    if (window.game && isLandscape()) {
      window.game.scale.refresh();
    }
  }, 1000);
}

function showOrientationWarning() {
  let warning = document.getElementById('orientation-warning');
  if (!warning) {
    warning = document.createElement('div');
    warning.id = 'orientation-warning';
    warning.style.position = 'fixed';
    warning.style.top = '0';
    warning.style.left = '0';
    warning.style.width = '100%';
    warning.style.height = '100%';
    warning.style.backgroundColor = '#000';
    warning.style.color = '#fff';
    warning.style.display = 'flex';
    warning.style.flexDirection = 'column';
    warning.style.justifyContent = 'center';
    warning.style.alignItems = 'center';
    warning.style.zIndex = '9999';
    warning.style.fontSize = '24px';
    warning.style.textAlign = 'center';
    warning.style.padding = '20px';
    warning.innerHTML = `
      <p>Пожалуйста, поверните устройство в горизонтальное положение</p>
      <button id="force-landscape" style="margin-top: 20px; padding: 10px 20px; font-size: 18px;">
        Я уже в горизонтальном режиме
      </button>
    `;
    document.body.appendChild(warning);
    
 
    document.getElementById('force-landscape').addEventListener('click', () => {
      hideOrientationWarning();
      startGame();
    });
  } else {
    warning.style.display = 'flex';
  }
}

function hideOrientationWarning() {
  const warning = document.getElementById('orientation-warning');
  if (warning) {
    warning.style.display = 'none';
  }
}

window.addEventListener('load', initGame);