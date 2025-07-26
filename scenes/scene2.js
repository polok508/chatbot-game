class Scene2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene2' });
  }

  preload() {
    this.load.image('manager_bg', 'assets/bg/manager.png');
    this.load.image('telegram_icon', 'assets/icons/telegram_icon.png');
    this.load.image('bot_avatar', 'assets/icons/bot_avatar.png');
  }

  create() {
    this.add.image(400, 300, 'manager_bg').setDisplaySize(800, 600);

    this.time.delayedCall(1000, () => {
      const boxX = 20;
      const boxY = 580;
      const boxWidth = 460;
      const boxHeight = 160;

      const box = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xffffff)
        .setOrigin(0, 1)
        .setStrokeStyle(3, 0x000000)
        .setAlpha(0);

      let icon;
      if (this.textures.exists('telegram_icon')) {
        icon = this.add.image(boxX + 16, boxY - boxHeight + 16, 'telegram_icon')
          .setOrigin(0, 0)
          .setDisplaySize(36, 36)
          .setAlpha(0);
      }

      const msg = this.add.text(boxX + 64, boxY - boxHeight + 24, "", {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#000000',
        fontStyle: 'bold',
        wordWrap: { width: boxWidth - 80 },
        align: 'left'
      }).setOrigin(0, 0).setAlpha(0);

      const appearTargets = [box, msg];
      if (icon) appearTargets.push(icon);

      this.tweens.add({
        targets: appearTargets,
        alpha: 1,
        y: '-=20',
        duration: 400,
        ease: 'Power2'
      });

      const fullText = "Бот устанавливается...";
      let currentText = "";
      let charIndex = 0;

      this.time.delayedCall(500, () => {
        this.time.addEvent({
          delay: 40,
          repeat: fullText.length - 1,
          callback: () => {
            currentText += fullText[charIndex];
            msg.setText(currentText);
            charIndex++;
          }
        });
      });

      this.time.delayedCall(2200, () => {
        msg.setText("Установка завершена");

        this.time.delayedCall(400, () => {
          const centerX = 400;
          const centerY = 180;

          const bigTextBg = this.add.rectangle(centerX, centerY, 380, 70, 0x000000, 0.6)
            .setOrigin(0.5)
            .setAlpha(0);

          const botAvatar = this.add.image(centerX - 120, centerY, 'bot_avatar')
            .setDisplaySize(32, 32)
            .setOrigin(0.5)
            .setAlpha(0);

          const bigText = this.add.text(centerX - 80, centerY, "Бот активирован", {
            fontFamily: 'Arial',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffffff'
          }).setOrigin(0, 0.5).setAlpha(0);

          this.tweens.add({
            targets: [bigTextBg, botAvatar, bigText],
            alpha: 1,
            duration: 600,
            ease: 'Power2'
          });

          const button = this.add.rectangle(centerX, 290, 220, 60, 0x2a6b2a)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0x1e4d1e)
            .setAlpha(0);

          const label = this.add.text(centerX, 290, "Продолжить", {
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



