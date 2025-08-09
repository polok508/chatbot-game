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

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile()) {
        if (isPortrait) {
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
    gameContainer.style.transform = 'translateY(-2vh)';

    game = new Phaser.Game(config);
    window.game = game; 

    resizeGameForMobileLandscape(); 
}


function resizeGameForMobileLandscape() {
    if (isMobile() && window.innerWidth > window.innerHeight && game) {
        const scaleX = window.innerWidth / BASE_WIDTH;
        const scaleY = window.innerHeight / BASE_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        game.scale.setZoom(scale);
        game.scale.refresh();
    }
}

window.addEventListener('scroll', () => {
    if (isMobile() && window.scrollY > window.innerHeight / 2) {
        startGame();
    }
});

window.addEventListener('resize', () => {
    checkOrientation();
    resizeGameForMobileLandscape();
});

window.addEventListener('orientationchange', () => {
    checkOrientation();
    resizeGameForMobileLandscape();
});

document.addEventListener('click', (e) => {
    if (e.target.id === 'start-button') {
        startGame();
    }
});

checkOrientation();
