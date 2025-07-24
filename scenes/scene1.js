class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene1' });
  }

  preload() {
    // Фон офиса
    this.load.image('bg_office', 'assets/bg/office.png');
  }

  create() {

    this.add.image(400, 300, 'bg_office').setDisplaySize(800, 600);


    const bgText = this.add.rectangle(400, 100, 620, 120, 0x000000, 0.5);
    bgText.setOrigin(0.5);

    // Текст
    const textContent = 
      "Ваш бизнес растёт, но вы не справляетесь с заявками.\n\n" +
      "Круглосуточно поступают вопросы, менеджеры не успевают — клиенты уходят.";

    this.add.text(400, 100, textContent, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    // Кнопка "Продолжить"
    const btn = this.add.rectangle(400, 500, 180, 60, 0x3377ff).setInteractive({ useHandCursor: true }).setStrokeStyle(2, 0x2244aa);
    this.add.text(400, 500, "Продолжить", {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    btn.on('pointerdown', () => {
        this.scene.start('Scene2');
    });

    btn.on('pointerover', () => btn.setFillStyle(0x5599ff));
    btn.on('pointerout', () => btn.setFillStyle(0x3377ff));
  }
}

window.Scene1 = Scene1;


