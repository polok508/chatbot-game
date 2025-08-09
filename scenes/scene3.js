class Scene3 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene3' });
  }

  preload() {
    this.load.image('bg_office3', 'assets/bg/scene3.png');
    this.load.image('bot_icon', 'assets/icons/bot.png');
    this.load.image('send_icon', 'assets/icons/send.png');
  }

  create() {
    const { width, height } = this.scale;
    this.chatX = 957;
    this.chatY = 200;

    // Фон
    this.add.image(width / 2, height / 2, 'bg_office3').setDisplaySize(width, height);

    // Заголовок с анимацией появления
    this.headerBg = this.add.graphics()
      .fillStyle(0xffffff, 0.7)
      .fillRoundedRect(403, 100, 635, 87, 20)
      .setAlpha(0);

    this.headerText = this.add.text(403 + 317, 100 + 43, "Летят заявки, ловите их!", {
      fontFamily: 'Roboto',
      fontSize: '40px',
      color: '#000'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [this.headerBg, this.headerText],
      alpha: 1,
      duration: 600,
      delay: 300
    });

    // Позиции заявок
    this.claimPositions = [
      { x: 182, y: 237 },
      { x: 624, y: 237 },
      { x: 1068, y: 237 },
      { x: 403, y: 362 },
      { x: 846, y: 362 },
      { x: 624, y: 487 }
    ];

    this.claimsCaught = 0;
    this.totalClaims = this.claimPositions.length;

    
    this.claimPositions.forEach((pos, i) => this.spawnClaim(i, pos.x, pos.y));

   
    this.createChatWindow();
    this.chatContainer.setVisible(false);

    this.createBottomBar();
    this.bottomBarContainer.setVisible(false);

    this.createContinueButton();
    this.continueBtn.setVisible(false);

    this.createSecondContinueButton();
    this.continueBtnSecond.setVisible(false);
  }

  spawnClaim(index, x, y) {
    const w = 191, h = 95;
    const g = this.add.graphics();
    g.fillStyle(0xB42527, 1);
    g.fillRoundedRect(0, 0, w, h, 10);
    g.generateTexture(`claim_bg_${index}`, w, h);
    g.destroy();

    const claimImage = this.add.image(x, y, `claim_bg_${index}`)
      .setOrigin(0, 0)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    const claimText = this.add.text(x + w / 2, y + h / 2, 'Заявка', {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [claimImage, claimText],
      alpha: 1,
      duration: 600,
      delay: index * 300
    });

    claimImage.on('pointerdown', () => {
      claimImage.disableInteractive();
      this.tweens.add({
        targets: [claimImage, claimText],
        alpha: 0,
        duration: 300,
        onComplete: () => {
          claimImage.destroy();
          claimText.destroy();
          this.claimsCaught++;
          if (this.claimsCaught === this.totalClaims) {
            this.headerBg.destroy();
            this.headerText.destroy();
            this.showChatWindow();
          }
        }
      });
    });
  }

  createChatWindow() {
    this.chatWidth = 413;
    this.chatHeight = 672;

    this.chatContainer = this.add.container(this.chatX, this.chatY);

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillRoundedRect(0, 0, this.chatWidth, this.chatHeight, 20);
    this.chatContainer.add(bg);

    const headerBar = this.add.graphics();
    headerBar.fillStyle(0xD0CDF8, 1);
    headerBar.fillRoundedRect(0, 0, this.chatWidth, 70, 20);
    this.chatContainer.add(headerBar);

    const botIcon = this.add.image(45, 35, 'bot_icon')
      .setOrigin(0.5)
      .setDisplaySize(50, 50);
    this.chatContainer.add(botIcon);

    const botLabel = this.add.text(105, 35, "Онлайн-помощник", {
      fontFamily: 'Roboto',
      fontSize: '20px',
      color: '#000',
      fontWeight: 'bold'
    }).setOrigin(0, 0.5);
    this.chatContainer.add(botLabel);

    this.messagesContainer = this.add.container(0, 90);
    this.chatContainer.add(this.messagesContainer);

    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(this.chatX, this.chatY + 90, this.chatWidth, this.chatHeight - 90);
    const mask = maskShape.createGeometryMask();
    this.messagesContainer.setMask(mask);

    this.chatMessages = [];
    this.nextMessageY = 0;
  }

  createBottomBar() {
    this.bottomBarContainer = this.add.container(this.chatX, this.chatY + 604);

    const bar = this.add.graphics();
    bar.fillStyle(0xffffff, 1);
    bar.fillRoundedRect(0, 0, this.chatWidth, 68, 20);
    bar.lineStyle(1, 0xCCCCCC, 1);
    bar.strokeRoundedRect(0, 0, this.chatWidth, 68, 20);
    this.bottomBarContainer.add(bar);

    this.messagePlaceholder = this.add.text(30, 34, 'Сообщение', {
      fontFamily: 'Roboto',
      fontSize: '16px',
      color: '#0000004D'
    }).setOrigin(0, 0.5);
    this.bottomBarContainer.add(this.messagePlaceholder);

    const sendIcon = this.add.image(this.chatWidth - 30, 34, 'send_icon')
      .setOrigin(0.5)
      .setDisplaySize(41, 41);
    this.bottomBarContainer.add(sendIcon);

    this.bottomBarContainer.disableInteractive();
  }

  addMessage(text, isBot = true) {
    const maxBubbleWidth = 300;
    const paddingX = 20;
    const paddingY = 16;
    const radius = 10;

    const tempText = this.add.text(0, 0, text, {
      fontFamily: 'Roboto',
      fontSize: '18px',
      fontWeight: 'bold',
      wordWrap: { width: maxBubbleWidth - paddingX * 2 },
      align: 'left',
    });

    const bubbleWidth = tempText.width + paddingX * 2;
    const bubbleHeight = tempText.height + paddingY * 2;
    tempText.destroy();

    const bubble = this.add.graphics();
    bubble.fillStyle(0xEFEFEF, 1);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, radius);

    const msgText = this.add.text(paddingX, paddingY, text, {
      fontFamily: 'Roboto',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#000',
      wordWrap: { width: maxBubbleWidth - paddingX * 2 },
      align: 'left',
    });

    const xPos = isBot ? 10 : this.chatWidth - bubbleWidth - 10;
    const msgContainer = this.add.container(xPos, this.nextMessageY, [bubble, msgText]);
    this.messagesContainer.add(msgContainer);
    this.chatMessages.push(msgContainer);

    this.nextMessageY += bubbleHeight + 12;

    const visibleHeight = this.chatHeight - 90 - 40;
    const extraMargin = 20;
    if (this.nextMessageY > visibleHeight) {
      this.messagesContainer.y = 90 - (this.nextMessageY - visibleHeight) - extraMargin;
    } else {
      this.messagesContainer.y = 90;
    }
  }

  clearChat() {
    this.chatMessages.forEach(msg => msg.destroy());
    this.chatMessages = [];
    this.nextMessageY = 0;
    this.messagesContainer.y = 90;
  }

  delay(ms) {
    return new Promise(resolve => this.time.delayedCall(ms, resolve));
  }

  showChatWindow() {
    this.chatContainer.setAlpha(0).setVisible(true);
    this.tweens.add({
      targets: this.chatContainer,
      alpha: 1,
      duration: 600,
      onComplete: () => {
        this.showFirstBotMessage();
        this.showContinueButton();
      }
    });
  }

  showFirstBotMessage() {
    this.bottomBarContainer.setVisible(false);
    this.clearChat();
    this.addMessage("Только что чат-бот обработал 6 заявок за 60 секунд! Автоматически зарегистрированы и распределены по категориям", true);
  }

  showContinueButton() {
    this.continueBtn.setVisible(true);
  }

  hideContinueButton() {
    this.continueBtn.setVisible(false);
    this.continueBtnZone.disableInteractive();
  }

  createContinueButton() {
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3A25B4, 1);
    btnBg.fillRoundedRect(0, 0, 353, 75, 10);

    const btnText = this.add.text(353 / 2, 75 / 2, "Продолжить", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#fff'
    }).setOrigin(0.5);

    this.continueBtn = this.add.container(this.chatX + 30, this.chatY + 567, [btnBg, btnText])
      .setSize(353, 75)
      .setDepth(999)
      .setVisible(false);

    btnBg.disableInteractive();
    btnText.disableInteractive();

    this.continueBtnZone = this.add.zone(this.chatX + 30, this.chatY + 567, 353, 75)
      .setOrigin(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    this.continueBtnZone.on('pointerdown', () => {
      this.hideContinueButton();
      this.clearChat();
      this.bottomBarContainer.setVisible(true);
      this.startAutoDialog();
    });
  }

  async startAutoDialog() {
    const dialog = [
      { q: 'Какие есть тарифы?', a: 'У нас есть несколько тарифов на выбор.' },
      { q: 'Сколько стоит бот?', a: 'Стоимость зависит от выбранного тарифа.' },
      { q: 'Какой процесс подключения?', a: 'Подключение обычно занимает 1 день.' },
      { q: 'У меня есть вопросы по проекту', a: 'Перевожу вас на менеджера!' }
    ];

    for (const { q, a } of dialog) {
      this.addMessage(q, false);
      await this.delay(1200);
      this.addMessage(a, true);
      await this.delay(1500);
    }

    await this.delay(1000);

    this.clearChat();
    this.addMessage("Автоответы активированы. среднее время ответа: 2 секунды. Сложные вопросы отправлены менеджеру.", true);

    this.bottomBarContainer.setVisible(false);

    this.showSecondContinueButton();
  }

  createSecondContinueButton() {
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3A25B4, 1);
    btnBg.fillRoundedRect(0, 0, 353, 75, 10);

    const btnText = this.add.text(353 / 2, 75 / 2, "Продолжить", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#fff'
    }).setOrigin(0.5);

    this.continueBtnSecond = this.add.container(this.chatX + 30, this.chatY + 567, [btnBg, btnText])
      .setSize(353, 75)
      .setDepth(999)
      .setVisible(false);

    btnBg.disableInteractive();
    btnText.disableInteractive();

    this.continueBtnSecondZone = this.add.zone(this.chatX + 30, this.chatY + 567, 353, 75)
      .setOrigin(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.continueBtnSecondZone.on('pointerdown', () => {
      this.scene.start('Scene4');
    });
  }

  showSecondContinueButton() {
    this.continueBtnSecond.setVisible(true);
    this.continueBtnSecondZone.setVisible(true).setInteractive();
  }

  hideSecondContinueButton() {
    this.continueBtnSecond.setVisible(false);
    this.continueBtnSecondZone.disableInteractive().setVisible(false);
  }
}

window.Scene3 = Scene3;
