class Scene3 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene3' });
  }

  preload() {
    this.load.image('bg_office', 'assets/bg/office3.png');
    this.load.image('bg_office2', 'assets/bg/office2.png');
    this.load.image('telegram_icon', 'assets/icons/telegram_icon.png');
    this.load.image('bot_avatar', 'assets/icons/bot_avatar.png');
  }

  create() {
    const { width, height } = this.scale;
    this.bg = this.add.image(width / 2, height / 2, 'bg_office').setDisplaySize(width, height);

    this.claimsCaught = 0;
    this.totalClaims = 5;

    const headerBgWidth = width * 0.6;
    const headerBgHeight = height * 0.08;
    this.headerBg = this.add.rectangle(width / 2, height * 0.07, headerBgWidth, headerBgHeight, 0x000000, 0.5)
      .setOrigin(0.5);

    this.header = this.add.text(width / 2, height * 0.07, 'Летят заявки, ловите их!', {
      fontFamily: 'Arial',
      fontSize: `${Math.floor(height / 20)}px`,
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const fixedX = [width * 0.2, width * 0.4, width * 0.6, width * 0.3, width * 0.5];
    for (let i = 0; i < this.totalClaims; i++) {
      this.spawnClaim(i, fixedX[i], width, height);
    }
  }

  spawnClaim(i, x, width, height) {
    const startY = height + 50;
    const targetY = height * 0.7 - i * height * 0.08;

    const box = this.add.rectangle(x, startY, width * 0.3, height * 0.07, 0xffee88)
      .setStrokeStyle(2, 0x000000)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(x, startY, 'Заявка', {
      fontFamily: 'Arial',
      fontSize: `${Math.floor(height / 30)}px`,
      color: '#000'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [box, label],
      alpha: 1,
      y: targetY,
      duration: 1000,
      delay: i * 600,
      ease: 'Power2'
    });

    box.on('pointerdown', () => {
      box.disableInteractive();
      this.tweens.add({
        targets: [box, label],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          box.destroy();
          label.destroy();
          this.claimsCaught++;
          if (this.claimsCaught === this.totalClaims) {
            this.header.destroy();
            this.headerBg.destroy();
            this.time.delayedCall(600, () => this.showBotWindow());
          }
        }
      });
    });
  }

  showBotWindow() {
    const { width, height } = this.scale;
    const boxWidth = width * 0.8;
    const boxHeight = height * 0.25;
    const boxX = width * 0.1;
    const boxY = height * 0.92;

    this.botBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xffffff)
      .setOrigin(0, 1)
      .setStrokeStyle(2, 0x000000);

    this.botIcon = this.add.image(boxX + 16, boxY - boxHeight + 16, 'telegram_icon')
      .setOrigin(0, 0)
      .setDisplaySize(40, 40);

    this.chatArea = this.add.container(boxX + 60, boxY - boxHeight + 10);

    this.chatAreaHeight = boxHeight - 20;
    this.chatAreaWidth = boxWidth - 80;

    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(boxX + 60, boxY - boxHeight + 10, this.chatAreaWidth, this.chatAreaHeight);
    const mask = maskShape.createGeometryMask();
    this.chatArea.setMask(mask);

    this.chatMessages = [];
    this.nextMessageY = 0;

    this.addToChatAsync(
      "Чат-Бот принял 56 заявок за минуту. Зарегистрировано и распределено по категориям.",
      true,
      { fontSize: 22, fontWeight: 'bold', lineSpacing: 14, color: '#000' }
    ).then(() => {
      this.time.delayedCall(3000, () => {
        this.chatMessages.forEach(msg => {
          if (msg.textTimer) {
            msg.textTimer.remove(false);
          }
          msg.destroy();
        });
        this.chatMessages = [];
        this.nextMessageY = 0;
        this.startAutoDialog();
      });
    });
  }

  addToChat(text, onComplete, isBot = true, options = {}) {
    const { height } = this.scale;
    const fontSize = options.fontSize || Math.floor(height / 45);
    const lineSpacing = options.lineSpacing || 8;
    const fontWeight = options.fontWeight || 'normal';
    const color = options.color || '#000000';

    const containerWidth = this.chatAreaWidth;

    const messageGroup = this.add.container(0, this.nextMessageY);

    if (isBot) {
      const avatar = this.add.image(0, 4, 'bot_avatar').setOrigin(0, 0).setDisplaySize(32, 32);
      messageGroup.add(avatar);
    }

    const label = this.add.text(isBot ? 40 : 0, 6, '', {
      fontFamily: 'Arial',
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      color: color,
      wordWrap: { width: containerWidth - 40 }
    }).setOrigin(0, 0);

    messageGroup.add(label);
    this.chatArea.add(messageGroup);
    this.chatMessages.push(messageGroup);

    let i = 0;
    messageGroup.textTimer = this.time.addEvent({
      delay: 30,
      repeat: text.length - 1,
      callback: () => {
        if (!label || label.destroyed) {
          messageGroup.textTimer.remove(false);
          return;
        }
        label.setText(label.text + text[i]);
        i++;
        if (i === text.length) {
          this.time.delayedCall(100, () => {
            const textHeight = label.height;
            const avatarHeight = isBot ? 36 : 0;
            const messageHeight = Math.max(textHeight, avatarHeight);
            this.nextMessageY += messageHeight + lineSpacing;

            if (this.nextMessageY > this.chatAreaHeight) {
              const overflow = this.nextMessageY - this.chatAreaHeight;
              this.nextMessageY = this.chatAreaHeight;

              this.chatMessages.forEach(msg => {
                msg.y -= overflow;
              });
            }

            if (onComplete) onComplete();
          });
        }
      }
    });
  }

  addToChatAsync(text, isBot = true, options = {}) {
    return new Promise(resolve => {
      this.addToChat(text, () => resolve(), isBot, options);
    });
  }

  async startAutoDialog() {
    const data = [
      { q: 'Какие есть тарифы?', a: 'Имеющиеся у нас тарифы...' },
      { q: 'Сколько стоит Бот?', a: 'Наши прайсы по тарифам...' },
      { q: 'Какой процесс подключения?', a: 'Процесс подключения прост...' },
      { q: 'У меня есть вопросы по моему проекту', a: 'Перевожу вас на менеджера!' }
    ];

    for (const { q, a } of data) {
      await new Promise(resolve => this.animateQuestionBlock(q, resolve));
      await this.addToChatAsync(`👤 ${q}`, false);
      await new Promise(r => this.time.delayedCall(500, r));
      await this.addToChatAsync(a, true);
      await new Promise(r => this.time.delayedCall(1000, r));
    }

    this.chatMessages.forEach(msg => {
      if (msg.textTimer) {
        msg.textTimer.remove(false);
      }
      msg.destroy();
    });
    this.chatMessages = [];
    this.nextMessageY = 0;

    await this.addToChatAsync(
      'Автоответы активированы.\nСреднее время ответа: 2 секунды.\nСложные вопросы отправлены менеджеру.',
      true,
      { fontSize: 22, fontWeight: 'bold', lineSpacing: 14, color: '#000' }
    );

    this.time.delayedCall(3000, () => this.finishScene());
  }

  animateQuestionBlock(text, onComplete) {
    const { width, height } = this.scale;
    const block = this.add.rectangle(width / 2, height + 40, width * 0.6, height * 0.06, 0xffffff)
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0.5);

    const label = this.add.text(width / 2, height + 40, text, {
      fontFamily: 'Arial',
      fontSize: `${Math.floor(height / 35)}px`,
      color: '#000000'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [block, label],
      y: height * 0.3,
      alpha: 0,
      duration: 2500,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        block.destroy();
        label.destroy();
        onComplete();
      }
    });
  }

  finishScene() {
    this.botBox.destroy();
    this.botIcon.destroy();
    this.chatArea.destroy();

    this.bg.setTexture('bg_office2');

    const { width, height } = this.scale;

    const overlay = this.add.rectangle(width / 2, height / 2, width * 0.9, height * 0.25, 0x000000, 0.5)
      .setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Чат Бот взял рутину на себя.\nКоманда работает с важным — без перегрузки', {
      fontFamily: 'Arial',
      fontSize: `${Math.floor(height / 25)}px`,
      color: '#fff',
      align: 'center',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.time.delayedCall(4000, () => {
      this.scene.start('Scene4');
    });
  }
}

window.Scene3 = Scene3;
