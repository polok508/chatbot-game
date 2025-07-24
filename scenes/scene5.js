class Scene5 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene5' });
    this.leadForm = new window.LeadForm();
  }

  create() {
    // Фон
    this.add.rectangle(400, 300, 800, 600, 0xd4f1c5);

    // Заголовок
    this.add.text(400, 80, "Поздравляем!", {
      fontFamily: 'Arial',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#2a6b2a'
    }).setOrigin(0.5);

    // Основной текст
    const mainText = `Благодаря чат-боту вы:\n\n` +
      `• Увеличили продажи\n` +
      `• Снизили нагрузку на персонал\n` +
      `• Автоматизировали воронку`;

    this.add.text(400, 220, mainText, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#2a6b2a',
      align: 'center',
      lineSpacing: 10,
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    // Радостный владелец (жёлтый круг)
    const ownerX = 250;
    const ownerY = 420;
    this.add.circle(ownerX, ownerY, 70, 0xffe066);
    this.add.circle(ownerX - 25, ownerY - 15, 12, 0x000000);
    this.add.circle(ownerX + 25, ownerY - 15, 12, 0x000000);
    this.add.arc(ownerX, ownerY + 15, 40, 0, Math.PI, false).setStrokeStyle(5, 0x000000);

    // Клиенты — три зелёных круга
    const clientsXStart = 520;
    const clientsY = 420;
    for (let i = 0; i < 3; i++) {
      const cx = clientsXStart + i * 100;
      this.add.circle(cx, clientsY, 50, 0x88cc88);
      this.add.circle(cx - 15, clientsY - 10, 8, 0x000000);
      this.add.circle(cx + 15, clientsY - 10, 8, 0x000000);
      this.add.arc(cx, clientsY + 10, 30, 0, Math.PI, false).setStrokeStyle(4, 0x000000);
    }

    // Кнопка "Заказать такого бота для себя"
    const btn = this.add.rectangle(400, 530, 400, 60, 0x2a6b2a)
      .setStrokeStyle(3, 0x195219)
      .setInteractive({ useHandCursor: true });

    this.add.text(400, 530, "Заказать такого бота для себя", {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#fff',
      fontStyle: 'bold'
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

