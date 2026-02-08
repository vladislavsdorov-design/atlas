import axios from "axios";

const BOT_API_URL =
  process.env.REACT_APP_BOT_API_URL || "http://localhost:5000";

export const telegramService = {
  // Отправка уведомления через бота
  async sendNotification(userId, message) {
    try {
      const response = await axios.post(
        `${BOT_API_URL}/api/send-notification`,
        {
          userId,
          message,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка отправки уведомления:", error);
      return { success: false, error: error.message };
    }
  },

  // Отправка ключа пользователю
  async sendRegistrationKey(userId, key) {
    try {
      const response = await axios.post(`${BOT_API_URL}/api/send-key`, {
        userId,
        key,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка отправки ключа:", error);
      return { success: false, error: error.message };
    }
  },

  // Отправка обновления статуса заказа
  async sendOrderUpdate(userId, orderId, updateMessage) {
    try {
      const response = await axios.post(
        `${BOT_API_URL}/api/send-order-update`,
        {
          userId,
          orderId,
          message: updateMessage,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка отправки обновления:", error);
      return { success: false, error: error.message };
    }
  },

  // Проверка подключения бота
  async checkBotConnection() {
    try {
      const response = await axios.get(`${BOT_API_URL}/api/health`);
      return response.data;
    } catch (error) {
      return { connected: false, error: "Бот не доступен" };
    }
  },
};
