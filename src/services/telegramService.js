import { database } from "../firebase";
import { ref, get } from "firebase/database";

class TelegramService {
  constructor() {
    this.botToken = "8431547548:AAEdt2HObM72b_DxJ3V44oVFZReLodMM5Sc";
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          ...options,
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.description);
      }
      return data;
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      throw error;
    }
  }

  async sendRegistrationKey(telegramId, key, userName) {
    const message = `
🎉 <b>Вам выдан регистрационный ключ для JetZone Delivery!</b>

👤 <b>Пользователь:</b> ${userName}
🔑 <b>Ключ:</b> <code>${key}</code>

━━━━━━━━━━━━━━━━
📱 <b>Инструкция:</b>

1️⃣ Откройте мини-приложение
2️⃣ Введите полученный ключ
3️⃣ Привяжите номер телефона
4️⃣ Отслеживайте свои заказы

━━━━━━━━━━━━━━━━
🔗 <a href="https://t.me/jetzone24_bot/jetzone24">🚀 ОТКРЫТЬ МИНИ-ПРИЛОЖЕНИЕ</a>

<i>⚠️ Ключ действителен до момента активации</i>
    `;

    return await this.sendMessage(telegramId, message);
  }

  async sendNewOrderNotification(telegramId, orderData, userName) {
    const message = `
📦 <b>НОВЫЙ ЗАКАЗ!</b>

━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${userName}
📌 <b>Заказ:</b> ${orderData.title}
📝 <b>Описание:</b> ${orderData.description || "Без описания"}
💰 <b>Стоимость:</b> ${orderData.price || 0} ₽
📍 <b>Адрес доставки:</b> ${orderData.location}
🔄 <b>Статус:</b> ${orderData.status}

━━━━━━━━━━━━━━━━
🔗 <a href="https://t.me/jetzone24_bot/jetzone24">👀 ОТСЛЕЖИВАТЬ ЗАКАЗ</a>
    `;

    return await this.sendMessage(telegramId, message);
  }

  async sendApprovalNotification(telegramId, userName) {
    const message = `
✅ <b>ВАШ ЗАПРОС ОДОБРЕН!</b>

━━━━━━━━━━━━━━━━
👤 <b>Вы привязаны к пользователю:</b> ${userName}

🎯 <b>Теперь вы можете:</b>
• 📦 Получать уведомления о новых заказах
• 🚚 Отслеживать статус доставки
• 📍 Видеть местоположение заказов
• 🔔 Получать обновления от администратора

━━━━━━━━━━━━━━━━
🔗 <a href="https://t.me/jetzone24_bot/jetzone24">🚀 ПЕРЕЙТИ В МИНИ-ПРИЛОЖЕНИЕ</a>
    `;

    return await this.sendMessage(telegramId, message);
  }

  async sendOrderUpdateNotification(telegramId, orderData, location, userName) {
    const message = `
🚚 <b>ОБНОВЛЕНИЕ ЗАКАЗА</b>

━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${userName}
📌 <b>Заказ:</b> ${orderData.title}
📍 <b>Новое местоположение:</b> ${location}
🔄 <b>Текущий статус:</b> ${orderData.status}
⏱ <b>Время обновления:</b> ${new Date().toLocaleString("ru-RU")}

━━━━━━━━━━━━━━━━
🔗 <a href="https://t.me/jetzone24_bot/jetzone24">📍 ОТСЛЕДИТЬ НА КАРТЕ</a>
    `;

    return await this.sendMessage(telegramId, message);
  }

  async sendRejectionNotification(telegramId) {
    const message = `
❌ <b>ЗАПРОС ОТКЛОНЕН</b>

━━━━━━━━━━━━━━━━
К сожалению, ваш запрос на регистрацию в JetZone Delivery был отклонен.

📞 <b>Что делать?</b>
Свяжитесь с администратором для уточнения причин и получения помощи.

━━━━━━━━━━━━━━━━
💬 <b>Контакты поддержки:</b>
@jetzone_support
    `;

    return await this.sendMessage(telegramId, message);
  }

  async sendNotification(userId, message) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error("Пользователь не найден");
      }

      const userData = snapshot.val();

      if (!userData.telegramId) {
        throw new Error("У пользователя не привязан Telegram");
      }

      const notificationMessage = `
📢 <b>УВЕДОМЛЕНИЕ ОТ АДМИНИСТРАТОРА</b>

━━━━━━━━━━━━━━━━
${message}

━━━━━━━━━━━━━━━━
🚀 JetZone Delivery
      `;

      return await this.sendMessage(userData.telegramId, notificationMessage);
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  async sendKeyInfo(telegramId, key, userName) {
    const message = `
🔐 <b>ИНФОРМАЦИЯ О КЛЮЧЕ ДОСТУПА</b>

━━━━━━━━━━━━━━━━
👤 <b>Пользователь:</b> ${userName}
🔑 <b>Ваш ключ:</b> <code>${key}</code>

📋 <b>Как использовать:</b>
1. Скопируйте ключ выше
2. Откройте мини-приложение
3. Вставьте ключ в поле ввода
4. Нажмите "Продолжить"

━━━━━━━━━━━━━━━━
⚠️ <i>Никому не передавайте этот ключ!</i>
    `;

    return await this.sendMessage(telegramId, message);
  }
}

export const telegramService = new TelegramService();
