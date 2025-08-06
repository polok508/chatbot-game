class LeadForm {
  constructor() {
    this.container = null;
    this.isSubmitting = false;
  }

  create() {
    if (document.getElementById('lead-form-container')) return;

    const container = document.createElement('div');
    container.id = 'lead-form-container';

    Object.assign(container.style, {
      position: 'absolute',
      top: '200px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '400px',           // фиксированная ширина по умолчанию
      maxHeight: '80vh',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(30px)',
      borderRadius: '20px',
      padding: '30px 25px',
      boxSizing: 'border-box',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      fontFamily: 'Roboto, Arial, sans-serif',
      color: '#2a6b2a',
      overflowY: 'auto',
      overflowX: 'hidden',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    });

    container.innerHTML = `
      <style>
        #lead-form-container {
          box-sizing: border-box;
          padding: 0;
        }
        @media (max-width: 480px) {
          #lead-form-container {
            width: 320px !important; /* сужаем ширину на узких экранах */
          }
        }
        #lead-form-container h2 {
          font-family: 'Roboto', sans-serif;
          font-weight: 400;
          font-size: 36px;
          color: #000000;
          margin: 0 0 30px 0;
          text-align: center;
          user-select: none;
        }
        #lead-form-container input {
          width: 100%;
          height: 50px;
          border-radius: 15px;
          border: 1px solid #ccc;
          padding: 12px 20px;
          font-size: 16px;
          margin-bottom: 20px;
          box-sizing: border-box;
          font-family: 'Roboto', Arial, sans-serif;
          color: #000000;
        }
        #lead-form-container button {
          width: 100%;
          height: 60px;
          border-radius: 15px;
          border: none;
          background-color: #3A25B4;
          color: #FFFFFF;
          font-weight: 400;
          font-size: 26px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          user-select: none;
        }
        #lead-form-container button:hover {
          background-color: #2e1c87;
        }
        #lead-form-container #lead-message {
          margin-top: 20px;
          text-align: center;
          font-size: 16px;
          min-height: 24px;
          user-select: none;
        }
      </style>

      <h2>Оставьте заявку</h2>

      <input type="text" id="lead-name" placeholder="Имя" required />
      <input type="tel" id="lead-phone" placeholder="Телефон" required />
      <input type="email" id="lead-email" placeholder="E-mail" required />

      <button id="lead-submit">Отправить</button>
      <div id="lead-message"></div>
    `;

    document.body.appendChild(container);
    this.container = container;

    const submitButton = this.container.querySelector('#lead-submit');
    submitButton.addEventListener('click', () => this.submit());
  }

  sanitizeInput(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  async submit() {
    if (this.isSubmitting) return;

    const messageBox = this.container.querySelector('#lead-message');

    let name = this.container.querySelector('#lead-name').value.trim();
    let phone = this.container.querySelector('#lead-phone').value.trim();
    let email = this.container.querySelector('#lead-email').value.trim();

    // Очистка от HTML/JS
    name = this.sanitizeInput(name);
    phone = this.sanitizeInput(phone);
    email = this.sanitizeInput(email);

    if (!name || !phone || !email) {
      messageBox.style.color = 'red';
      messageBox.textContent = 'Пожалуйста, заполните все поля.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      messageBox.style.color = 'red';
      messageBox.textContent = 'Введите корректный email.';
      return;
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
    if (!phoneRegex.test(phone)) {
      messageBox.style.color = 'red';
      messageBox.textContent = 'Введите корректный телефон.';
      return;
    }

    const botToken = window.AppConfig?.BOT_TOKEN;
    const chatId = window.AppConfig?.CHAT_ID;

    if (!botToken || !chatId) {
      console.error('BOT_TOKEN или CHAT_ID не определены');
      messageBox.style.color = 'red';
      messageBox.textContent = 'Ошибка конфигурации. Обратитесь к администратору.';
      return;
    }

    this.isSubmitting = true;
    messageBox.style.color = '#2a6b2a';
    messageBox.textContent = '⏳ Отправка...';

    const text = `🧾 Новая заявка с игры:\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email}`;

    try {
      const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
      });

      const tgData = await tgResponse.json();
      if (!tgData.ok) throw new Error('Ошибка Telegram API');

      messageBox.style.color = 'green';
      messageBox.textContent = '✅ Спасибо! Ваша заявка отправлена.';
      this.clearFields();
    } catch (error) {
      console.error('Ошибка отправки:', error);
      messageBox.style.color = 'red';
      messageBox.textContent = '❌ Ошибка при отправке. Попробуйте позже.';
    } finally {
      this.isSubmitting = false;
    }
  }

  show() {
    if (this.container) this.container.style.display = 'flex';
  }

  hide() {
    if (this.container) this.container.style.display = 'none';
  }

  clearFields() {
    this.container.querySelector('#lead-name').value = '';
    this.container.querySelector('#lead-phone').value = '';
    this.container.querySelector('#lead-email').value = '';
  }

  destroy() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

window.LeadForm = LeadForm;
