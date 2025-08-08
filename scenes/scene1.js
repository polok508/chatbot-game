class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene1' });
  }

  preload() {
    this.load.image('bg_office', 'assets/bg/scene1.png');
    this.load.image('vector1', 'assets/icons/vector1.png');
    this.load.image('vector2', 'assets/icons/vector2.png');
    this.load.image('vector3', 'assets/icons/vector3.png');
  }

  create() {
    this.createSceneElements();
    this.scale.on('resize', this.onResize, this);
  }

  createSceneElements() {
    // Удаляем предыдущие объекты, если есть
    if (this.bg) this.bg.destroy();
    if (this.titleBg) this.titleBg.destroy();
    if (this.titleText) this.titleText.destroy();
    if (this.linesGroup) this.linesGroup.clear(true, true);
    if (this.messagesGroup) this.messagesGroup.clear(true, true);
    if (this.buttonsGroup) this.buttonsGroup.clear(true, true);
    if (this.managerPopupGroup) this.managerPopupGroup?.clear(true, true);

    // Фон
    this.bg = this.add.image(0, 0, 'bg_office').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);

    // Заголовок
    const titleWidth = this.scale.width * 0.9; // около 1300 на 1440
    const titleHeight = this.scale.height * 0.088; // 87 на 992
    const titleX = (this.scale.width - titleWidth) / 2;
    const titleY = this.scale.height * 0.10;

    // Создаем графику под заголовок
    const gfx = this.add.graphics();
    gfx.fillStyle(0xffffff, 0.7);
    gfx.fillRoundedRect(0, 0, titleWidth, titleHeight, 10);
    gfx.generateTexture('title_bg', titleWidth, titleHeight);
    gfx.destroy();

    this.titleBg = this.add.image(titleX, titleY, 'title_bg').setOrigin(0).setAlpha(0);
    this.titleText = this.add.text(titleX + titleWidth * 0.2, titleY + titleHeight * 0.3,
      "Бизнес растёт, но заявки становятся проблемой?", {
        fontFamily: 'Roboto',
        fontSize: `${Math.round(this.scale.height * 0.04)}px`,
        fontWeight: '400',
        color: '#000000',
        wordWrap: { width: titleWidth * 0.7 }
      }).setAlpha(0);

    this.tweens.add({ targets: [this.titleBg, this.titleText], alpha: 1, duration: 500, delay: 200 });

    // Линии
    const linesData = [
      { key: 'vector1', xRatio: 169.87 / 1440, yRatio: 262.93 / 992, wRatio: 233.48 / 1440, hRatio: 97.10 / 992, delay: 1200 },
      { key: 'vector2', xRatio: 721.55 / 1440, yRatio: 374.16 / 992, wRatio: 225.30 / 1440, hRatio: 94.92 / 992, delay: 2200 },
      { key: 'vector3', xRatio: 406.13 / 1440, yRatio: 478.05 / 992, wRatio: 213.83 / 1440, hRatio: 107.56 / 992, delay: 3200 },
    ];

    this.linesGroup = this.add.group();

    linesData.forEach(({ key, xRatio, yRatio, wRatio, hRatio, delay }) => {
      const x = this.scale.width * xRatio;
      const y = this.scale.height * yRatio;
      const w = this.scale.width * wRatio;
      const h = this.scale.height * hRatio;

      const line = this.add.image(x, y, key).setOrigin(0).setDisplaySize(w, h).setDepth(2).setAlpha(0.9);
      const shadow = this.add.image(x + (3 * this.scale.width / 1440), y + (3 * this.scale.height / 992), key)
        .setOrigin(0)
        .setDisplaySize(w, h)
        .setTint(0x000000)
        .setAlpha(0.3)
        .setDepth(1);

      const shape = this.make.graphics();
      shape.fillRect(x, y, 0, h);
      const mask = shape.createGeometryMask();

      line.setMask(mask);
      shadow.setMask(mask);

      this.tweens.add({
        targets: shape,
        props: {
          scaleX: { from: 0, to: 1 },
        },
        duration: 700,
        delay,
        ease: 'Power1',
        onUpdate: () => {
          shape.clear();
          shape.fillStyle(0xffffff);
          shape.fillRect(x, y, w * shape.scaleX, h);
        }
      });

      this.linesGroup.addMultiple([line, shadow]);
    });

    // Сообщения
    const messagesData = [
      { xRatio: 270 / 1440, yRatio: 227 / 992, wRatio: 378 / 1440, hRatio: 75 / 992, text: "Теряете клиентов из-за:", twRatio: 338 / 1440, delay: 1800 },
      { xRatio: 400 / 1440, yRatio: 342 / 992, wRatio: 319 / 1440, hRatio: 75 / 992, text: "Очередей в ответах", twRatio: 279 / 1440, delay: 2800 },
      { xRatio: 510 / 1440, yRatio: 457 / 992, wRatio: 330 / 1440, hRatio: 75 / 992, text: "Хаоса в сообщениях", twRatio: 290 / 1440, delay: 3800 },
      { xRatio: 626 / 1440, yRatio: 572 / 992, wRatio: 362 / 1440, hRatio: 75 / 992, text: "Пропущенных заказов", twRatio: 322 / 1440, delay: 4800 },
    ];

    this.messagesGroup = this.add.group();

    messagesData.forEach(({ xRatio, yRatio, wRatio, hRatio, text, twRatio, delay }) => {
      const x = this.scale.width * xRatio;
      const y = this.scale.height * yRatio;
      const w = this.scale.width * wRatio;
      const h = this.scale.height * hRatio;
      const tw = this.scale.width * twRatio;

      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.7);
      g.fillRoundedRect(0, 0, w, h, 10);
      g.generateTexture(`msg_bg_${Math.round(x)}_${Math.round(y)}`, w, h);
      g.destroy();

      const bg = this.add.image(x, y, `msg_bg_${Math.round(x)}_${Math.round(y)}`).setOrigin(0).setAlpha(0);
      const txt = this.add.text(x + w * 0.05, y + h * 0.26, text, {
        fontFamily: 'Roboto',
        fontSize: `${Math.round(this.scale.height * 0.03)}px`,
        fontWeight: '400',
        color: '#000000',
        wordWrap: { width: tw }
      }).setOrigin(0, 0).setAlpha(0);

      this.tweens.add({ targets: [bg, txt], alpha: 1, duration: 400, delay });

      this.messagesGroup.addMultiple([bg, txt]);
    });

    // Кнопки
    this.buttonsGroup = this.add.group();

    this.time.delayedCall(5300, () => {
      this.createButtonContainer(
        this.scale.width * (290 / 1440), this.scale.height * (739 / 992),
        "дорого и долго", 211 * (this.scale.width / 1440), 48 * (this.scale.height / 992), 0x0F0F0F, 0.5,
        "Нанять менеджера", 331 * (this.scale.width / 1440), 95 * (this.scale.height / 992),
        () => { this.showManagerPopup(); }
      );

      this.createButtonContainer(
        this.scale.width * (840 / 1440), this.scale.height * (739 / 992),
        "справится уже сегодня", 301 * (this.scale.width / 1440), 48 * (this.scale.height / 992), 0x0F0F0F, 0.5,
        "Установить Чат-Бота", 357 * (this.scale.width / 1440), 95 * (this.scale.height / 992),
        () => { this.scene.start('Scene2'); }
      );
    });
  }

  createButtonContainer(x, y, topText, topBgWidth, topBgHeight, topBgColor, topBgAlpha, btnText, btnWidth, btnHeight, onClick) {
    const topBg = this.add.graphics();
    topBg.fillStyle(topBgColor, topBgAlpha);
    topBg.fillRoundedRect(0, 0, topBgWidth, topBgHeight, topBgHeight / 2);
    topBg.generateTexture(`top_bg_${Math.round(x)}_${Math.round(y)}`, topBgWidth, topBgHeight);
    topBg.destroy();

    const topBgImage = this.add.image(x + (btnWidth - topBgWidth) / 2, y, `top_bg_${Math.round(x)}_${Math.round(y)}`)
      .setOrigin(0, 0)
      .setDepth(3)
      .setAlpha(0);

    const topTxt = this.add.text(topBgImage.x + topBgWidth / 2, topBgImage.y + topBgHeight / 2, topText, {
      fontFamily: 'Roboto',
      fontSize: `${Math.round(this.scale.height * 0.017)}px`,
      fontWeight: '400',
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5).setDepth(4).setAlpha(0);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3A25B4, 1);
    btnBg.fillRoundedRect(0, 0, btnWidth, btnHeight, 20);
    btnBg.generateTexture(`btn_bg_${Math.round(x)}_${Math.round(y)}`, btnWidth, btnHeight);
    btnBg.destroy();

    const btnImage = this.add.image(x, y + topBgHeight + 10, `btn_bg_${Math.round(x)}_${Math.round(y)}`)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', onClick)
      .setDepth(3)
      .setAlpha(0);

    const btnTxt = this.add.text(btnImage.x + btnWidth / 2, btnImage.y + btnHeight / 2, btnText, {
      fontFamily: 'Roboto',
      fontSize: `${Math.round(this.scale.height * 0.03)}px`,
      fontWeight: '400',
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5).setDepth(4).setAlpha(0);

    this.tweens.add({ targets: [topBgImage, topTxt, btnImage, btnTxt], alpha: 1, duration: 500 });

    this.buttonsGroup.addMultiple([topBgImage, topTxt, btnImage, btnTxt]);
  }

  showManagerPopup() {
    // Удаляем, если уже есть
    if (this.managerPopupGroup) {
      this.managerPopupGroup.clear(true, true);
    }

    this.managerPopupGroup = this.add.group();

    const overlay = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0.5).setDepth(10);

    const popupWidth = this.scale.width * 0.42; // около 600 на 1440
    const popupHeight = this.scale.height * 0.25; // около 250 на 992
    const popupX = this.scale.width / 2;
    const popupY = this.scale.height / 2;

    const popupBg = this.add.graphics().setDepth(11);
    popupBg.fillStyle(0x8b0000, 0.95);
    popupBg.fillRoundedRect(popupX - popupWidth / 2, popupY - popupHeight / 2, popupWidth, popupHeight, 20);

    const popupText = this.add.text(popupX, popupY,
      "Хаос продолжается!\nКлиенты по-прежнему ждут ответа.\nОдин менеджер не спасает ситуацию.\n(Потери: -10 клиентов в неделю)",
      {
        fontFamily: 'Roboto',
        fontSize: `${Math.round(this.scale.height * 0.022)}px`,
        fontWeight: '400',
        color: '#ff6666',
        align: 'center',
        lineSpacing: 8,
        wordWrap: { width: popupWidth - 60 }
      }).setOrigin(0.5).setDepth(12);

    const closeBtnSize = this.scale.height * 0.036;
    const closeBtnBg = this.add.circle(popupX + popupWidth / 2 - closeBtnSize, popupY - popupHeight / 2 + closeBtnSize, closeBtnSize / 2, 0xff4c4c)
      .setDepth(13)
      .setInteractive({ useHandCursor: true });

    const closeBtnText = this.add.text(closeBtnBg.x, closeBtnBg.y, '×', {
      fontFamily: 'Arial',
      fontSize: closeBtnSize * 0.8,
      color: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5).setDepth(14);

    closeBtnBg.on('pointerdown', () => {
      this.managerPopupGroup.clear(true, true);
    });

    this.managerPopupGroup.addMultiple([overlay, popupBg, popupText, closeBtnBg, closeBtnText]);
  }
}

window.Scene1 = Scene1;
