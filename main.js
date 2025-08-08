let game = null;

function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

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


function resizeGame() {
    if (game && isMobile()) {
        game.scale.resize(window.innerWidth, window.innerHeight);
    }
}

window.addEventListener('resize', () => {
    checkOrientation();
    resizeGame();
});
window.addEventListener('orientationchange', () => {
    checkOrientation();
    resizeGame();

    // Для iOS автоскролл
    if (isMobile() && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        setTimeout(() => window.scrollTo(0, 1), 300);
    }
});

document.getElementById('start-button').addEventListener('click', async () => {
    await enterFullscreen();
    game = new Phaser.Game(config);
    document.getElementById('start-button').style.display = 'none';
});

window.addEventListener('load', () => {
    checkOrientation();
});

async function enterFullscreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
    }

    if (isMobile()) {
        document.documentElement.style.height = window.innerHeight + "px";
        document.body.style.height = window.innerHeight + "px";
        document.body.style.overflow = "hidden";

        // Несколько попыток автоскролла чтобы скрыть адресную строку
        for (let i = 0; i < 3; i++) {
            setTimeout(() => window.scrollTo(0, 1), i * 300);
        }
    }
}
