function checkOrientation() {
  const isDesktop = !isMobile();
  const body = document.body;
  const gameContainer = document.getElementById('game-container');

  if (isDesktop) {
    body.classList.add('desktop');
    body.classList.remove('mobile');
    body.classList.remove('landscape');
    gameContainer.classList.add('desktop');
    gameContainer.classList.remove('mobile');
  } else {
    body.classList.add('mobile');
    body.classList.remove('desktop');
    gameContainer.classList.add('mobile');
    gameContainer.classList.remove('desktop');
  }

  resetVisibility();

  const isPortrait = window.innerHeight > window.innerWidth;

  if (!isDesktop) {
    if (isPortrait) {
      body.classList.remove('landscape');
      showElement('rotate-notice');
      body.style.overflowY = 'hidden';
      body.style.height = '100vh';
      return;
    } else {
      body.classList.add('landscape');
      if (!rotatedToLandscape) {
        rotatedToLandscape = true;
        showElement('scroll-notice');
        body.style.overflowY = 'auto';
        body.style.height = '150vh';
        return;
      } else {
        if (!gameStarted) {
          showElement('scroll-notice');
          body.style.overflowY = 'auto';
          body.style.height = '150vh';
        } else {
          showElement('game-container');
          body.style.overflowY = 'hidden';
          body.style.height = '100vh';
        }
      }
    }
  } else {
    body.classList.remove('landscape');
    showElement('game-container');
    body.style.overflowY = 'hidden';
    body.style.height = '100vh';

    if (!window.game) {
      window.game = new Phaser.Game(config);
      window.game.renderer.clearBeforeRender = false;
      gameStarted = true;
    }
  }
}
