let game;
const gameContainer = document.getElementById('game-container');
const rotateNotice = document.getElementById('rotate-notice');
const scrollNotice = document.getElementById('scroll-notice');

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function setBodyStyles(height, overflow) {
    document.body.style.height = height;
    document.documentElement.style.height = height;
    document.body.style.overflowY = overflow;
}

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile()) {
        if (isPortrait) {
            rotateNotice.style.display = 'flex';
            scrollNotice.style.display = 'none';
            gameContainer.style.display = 'none';

            setBodyStyles('100vh', 'hidden');

            // Центрируем текст rotate-notice через стили
            rotateNotice.style.position = 'fixed';
            rotateNotice.style.top = '0';
            rotateNotice.style.left = '0';
            rotateNotice.style.width = '100vw';
            rotateNotice.style.height = '100vh';
            rotateNotice.style.justifyContent = 'center';
            rotateNotice.style.alignItems = 'center';
            rotateNotice.style.textAlign = 'center';

        } else {
            rotateNotice.style.display = 'none';
            scrollNotice.style.display = 'flex';
            gameContainer.style.display = 'none';

            setBodyStyles('200vh', 'auto');
            window.scrollTo(0, 0);

            // Центрируем текст scroll-notice через стили
            scrollNotice.style.position = 'fixed';
            scrollNotice.style.bottom = '0';
            scrollNotice.style.left = '0';
            scrollNotice.style.width = '100vw';
            scrollNotice.style.justifyContent = 'center';
            scrollNotice.style.alignItems = 'center';
            scrollNotice.style.textAlign = 'center';
        }
    } else {
        rotateNotice.style.display = 'none';
        scrollNotice.style.display = 'none';
        gameContainer.style.display = 'block';

        setBodyStyles('100vh', 'hidden');

        startGame();
    }
}

function startGame() {
    if (game) return;

    setBodyStyles('100vh', 'hidden');
    window.scrollTo(0, 0);

    gameContainer.style.display = 'block';
    gameContainer.style.margin = '0 auto';
    gameContainer.style.transform = 'translateY(-2vh)';

    game = new Phaser.Game(config);
}

window.addEventListener('scroll', () => {
    if (isMobile() && window.scrollY > window.innerHeight / 2) {
        startGame();
    }
});

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => {
    checkOrientation();

    // В iOS иногда помогает убрать адресную строку после смены ориентации
    if (isMobile() && !window.matchMedia("(orientation: portrait)").matches) {
        setTimeout(() => window.scrollTo(0, 1), 300);
    }
});

document.addEventListener('click', (e) => {
    if (e.target.id === 'start-button') {
        startGame();
    }
});

checkOrientation();
