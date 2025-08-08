let game;
let gameStarted = false;

const gameContainer = document.getElementById('game-container');
const rotateNotice = document.getElementById('rotate-notice');
const scrollNotice = document.getElementById('scroll-notice');

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function showElement(el) {
    el.classList.add('visible');
}

function hideElement(el) {
    el.classList.remove('visible');
}

function setBodyStyles(height, overflow) {
    document.body.style.height = height;
    document.documentElement.style.height = height;
    document.body.style.overflowY = overflow;
}

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (!gameStarted) {
        if (isMobile()) {
            if (isPortrait) {
           
                showElement(rotateNotice);
                hideElement(scrollNotice);
                hideElement(gameContainer);
                setBodyStyles('100vh', 'hidden');
                return;
            } else {
               
                hideElement(rotateNotice);
                showElement(scrollNotice);
                hideElement(gameContainer);
                setBodyStyles('200vh', 'auto');
                window.scrollTo(0, 0);
                return;
            }
        } else {
           
            hideElement(rotateNotice);
            hideElement(scrollNotice);
            showElement(gameContainer);
            setBodyStyles('100vh', 'hidden');
            startGame();
            return;
        }
    } else {
   
        hideElement(rotateNotice);
        hideElement(scrollNotice);
        showElement(gameContainer);
        setBodyStyles('100vh', 'hidden');
    
        if (game) {
            game.scale.resize(window.innerWidth, window.innerHeight);
        }
    }
}

function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    hideElement(rotateNotice);
    hideElement(scrollNotice);

    showElement(gameContainer);
    setBodyStyles('100vh', 'hidden');
    window.scrollTo(0, 0);

    gameContainer.style.margin = '0 auto';
    gameContainer.style.transform = 'translateY(-2vh)';

    game = new Phaser.Game(config);

  
    game.scale.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener('scroll', () => {
    if (isMobile() && !gameStarted && window.scrollY > window.innerHeight / 2) {
        startGame();
    }
});

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => {
    checkOrientation();
});

document.addEventListener('click', (e) => {
    if (e.target.id === 'start-button') {
        startGame();
    }
});


checkOrientation();
