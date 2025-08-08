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

document.getElementById('start-button').addEventListener('click', async () => {
    await enterFullscreen();
    game = new Phaser.Game(config);
    document.getElementById('start-button').style.display = 'none';
});

window.addEventListener('load', () => {
    checkOrientation();
});

// Попытка включить fullscreen
async function enterFullscreen() {
    const elem = document.documentElement;

    // Настоящий fullscreen API (Chrome, Firefox, Edge, Android-браузеры)
    if (elem.requestFullscreen) {
        await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari
        await elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge старые
        await elem.msRequestFullscreen();
    } else {
        // Псевдо-фуллскрин для iOS Safari/Telegram
        document.body.style.height = window.innerHeight + "px";
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);
    }
}
