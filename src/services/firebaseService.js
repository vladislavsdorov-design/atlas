import { database } from "../firebase";
import { ref, set, push, get, update, onValue } from "firebase/database";

class FirebaseService {
  // ============== ПОЛЬЗОВАТЕЛИ ==============

  async getAllUsers() {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        return Object.entries(users).map(([id, data]) => ({
          id,
          ...data,
          orders: data.orders || {},
          telegramRequests: data.telegramRequests || {},
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const usersRef = ref(database, "users");
      const newUserRef = push(usersRef);
      const userId = newUserRef.key;

      const userWithId = {
        ...userData,
        id: userId,
        createdAt: new Date().toISOString(),
        orders: {},
        telegramRequests: {},
      };

      await set(ref(database, `users/${userId}`), userWithId);

      return {
        userId,
        ...userWithId,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return {
          id: userId,
          ...snapshot.val(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserByRegistrationKey(key) {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        for (const [userId, userData] of Object.entries(users)) {
          if (userData.registrationKey === key) {
            return {
              id: userId,
              ...userData,
            };
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error getting user by key:", error);
      throw error;
    }
  }

  async updateUserPhone(userId, phone) {
    try {
      await update(ref(database, `users/${userId}`), {
        phone: phone,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error updating user phone:", error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      await update(ref(database, `users/${userId}`), {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // ============== ЗАПРОСЫ НА АКТИВАЦИЮ ==============

  async addTelegramRequest(userData) {
    try {
      const requestsRef = ref(database, "telegram_requests");
      const newRequestRef = push(requestsRef);
      const requestId = newRequestRef.key;

      const requestData = {
        id: requestId,
        telegramId: userData.telegramId.toString(),
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        phone: userData.phone || userData.phoneNumber || "",
        requestedAt: new Date().toISOString(),
        status: "pending",
        userId: null,
      };

      await set(newRequestRef, requestData);

      await set(ref(database, `telegram_users/${userData.telegramId}`), {
        requestId,
        status: "pending",
        requestedAt: new Date().toISOString(),
      });

      return requestId;
    } catch (error) {
      console.error("Error adding telegram request:", error);
      throw error;
    }
  }

  async getTelegramRequests() {
    try {
      const requestsRef = ref(database, "telegram_requests");
      const snapshot = await get(requestsRef);

      if (snapshot.exists()) {
        const requests = snapshot.val();
        return Object.entries(requests).map(([id, data]) => ({
          id,
          ...data,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting telegram requests:", error);
      throw error;
    }
  }

  async approveTelegramRequest(requestId, userId) {
    try {
      const requestRef = ref(database, `telegram_requests/${requestId}`);
      const requestSnapshot = await get(requestRef);

      if (!requestSnapshot.exists()) {
        throw new Error("Запрос не найден");
      }

      const requestData = requestSnapshot.val();

      await update(ref(database, `telegram_requests/${requestId}`), {
        status: "approved",
        approvedAt: new Date().toISOString(),
        userId: userId,
      });

      await update(ref(database, `users/${userId}`), {
        telegramId: requestData.telegramId,
        telegramUsername: requestData.username || "",
        telegramFirstName: requestData.firstName,
        telegramLastName: requestData.lastName,
        phone: requestData.phone || "",
        telegramApprovedAt: new Date().toISOString(),
      });

      await update(ref(database, `telegram_users/${requestData.telegramId}`), {
        status: "approved",
        userId: userId,
        approvedAt: new Date().toISOString(),
      });

      return {
        ...requestData,
        userId,
      };
    } catch (error) {
      console.error("Error approving telegram request:", error);
      throw error;
    }
  }

  async rejectTelegramRequest(requestId) {
    try {
      const requestRef = ref(database, `telegram_requests/${requestId}`);
      const requestSnapshot = await get(requestRef);

      if (!requestSnapshot.exists()) {
        throw new Error("Запрос не найден");
      }

      const requestData = requestSnapshot.val();

      await update(ref(database, `telegram_requests/${requestId}`), {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
      });

      await update(ref(database, `telegram_users/${requestData.telegramId}`), {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Error rejecting telegram request:", error);
      throw error;
    }
  }

  // ============== ЗАКАЗЫ ==============

  async getUserOrders(userId) {
    try {
      const ordersRef = ref(database, `users/${userId}/orders`);
      const snapshot = await get(ordersRef);

      if (snapshot.exists()) {
        const orders = snapshot.val();
        return Object.entries(orders).map(([orderId, data]) => ({
          id: orderId,
          orderId,
          ...data,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw error;
    }
  }

  async addOrder(userId, orderData) {
    try {
      const ordersRef = ref(database, `users/${userId}/orders`);
      const newOrderRef = push(ordersRef);
      const orderId = newOrderRef.key;

      const orderWithId = {
        ...orderData,
        id: orderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await set(
        ref(database, `users/${userId}/orders/${orderId}`),
        orderWithId
      );

      return orderId;
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  }

  async updateOrderLocation(userId, orderId, location, status) {
    try {
      const orderRef = ref(database, `users/${userId}/orders/${orderId}`);
      const snapshot = await get(orderRef);

      if (snapshot.exists()) {
        const orderData = snapshot.val();
        const tracking = orderData.tracking || [];

        tracking.push({
          status,
          location,
          timestamp: new Date().toISOString(),
        });

        await update(ref(database, `users/${userId}/orders/${orderId}`), {
          location,
          status,
          tracking,
          updatedAt: new Date().toISOString(),
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating order location:", error);
      throw error;
    }
  }

  async updateOrderStatus(userId, orderId, status) {
    try {
      await update(ref(database, `users/${userId}/orders/${orderId}`), {
        status,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  subscribeToUserOrders(userId, callback) {
    const ordersRef = ref(database, `users/${userId}/orders`);

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const orders = snapshot.val();
        const ordersArray = Object.entries(orders).map(([orderId, data]) => ({
          id: orderId,
          ...data,
        }));
        callback(ordersArray);
      } else {
        callback([]);
      }
    });

    return unsubscribe;
  }

  // ============== КЛЮЧИ ==============

  async validateRegistrationKey(key) {
    try {
      const user = await this.getUserByRegistrationKey(key);

      if (user) {
        return {
          valid: true,
          userId: user.id,
          userName: user.name,
        };
      }

      return {
        valid: false,
        error: "Неверный регистрационный ключ",
      };
    } catch (error) {
      console.error("Error validating key:", error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService();
