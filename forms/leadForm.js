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
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90vw',
      maxWidth: '400px',
      background: '#ffffffee',
      borderRadius: '10px',
      padding: '20px',
      boxSizing: 'border-box',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      fontFamily: 'Arial, sans-serif',
      color: '#2a6b2a',
      zIndex: 1000,
    });

    container.innerHTML = `
      <style>
        #lead-form-container {
          box-sizing: border-box;
          padding: 0;
        }

        #lead-form-container input,
        #lead-form-container button {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          font-size: 16px;
          border-radius: 6px;
          border: 1px solid #ccc;
          padding: 12px;
          margin-bottom: 12px;
        }

        #lead-form-container label {
          display: block;
          margin-bottom: 6px;
          font-weight: bold;
        }

        #lead-form-container button {
          background-color: #2a6b2a;
          color: white;
          border: none;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        #lead-form-container button:hover {
          background-color: #3e8e3e;
        }

        #lead-form-container #lead-message {
          margin-top: 14px;
          text-align: center;
          font-size: 16px;
        }
      </style>

      <label>Имя</label>
      <input type="text" id="lead-name" placeholder="Ваше имя" required />

      <label>Телефон</label>
      <input type="tel" id="lead-phone" placeholder="+7 999 999-99-99" required />

      <label>Email</label>
      <input type="email" id="lead-email" placeholder="example@mail.com" required />

      <button id="lead-submit">Отправить заявку</button>
      <div id="lead-message"></div>
    `;

    document.body.appendChild(container);
    this.container = container;

    const submitButton = this.container.querySelector('#lead-submit');
    submitButton.addEventListener('click', () => this.submit());
  }

  async submit() {
    if (this.isSubmitting) return;

    console.log('AppConfig:', window.AppConfig);

    const name = this.container.querySelector('#lead-name').value.trim();
    const phone = this.container.querySelector('#lead-phone').value.trim();
    const email = this.container.querySelector('#lead-email').value.trim();
    const messageBox = this.container.querySelector('#lead-message');

    if (!name || !phone || !email) {
      messageBox.style.color = 'red';
      messageBox.textContent = 'Пожалуйста, заполните все поля.';
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
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
      });

      const data = await response.json();

      if (data.ok) {
        messageBox.style.color = 'green';
        messageBox.textContent = '✅ Спасибо! Ваша заявка отправлена.';
        this.clearFields();
      } else {
        throw new Error('Telegram API error');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      messageBox.style.color = 'red';
      messageBox.textContent = '❌ Ошибка при отправке. Попробуйте позже.';
    } finally {
      this.isSubmitting = false;
    }
  }

  show() {
    if (this.container) this.container.style.display = 'block';
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






