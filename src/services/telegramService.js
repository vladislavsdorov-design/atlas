// import { database } from "../firebase";
// import { ref, get } from "firebase/database";

// class TelegramService {
//   constructor() {
//     this.botToken = "8431547548:AAEdt2HObM72b_DxJ3V44oVFZReLodMM5Sc";
//     this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
//   }

//   async sendMessage(chatId, text, options = {}) {
//     try {
//       const response = await fetch(`${this.apiUrl}/sendMessage`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chat_id: chatId,
//           text: text,
//           parse_mode: "HTML",
//           disable_web_page_preview: true,
//           ...options,
//         }),
//       });

//       const data = await response.json();
//       if (!data.ok) {
//         throw new Error(data.description);
//       }
//       return data;
//     } catch (error) {
//       console.error("Error sending Telegram message:", error);
//       throw error;
//     }
//   }

//   async sendRegistrationKey(telegramId, key, userName) {
//     const message = `
// 🎉 <b>Вам выдан регистрационный ключ для JetZone Delivery!</b>

// 👤 <b>Пользователь:</b> ${userName}
// 🔑 <b>Ключ:</b> <code>${key}</code>

// ━━━━━━━━━━━━━━━━
// 📱 <b>Инструкция:</b>

// 1️⃣ Откройте мини-приложение
// 2️⃣ Введите полученный ключ
// 3️⃣ Привяжите номер телефона
// 4️⃣ Отслеживайте свои заказы

// ━━━━━━━━━━━━━━━━
// 🔗 <a href="https://t.me/jetzone24_bot/jetzone24">🚀 ОТКРЫТЬ МИНИ-ПРИЛОЖЕНИЕ</a>

// <i>⚠️ Ключ действителен до момента активации</i>
//     `;

//     return await this.sendMessage(telegramId, message);
//   }

//   async sendNewOrderNotification(telegramId, orderData, userName) {
//     const message = `
// 📦 <b>НОВЫЙ ЗАКАЗ!</b>

// ━━━━━━━━━━━━━━━━
// 👤 <b>Клиент:</b> ${userName}
// 📌 <b>Заказ:</b> ${orderData.title}
// 📝 <b>Описание:</b> ${orderData.description || "Без описания"}
// 💰 <b>Стоимость:</b> ${orderData.price || 0} ₽
// 📍 <b>Адрес доставки:</b> ${orderData.location}
// 🔄 <b>Статус:</b> ${orderData.status}

// ━━━━━━━━━━━━━━━━
// 🔗 <a href="https://t.me/jetzone24_bot/jetzone24">👀 ОТСЛЕЖИВАТЬ ЗАКАЗ</a>
//     `;

//     return await this.sendMessage(telegramId, message);
//   }

//   async sendApprovalNotification(telegramId, userName) {
//     const message = `
// ✅ <b>ВАШ ЗАПРОС ОДОБРЕН!</b>

// ━━━━━━━━━━━━━━━━
// 👤 <b>Вы привязаны к пользователю:</b> ${userName}

// 🎯 <b>Теперь вы можете:</b>
// • 📦 Получать уведомления о новых заказах
// • 🚚 Отслеживать статус доставки
// • 📍 Видеть местоположение заказов
// • 🔔 Получать обновления от администратора

// ━━━━━━━━━━━━━━━━
// 🔗 <a href="https://t.me/jetzone24_bot/jetzone24">🚀 ПЕРЕЙТИ В МИНИ-ПРИЛОЖЕНИЕ</a>
//     `;

//     return await this.sendMessage(telegramId, message);
//   }

//   async sendOrderUpdateNotification(telegramId, orderData, location, userName) {
//     const message = `
// 🚚 <b>ОБНОВЛЕНИЕ ЗАКАЗА</b>

// ━━━━━━━━━━━━━━━━
// 👤 <b>Клиент:</b> ${userName}
// 📌 <b>Заказ:</b> ${orderData.title}
// 📍 <b>Новое местоположение:</b> ${location}
// 🔄 <b>Текущий статус:</b> ${orderData.status}
// ⏱ <b>Время обновления:</b> ${new Date().toLocaleString("ru-RU")}

// ━━━━━━━━━━━━━━━━
// 🔗 <a href="https://t.me/jetzone24_bot/jetzone24">📍 ОТСЛЕДИТЬ НА КАРТЕ</a>
//     `;

//     return await this.sendMessage(telegramId, message);
//   }

//   async sendRejectionNotification(telegramId) {
//     const message = `
// ❌ <b>ЗАПРОС ОТКЛОНЕН</b>

// ━━━━━━━━━━━━━━━━
// К сожалению, ваш запрос на регистрацию в JetZone Delivery был отклонен.

// 📞 <b>Что делать?</b>
// Свяжитесь с администратором для уточнения причин и получения помощи.

// ━━━━━━━━━━━━━━━━
// 💬 <b>Контакты поддержки:</b>
// @jetzone_support
//     `;

//     return await this.sendMessage(telegramId, message);
//   }

//   async sendNotification(userId, message) {
//     try {
//       const userRef = ref(database, `users/${userId}`);
//       const snapshot = await get(userRef);

//       if (!snapshot.exists()) {
//         throw new Error("Пользователь не найден");
//       }

//       const userData = snapshot.val();

//       if (!userData.telegramId) {
//         throw new Error("У пользователя не привязан Telegram");
//       }

//       const notificationMessage = `
// 📢 <b>УВЕДОМЛЕНИЕ ОТ АДМИНИСТРАТОРА</b>

// ━━━━━━━━━━━━━━━━
// ${message}

// ━━━━━━━━━━━━━━━━
// 🚀 JetZone Delivery
//       `;

//       return await this.sendMessage(userData.telegramId, notificationMessage);
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       throw error;
//     }
//   }

//   async sendKeyInfo(telegramId, key, userName) {
//     const message = `
// 🔐 <b>ИНФОРМАЦИЯ О КЛЮЧЕ ДОСТУПА</b>

// ━━━━━━━━━━━━━━━━
// 👤 <b>Пользователь:</b> ${userName}
// 🔑 <b>Ваш ключ:</b> <code>${key}</code>

// 📋 <b>Как использовать:</b>
// 1. Скопируйте ключ выше
// 2. Откройте мини-приложение
// 3. Вставьте ключ в поле ввода
// 4. Нажмите "Продолжить"

// ━━━━━━━━━━━━━━━━
// ⚠️ <i>Никому не передавайте этот ключ!</i>
//     `;

//     return await this.sendMessage(telegramId, message);
//   }
// }

// export const telegramService = new TelegramService();
import { database } from "../firebase";
import { ref, get } from "firebase/database";

/**
 * Сервис для взаимодействия с Telegram Bot API
 * @class TelegramService
 */
class TelegramService {
  /**
   * Создает экземпляр TelegramService.
   */
  constructor() {
    this.botToken = "8431547548:AAEdt2HObM72b_DxJ3V44oVFZReLodMM5Sc";
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Базовая отправка сообщения через Telegram Bot API.
   * @param {string|number} chatId - ID чата получателя.
   * @param {string} text - Текст сообщения.
   * @param {object} options - Дополнительные параметры запроса.
   * @returns {Promise<object>} Ответ от Telegram API.
   */
  async sendMessage(chatId, text, options = {}) {
    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      console.error("[ATLAS] Ошибка отправки Telegram сообщения:", error);
      throw error;
    }
  }

  /**
   * Отправка регистрационного ключа.
   * @param {string|number} telegramId - Telegram ID получателя.
   * @param {string} key - Регистрационный ключ.
   * @param {string} userName - Имя пользователя.
   * @returns {Promise<object>}
   */
  async sendRegistrationKey(telegramId, key, userName) {
    const message = `
━━━━━━━━━━━━━━━━━━━━━━━
АТЛАС • ВЕРИФИКАЦИЯ
━━━━━━━━━━━━━━━━━━━━━━━

Уважаемый(-ая) <b>${userName}</b>,

Ваш уникальный ключ доступа к корпоративной платформе ATLAS успешно сгенерирован.

┌───────────── КЛЮЧ ДОСТУПА ─────────────┐
│                                          │
│   <code>${key}</code>  │
│                                          │
└──────────────────────────────────────────┘

<b>ПОРЯДОК АКТИВАЦИИ:</b>
1️⃣ Авторизуйтесь в мини-приложении ATLAS
2️⃣ Введите полученный ключ в соответствующее поле
3️⃣ Подтвердите номер телефона
4️⃣ Получите доступ к панели управления заказами

<b>ССЫЛКА ДЛЯ ВХОДА:</b>
🔗 <a href="https://t.me/atlas_bot/atlas24">ПЕРЕЙТИ В СИСТЕМУ ATLAS</a>

━━━━━━━━━━━━━━━━━━━━━━━
⏱ Ключ действителен до момента активации.
📎 Не передавайте данный ключ третьим лицам.
━━━━━━━━━━━━━━━━━━━━━━━
    `;

    return await this.sendMessage(telegramId, message);
  }

  /**
   * Уведомление о новом заказе для водителя/оператора.
   * @param {string|number} telegramId - Telegram ID получателя.
   * @param {object} orderData - Данные заказа.
   * @param {string} userName - Имя клиента.
   * @returns {Promise<object>}
   */
  async sendNewOrderNotification(telegramId, orderData, userName) {
    const message = `
━━━━━━━━━━━━━━━━━━━━━━━
АТЛАС • НОВЫЙ ЗАКАЗ
━━━━━━━━━━━━━━━━━━━━━━━

<b>Детали заказа:</b>
┌─────────────────────────────────────┐
│  👤 Клиент:        ${userName}
│  📦 Наименование:  ${orderData.title}
│  📝 Описание:      ${orderData.description || "Не указано"}
│  💰 Стоимость:     ${orderData.price || 0} ₽
│  📍 Адрес:         ${orderData.location}
│  🔄 Статус:        ${orderData.status}
└─────────────────────────────────────┘

<b>ДЕЙСТВИЯ:</b>
🔗 <a href="https://t.me/atlas_bot/atlas24">ПРИНЯТЬ ЗАКАЗ И ПОСТРОИТЬ МАРШРУТ</a>

━━━━━━━━━━━━━━━━━━━━━━━
    `;

    return await this.sendMessage(telegramId, message);
  }

  /**
   * Уведомление об одобрении заявки на подключение.
   * @param {string|number} telegramId - Telegram ID получателя.
   * @param {string} userName - Имя пользователя.
   * @returns {Promise<object>}
   */
  async sendApprovalNotification(telegramId, userName) {
    const message = `
━━━━━━━━━━━━━━━━━━━━━━━
АТЛАС • ДОСТУП ПРЕДОСТАВЛЕН
━━━━━━━━━━━━━━━━━━━━━━━

<b>${userName}</b>, ваша учетная запись подтверждена.

Вам открыт доступ к функционалу платформы:
┌─────────────────────────────────────┐
│  ✓ Мониторинг новых заказов в реальном времени
│  ✓ Управление статусами доставки
│  ✓ Отслеживание геолокации заказов
│  ✓ Получение системных уведомлений
└─────────────────────────────────────┘

<b>ССЫЛКА ДЛЯ ВХОДА:</b>
🔗 <a href="https://t.me/atlas_bot/atlas24">ПЕРЕЙТИ В РАБОЧЕЕ ПРОСТРАНСТВО ATLAS</a>

━━━━━━━━━━━━━━━━━━━━━━━
    `;

    return await this.sendMessage(telegramId, message);
  }

  /**
   * Уведомление об обновлении статуса или местоположения заказа.
   * @param {string|number} telegramId - Telegram ID получателя.
   * @param {object} orderData - Данные заказа.
   * @param {string} location - Новое местоположение.
   * @param {string} userName - Имя клиента.
   * @returns {Promise<object>}
   */
  async sendOrderUpdateNotification(telegramId, orderData, location, userName) {
    const message = `
━━━━━━━━━━━━━━━━━━━━━━━
АТЛАС • ОБНОВЛЕНИЕ СТАТУСА
━━━━━━━━━━━━━━━━━━━━━━━

<b>Заказ #${
      orderData.id || "N/A"
    }</b> для клиента <b>${userName}</b> получил обновление.

┌─────────────────────────────────────┐
│  📌 Текущая геолокация: ${location}
│  🔄 Статус:            ${orderData.status}
│  ⏱ Время обновления:   ${new Date().toLocaleString("ru-RU")}
└─────────────────────────────────────┘

<b>ОТСЛЕЖИВАНИЕ:</b>
🔗 <a href="https://t.me/atlas_bot/atlas24">ОТКРЫТЬ КАРТУ</a>

━━━━━━━━━━━━━━━━━━━━━━━
    `;

    return await this.sendMessage(telegramId, message);
  }

  /**
   * Уведомление об отклонении заявки.
   * @param {string|number} telegramId - Telegram ID получателя.
   * @returns {Promise<object>}
   */
  async sendRejectionNotification(telegramId) {
    const message = `
━━━━━━━━━━━━━━━━━━━━━━━
АТЛАС • ЗАПРОС ОТКЛОНЕН
━━━━━━━━━━━━━━━━━━━━━━━

Ваш запрос на регистрацию в системе ATLAS не может быть обработан автоматически.

<b>РЕКОМЕНДАЦИИ:</b>
Для выяснения причин и решения вопроса, свяжитесь со службой поддержки.

┌─────────────────────────────────────┐
│  💬 Официальный канал поддержки:    │
│  @atlas_support                      │
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━
    `;

    return await this.sendMessage(telegramId, message);
  }

  /**
   * Отправка текстового уведомления от администратора конкретному пользователю.
   * @param {string} userId - UID пользователя в Firebase.
   * @param {string} message - Текст уведомления.
   * @returns {Promise<object>}
   */
  async sendNotification(userId, message) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error("[ATLAS] Пользователь не найден в базе данных");
      }

      const userData = snapshot.val();

      if (!userData.telegramId) {
        throw new Error(
          "[ATLAS] Telegram ID не привязан к аккаунту пользователя"
        );
      }

      const notificationMessage = `
━━━━━━━━━━━━━━━━━━━━━━━
АТЛАС • СООБЩЕНИЕ
━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━
      `;

      return await this.sendMessage(userData.telegramId, notificationMessage);
    } catch (error) {
      console.error("[ATLAS] Ошибка отправки уведомления:", error);
      throw error;
    }
  }

  /**
   * Повторная отправка информации о ключе доступа.
   * @param {string|number} telegramId - Telegram ID получателя.
   * @param {string} key - Ключ доступа.
   * @param {string} userName - Имя пользователя.
   * @returns {Promise<object>}
   */
  async sendKeyInfo(telegramId, key, userName) {
    const message = `
━━━━━━━━━━━━━━━━━━━━━━━
АТЛАС • ДАННЫЕ ДОСТУПА
━━━━━━━━━━━━━━━━━━━━━━━

<b>${userName}</b>, запрошенная информация о ключе:

┌───────────── ВАШ КЛЮЧ ─────────────┐
│                                      │
│   <code>${key}</code>  │
│                                      │
└──────────────────────────────────────┘

<b>ИНСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ:</b>
1. Скопируйте ключ из сообщения
2. Откройте приложение ATLAS
3. Введите ключ в поле авторизации

<b>ССЫЛКА ДЛЯ ВХОДА:</b>
🔗 <a href="https://t.me/atlas_bot/atlas24">ВОЙТИ В СИСТЕМУ</a>

━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Храните ключ в безопасном месте. Никому его не сообщайте.
━━━━━━━━━━━━━━━━━━━━━━━
    `;

    return await this.sendMessage(telegramId, message);
  }
}

// Экспорт singleton-экземпляра сервиса
export const telegramService = new TelegramService();
