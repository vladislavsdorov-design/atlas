// telegram.js - утилиты для работы с Telegram
export const telegram = {
  // Проверка запуска в Telegram Web App
  isWebApp() {
    return (
      typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp
    );
  },

  // Получение экземпляра Web App
  getWebApp() {
    return this.isWebApp() ? window.Telegram.WebApp : null;
  },

  // Получение данных пользователя
  getUser() {
    const webApp = this.getWebApp();
    return webApp ? webApp.initDataUnsafe?.user : null;
  },

  // Получение chat ID
  getChatId() {
    const user = this.getUser();
    return user ? user.id : null;
  },

  // Получение номера телефона
  getPhoneNumber() {
    const user = this.getUser();
    return user ? user.phone_number : null;
  },

  // Инициализация Web App
  initWebApp() {
    const webApp = this.getWebApp();
    if (webApp) {
      webApp.ready();
      webApp.expand();
      webApp.enableClosingConfirmation();
      webApp.setBackgroundColor("#f8f9fa");
      webApp.setHeaderColor("secondary_bg_color");
    }
  },

  // Настройка кнопки назад
  setupBackButton(onClick) {
    const webApp = this.getWebApp();
    if (webApp) {
      webApp.BackButton.onClick(onClick);
      webApp.BackButton.show();
    }
  },

  // Скрыть кнопку назад
  hideBackButton() {
    const webApp = this.getWebApp();
    if (webApp) {
      webApp.BackButton.hide();
    }
  },

  // Закрыть Web App
  close() {
    const webApp = this.getWebApp();
    if (webApp) {
      webApp.close();
    }
  },

  // Показать алерт
  showAlert(message, callback) {
    const webApp = this.getWebApp();
    if (webApp) {
      webApp.showAlert(message, callback);
    } else {
      alert(message);
      if (callback) callback();
    }
  },

  // Показать подтверждение
  showConfirm(message, callback) {
    const webApp = this.getWebApp();
    if (webApp) {
      webApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      if (callback) callback(result);
    }
  },

  // Отправить данные на сервер
  sendData(data, callback) {
    const webApp = this.getWebApp();
    if (webApp) {
      webApp.sendData(JSON.stringify(data));
      if (callback) callback(true);
    } else {
      console.log("Data to send:", data);
      if (callback) callback(false);
    }
  },

  // Генерация ссылки для бота
  generateBotLink(command = "start", params = {}) {
    const botUsername = "jetzone_delivery_bot";
    const queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");

    return `https://t.me/${botUsername}?${
      queryString ? `${command}&${queryString}` : command
    }`;
  },
};

export default telegram;
