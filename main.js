window.addEventListener('load', () => {
  const game = new Phaser.Game(config);

  function resizeGame() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    game.scale.resize(width, height);
  }

  window.addEventListener('resize', resizeGame);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeGame, 300); 
  });
});
