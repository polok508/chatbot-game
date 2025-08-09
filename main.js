let game;
const gameContainer = document.getElementById('game-container');
const rotateNotice = document.getElementById('rotate-notice');
const scrollNotice = document.getElementById('scroll-notice');

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function checkOrientation() {
    if (isMobile()) {
        if (isPortrait()) {
            rotateNotice.style.display = 'flex';
            scrollNotice.style.display = 'none';
            gameContainer.style.display = 'none';

            document.body.style.height = '100vh';
            document.documentElement.style.height = '100vh';
            document.body.style.overflowY = 'hidden';
        } else {
            rotateNotice.style.display = 'none';
            scrollNotice.style.display = 'flex';
            gameContainer.style.display = 'none';

            document.body.style.height = '200vh';
            document.documentElement.style.height = '200vh';
            document.body.style.overflowY = 'auto';
            window.scrollTo(0, 0);
        }
    } else {
        rotateNotice.style.display = 'none';
        scrollNotice.style.display = 'none';
        gameContainer.style.display = 'block';

        document.body.style.height = '100vh';
        document.documentElement.style.height = '100vh';
        document.body.style.overflowY = 'hidden';

        startGame();
    }
}

function startGame() {
    if (game) return;

    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    window.scrollTo(0, 0);

    gameContainer.style.display = 'block';
    gameContainer.style.margin = '0 auto';

    game = new Phaser.Game(config);

    adjustGameScale();
}

function adjustGameScale() {
    if (isMobile() && !isPortrait()) {
        const scaleFactor = window.innerHeight / BASE_HEIGHT;
        gameContainer.style.transform = `scale(${scaleFactor}) translateY(0)`;
    } else {
        gameContainer.style.transform = 'scale(1) translateY(0)';
    }
}

window.addEventListener('scroll', () => {
    if (isMobile() && !isPortrait() && window.scrollY > window.innerHeight / 2) {
        startGame();
    }
});

window.addEventListener('resize', () => {
    checkOrientation();
    adjustGameScale();
});
window.addEventListener('orientationchange', () => {
    checkOrientation();
    adjustGameScale();
});

document.addEventListener('click', (e) => {
    if (e.target.id === 'start-button') {
        startGame();
    }
});

checkOrientation();
