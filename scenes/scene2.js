class Scene2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene2' });
  }

  preload() {
    // Заглушки
  }

  create() {
    // Фон
    this.add.rectangle(400, 300, 800, 600, 0xf0f0f0);

    // Заголовок
    this.add.text(400, 80, "Как вы решите проблему?", {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#222222',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Кнопка "Менеджер" 
    const btnManager = this.add.container(250, 350);

    // Прямоугольник кнопки
    const rectMan = this.add.rectangle(0, 0, 220, 160, 0x3399ff).setStrokeStyle(2, 0x2266cc);

    // Заглушка иконки 
    const iconManBg = this.add.rectangle(0, -30, 80, 80, 0x224488);
    const iconManText = this.add.text(0, -30, "Менеджер", {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 80 }
    }).setOrigin(0.5);

    // Подпись под иконкой
    const textMan = this.add.text(0, 50, "Нанять менеджера\n–30 000 ₽ в месяц", {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    btnManager.add([rectMan, iconManBg, iconManText, textMan]);

    // Интерактив
    btnManager.setSize(220, 160);
    btnManager.setInteractive({ useHandCursor: true });

    // Кнопка "Бот"
    const btnBot = this.add.container(550, 350);

    const rectBot = this.add.rectangle(0, 0, 220, 160, 0x33cc33).setStrokeStyle(2, 0x228822);

    // Заглушка иконки
    const iconBotBg = this.add.rectangle(0, -30, 80, 80, 0x226622);
    const iconBotText = this.add.text(0, -30, "Чат-бот", {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 80 }
    }).setOrigin(0.5);

    const textBot = this.add.text(0, 50, "Установить чат-бота\n+1 день на внедрение\n+5X заявки", {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    btnBot.add([rectBot, iconBotBg, iconBotText, textBot]);

    btnBot.setSize(220, 160);
    btnBot.setInteractive({ useHandCursor: true });

    // Анимация и переход
    const animateAndGo = (btnContainer, choiceKey) => {
      this.tweens.add({
        targets: btnContainer.getAt(0), 
        scale: 1.1,
        yoyo: true,
        duration: 300,
        repeat: 1,
        onComplete: () => {
          this.registry.set('strategyChoice', choiceKey);
          this.scene.start('Scene3');
        }
      });
    };

    btnManager.on('pointerdown', () => animateAndGo(btnManager, 'manager'));
    btnBot.on('pointerdown', () => animateAndGo(btnBot, 'bot'));
  }
}

window.Scene2 = Scene2;
