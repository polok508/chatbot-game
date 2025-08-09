const BASE_WIDTH = 1500;
const BASE_HEIGHT = 1100;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: BASE_WIDTH,
  height: BASE_HEIGHT,
  backgroundColor: '#fff',
  scene: [Scene1, Scene2, Scene3, Scene4, Scene5],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    max: {
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
    },
    min: {
      width: 400,
      height: 600,
    }
  }
};
