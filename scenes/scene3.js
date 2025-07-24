class Scene3 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene3' });
  }

  preload() {
    // Заглушки 
  }

  create() {
    const choice = this.registry.get('strategyChoice'); // 'manager' или 'bot'

    // Фон
    this.add.rectangle(400, 300, 800, 600, 0xf8f8f8);

    // Заголовок
    this.add.text(400, 50, 'Результаты вашего выбора', {
      fontFamily: 'Arial',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#222222'
    }).setOrigin(0.5);

    // Основной текст и анимация в зависимости от выбора
    if (choice === 'manager') {
      this.add.text(400, 120, 
        "Клиенты по-прежнему ждут ответа.\nОдин менеджер не спасает ситуацию.\n(Потери: –10 клиентов в неделю)",
        {
          fontFamily: 'Arial',
          fontSize: '20px',
          color: '#aa2222',
          align: 'center',
          wordWrap: { width: 700 }
        }).setOrigin(0.5);

      // Анимация довольных клиентов — мигающие синие кружки
      for (let i = 0; i < 8; i++) {
        const x = 150 + i * 70;
        const y = 350 + Math.sin(i) * 10;
        let circle = this.add.circle(x, y, 20, 0x3366cc);
        this.tweens.add({
          targets: circle,
          alpha: { from: 1, to: 0.3 },
          yoyo: true,
          repeat: -1,
          delay: i * 200,
          duration: 1000
        });
      }

      // Анимация менеджера — красный квадрат, мигающий
      let managerRect = this.add.rectangle(400, 460, 120, 120, 0xcc3333);
      this.tweens.add({
        targets: managerRect,
        alpha: { from: 1, to: 0.4 },
        yoyo: true,
        repeat: -1,
        duration: 800
      });

      // График (столбики) заявок — стагнация/падение
      this.drawChart([5, 4, 3, 2, 1, 0, 0], 500, 520, 300, 120, 0xaa2222);

    } else if (choice === 'bot') {
      this.add.text(400, 120,
        "Бот отвечает мгновенно, собирает контакты,\nнаправляет в CRM.\n(Рост: +30% воронка продаж)",
        {
          fontFamily: 'Arial',
          fontSize: '20px',
          color: '#228822',
          align: 'center',
          wordWrap: { width: 700 }
        }).setOrigin(0.5);

      // Анимация бота — зеленый квадрат с мерцанием
      let botRect = this.add.rectangle(400, 460, 120, 120, 0x22aa22);
      this.tweens.add({
        targets: botRect,
        alpha: { from: 1, to: 0.4 },
        yoyo: true,
        repeat: -1,
        duration: 800
      });

      // Анимация довольных клиентов — светло-зеленые кружки с пульсацией
      for (let i = 0; i < 8; i++) {
        const x = 150 + i * 70;
        const y = 350 + Math.cos(i) * 10;
        let circle = this.add.circle(x, y, 20, 0x66cc66);
        this.tweens.add({
          targets: circle,
          scale: { from: 1, to: 1.3 },
          yoyo: true,
          repeat: -1,
          delay: i * 150,
          duration: 800
        });
      }

      // График (столбики) заявок — рост
      this.drawChart([1, 2, 4, 6, 9, 12, 15], 500, 520, 300, 120, 0x228822);

    } else {
      this.add.text(400, 120, "Пожалуйста, сделайте выбор в предыдущем экране.", {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#888888',
      }).setOrigin(0.5);
    }

    // Таблица "До / После внедрения"
    const tableX = 150;
    const tableY = 540;

    this.add.text(tableX, tableY, 'До', { fontSize: '20px', fontStyle: 'bold', color: '#333' });
    this.add.text(tableX + 300, tableY, 'После', { fontSize: '20px', fontStyle: 'bold', color: '#333' });

    this.add.text(tableX, tableY + 30, 'Количество заявок:', { fontSize: '18px', color: '#555' });
    this.add.text(tableX + 300, tableY + 30,
      choice === 'bot' ? 'Выросло в 5 раз' : 'Без изменений',
      { fontSize: '18px', color: '#555' });

    this.add.text(tableX, tableY + 60, 'Время ответа:', { fontSize: '18px', color: '#555' });
    this.add.text(tableX + 300, tableY + 60,
      choice === 'bot' ? 'Мгновенно' : 'Долго',
      { fontSize: '18px', color: '#555' });

    this.add.text(tableX, tableY + 90, 'Клиентская база:', { fontSize: '18px', color: '#555' });
    this.add.text(tableX + 300, tableY + 90,
      choice === 'bot' ? 'Растёт' : 'Сокращается',
      { fontSize: '18px', color: '#555' });

    // Кнопка "Далее"
    const btnNext = this.add.rectangle(700, 560, 160, 50, 0x3377ff).setInteractive({ useHandCursor: true }).setStrokeStyle(2, 0x2244aa);
    this.add.text(700, 560, 'Далее', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    btnNext.on('pointerdown', () => {
      this.scene.start('Scene4');
    });

    btnNext.on('pointerover', () => btnNext.setFillStyle(0x5599ff));
    btnNext.on('pointerout', () => btnNext.setFillStyle(0x3377ff));
  }


  drawChart(data, x, y, width, height, color) {
    const maxVal = Math.max(...data);
    const barWidth = width / data.length;
    const graphics = this.add.graphics();

    // Ось Х
    graphics.lineStyle(2, 0x444444);
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + width, y);
    graphics.strokePath();

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / maxVal) * height;
      const barX = x + i * barWidth + barWidth * 0.1;
      const barY = y - barHeight;

      graphics.fillStyle(color, 1);
      graphics.fillRect(barX, barY, barWidth * 0.8, barHeight);
    }
  }
}

window.Scene3 = Scene3;

