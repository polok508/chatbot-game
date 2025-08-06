class Scene5 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene5' });
    this.leadForm = new window.LeadForm();
  }

  preload() {
    this.load.image('bg_office5', 'assets/bg/scene5.png');
  }

  create() {
    const { width, height } = this.scale;


    this.add.image(width / 2, height / 2, 'bg_office5').setDisplaySize(width, height);

    // заголовок
    const headerBg = this.add.graphics();
    headerBg.fillStyle(0x000000, 0.5);
    headerBg.fillRoundedRect(403, 100, 635, 87, 10);
    this.add.text(403 + 635 / 2, 100 + 87 / 2, "Хотите такого же бота?", {
      fontFamily: 'Roboto',
      fontSize: '40px',
      color: '#FFFFFF',
      fontWeight: '400',
      align: 'center',
      wordWrap: { width: 438 }
    }).setOrigin(0.5);

    // форма
    this.leadForm.create();
  }
}

window.Scene5 = Scene5;
