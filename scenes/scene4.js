class Scene4 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene4' });
  }

  preload() {
    this.load.image('happy_face', 'assets/icons/happy_face.png');
    this.load.image('money_bag', 'assets/icons/money_bag.png');
    this.load.image('chart_up', 'assets/icons/chart_up.png');
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Фон
    this.cameras.main.setBackgroundColor('#e6f0fa');


    const titleFontSize = Math.min(this.scale.width, 600) / 16;
    const subtitleFontSize = titleFontSize * 0.85;

    // Заголовок
    this.add.text(centerX, 50, 'Успех бизнеса', {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: `${titleFontSize}px`,
      color: '#222222',
      fontWeight: '700',
      letterSpacing: 1.4,
      lineHeight: `${titleFontSize * 1.4}px`,
      align: 'center',
    }).setOrigin(0.5);

    // Иконки 
    const iconsY = centerY + titleFontSize * 1.8;
    const spacing = this.scale.width / 5;
    const iconScale = Math.min(this.scale.width / 800, 1) * 1.0; 

    const happyFace = this.add.image(centerX - spacing, iconsY, 'happy_face').setAlpha(0).setScale(iconScale);
    const moneyBag = this.add.image(centerX, iconsY, 'money_bag').setAlpha(0).setScale(iconScale);
    const chartUp = this.add.image(centerX + spacing, iconsY, 'chart_up').setAlpha(0).setScale(iconScale);

    // Анимация появления иконок
    this.time.delayedCall(500, () => this.tweens.add({ targets: happyFace, alpha: 1, duration: 400 }));
    this.time.delayedCall(900, () => this.tweens.add({ targets: moneyBag, alpha: 1, duration: 400 }));
    this.time.delayedCall(1300, () => this.tweens.add({ targets: chartUp, alpha: 1, duration: 400 }));

    // Подпись с плавным появлением
    this.time.delayedCall(1800, () => {
      const congratsText = this.add.text(centerX, iconsY + titleFontSize * 3, 'Поздравляю, вы автоматизировали бизнес!', {
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: `${subtitleFontSize}px`,
        color: '#333333',
        fontWeight: '500',
        letterSpacing: 0.8,
        lineHeight: `${subtitleFontSize * 1.5}px`,
        align: 'center',
        wordWrap: { width: this.scale.width * 0.8 }
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({ targets: congratsText, alpha: 1, duration: 600 });
    });

    // Переход на следующую сцену через 5 секунды
    this.time.delayedCall(5000, () => {
      this.scene.start('Scene5');
    });
  }
}

window.Scene4 = Scene4;


