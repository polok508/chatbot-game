class Scene3 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene3' });
  }

  preload() {
    this.load.image('office_happy', 'assets/bg/office2.png');
    this.load.image('green_arrow', 'assets/icons/arrow.png');
    this.load.image('bot_avatar', 'assets/icons/bot_avatar.png');
    this.load.image('telegram_icon', 'assets/icons/telegram_icon.png');
  }

  create() {
    // Иконка Telegram слева
    this.add.image(30, 30, 'telegram_icon')
      .setDisplaySize(32, 32)
      .setOrigin(0.5)
      .setDepth(10);

    // Фон офиса справа
    this.add.image(600, 300, 'office_happy').setDisplaySize(400, 600);

    // Зелёная стрелка графика справа
    this.arrow = this.add.image(600, 560, 'green_arrow') 
      .setOrigin(0.5, 1)
      .setScale(0.4, 0) 
      .setAlpha(0.6);

    // Левая белая панель для чата
    this.add.rectangle(200, 300, 400, 600, 0xffffff)
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0.5);

    const messages = [
      "Здравствуйте! Я ваш помощник 🤖",
      "Я уже собрал первые заявки!",
      "Давайте посмотрим на результаты 📈"
    ];

    let currentY = 80; 
    let msgIndex = 0;

    const showTypingIndicator = (callback) => {
      const typing = this.add.text(100, currentY + 10, '...', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#999999'
      }).setAlpha(0).setDepth(3);

      this.tweens.add({
        targets: typing,
        alpha: 1,
        duration: 200,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          typing.destroy();
          callback();
        }
      });
    };

    const showNextMessage = () => {
      if (msgIndex >= messages.length) {
        this.animateArrowAndShowButton(this.arrow);
        return;
      }

      showTypingIndicator(() => {
        const text = messages[msgIndex];
        const padding = 12;
        const startX = 500;
        const targetX = 80;

        // Временный текст для расчёта размеров
        const tempText = this.add.text(0, 0, text, {
          fontFamily: 'Arial',
          fontSize: '18px',
          wordWrap: { width: 250 }
        }).setAlpha(0);

        const bubbleW = tempText.width + padding * 2;
        const bubbleH = tempText.height + padding * 2;
        tempText.destroy();

        const bg = this.add.rectangle(startX, currentY, bubbleW, bubbleH, 0xe0f3ff)
          .setOrigin(0)
          .setAlpha(0)
          .setStrokeStyle(1, 0xcccccc)
          .setDepth(1);

        const textObj = this.add.text(startX + padding, currentY + padding, text, {
          fontFamily: 'Arial',
          fontSize: '18px',
          color: '#000000',
          wordWrap: { width: 250 }
        }).setAlpha(0).setDepth(2);

        const avatar = this.add.image(startX - 40, currentY + bubbleH / 2, 'bot_avatar')
          .setDisplaySize(32, 32)
          .setAlpha(0)
          .setDepth(2);

        this.tweens.add({
          targets: [bg, textObj, avatar],
          x: (target) => {
            if (target === bg) return targetX;
            if (target === textObj) return targetX + padding;
            if (target === avatar) return 40;
          },
          alpha: 1,
          ease: 'Power2',
          duration: 400,
          onComplete: () => {
            msgIndex++;
            currentY += bubbleH + 20;
            this.time.delayedCall(300, showNextMessage);
          }
        });
      });
    };

    showNextMessage();
  }

  animateArrowAndShowButton(arrow) {
    const topLimit = 20; 
    const arrowHeightOriginal = arrow.height * arrow.scaleX; 

    this.tweens.add({
      targets: arrow,
      scaleY: 1,
      duration: 1000,
      ease: 'Power2',
      onUpdate: () => {
      
        const currentTopY = arrow.y - arrowHeightOriginal * arrow.scaleY;
        if (currentTopY < topLimit) {

          arrow.scaleY = (arrow.y - topLimit) / arrowHeightOriginal;
        }
      },
      onComplete: () => {
        const button = this.add.rectangle(600, 540, 250, 60, 0x2a6b2a)
          .setInteractive({ useHandCursor: true })
          .setStrokeStyle(2, 0x1e4d1e)
          .setAlpha(0)
          .setOrigin(0.5);

        const label = this.add.text(600, 540, "Показать результаты", {
          fontFamily: 'Arial',
          fontSize: '20px',
          fontStyle: 'bold',
          color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);

        button.on('pointerover', () => button.setFillStyle(0x3c8f3c));
        button.on('pointerout', () => button.setFillStyle(0x2a6b2a));
        button.on('pointerdown', () => this.scene.start('Scene4'));

        this.tweens.add({
          targets: [button, label],
          alpha: 1,
          duration: 500,
          delay: 300
        });
      }
    });
  }
}

window.Scene3 = Scene3;

