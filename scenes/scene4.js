class Scene4 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene4' });
  }

  create() {
    // Фон
    this.add.rectangle(400, 300, 800, 600, 0xf9f9f9);

    // Заголовок
    this.add.text(400, 60, "С ботом у вас высвободилось время. Что дальше?", {
      fontFamily: 'Arial',
      fontSize: '26px',
      color: '#222222',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    // Варианты выбора
    const options = [
      { text: "Масштабировать бизнес", key: "scale" },
      { text: "Добавить обработку заявок прямо в Telegram", key: "telegram" },
      { text: "Интеграция с CRM", key: "crm" }
    ];

    options.forEach((opt, idx) => {
      const y = 150 + idx * 120;

      // Контейнер кнопки
      const container = this.add.container(400, y);

      // Кнопка фон
      const rect = this.add.rectangle(0, 0, 600, 80, 0x4488cc).setStrokeStyle(2, 0x225577);

      // Текст
      const text = this.add.text(0, 0, opt.text, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 580 }
      }).setOrigin(0.5);

      container.add([rect, text]);

      container.setSize(600, 80);
      container.setInteractive({ useHandCursor: true });

      container.on('pointerover', () => rect.setFillStyle(0x66aaff));
      container.on('pointerout', () => rect.setFillStyle(0x4488cc));

      container.on('pointerdown', () => {
        this.showPopup(opt.text);
        this.registry.set('scaleChoice', opt.key);

        this.time.delayedCall(1500, () => {
          if (this.scene.get('Scene5')) {
            this.scene.start('Scene5');
          } else {
            console.warn('Scene5 is not found. Make sure it is registered.');
          }
        });
      });
    });
  }

  showPopup(text) {
    const popup = this.add.container(400, 500);

    const bg = this.add.rectangle(0, 0, 700, 60, 0x222222, 0.85);
    const popupText = this.add.text(0, 0, `Вы выбрали: ${text}`, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    popup.add([bg, popupText]);
    popup.setScale(0.5);
    popup.setAlpha(0);

    this.tweens.add({
      targets: popup,
      alpha: 1,
      scale: 1.1,
      ease: 'Power1',
      duration: 200,
      onComplete: () => {
        this.tweens.add({
          targets: popup,
          scale: 1,
          ease: 'Power1',
          duration: 150,
          onComplete: () => {
            this.time.delayedCall(800, () => {
              this.tweens.add({
                targets: popup,
                alpha: 0,
                duration: 400,
                onComplete: () => popup.destroy()
              });
            });
          }
        });
      }
    });
  }
}

window.Scene4 = Scene4;
