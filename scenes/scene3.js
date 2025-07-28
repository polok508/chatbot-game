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
    this.headerBg = this.add.rectangle(width / 2, height * 0.07, headerBgWidth, headerBgHeight, 0x000000, 0.5).setOrigin(0.5);

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
            this.showBotWindow();
          }
        }
      });
    });
  }

  showBotWindow() {
    const { width, height } = this.scale;
    const boxWidth = width * 0.35;
    const boxHeight = height * 0.65;
    const boxX = width - boxWidth - 20;
    const boxY = height - 20;

    this.botBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xffffff)
      .setOrigin(0, 1)
      .setStrokeStyle(2, 0x000000);

    this.botIcon = this.add.image(boxX + 12, boxY - boxHeight + 12, 'telegram_icon')
      .setOrigin(0, 0)
      .setDisplaySize(36, 36);

    this.chatArea = this.add.container(boxX + 54, boxY - boxHeight + 16);
    this.chatAreaHeight = boxHeight - 32;
    this.chatAreaWidth = boxWidth - 72;

    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(boxX + 54, boxY - boxHeight + 16, this.chatAreaWidth, this.chatAreaHeight);
    const mask = maskShape.createGeometryMask();
    this.chatArea.setMask(mask);

    this.chatMessages = [];
    this.nextMessageY = 6;

    this.addToChatAsync(
      "Чат-Бот принял 5 заявок за минуту. Зарегистрировано и распределено по категориям.",
      true,
      { fontSize: 20, fontWeight: 'bold', lineSpacing: 12, color: '#000' }
    ).then(() => {
      this.showContinueButton(() => {
        this.clearChat();
        this.startAutoDialog();
      });
    });
  }

  addToChat(text, onComplete, isBot = true, options = {}) {
    const { height } = this.scale;
    const defaultFontSize = options.fontSize || Math.floor(height / 30);
    const lineSpacing = options.lineSpacing || 10;
    const fontWeight = options.fontWeight || 'bold';
    const color = options.color || '#000000';

    const containerWidth = this.chatAreaWidth;
    const messageGroup = this.add.container(0, this.nextMessageY);

    const forceNarrow = text.includes('Чат-Бот принял');

    const maxWidth = forceNarrow ? containerWidth * 0.6 : containerWidth * 0.54;

    let labelX, align, bgColor;
    if (isBot) {
      const avatar = this.add.image(0, 4, 'bot_avatar').setOrigin(0, 0).setDisplaySize(32, 32);
      messageGroup.add(avatar);
      labelX = 40;
      align = 'left';
      bgColor = 0xe0f0e9;
    } else {
      labelX = containerWidth;
      align = 'right';
      bgColor = 0xd0d0d0;
    }

  
    let fontSize = defaultFontSize;
    let label = this.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      color: color,
      wordWrap: { width: maxWidth },
      align: align
    });


    while (label.width > maxWidth && fontSize > 10) {
      fontSize -= 1;
      label.setFontSize(fontSize);
    }

    label.setOrigin(isBot ? 0 : 1, 0);
    label.x = labelX;

    messageGroup.add(label);
    this.chatArea.add(messageGroup);
    this.chatMessages.push(messageGroup);

    // Печать текста по символам
    label.setText('');
    let i = 0;
    messageGroup.textTimer = this.time.addEvent({
      delay: 30,
      repeat: text.length - 1,
      callback: () => {
        if (!label || label.destroyed) return;
        label.setText(label.text + text[i]);
        i++;
        if (i === text.length) {
          const textWidth = label.width;
          const textHeight = label.height;

          const bg = this.add.graphics();
          bg.fillStyle(bgColor, 1);
          bg.fillRoundedRect(
            isBot ? label.x - 6 : label.x - textWidth - 6,
            label.y - 8,
            textWidth + 20,
            textHeight + 16,
            12
          );
          messageGroup.addAt(bg, 0);

          this.nextMessageY += textHeight + 16 + lineSpacing;

          if (this.nextMessageY > this.chatAreaHeight) {
            const overflow = this.nextMessageY - this.chatAreaHeight;
            this.nextMessageY = this.chatAreaHeight;
            this.chatMessages.forEach(msg => {
              msg.y -= overflow;
            });
          }

          if (onComplete) onComplete();
        }
      }
    });
  }

  addToChatAsync(text, isBot = true, options = {}) {
    return new Promise(resolve => {
      this.addToChat(text, () => resolve(), isBot, options);
    });
  }

  showContinueButton(callback) {
    if (this.continueBtn) return;
    const btnWidth = 130;
    const btnHeight = 32;
    const btnX = this.botBox.x + this.botBox.width - btnWidth - 12;
    const btnY = this.botBox.y - btnHeight - 12;
    this.continueBtn = this.add.container(btnX, btnY);

    const graphics = this.add.graphics();
    graphics.fillStyle(0x2a6b2a, 1);
    graphics.fillRoundedRect(0, 0, btnWidth, btnHeight, 10);
    graphics.lineStyle(2, 0x1b431b, 1);
    graphics.strokeRoundedRect(0, 0, btnWidth, btnHeight, 10);

    const btnText = this.add.text(btnWidth / 2, btnHeight / 2, 'Продолжить', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#fff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.continueBtn.add([graphics, btnText]);

    graphics.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, btnWidth, btnHeight),
      Phaser.Geom.Rectangle.Contains
    );

    graphics.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    graphics.on('pointerout', () => this.input.setDefaultCursor('default'));

    graphics.on('pointerdown', () => graphics.setScale(0.95));
    graphics.on('pointerup', () => {
      graphics.setScale(1);
      if (this.continueBtn) {
        this.continueBtn.destroy();
        this.continueBtn = null;
      }
      if (callback) callback();
    });
  }

  clearChat() {
    this.chatMessages.forEach(msg => {
      if (msg.textTimer) msg.textTimer.remove(false);
      msg.destroy();
    });
    this.chatMessages = [];
    this.nextMessageY = 6;
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

    this.clearChat();
    await this.addToChatAsync(
      'Автоответы активированы.\nСреднее время ответа: 2 секунды.\nСложные вопросы отправлены менеджеру.',
      true,
      { fontSize: 20, fontWeight: 'bold', lineSpacing: 14, color: '#000' }
    );

    this.showContinueButton(() => {
      this.finishScene();
    });
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
      duration: 600,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.time.delayedCall(900, () => {
          block.destroy();
          label.destroy();
          onComplete();
        });
      }
    });
  }

  finishScene() {
    this.botBox.destroy();
    this.botIcon.destroy();
    this.chatArea.destroy();
    if (this.continueBtn) this.continueBtn.destroy();
    this.bg.setTexture('bg_office2');

    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width * 0.9, height * 0.25, 0x000000, 0.75).setOrigin(0.5);
    this.add.text(width / 2, height / 2, 'Чат Бот взял рутину на себя.\nКоманда работает с важным — без перегрузки', {
      fontFamily: 'Arial',
      fontSize: `${Math.floor(height / 22)}px`,
      color: '#f0f0f0',
      align: 'center',
      stroke: '#222222',
      strokeThickness: 4,
      fontStyle: 'bold',
      padding: { x: 10, y: 10 }
    }).setOrigin(0.5);

    this.time.delayedCall(4000, () => {
      this.scene.start('Scene4');
    });
  }
}

window.Scene3 = Scene3;
