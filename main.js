let game = null;

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const notice = document.getElementById('rotate-notice');
    const startBtn = document.getElementById('start-button');

    if (isPortrait) {
    
        notice.style.display = 'flex';
        startBtn.style.display = 'none';
        if (game && game.canvas) {
            game.canvas.style.filter = 'blur(5px)';
            game.canvas.style.pointerEvents = 'none';
        }
    } else {
     
        notice.style.display = 'none';
     
        if (!game) {
            startBtn.style.display = 'block';
        }
        if (game && game.canvas) {
            game.canvas.style.filter = 'none';
            game.canvas.style.pointerEvents = 'auto';
        }
    }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);


document.getElementById('start-button').addEventListener('click', () => {
    game = new Phaser.Game(config);
    document.getElementById('start-button').style.display = 'none';
});


window.addEventListener('load', () => {
    checkOrientation();
});
