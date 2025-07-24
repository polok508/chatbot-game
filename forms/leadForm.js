class LeadForm {
  constructor() {
    this.container = null;
  }

  create() {
    if (this.container) return;

    const container = document.createElement('div');
    container.id = 'lead-form-container';
    container.style.position = 'absolute';
    container.style.top = '150px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.width = '400px';
    container.style.background = '#ffffffcc';
    container.style.borderRadius = '8px';
    container.style.padding = '20px';
    container.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
    container.style.fontFamily = 'Arial';
    container.style.color = '#2a6b2a';
    container.style.zIndex = 1000;

    container.innerHTML = `
      <label style="display:block; margin-bottom:8px; font-weight:bold;">Имя</label>
      <input type="text" id="lead-name" style="width:100%; padding:8px; margin-bottom:15px; font-size:16px; border:1px solid #aaa; border-radius:4px;" placeholder="Ваше имя" required />

      <label style="display:block; margin-bottom:8px; font-weight:bold;">Телефон</label>
      <input type="tel" id="lead-phone" style="width:100%; padding:8px; margin-bottom:15px; font-size:16px; border:1px solid #aaa; border-radius:4px;" placeholder="+7 999 999-99-99" required />

      <label style="display:block; margin-bottom:8px; font-weight:bold;">Email</label>
      <input type="email" id="lead-email" style="width:100%; padding:8px; margin-bottom:15px; font-size:16px; border:1px solid #aaa; border-radius:4px;" placeholder="example@mail.com" required />

      <button id="lead-submit" style="
        width: 100%;
        padding: 12px;
        font-size: 18px;
        background-color: #2a6b2a;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
      ">Отправить заявку</button>

      <div id="lead-message" style="margin-top:15px; text-align:center; font-size:16px;"></div>
    `;

    document.body.appendChild(container);
    this.container = container;

    this.container.querySelector('#lead-submit').addEventListener('click', () => this.submit());
  }

  async submit() {
    const name = this.container.querySelector('#lead-name').value.trim();
    const phone = this.container.querySelector('#lead-phone').value.trim();
    const email = this.container.querySelector('#lead-email').value.trim();
    const messageBox = this.container.querySelector('#lead-message');

    if (!name || !phone || !email) {
      messageBox.style.color = 'red';
      messageBox.textContent = 'Пожалуйста, заполните все поля.';
      return;
    }

    messageBox.style.color = '#2a6b2a';
    messageBox.textContent = 'Отправка...';

    // Глобальная переменная
    const botToken = window.AppConfig.BOT_TOKEN;
    const chatId = window.AppConfig.CHAT_ID;

    const text = `🧾 Новая заявка с игры:\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: text })
      });

      const data = await response.json();

      if (data.ok) {
        messageBox.style.color = 'green';
        messageBox.textContent = 'Спасибо! Ваша заявка отправлена. Мы скоро свяжемся с вами.';
        this.clearFields();
      } else {
        throw new Error("Telegram API error");
      }
    } catch (error) {
      console.error(error);
      messageBox.style.color = 'red';
      messageBox.textContent = 'Ошибка при отправке. Попробуйте позже.';
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


