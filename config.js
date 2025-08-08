const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

// Инициализация игры с проверкой ориентации
function initGame() {
  if (isMobile) {
    checkOrientation();
  } else {
    new Phaser.Game(config);
  }
}

// Проверка ориентации для мобильных устройств
function checkOrientation() {
  if (window.innerHeight > window.innerWidth) {
    // Показываем сообщение о необходимости поворота
    showOrientationWarning();
    // Добавляем обработчик изменения ориентации
    window.addEventListener('orientationchange', handleOrientationChange);
  } else {
    // Если ориентация горизонтальная - запускаем игру
    startGame();
  }
}

function handleOrientationChange() {
  if (window.innerHeight > window.innerWidth) {
    showOrientationWarning();
  } else {
    document.getElementById('orientation-warning').style.display = 'none';
    if (!window.game) {
      startGame();
    }
  }
}

function startGame() {
  // Запускаем полноэкранный режим
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(e => console.log(e));
  }
  
  // Инициализируем игру
  window.game = new Phaser.Game(config);
}

function showOrientationWarning() {
  let warning = document.getElementById('orientation-warning');
  if (!warning) {
    warning = document.createElement('div');
    warning.id = 'orientation-warning';
    warning.style.position = 'fixed';
    warning.style.top = '0';
    warning.style.left = '0';
    warning.style.width = '100%';
    warning.style.height = '100%';
    warning.style.backgroundColor = '#000';
    warning.style.color = '#fff';
    warning.style.display = 'flex';
    warning.style.justifyContent = 'center';
    warning.style.alignItems = 'center';
    warning.style.zIndex = '9999';
    warning.style.fontSize = '24px';
    warning.style.textAlign = 'center';
    warning.style.padding = '20px';
    warning.innerHTML = 'Пожалуйста, поверните устройство в горизонтальное положение для игры';
    document.body.appendChild(warning);
  } else {
    warning.style.display = 'flex';
  }
}

// Запуск при загрузке страницы
window.addEventListener('load', () => {
  initGame();
});

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
  if (window.game && isMobile) {
    if (window.innerHeight > window.innerWidth) {
      document.getElementById('orientation-warning').style.display = 'flex';
    } else {
      document.getElementById('orientation-warning').style.display = 'none';
    }
  }
});