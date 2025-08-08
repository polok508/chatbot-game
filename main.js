window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
  let gameStarted = true; 

  function adjustGameSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const gameContainer = document.getElementById('game-container');
    gameContainer.style.width = width + 'px';
    gameContainer.style.height = height + 'px';

    if (game && game.scale) {
      game.scale.resize(width, height);
    }

    
    if (width < height) {
      document.getElementById('orientation-overlay').classList.remove('hidden');
      document.getElementById('start-overlay').classList.add('hidden');
      gameContainer.style.display = 'none';
    } else {
      document.getElementById('orientation-overlay').classList.add('hidden');
      if (gameStarted) {
        gameContainer.style.display = 'block';
      }
    }
  }

  window.addEventListener('resize', adjustGameSize);
  window.addEventListener('orientationchange', () => setTimeout(adjustGameSize, 300));

  adjustGameSize(); 
});
