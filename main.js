let game;
const gameContainer = document.getElementById('game-container');
const rotateNotice = document.getElementById('rotate-notice');
const scrollNotice = document.getElementById('scroll-notice');

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function setBodyStyles(height, overflow) {
    document.body.style.height = height;
    document.documentElement.style.height = height;
    document.body.style.overflowY = overflow;
}

function showElement(el) {
    el.classList.add('visible');
}

function hideElement(el) {
    el.classList.remove('visible');
}

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile()) {
        if (isPortrait) {
            showElement(rotateNotice);
            hideElement(scrollNotice);
            hideElement(gameContainer);

            setBodyStyles('100vh', 'hidden');
        } else {
            hideElement(rotateNotice);
            showElement(scrollNotice);
            hideElement(gameContainer);

            setBodyStyles('200vh', 'auto');
            window.scrollTo(0, 0);
        }
    } else {
        hideElement(rotateNotice);
        hideElement(scrollNotice);
        showElement(gameContainer);

        setBodyStyles('100vh', 'hidden');

        startGame();
    }
}

function startGame() {
    if (game) return;

    setBodyStyles('100vh', 'hidden');
    window.scrollTo(0, 0);

    showElement(gameContainer);
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
