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
    // проверка ориентации
    if (window.innerHeight > window.innerWidth) {
      this.showRotateMessage();
      this.scene.pause();
    }

    window.addEventListener('resize', () => {
      if (window.innerHeight > window.innerWidth) {
        this.scene.pause();
        this.showRotateMessage();
      } else {
        this.scene.resume();
        this.hideRotateMessage();
      }
    });

    this.rotateOverlay = null;
    this.rotateText = null;

    // фон
    this.add.image(0, 0, 'bg_office')
      .setOrigin(0, 0)
      .setDisplaySize(1440, 992);

    // заголовок
    const titleBgGfx = this.add.graphics();
    titleBgGfx.fillStyle(0xffffff, 0.7);
    titleBgGfx.fillRoundedRect(0, 0, 1300, 87, 10);
    titleBgGfx.generateTexture('title_bg', 1300, 87);
    titleBgGfx.destroy();

    const titleBg = this.add.image((1440 - 1300) / 2, 100, 'title_bg')
      .setOrigin(0, 0)
      .setAlpha(0);
    const titleText = this.add.text(255, 120, "Бизнес растёт, но заявки становятся проблемой?", {
      fontFamily: 'Roboto',
      fontSize: '40px',
      fontWeight: '400',
      color: '#000000',
      wordWrap: { width: 935 }
    }).setAlpha(0);

    this.tweens.add({ targets: [titleBg, titleText], alpha: 1, duration: 500, delay: 200 });

    // линии
    const linesData = [
      { key: 'vector1', x: 169.87, y: 262.93, w: 233.48, h: 97.10, delay: 1200 },
      { key: 'vector2', x: 721.55, y: 374.16, w: 225.30, h: 94.92, delay: 2200 },
      { key: 'vector3', x: 406.13, y: 478.05, w: 213.83, h: 107.56, delay: 3200 },
    ];

    linesData.forEach(({ key, x, y, w, h, delay }) => {
      const line = this.add.image(x, y, key)
        .setOrigin(0, 0)
        .setDisplaySize(w, h)
        .setDepth(2)
        .setAlpha(0.9);

      const shadow = this.add.image(x + 3, y + 3, key)
        .setOrigin(0, 0)
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
    });

    // сообщения
    const messages = [
      { x: 270, y: 227, w: 378, h: 75, text: "Теряете клиентов из-за:", tw: 338, delay: 1800 },
      { x: 400, y: 342, w: 319, h: 75, text: "Очередей в ответах", tw: 279, delay: 2800 },
      { x: 510, y: 457, w: 330, h: 75, text: "Хаоса в сообщениях", tw: 290, delay: 3800 },
      { x: 626, y: 572, w: 362, h: 75, text: "Пропущенных заказов", tw: 322, delay: 4800 },
    ];

    messages.forEach(({ x, y, w, h, text, tw, delay }) => {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.7);
      g.fillRoundedRect(0, 0, w, h, 10);
      g.generateTexture(`msg_bg_${x}_${y}`, w, h);
      g.destroy();

      const bg = this.add.image(x, y, `msg_bg_${x}_${y}`).setOrigin(0, 0).setAlpha(0);
      const txt = this.add.text(x + 20, y + 20, text, {
        fontFamily: 'Roboto',
        fontSize: '30px',
        fontWeight: '400',
        color: '#000000',
        wordWrap: { width: tw }
      }).setOrigin(0, 0).setAlpha(0);

      this.tweens.add({ targets: [bg, txt], alpha: 1, duration: 400, delay });
    });

    // кнопки
    this.time.delayedCall(5300, () => {
      this.createButtonContainer(
        290, 739,
        "дорого и долго", 211, 48, 0x0F0F0F, 0.5,
        "Нанять менеджера", 331, 95,
        () => { this.showManagerPopup(); }
      );

      this.createButtonContainer(
        840, 739,
        "справится уже сегодня", 301, 48, 0x0F0F0F, 0.5,
        "Установить Чат-Бота", 357, 95,
        () => { this.scene.start('Scene2'); }
      );
    });
  }

  createButtonContainer(x, y, topText, topBgWidth, topBgHeight, topBgColor, topBgAlpha, btnText, btnWidth, btnHeight, onClick) {
    const topBg = this.add.graphics();
    topBg.fillStyle(topBgColor, topBgAlpha);
    topBg.fillRoundedRect(0, 0, topBgWidth, topBgHeight, topBgHeight / 2);
    topBg.generateTexture(`top_bg_${x}_${y}`, topBgWidth, topBgHeight);
    topBg.destroy();

    const topBgImage = this.add.image(x + (btnWidth - topBgWidth) / 2, y, `top_bg_${x}_${y}`)
      .setOrigin(0, 0)
      .setDepth(3)
      .setAlpha(0);

    const topTxt = this.add.text(topBgImage.x + topBgWidth / 2, topBgImage.y + topBgHeight / 2, topText, {
      fontFamily: 'Roboto',
      fontSize: '24px',
      fontWeight: '400',
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5).setDepth(4).setAlpha(0);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3A25B4, 1);
    btnBg.fillRoundedRect(0, 0, btnWidth, btnHeight, 20);
    btnBg.generateTexture(`btn_bg_${x}_${y}`, btnWidth, btnHeight);
    btnBg.destroy();

    const btnImage = this.add.image(x, y + topBgHeight + 10, `btn_bg_${x}_${y}`)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', onClick)
      .setDepth(3)
      .setAlpha(0);

    const btnTxt = this.add.text(btnImage.x + btnWidth / 2, btnImage.y + btnHeight / 2, btnText, {
      fontFamily: 'Roboto',
      fontSize: '30px',
      fontWeight: '400',
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5).setDepth(4).setAlpha(0);

    this.tweens.add({ targets: [topBgImage, topTxt, btnImage, btnTxt], alpha: 1, duration: 500 });
  }

  showManagerPopup() {
    const overlay = this.add.rectangle(720, 496, 1440, 992, 0x000000, 0.6).setOrigin(0.5).setDepth(10);

    const popupWidth = 600;
    const popupHeight = 250;
    const popupX = 720;
    const popupY = 496;

    const popupBg = this.add.graphics().setDepth(11);
    popupBg.fillStyle(0x8b0000, 0.95);
    popupBg.fillRoundedRect(popupX - popupWidth / 2, popupY - popupHeight / 2, popupWidth, popupHeight, 20);

    const popupText = this.add.text(popupX, popupY,
      "Хаос продолжается!\nКлиенты по-прежнему ждут ответа.\nОдин менеджер не спасает ситуацию.\n(Потери: -10 клиентов в неделю)",
      {
        fontFamily: 'Roboto',
        fontSize: '22px',
        fontWeight: '400',
        color: '#ff6666',
        align: 'center',
        lineSpacing: 8,
        wordWrap: { width: popupWidth - 60 }
      }).setOrigin(0.5).setDepth(12);

    const closeBtnSize = 36;
    const closeBtnBg = this.add.circle(popupX + popupWidth / 2 - closeBtnSize, popupY - popupHeight / 2 + closeBtnSize, closeBtnSize / 2, 0xff4c4c)
      .setDepth(13)
      .setInteractive({ useHandCursor: true });

    const closeBtnText = this.add.text(closeBtnBg.x, closeBtnBg.y, '×', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5).setDepth(14);

    closeBtnBg.on('pointerdown', () => {
      overlay.destroy();
      popupBg.destroy();
      popupText.destroy();
      closeBtnBg.destroy();
      closeBtnText.destroy();
    });
  }

  showRotateMessage() {
    if (this.rotateOverlay) return;

    this.rotateOverlay = this.add.rectangle(720, 496, 1440, 992, 0x000000, 0.8).setDepth(100);

    this.rotateText = this.add.text(720, 496, 'Поверните экран горизонтально\nдля начала игры', {
      fontFamily: 'Roboto',
      fontSize: '36px',
      fontWeight: '400',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 1000 }
    }).setOrigin(0.5).setDepth(101);
  }

  hideRotateMessage() {
    if (this.rotateOverlay) {
      this.rotateOverlay.destroy();
      this.rotateOverlay = null;
    }

    if (this.rotateText) {
      this.rotateText.destroy();
      this.rotateText = null;
    }
  }
}

window.Scene1 = Scene1;
