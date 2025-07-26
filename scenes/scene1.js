class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene1' });
  }

  preload() {
    // Фон
    this.load.image('bg_office', 'assets/bg/office.png');
  }

  create() {

    this.add.image(400, 300, 'bg_office').setDisplaySize(800, 600);


    const bgText = this.add.rectangle(400, 100, 660, 140, 0x1a1a1a, 0.8)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff, 0.3)
      .setDepth(1);

    // Основной текст описания ситуации
    const textContent =
      "Ваш бизнес растёт, но вы не справляетесь с заявками.\n\n" +
      "Круглосуточно поступают вопросы, менеджеры не успевают — клиенты уходят.";

    this.add.text(400, 100, textContent, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 620 },
      lineSpacing: 6,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 2,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setDepth(2);

    // Позиции для всплывающих тревожных сообщений
    const positions = [
      { x: 200, y: 200 },
      { x: 600, y: 220 },
      { x: 400, y: 320 },
    ];

    const messages = ["Много заявок", "Куча сообщений", "Очередь клиентов"];

    // Последовательно выводим тревожные сообщения
    messages.forEach((msg, index) => {
      this.time.delayedCall(index * 500, () => {
        const pos = positions[index];
        const bg = this.add.rectangle(pos.x, pos.y, msg.length * 20, 50, 0xcc0000, 0.9).setOrigin(0.5);
        const text = this.add.text(pos.x, pos.y, msg, {
          fontFamily: 'Arial',
          fontSize: '20px',
          color: '#ffffff',
          fontStyle: 'bold',
        }).setOrigin(0.5);

        // Анимация дрожания
        this.tweens.add({
          targets: [bg, text],
          x: `+=4`,
          yoyo: true,
          repeat: -1,
          duration: 100,
          ease: 'Sine.easeInOut'
        });
      });
    });

    // Через 4 секунды показываем кнопки
    this.time.delayedCall(1500, () => {
      let installBotButton = null;


      const createStyledButton = (x, y, labelText, onClick) => {

        const button = this.add.rectangle(x, y, 240, 64, 0x2a6b2a)
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .setStrokeStyle(2, 0x1e4d1e)
          .setAlpha(0)
          .setDepth(1);

        // Текст на кнопке
        const label = this.add.text(x, y, labelText, {
          fontFamily: 'Arial',
          fontSize: '20px',
          fontStyle: 'bold',
          color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0).setDepth(2);

        // Наведение: подсветка
        button.on('pointerover', () => {
          button.setFillStyle(0x3c8f3c);
          button.setScale(1.02);
        });
        button.on('pointerout', () => {
          button.setFillStyle(0x2a6b2a);
          button.setScale(1);
        });

        // Клик по кнопке
        button.on('pointerdown', () => {
          button.setFillStyle(0x1e4d1e);
          onClick.call(this, button, label);
        });

        // Плавное появление кнопки и текста
        this.tweens.add({
          targets: [button, label],
          alpha: 1,
          duration: 400,
          ease: 'Power1'
        });

        return { button, label };
      };

      // Кнопка "Нанять менеджера"
      createStyledButton(250, 520, "Нанять менеджера", () => {
        // Затемнение фона
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5).setDepth(5);

        // Красное окно-предупреждение
        this.add.rectangle(400, 300, 600, 200, 0x8b0000, 0.95)
          .setStrokeStyle(3, 0xffffff)
          .setDepth(6);

        // Сообщение о последствиях
        this.add.text(400, 300,
          "Хаос продолжается!\nКлиенты по-прежнему ждут ответа.\nОдин менеджер не спасает ситуацию.\n(Потери: -10 клиентов в неделю)",
          {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8,
            wordWrap: { width: 540 }
          }).setOrigin(0.5).setDepth(7);

          // Подсветка кнопки "Установить Чат Бота"
        if (installBotButton) {
          this.tweens.add({
          targets: installBotButton.button,
          alpha: { from: 1, to: 0.4 },
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
  
  // Ярко-зеленый цвет, чтобы кнопка не меркла
        installBotButton.button.setFillStyle(0x4CAF50);
        
        this.tweens.add({
          targets: installBotButton.label,
          alpha: { from: 1, to: 0.7 },
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }

      });

      // Кнопка "Установить Чат Бота"
      installBotButton = createStyledButton(550, 520, "Установить Чат Бота", () => {
        // Переход на следующую сцену
        this.scene.start('Scene2');
      });
    });
  }
}

window.Scene1 = Scene1;



