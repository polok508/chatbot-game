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


    this.headerBg = this.add.graphics();
    this.headerBg.fillStyle(0x000000, 0.5);
    this.headerBg.fillRoundedRect(403, 100, 635, 87, 10);

    this.headerText = this.add.text(403 + 635 / 2, 100 + 87 / 2, "Хотите такого же бота?", {
      fontFamily: 'Roboto',
      fontSize: '40px',
      color: '#FFFFFF',
      fontWeight: '400',
      align: 'center',
      wordWrap: { width: 438 }
    }).setOrigin(0.5);

    // Кнопка
    const buttonWidth = 350;
    const buttonHeight = 90;
    const buttonX = width / 2;
    const buttonY = height / 2 + 150;

    this.buttonContainer = this.add.container(buttonX, buttonY);

    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x3A25B4, 1);
    buttonBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 20);

    const buttonText = this.add.text(0, 0, 'Оставить заявку', {
      fontFamily: 'Roboto',
      fontSize: '32px',
      fontWeight: '400',
      color: '#FFFFFF',
      align: 'center',
    }).setOrigin(0.5);

    this.buttonContainer.add([buttonBg, buttonText]);
    this.buttonContainer.setSize(buttonWidth, buttonHeight);
    this.buttonContainer.setInteractive({ useHandCursor: true });

    this.buttonContainer.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x2e1c87, 1);
      buttonBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 20);
    });

    this.buttonContainer.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x3A25B4, 1);
      buttonBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 20);
    });

    this.buttonContainer.on('pointerdown', () => {
      this.leadForm.show();
      this.hideHeader();
    });

    this.leadForm.create();


    const originalShow = this.leadForm.show.bind(this.leadForm);
    const originalHide = this.leadForm.hide.bind(this.leadForm);

    this.leadForm.show = () => {
      originalShow();
      this.hideHeader();
    };

    this.leadForm.hide = () => {
      originalHide();
      this.showHeader();
    };

    this.leadForm.hide();
  }

  hideHeader() {
    this.headerBg.setVisible(false);
    this.headerText.setVisible(false);
  }

  showHeader() {
    this.headerBg.setVisible(true);
    this.headerText.setVisible(true);
  }
}

window.Scene5 = Scene5;
