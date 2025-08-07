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

const game = new Phaser.Game(config);

// фикс для Safari, Telegram WebView и Android браузеров
function fixViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('load', fixViewportHeight);
window.addEventListener('resize', fixViewportHeight);
window.addEventListener('orientationchange', () => {
  setTimeout(fixViewportHeight, 300);
});
