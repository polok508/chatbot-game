let game;
const gameContainer = document.getElementById('game-container');
const rotateNotice = document.getElementById('rotate-notice');
const scrollNotice = document.getElementById('scroll-notice');

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile()) {
        if (isPortrait) {
            // Вертикальная ориентация
            rotateNotice.style.display = 'flex';
            scrollNotice.style.display = 'none';
            gameContainer.style.display = 'none';

            document.body.style.height = '100vh';
            document.documentElement.style.height = '100vh';
            document.body.style.overflowY = 'hidden';
        } else {
            // Горизонтальная ориентация
            rotateNotice.style.display = 'none';
            scrollNotice.style.display = 'flex';
            gameContainer.style.display = 'none';

            document.body.style.height = '200vh';
            document.documentElement.style.height = '200vh';
            document.body.style.overflowY = 'auto';
            window.scrollTo(0, 0);

            // ✅ Фикс высоты и центрирования игры
            if (game) {
                game.scale.resize(BASE_WIDTH, BASE_HEIGHT);
                game.scale.refresh();
            }
        }
    } else {
        // Десктоп
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

    // ✅ Чтобы игра оставалась правильного размера в горизонте
    window.addEventListener('resize', () => {
        if (isMobile() && window.innerWidth > window.innerHeight) {
            game.scale.resize(BASE_WIDTH, BASE_HEIGHT);
            game.scale.refresh();
        }
    });
}

window.addEventListener('scroll', () => {
    if (isMobile() && window.scrollY > window.innerHeight / 2) {
        startGame();
    }
});

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

checkOrientation();
