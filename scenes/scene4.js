class Scene4 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene4' });
  }

  preload() {
    this.load.image('bg_office4', 'assets/bg/scene4.png');
    this.load.image('bot2', 'assets/icons/bot2.png');
    this.load.image('team', 'assets/icons/team.png');
  }

  create() {
    const { width, height } = this.scale;

    // фон сцены
    this.add.image(width / 2, height / 2, 'bg_office4').setDisplaySize(width, height);

    // левый полупрозрачный блок
    const bgPanelLeft = this.add.graphics();
    bgPanelLeft.fillStyle(0xE0E0E0, 0.85);
    bgPanelLeft.fillRoundedRect(70, 331, 635, 330, 20);


    this.add.image(70 + 16.88 + 45, 331 + 5.63 + 45, 'bot2')
      .setOrigin(0.5)
      .setDisplaySize(90, 90);


    this.add.text(70 + 120, 331 + 20, "Чат-бот автоматизирует рутину:", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);


    this.add.text(70 + 120, 331 + 70, "Отвечает на вопросы 24/7", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);


    this.add.text(70 + 120, 331 + 110, "Собирает и систематизирует", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);

    this.add.text(70 + 120, 331 + 150, "заявки", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);


    this.add.text(70 + 120, 331 + 190, "Фильтрует спам и первичные", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);

    this.add.text(70 + 120, 331 + 230, "запросы", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);

    // правый полупрозрачный блок
    const bgPanelRight = this.add.graphics();
    bgPanelRight.fillStyle(0xE0E0E0, 0.85);
    bgPanelRight.fillRoundedRect(735, 331, 635, 330, 20);


    this.add.image(735 + 16.88 + 45, 331 + 5.63 + 45, 'team')
      .setOrigin(0.5)
      .setDisplaySize(90, 90);


    this.add.text(735 + 120, 331 + 20, "Ваша команда фокусируется", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);


    this.add.text(735 + 120, 331 + 70, "на том, что приносит деньги:", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);


    this.add.text(735 + 120, 331 + 120, "Закрытие сделок", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);


    this.add.text(735 + 120, 331 + 160, "Работа с лояльными", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);

    this.add.text(735 + 120, 331 + 200, "клиентами", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);

    this.add.text(735 + 120, 331 + 240, "Без шаблонных ответов", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#000000',
      fontWeight: '400'
    }).setOrigin(0, 0);

    // кнопка продолжить
    const btnX = 1068;
    const btnY = 847;
    const btnWidth = 302;
    const btnHeight = 75;
    const btnRadius = 20;

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x3A25B4, 1);
    btnBg.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, btnRadius);
    btnBg.setInteractive(new Phaser.Geom.Rectangle(btnX, btnY, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        this.scene.start('Scene5');
      });

    const btnText = this.add.text(btnX + btnWidth / 2, btnY + btnHeight / 2, "Продолжить", {
      fontFamily: 'Roboto',
      fontSize: '30px',
      color: '#FFFFFF',
      fontWeight: '400'
    }).setOrigin(0.5, 0.5);
  }
}

window.Scene4 = Scene4;
