const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isYandex = navigator.userAgent.includes('YaBrowser');

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1440,
    height: 992,
    backgroundColor: '#ffffff',
    scene: [Scene1, Scene2, Scene3, Scene4, Scene5],
    scale: {
        mode: isMobile ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {
            width: 1440,
            height: 992
        },
        min: {
            width: 400,
            height: 600
        }
    }
};


function initGame() {
    setProperSizes();
    
    if (isMobile) {
        setupMobileEnvironment();
        checkOrientation();
    } else {
        startGame(false);
    }
}

function setProperSizes() {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.getElementById('game-container').style.height = '100%';
    
    if (isIOS) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
}

function setupMobileEnvironment() {
    hideBrowserUI();
    
    if (isIOS) {
        document.body.style.webkitTransform = 'translate3d(0,0,0)';
        window.addEventListener('scroll', preventScrolling);
    }
    
    if (isYandex) {
        setupYandexBrowser();
    }
}

function checkOrientation() {
    if (isLandscape()) {
        startGame(true);
    } else {
        showOrientationWarning();
        setupOrientationListeners();
    }
}

function startGame(requestFullscreen) {
    hideOrientationWarning();
    
    if (!window.game) {
        window.game = new Phaser.Game(config);
        setupViewportResizeHandler();
        
        if (requestFullscreen && isMobile) {
            setTimeout(() => enterFullscreen(), 300);
        }
    } else {
        window.game.scale.refresh();
    }
}


function isLandscape() {
    if (window.screen.orientation) {
        return window.screen.orientation.type.includes('landscape');
    }
    return window.innerWidth > window.innerHeight || Math.abs(window.orientation) === 90;
}

function showOrientationWarning() {
    const warning = document.getElementById('orientation-warning');
    if (warning) {
        warning.style.display = 'flex';
    }
    
    document.getElementById('force-landscape').addEventListener('click', () => startGame(true), { once: true });
}

function hideOrientationWarning() {
    const warning = document.getElementById('orientation-warning');
    if (warning) {
        warning.style.display = 'none';
    }
}

function setupOrientationListeners() {
    const events = isIOS ? ['resize', 'orientationchange'] : ['orientationchange'];
    events.forEach(event => {
        window.addEventListener(event, handleOrientationChange, { passive: true });
    });
}

function handleOrientationChange() {
    if (isLandscape()) {
        startGame(true);
    } else {
        showOrientationWarning();
    }
}

function hideBrowserUI() {
    window.scrollTo(0, 1);
    setTimeout(() => window.scrollTo(0, 0), 100);
    
    if (/Android/.test(navigator.userAgent)) {
        const metaViewport = document.querySelector('meta[name=viewport]');
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no');
    }
}

function setupViewportResizeHandler() {
    let lastHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
        const newHeight = window.innerHeight;
        
        if (Math.abs(lastHeight - newHeight) > 60) {
            lastHeight = newHeight;
            setTimeout(() => {
                if (window.game) {
                    window.game.scale.refresh();
                    hideBrowserUI();
                }
            }, 300);
        }
    });
}

function enterFullscreen() {
    if (!isMobile) return;

    const element = document.documentElement;
    const methods = [
        'requestFullscreen',
        'webkitRequestFullscreen',
        'msRequestFullscreen'
    ];
    
    for (const method of methods) {
        if (element[method]) {
            element[method]().catch(e => console.log('Fullscreen error:', e));
            break;
        }
    }
}

function preventScrolling() {
    window.scrollTo(0, 1);
}

function setupYandexBrowser() {
    document.addEventListener('click', () => {
        setTimeout(() => {
            window.scrollTo(0, 1);
            if (window.game) window.game.scale.refresh();
        }, 300);
    });
    
    const yandexInterval = setInterval(() => {
        if (window.game && isLandscape()) {
            window.game.scale.refresh();
        } else {
            clearInterval(yandexInterval);
        }
    }, 1500);
}


window.addEventListener('load', initGame);

if (isIOS) {
    window.addEventListener('pageshow', initGame);
}