class Scene5 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene5' });
    this.leadForm = new window.LeadForm();
  }

  preload() {
    // Фон
    this.load.image('office3', 'assets/bg/office3.png');
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;


    this.add.image(centerX, centerY, 'office3')
      .setDisplaySize(this.scale.width, this.scale.height)
      .setOrigin(0.5);


    const rectWidth = this.scale.width * 0.8;
    const rectHeight = 100;
    const rectY = 150;

    const bgRect = this.add.rectangle(centerX, rectY, rectWidth, rectHeight, 0x2a6b2a, 0.6)
      .setOrigin(0.5);

    // Заголовок поверх полупрозрачного фона
    this.add.text(centerX, rectY, 'Хотите такого же Бота?', {
      fontFamily: 'Arial',
      fontSize: '40px',
      fontWeight: '700',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: rectWidth * 0.9 }
    }).setOrigin(0.5);

    // Кнопка "Оставить заявку"
    const btnWidth = 350;
    const btnHeight = 70;
    const btnY = centerY + 50;

    const btn = this.add.rectangle(centerX, btnY, btnWidth, btnHeight, 0x2a6b2a)
      .setStrokeStyle(3, 0x195219)
      .setInteractive({ useHandCursor: true });

    this.add.text(centerX, btnY, 'Оставить заявку', {
      fontFamily: 'Arial',
      fontSize: '28px',
      fontWeight: '700',
      color: '#ffffff'
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setFillStyle(0x3e8e3e));
    btn.on('pointerout', () => btn.setFillStyle(0x2a6b2a));
    btn.on('pointerdown', () => {
      this.leadForm.create();
      this.leadForm.show();
    });
  }

  shutdown() {
    this.leadForm.destroy();
  }

  destroy() {
    this.shutdown();
  }
}

window.Scene5 = Scene5;


