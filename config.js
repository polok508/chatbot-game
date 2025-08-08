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


