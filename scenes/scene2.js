class Scene2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene2' });
  }

  preload() {
    this.load.image('manager_bg', 'assets/bg/scene2.png');
    this.load.image('ellipse1', 'assets/icons/ellipse1.png'); // загрузка
    this.load.image('ellipse2', 'assets/icons/ellipse2.png'); // готово
  }

  create() {
    // фон
    const bg = this.add.image(0, 0, 'manager_bg')
      .setOrigin(0, 0)
      .setDisplaySize(1440, 992);


    this.time.delayedCall(1500, () => {

      const overlay = this.add.rectangle(0, 0, 1440, 992, 0x070707, 0.8)
        .setOrigin(0, 0)
        .setAlpha(0);
      this.tweens.add({
        targets: overlay,
        alpha: 1,
        duration: 500
      });


      const msgBg1 = this.add.graphics();
      msgBg1.fillStyle(0x3A25B4, 1);
      msgBg1.fillRoundedRect(0, 0, 357, 95, 20);
      msgBg1.generateTexture('msg_bg1', 357, 95);
      msgBg1.destroy();

      const msg = this.add.image(542, 100, 'msg_bg1').setOrigin(0, 0).setAlpha(0);
      const msgText = this.add.text(542 + 357 / 2, 100 + 95 / 2, "Установка Чат-Бота", {
        fontFamily: 'Roboto',
        fontSize: '30px',
        fontWeight: '400',
        color: '#FFFFFF'
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: [msg, msgText],
        alpha: 1,
        duration: 400,
        delay: 200
      });


      const loader = this.add.image(720, 496, 'ellipse1')
        .setDisplaySize(200, 200)
        .setOrigin(0.5)
        .setAlpha(0);

      this.tweens.add({
        targets: loader,
        alpha: 1,
        duration: 400,
        delay: 200
      });

      // вращение загрузки
      this.tweens.add({
        targets: loader,
        angle: 360,
        duration: 2500,
        repeat: 0,
        ease: 'Linear'
      });

      // финальный экран
      this.time.delayedCall(2500, () => {
        this.tweens.add({
          targets: [msg, msgText, loader],
          alpha: 0,
          duration: 300,
          onComplete: () => {

            const msgBg2 = this.add.graphics();
            msgBg2.fillStyle(0xFFFFFF, 0.7);
            msgBg2.fillRoundedRect(0, 0, 357, 95, 20);
            msgBg2.generateTexture('msg_bg2', 357, 95);
            msgBg2.destroy();

            msg.setTexture('msg_bg2');
            msg.setAlpha(0);

            msgText.setText("Чат-Бот активирован");
            msgText.setColor('#000000');
            msgText.setAlpha(0);

            loader.setTexture('ellipse2');
            loader.setAngle(0);
            loader.setAlpha(0);

            this.tweens.add({
              targets: [msg, msgText, loader],
              alpha: 1,
              duration: 400
            });

            // кнопка
            const btnBg = this.add.graphics();
            btnBg.fillStyle(0x3A25B4, 1);
            btnBg.fillRoundedRect(0, 0, 357, 95, 20);
            btnBg.generateTexture('btn_bg_continue', 357, 95);
            btnBg.destroy();

            const btn = this.add.image(542, 746, 'btn_bg_continue')
              .setOrigin(0, 0)
              .setAlpha(0)
              .setInteractive({ useHandCursor: true })
              .on('pointerdown', () => {
                this.scene.start('Scene3');
              });

            const btnText = this.add.text(542 + 357 / 2, 746 + 95 / 2, "Продолжить", {
              fontFamily: 'Roboto',
              fontSize: '30px',
              fontWeight: '400',
              color: '#FFFFFF'
            }).setOrigin(0.5).setAlpha(0);


            this.tweens.add({
              targets: [btn, btnText],
              alpha: 1,
              duration: 400,
              delay: 200
              // пульсация убрана
            });
          }
        });
      });
    });
  }
}

window.Scene2 = Scene2;
