import { database } from "../firebase/config";
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
} from "firebase/database";

export const firebaseService = {
  // Генерация ключа
  generateRegistrationKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "JET-";
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 2) key += "-";
    }
    return key;
  },

  // Создание пользователя
  async createUser(userData) {
    const key = this.generateRegistrationKey();
    const userId = `user_${Date.now()}`;

    // Сохраняем ключ
    const keyRef = ref(database, `registrationKeys/${key}`);
    await set(keyRef, {
      key,
      userId,
      userName: userData.name,
      createdAt: new Date().toISOString(),
      used: false,
    });

    // Сохраняем пользователя
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, {
      id: userId,
      name: userData.name,
      phone: userData.phone || "",
      registrationKey: key,
      createdAt: new Date().toISOString(),
      telegramId: null,
      telegramUsername: null,
      orders: {},
    });

    return { userId, key };
  },

  // Получение всех пользователей
  async getAllUsers() {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) return [];

    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
  },

  // Получение пользователя по ID
  async getUserById(userId) {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) return null;

    return { id: userId, ...snapshot.val() };
  },

  // Обновление телефона пользователя
  async updateUserPhone(userId, phone) {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, { phone });
  },

  // Привязка Telegram
  async linkTelegram(userId, telegramData) {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      telegramId: telegramData.id,
      telegramUsername: telegramData.username,
      telegramLinkedAt: new Date().toISOString(),
    });
  },

  // Добавление заказа
  async addOrder(userId, orderData) {
    const orderId = `order_${Date.now()}`;
    const orderRef = ref(database, `users/${userId}/orders/${orderId}`);

    await set(orderRef, {
      id: orderId,
      title: orderData.title,
      description: orderData.description,
      price: orderData.price,
      location: orderData.location,
      status: "новый",
      createdAt: new Date().toISOString(),
      tracking: [
        {
          status: "новый",
          location: orderData.location,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    return orderId;
  },

  // Обновление местоположения заказа
  async updateOrderLocation(userId, orderId, location, status) {
    const orderRef = ref(database, `users/${userId}/orders/${orderId}`);
    const snapshot = await get(orderRef);

    if (!snapshot.exists()) return false;

    const order = snapshot.val();
    const tracking = order.tracking || [];

    await update(orderRef, {
      location,
      status: status || order.status,
      tracking: [
        ...tracking,
        {
          status: status || order.status,
          location,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    return true;
  },

  // Получение заказов пользователя
  async getUserOrders(userId) {
    const ordersRef = ref(database, `users/${userId}/orders`);
    const snapshot = await get(ordersRef);

    if (!snapshot.exists()) return [];

    return Object.values(snapshot.val());
  },

  // Реальная подписка на заказы
  subscribeToUserOrders(userId, callback) {
    const ordersRef = ref(database, `users/${userId}/orders`);
    return onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const orders = Object.values(snapshot.val());
        callback(orders);
      } else {
        callback([]);
      }
    });
  },

  // Проверка ключа регистрации
  async validateRegistrationKey(key) {
    const keyRef = ref(database, `registrationKeys/${key}`);
    const snapshot = await get(keyRef);

    if (!snapshot.exists()) {
      return { valid: false, error: "Ключ не найден" };
    }

    const keyData = snapshot.val();

    if (keyData.used) {
      return { valid: false, error: "Ключ уже использован" };
    }

    return {
      valid: true,
      userId: keyData.userId,
      userName: keyData.userName,
    };
  },

  // Использование ключа
  async useRegistrationKey(key, telegramData) {
    const keyRef = ref(database, `registrationKeys/${key}`);
    await update(keyRef, {
      used: true,
      usedAt: new Date().toISOString(),
      telegramId: telegramData.id,
      telegramUsername: telegramData.username,
    });

    const keySnapshot = await get(keyRef);
    const keyData = keySnapshot.val();

    const userRef = ref(database, `users/${keyData.userId}`);
    await update(userRef, {
      telegramId: telegramData.id,
      telegramUsername: telegramData.username,
      telegramLinkedAt: new Date().toISOString(),
    });

    return keyData.userId;
  },
};
