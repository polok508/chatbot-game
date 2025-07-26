class Scene2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene2' });
  }

  preload() {
    // Фон 
    this.load.image('manager_bg', 'assets/bg/manager.png');
    // Иконка Telegram
    this.load.image('telegram_icon', 'assets/icons/telegram_icon.png');
  }

  create() {

    this.add.image(400, 300, 'manager_bg').setDisplaySize(800, 600);

    this.time.delayedCall(1000, () => {
      // Координаты и размеры окна слева внизу
      const boxX = 0;
      const boxY = 600;
      const boxWidth = 400;
      const boxHeight = 200;


      const box = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xffffff)
        .setOrigin(0, 1)
        .setStrokeStyle(3, 0x000000)
        .setAlpha(0);

      // Иконка 
      let icon;
      if (this.textures.exists('telegram_icon')) {
        icon = this.add.image(boxX + 20, boxY - boxHeight + 20, 'telegram_icon')
          .setOrigin(0, 0)
          .setDisplaySize(40, 40)
          .setAlpha(0);
      } else {
        console.warn('Telegram icon texture not found!');
      }

      // Текст внутри окна
      const msg = this.add.text(boxX + 80, boxY - boxHeight + 30, "", {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#000000',
        fontStyle: 'bold',
        wordWrap: { width: boxWidth - 100 },
        align: 'left'
      }).setOrigin(0, 0).setAlpha(0);

      // Появление окна, иконки и текста
      const appearTargets = [box, msg];
      if (icon) appearTargets.push(icon);

      this.tweens.add({
        targets: appearTargets,
        alpha: 1,
        y: '-=20',
        duration: 400,
        ease: 'Power2'
      });

      // Эффект печатания текста "Бот устанавливается..."
      const fullText = "Бот устанавливается...";
      let currentText = "";
      let charIndex = 0;

      this.time.delayedCall(500, () => {
        this.time.addEvent({
          delay: 50,
          repeat: fullText.length - 1,
          callback: () => {
            currentText += fullText[charIndex];
            msg.setText(currentText);
            charIndex++;
          }
        });
      });

      // Через 2.5 секунды меняем текст на "Установка завершена"
      this.time.delayedCall(2500, () => {
        msg.setText("Установка завершена");

        this.time.delayedCall(400, () => {
          // Большой полупрозрачный фон и текст "Бот активирован" по центру
          const bigTextBg = this.add.rectangle(400, 170, 380, 80, 0x000000, 0.6)
            .setOrigin(0.5)
            .setAlpha(0);

          const bigText = this.add.text(400, 170, "🤖 Бот активирован", {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
          }).setOrigin(0.5).setAlpha(0);

          this.tweens.add({
            targets: [bigTextBg, bigText],
            alpha: 1,
            duration: 600,
            ease: 'Power2'
          });

          // Кнопка "Продолжить" 
          const button = this.add.rectangle(400, 290, 220, 60, 0x2a6b2a)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0x1e4d1e)
            .setAlpha(0);

          const label = this.add.text(400, 290, "Продолжить", {
            fontFamily: 'Arial',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#ffffff'
          }).setOrigin(0.5).setAlpha(0);

          button.on('pointerover', () => button.setFillStyle(0x3c8f3c));
          button.on('pointerout', () => button.setFillStyle(0x2a6b2a));
          button.on('pointerdown', () => this.scene.start('Scene3'));

          this.tweens.add({
            targets: [button, label],
            alpha: 1,
            delay: 400,
            duration: 600,
            ease: 'Power2'
          });
        });
      });
    });
  }
}

window.Scene2 = Scene2;

