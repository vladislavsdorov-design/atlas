import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Telegram as TelegramIcon,
  ContentCopy as CopyIcon,
  LocalShipping as ShippingIcon,
  Refresh as RefreshIcon,
  Key as KeyIcon,
  ShoppingBag as ShoppingBagIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { firebaseService } from "../services/firebaseService";
import { telegramService } from "../services/telegramService";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [telegramRequests, setTelegramRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    telegramUsername: "",
  });
  const [newOrder, setNewOrder] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    status: "новый",
  });
  const [locationUpdate, setLocationUpdate] = useState({
    orderId: "",
    location: "",
    status: "в пути",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [addOrderDialog, setAddOrderDialog] = useState(false);
  const [updateLocationDialog, setUpdateLocationDialog] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [generatedKey, setGeneratedKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    loadUsers();
    loadTelegramRequests();
  }, []);

  const generateRegistrationKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "JET-";
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 2) key += "-";
    }
    return key;
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await firebaseService.getAllUsers();

      const processedUsers = Array.isArray(allUsers)
        ? allUsers.map((user) => ({
            ...user,
            orders: user.orders || {},
            telegramId: user.telegramId || null,
            telegramUsername: user.telegramUsername || "",
            phone: user.phone || "",
            registrationKey: user.registrationKey || "Нет ключа",
          }))
        : [];

      setUsers(processedUsers);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
      showSnackbar("Ошибка загрузки пользователей: " + error.message, "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTelegramRequests = async () => {
    try {
      setRequestsLoading(true);
      const requests = await firebaseService.getTelegramRequests();
      const sortedRequests = requests.sort(
        (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
      );
      setTelegramRequests(sortedRequests);
    } catch (error) {
      console.error("Ошибка загрузки запросов:", error);
      showSnackbar("Ошибка загрузки запросов", "error");
    } finally {
      setRequestsLoading(false);
    }
  };

  const loadUserOrders = async (userId) => {
    if (!userId) {
      setUserOrders([]);
      return;
    }

    try {
      setOrdersLoading(true);
      const orders = await firebaseService.getUserOrders(userId);

      const processedOrders = Array.isArray(orders)
        ? orders.map((order) => ({
            ...order,
            id: order.id || order.orderId,
            price: order.price || 0,
            description: order.description || "",
            tracking: Array.isArray(order.tracking) ? order.tracking : [],
          }))
        : [];

      setUserOrders(processedOrders);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
      showSnackbar("Ошибка загрузки заказов", "error");
      setUserOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name.trim()) {
      showSnackbar("Введите имя пользователя", "error");
      return;
    }

    try {
      setLoading(true);
      const registrationKey = generateRegistrationKey();

      const userData = {
        name: newUser.name.trim(),
        phone: newUser.phone.trim() || "",
        telegramUsername:
          newUser.telegramUsername.replace("@", "").trim() || "",
        registrationKey,
        createdAt: new Date().toISOString(),
        telegramId: null,
        orders: {},
      };

      const result = await firebaseService.createUser(userData);

      if (!result || !result.userId) {
        throw new Error("Не удалось создать пользователя");
      }

      showSnackbar(
        `Пользователь "${userData.name}" создан! Ключ: ${registrationKey}`
      );
      setGeneratedKey(registrationKey);
      navigator.clipboard.writeText(registrationKey);

      setNewUser({ name: "", phone: "", telegramUsername: "" });
      setAddUserDialog(false);

      await loadUsers();
    } catch (error) {
      console.error("Ошибка создания пользователя:", error);
      showSnackbar("Ошибка создания пользователя: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest || !selectedUser) {
      showSnackbar("Выберите запрос и пользователя", "error");
      return;
    }

    try {
      setLoading(true);

      await firebaseService.approveTelegramRequest(
        selectedRequest.id,
        selectedUser.id
      );

      await telegramService.sendRegistrationKey(
        selectedRequest.telegramId,
        selectedUser.registrationKey,
        selectedUser.name
      );

      await telegramService.sendApprovalNotification(
        selectedRequest.telegramId,
        selectedUser.name
      );

      showSnackbar(
        `✅ Запрос одобрен! Ключ отправлен пользователю ${selectedRequest.firstName}`
      );

      await loadTelegramRequests();
      await loadUsers();

      setSelectedRequest(null);
      setSelectedUser(null);
      setTabValue(4);
    } catch (error) {
      console.error("Ошибка одобрения запроса:", error);
      showSnackbar("Ошибка: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      setLoading(true);

      await firebaseService.rejectTelegramRequest(selectedRequest.id);

      await telegramService.sendRejectionNotification(
        selectedRequest.telegramId
      );

      showSnackbar(`❌ Запрос отклонен`);

      await loadTelegramRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Ошибка отклонения запроса:", error);
      showSnackbar("Ошибка: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async () => {
    if (!selectedUser) {
      showSnackbar("Выберите пользователя", "error");
      return;
    }

    if (!newOrder.title.trim() || !newOrder.location.trim()) {
      showSnackbar("Заполните название и местоположение заказа", "error");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        title: newOrder.title.trim(),
        description: newOrder.description.trim() || "",
        price: parseFloat(newOrder.price) || 0,
        location: newOrder.location.trim(),
        status: newOrder.status || "новый",
        createdAt: new Date().toISOString(),
        tracking: [
          {
            status: "новый",
            location: newOrder.location.trim(),
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const orderId = await firebaseService.addOrder(
        selectedUser.id,
        orderData
      );

      showSnackbar(`✅ Заказ "${orderData.title}" успешно добавлен!`);

      // Отправляем уведомление в Telegram
      if (selectedUser.telegramId) {
        try {
          await telegramService.sendNewOrderNotification(
            selectedUser.telegramId,
            orderData,
            selectedUser.name
          );
          showSnackbar("📱 Уведомление отправлено в Telegram", "info");
        } catch (telegramError) {
          console.error("Ошибка отправки уведомления:", telegramError);
        }
      }

      setNewOrder({
        title: "",
        description: "",
        price: "",
        location: "",
        status: "новый",
      });
      setAddOrderDialog(false);

      await loadUserOrders(selectedUser.id);
    } catch (error) {
      console.error("Ошибка добавления заказа:", error);
      showSnackbar("Ошибка добавления заказа: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async () => {
    if (!selectedUser) {
      showSnackbar("Выберите пользователя", "error");
      return;
    }

    if (!locationUpdate.orderId || !locationUpdate.location.trim()) {
      showSnackbar("Выберите заказ и введите местоположение", "error");
      return;
    }

    try {
      setLoading(true);

      const success = await firebaseService.updateOrderLocation(
        selectedUser.id,
        locationUpdate.orderId,
        locationUpdate.location,
        locationUpdate.status
      );

      if (success) {
        showSnackbar("📍 Местоположение обновлено!");

        // Отправляем уведомление в Telegram
        if (selectedUser.telegramId) {
          const order = userOrders.find((o) => o.id === locationUpdate.orderId);
          if (order) {
            try {
              await telegramService.sendOrderUpdateNotification(
                selectedUser.telegramId,
                order,
                locationUpdate.location,
                selectedUser.name
              );
            } catch (telegramError) {
              console.error("Ошибка отправки уведомления:", telegramError);
            }
          }
        }

        setLocationUpdate({ orderId: "", location: "", status: "в пути" });
        setUpdateLocationDialog(false);

        await loadUserOrders(selectedUser.id);
      }
    } catch (error) {
      console.error("Ошибка обновления:", error);
      showSnackbar("Ошибка обновления: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!selectedUser) {
      showSnackbar("Выберите пользователя", "error");
      return;
    }

    if (!notificationMessage.trim()) {
      showSnackbar("Введите сообщение", "error");
      return;
    }

    if (!selectedUser.telegramId) {
      showSnackbar("У пользователя не привязан Telegram", "warning");
      return;
    }

    try {
      setLoading(true);

      await telegramService.sendNotification(
        selectedUser.id,
        notificationMessage
      );

      showSnackbar("📢 Уведомление отправлено!");
      setNotificationMessage("");
    } catch (error) {
      console.error("Ошибка отправки уведомления:", error);
      showSnackbar("Ошибка отправки: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar("📋 Скопировано в буфер обмена");
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    const colors = {
      новый: "primary",
      "в обработке": "warning",
      собирается: "info",
      "в пути": "secondary",
      доставлен: "success",
      отменен: "error",
    };
    return colors[status] || "default";
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    loadUserOrders(user.id);
  };

  const handleRefresh = () => {
    loadUsers();
    loadTelegramRequests();
    if (selectedUser) {
      loadUserOrders(selectedUser.id);
    }
  };

  const getOrderCount = (user) => {
    if (!user || !user.orders) return 0;
    if (Array.isArray(user.orders)) return user.orders.length;
    if (typeof user.orders === "object") return Object.keys(user.orders).length;
    return 0;
  };

  const pendingRequestsCount = telegramRequests.filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            👨‍💼 Панель администратора
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            JetZone Delivery
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {pendingRequestsCount > 0 && (
            <Chip
              label={`${pendingRequestsCount} ${
                pendingRequestsCount === 1 ? "запрос" : "запросов"
              } на активацию`}
              color="warning"
              icon={<TelegramIcon />}
              onClick={() => setTabValue(4)}
              sx={{ cursor: "pointer" }}
            />
          )}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Обновить
          </Button>
        </Box>
      </Box>

      {loading && users.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Загрузка данных...
          </Typography>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="👥 Пользователи" />
            <Tab label="📦 Добавить заказ" disabled={!selectedUser} />
            <Tab label="📍 Обновить местоположение" disabled={!selectedUser} />
            <Tab label="📢 Уведомления" disabled={!selectedUser} />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>🔔 Запросы</span>
                  {pendingRequestsCount > 0 && (
                    <Chip
                      label={pendingRequestsCount}
                      size="small"
                      color="warning"
                      sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
                    />
                  )}
                </Box>
              }
            />
          </Tabs>

          {/* Вкладка: Пользователи */}
          <TabPanel value={tabValue} index={0}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h6">
                Все пользователи ({users.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddUserDialog(true)}
                disabled={loading}
              >
                Создать пользователя
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Имя</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Телефон</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Telegram</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Ключ</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Заказов</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Действия</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="textSecondary" sx={{ py: 3 }}>
                          Нет пользователей. Создайте первого пользователя.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow
                        key={user.id}
                        hover
                        selected={selectedUser?.id === user.id}
                        onClick={() => handleUserClick(user)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {user.telegramId && (
                              <TelegramIcon color="primary" fontSize="small" />
                            )}
                            <Typography variant="body1">{user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.phone || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {user.telegramId || user.telegramUsername ? (
                            <Chip
                              label={`@${
                                user.telegramUsername || user.telegramId
                              }`}
                              size="small"
                              color="success"
                              icon={<TelegramIcon />}
                              sx={{ borderRadius: 1 }}
                            />
                          ) : (
                            <Chip
                              label="Не привязан"
                              size="small"
                              color="default"
                              sx={{ borderRadius: 1 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontFamily="monospace"
                              sx={{ fontWeight: "bold" }}
                            >
                              {user.registrationKey}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(user.registrationKey);
                              }}
                              title="Копировать ключ"
                            >
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getOrderCount(user)}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user);
                              setTabValue(1);
                            }}
                            title="Добавить заказ"
                            color="primary"
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user);
                              setTabValue(2);
                            }}
                            title="Обновить местоположение"
                            color="secondary"
                          >
                            <LocationIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Вкладка: Добавить заказ */}
          <TabPanel value={tabValue} index={1}>
            {selectedUser ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        Добавить заказ для {selectedUser.name}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Имя"
                              secondary={<strong>{selectedUser.name}</strong>}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Телефон"
                              secondary={selectedUser.phone || "не указан"}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Telegram"
                              secondary={
                                selectedUser.telegramId ||
                                selectedUser.telegramUsername
                                  ? `@${
                                      selectedUser.telegramUsername ||
                                      selectedUser.telegramId
                                    }`
                                  : "не привязан"
                              }
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Ключ регистрации"
                              secondary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <KeyIcon fontSize="small" color="action" />
                                  <Typography
                                    variant="body2"
                                    fontFamily="monospace"
                                  >
                                    {selectedUser.registrationKey}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </List>
                      </Box>

                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddOrderDialog(true)}
                        disabled={loading}
                        fullWidth
                        size="large"
                      >
                        Добавить заказ
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 3,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        >
                          Заказы пользователя
                        </Typography>
                        <Chip
                          label={`${userOrders.length} ${
                            userOrders.length === 1
                              ? "заказ"
                              : userOrders.length < 5
                              ? "заказа"
                              : "заказов"
                          }`}
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>

                      {ordersLoading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 4,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : userOrders.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <ShoppingBagIcon
                            sx={{
                              fontSize: 60,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          />
                          <Typography variant="h6" color="textSecondary">
                            Нет заказов
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Добавьте первый заказ для этого пользователя
                          </Typography>
                        </Box>
                      ) : (
                        <Grid container spacing={2}>
                          {userOrders.map((order) => (
                            <Grid item xs={12} key={order.id}>
                              <Card elevation={2} sx={{ borderRadius: 2 }}>
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                      mb: 2,
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ fontWeight: "bold" }}
                                      >
                                        {order.title}
                                      </Typography>
                                      {order.description && (
                                        <Typography
                                          color="textSecondary"
                                          paragraph
                                        >
                                          {order.description}
                                        </Typography>
                                      )}
                                    </Box>
                                    <Chip
                                      label={order.status || "новый"}
                                      color={getStatusColor(order.status)}
                                      size="small"
                                      sx={{ borderRadius: 1 }}
                                    />
                                  </Box>

                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                      <Typography variant="body2">
                                        <strong>💰 Цена:</strong>{" "}
                                        {order.price || 0} ₽
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={9}>
                                      <Typography variant="body2">
                                        <strong>📍 Местоположение:</strong>{" "}
                                        {order.location}
                                      </Typography>
                                    </Grid>
                                  </Grid>

                                  {order.tracking &&
                                    order.tracking.length > 0 && (
                                      <Box sx={{ mt: 3 }}>
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          color="primary"
                                          sx={{ fontWeight: "bold" }}
                                        >
                                          📍 История перемещений:
                                        </Typography>
                                        <Stepper
                                          orientation="vertical"
                                          sx={{ mt: 1 }}
                                        >
                                          {order.tracking.map(
                                            (track, index) => (
                                              <Step key={index} completed>
                                                <StepLabel>
                                                  <Typography variant="body2">
                                                    {track.location}
                                                  </Typography>
                                                  <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                  >
                                                    {new Date(
                                                      track.timestamp
                                                    ).toLocaleString(
                                                      "ru-RU"
                                                    )}{" "}
                                                    • {track.status}
                                                  </Typography>
                                                </StepLabel>
                                              </Step>
                                            )
                                          )}
                                        </Stepper>
                                      </Box>
                                    )}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <ShoppingBagIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="textSecondary">
                  Выберите пользователя
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Для добавления заказа выберите пользователя на вкладке
                  "Пользователи"
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Вкладка: Обновить местоположение */}
          <TabPanel value={tabValue} index={2}>
            {selectedUser ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        Обновить местоположение
                      </Typography>

                      <Typography variant="body2" paragraph>
                        Пользователь: <strong>{selectedUser.name}</strong>
                      </Typography>

                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Выберите заказ</InputLabel>
                        <Select
                          value={locationUpdate.orderId}
                          onChange={(e) =>
                            setLocationUpdate({
                              ...locationUpdate,
                              orderId: e.target.value,
                            })
                          }
                          label="Выберите заказ"
                        >
                          {userOrders.map((order) => (
                            <MenuItem key={order.id} value={order.id}>
                              {order.title} - {order.location}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Новое местоположение"
                        value={locationUpdate.location}
                        onChange={(e) =>
                          setLocationUpdate({
                            ...locationUpdate,
                            location: e.target.value,
                          })
                        }
                        sx={{ mb: 2 }}
                        placeholder="Введите адрес или местоположение"
                      />

                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Статус</InputLabel>
                        <Select
                          value={locationUpdate.status}
                          onChange={(e) =>
                            setLocationUpdate({
                              ...locationUpdate,
                              status: e.target.value,
                            })
                          }
                          label="Статус"
                        >
                          <MenuItem value="в пути">🚚 В пути</MenuItem>
                          <MenuItem value="собирается">📦 Собирается</MenuItem>
                          <MenuItem value="доставлен">✅ Доставлен</MenuItem>
                          <MenuItem value="в обработке">
                            ⚙️ В обработке
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setUpdateLocationDialog(true)}
                        disabled={
                          !locationUpdate.orderId ||
                          !locationUpdate.location.trim() ||
                          loading
                        }
                        startIcon={<LocationIcon />}
                        fullWidth
                        size="large"
                      >
                        Обновить местоположение
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        Текущие заказы
                      </Typography>

                      {userOrders.length === 0 ? (
                        <Typography color="textSecondary">
                          Нет активных заказов
                        </Typography>
                      ) : (
                        <List>
                          {userOrders.map((order) => (
                            <React.Fragment key={order.id}>
                              <ListItem>
                                <ListItemText
                                  primary={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold" }}
                                      >
                                        {order.title}
                                      </Typography>
                                      <Chip
                                        label={order.status}
                                        size="small"
                                        color={getStatusColor(order.status)}
                                        sx={{ borderRadius: 1 }}
                                      />
                                    </Box>
                                  }
                                  secondary={
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        📍 {order.location}
                                      </Typography>
                                      {order.tracking &&
                                        order.tracking.length > 0 && (
                                          <Typography
                                            variant="caption"
                                            color="textSecondary"
                                          >
                                            Последнее обновление:{" "}
                                            {new Date(
                                              order.tracking[
                                                order.tracking.length - 1
                                              ].timestamp
                                            ).toLocaleString("ru-RU")}
                                          </Typography>
                                        )}
                                    </Box>
                                  }
                                />
                              </ListItem>
                              <Divider />
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <LocationIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="textSecondary">
                  Выберите пользователя
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Для обновления местоположения выберите пользователя на вкладке
                  "Пользователи"
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Вкладка: Отправка уведомлений */}
          <TabPanel value={tabValue} index={3}>
            {selectedUser ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        📢 Отправить уведомление
                      </Typography>

                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          Получатель: <strong>{selectedUser.name}</strong>
                        </Typography>
                        {selectedUser.telegramId ? (
                          <Typography variant="body2" color="success.main">
                            ✅ Telegram привязан
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="error.main">
                            ❌ Telegram не привязан
                          </Typography>
                        )}
                      </Alert>

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Текст уведомления"
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Введите сообщение для пользователя..."
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendNotification}
                        disabled={
                          !notificationMessage.trim() ||
                          !selectedUser.telegramId ||
                          loading
                        }
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <SendIcon />
                          )
                        }
                        fullWidth
                        size="large"
                      >
                        {loading ? "Отправка..." : "Отправить уведомление"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Информация о пользователе
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2 }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              gutterBottom
                            >
                              Контактные данные
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {selectedUser.name}
                            </Typography>
                            <Typography variant="body2">
                              📞 {selectedUser.phone || "Не указан"}
                            </Typography>
                            {selectedUser.telegramUsername && (
                              <Typography variant="body2">
                                📱 @{selectedUser.telegramUsername}
                              </Typography>
                            )}
                          </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2 }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              gutterBottom
                            >
                              Статистика
                            </Typography>
                            <Typography variant="body2">
                              📦 Заказов: {getOrderCount(selectedUser)}
                            </Typography>
                            <Typography variant="body2">
                              🔑 Ключ: {selectedUser.registrationKey}
                            </Typography>
                            <Typography variant="body2">
                              📅 Создан:{" "}
                              {new Date(
                                selectedUser.createdAt
                              ).toLocaleDateString("ru-RU")}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <SendIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="textSecondary">
                  Выберите пользователя
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Для отправки уведомления выберите пользователя на вкладке
                  "Пользователи"
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Вкладка: Запросы на активацию */}
          <TabPanel value={tabValue} index={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                🔔 Запросы на активацию
                {pendingRequestsCount > 0 && (
                  <Chip
                    label={`${pendingRequestsCount} активных`}
                    color="warning"
                    size="small"
                    sx={{ ml: 2, borderRadius: 1 }}
                  />
                )}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadTelegramRequests}
                disabled={requestsLoading}
              >
                Обновить
              </Button>
            </Box>

            {requestsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Дата</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Пользователь</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Telegram</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Статус</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Действия</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {telegramRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <Typography color="textSecondary" sx={{ py: 3 }}>
                                Нет запросов на активацию
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          telegramRequests.map((request) => (
                            <TableRow
                              key={request.id}
                              hover
                              selected={selectedRequest?.id === request.id}
                              onClick={() => setSelectedRequest(request)}
                              sx={{ cursor: "pointer" }}
                            >
                              <TableCell>
                                {new Date(request.requestedAt).toLocaleString(
                                  "ru-RU",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      bgcolor: "primary.main",
                                    }}
                                  >
                                    {request.firstName?.charAt(0) || "?"}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      {request.firstName} {request.lastName}
                                    </Typography>
                                    {request.username && (
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        @{request.username}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={request.telegramId}
                                  size="small"
                                  icon={<TelegramIcon />}
                                  sx={{ borderRadius: 1 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    request.status === "pending"
                                      ? "Ожидание"
                                      : request.status === "approved"
                                      ? "Одобрен"
                                      : "Отклонен"
                                  }
                                  size="small"
                                  color={
                                    request.status === "pending"
                                      ? "warning"
                                      : request.status === "approved"
                                      ? "success"
                                      : "error"
                                  }
                                  sx={{ borderRadius: 1 }}
                                />
                              </TableCell>
                              <TableCell>
                                {request.status === "pending" && (
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      color="success"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRequest(request);
                                        setTabValue(0);
                                        showSnackbar(
                                          "Выберите пользователя для привязки",
                                          "info"
                                        );
                                      }}
                                      title="Одобрить"
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRequest(request);
                                        handleRejectRequest();
                                      }}
                                      title="Отклонить"
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </Box>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={5}>
                  {selectedRequest && selectedRequest.status === "pending" ? (
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        >
                          ✅ Одобрение запроса
                        </Typography>

                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {selectedRequest.firstName}{" "}
                            {selectedRequest.lastName}
                          </Typography>
                          {selectedRequest.username && (
                            <Typography variant="body2">
                              @{selectedRequest.username}
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            📱 ID: {selectedRequest.telegramId}
                          </Typography>
                          {selectedRequest.phone && (
                            <Typography variant="body2">
                              📞 {selectedRequest.phone}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ mt: 1 }}
                            color="textSecondary"
                          >
                            Запрошен:{" "}
                            {new Date(
                              selectedRequest.requestedAt
                            ).toLocaleString("ru-RU")}
                          </Typography>
                        </Alert>

                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          Выберите пользователя для привязки:
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Пользователь</InputLabel>
                          <Select
                            value={selectedUser?.id || ""}
                            onChange={(e) => {
                              const user = users.find(
                                (u) => u.id === e.target.value
                              );
                              setSelectedUser(user);
                            }}
                            label="Пользователь"
                          >
                            {users.map((user) => (
                              <MenuItem key={user.id} value={user.id}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography>{user.name}</Typography>
                                  {user.telegramId ? (
                                    <Chip
                                      label="Привязан"
                                      size="small"
                                      color="success"
                                      sx={{ ml: 1 }}
                                    />
                                  ) : (
                                    <Chip
                                      label="Свободен"
                                      size="small"
                                      variant="outlined"
                                      sx={{ ml: 1 }}
                                    />
                                  )}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {selectedUser && (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              Будет отправлен ключ:{" "}
                              <strong>{selectedUser.registrationKey}</strong>
                            </Typography>
                            <Typography variant="caption" display="block">
                              Пользователь получит ключ и уведомление в Telegram
                            </Typography>
                          </Alert>
                        )}

                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleApproveRequest}
                          disabled={!selectedUser || loading}
                          startIcon={
                            loading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                          fullWidth
                          size="large"
                        >
                          {loading
                            ? "Одобрение..."
                            : "Одобрить и отправить ключ"}
                        </Button>
                      </CardContent>
                    </Card>
                  ) : selectedRequest ? (
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          Информация о запросе
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Статус"
                              secondary={
                                <Chip
                                  label={
                                    selectedRequest.status === "approved"
                                      ? "Одобрен"
                                      : "Отклонен"
                                  }
                                  size="small"
                                  color={
                                    selectedRequest.status === "approved"
                                      ? "success"
                                      : "error"
                                  }
                                  sx={{ borderRadius: 1 }}
                                />
                              }
                            />
                          </ListItem>
                          {selectedRequest.approvedAt && (
                            <ListItem>
                              <ListItemText
                                primary="Дата одобрения"
                                secondary={new Date(
                                  selectedRequest.approvedAt
                                ).toLocaleString("ru-RU")}
                              />
                            </ListItem>
                          )}
                          {selectedRequest.rejectedAt && (
                            <ListItem>
                              <ListItemText
                                primary="Дата отклонения"
                                secondary={new Date(
                                  selectedRequest.rejectedAt
                                ).toLocaleString("ru-RU")}
                              />
                            </ListItem>
                          )}
                          {selectedRequest.userId && (
                            <ListItem>
                              <ListItemText
                                primary="Привязан к пользователю"
                                secondary={
                                  users.find(
                                    (u) => u.id === selectedRequest.userId
                                  )?.name || selectedRequest.userId
                                }
                              />
                            </ListItem>
                          )}
                        </List>
                      </CardContent>
                    </Card>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <TelegramIcon
                        sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        Выберите запрос
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Для просмотра деталей или одобрения
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            )}
          </TabPanel>
        </Paper>
      )}

      {/* Диалог создания пользователя */}
      <Dialog
        open={addUserDialog}
        onClose={() => !loading && setAddUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            👤 Создание нового пользователя
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Имя пользователя *"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
            disabled={loading}
            placeholder="Введите имя пользователя"
          />

          <TextField
            fullWidth
            label="Телефон (опционально)"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            placeholder="+7 (999) 123-45-67"
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Telegram username (опционально)"
            value={newUser.telegramUsername}
            onChange={(e) =>
              setNewUser({ ...newUser, telegramUsername: e.target.value })
            }
            placeholder="username (без @)"
            sx={{ mb: 2 }}
            disabled={loading}
            helperText="Если укажете username, ключ можно будет отправить вручную"
          />

          {generatedKey && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <KeyIcon />
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Ключ создан!
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  fontFamily: "monospace",
                  backgroundColor: "#f5f5f5",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {generatedKey}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Этот ключ нужен пользователю для регистрации. Ключ скопирован в
                буфер обмена.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CopyIcon />}
                onClick={() => copyToClipboard(generatedKey)}
              >
                Скопировать ключ еще раз
              </Button>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: 1, borderColor: "divider", p: 2 }}>
          <Button
            onClick={() => setAddUserDialog(false)}
            disabled={loading}
            color="inherit"
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            disabled={!newUser.name.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? "Создание..." : "Создать пользователя"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления заказа */}
      <Dialog
        open={addOrderDialog}
        onClose={() => !loading && setAddOrderDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            📦 Добавить заказ
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedUser && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Для пользователя: <strong>{selectedUser.name}</strong>
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Название заказа *"
            value={newOrder.title}
            onChange={(e) =>
              setNewOrder({ ...newOrder, title: e.target.value })
            }
            sx={{ mb: 2 }}
            disabled={loading}
            placeholder="Например: Доставка документов"
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Описание (опционально)"
            value={newOrder.description}
            onChange={(e) =>
              setNewOrder({ ...newOrder, description: e.target.value })
            }
            sx={{ mb: 2 }}
            disabled={loading}
            placeholder="Описание заказа"
          />

          <TextField
            fullWidth
            type="number"
            label="Цена (₽)"
            value={newOrder.price}
            onChange={(e) =>
              setNewOrder({ ...newOrder, price: e.target.value })
            }
            sx={{ mb: 2 }}
            disabled={loading}
            placeholder="0"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={newOrder.status}
              onChange={(e) =>
                setNewOrder({ ...newOrder, status: e.target.value })
              }
              label="Статус"
              disabled={loading}
            >
              <MenuItem value="новый">🆕 Новый</MenuItem>
              <MenuItem value="в обработке">⚙️ В обработке</MenuItem>
              <MenuItem value="собирается">📦 Собирается</MenuItem>
              <MenuItem value="в пути">🚚 В пути</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Местоположение *"
            value={newOrder.location}
            onChange={(e) =>
              setNewOrder({ ...newOrder, location: e.target.value })
            }
            placeholder="Москва, ул. Ленина, д. 1, кв. 5"
            helperText="Укажите полный адрес доставки"
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: 1, borderColor: "divider", p: 2 }}>
          <Button
            onClick={() => setAddOrderDialog(false)}
            disabled={loading}
            color="inherit"
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleAddOrder}
            disabled={
              !newOrder.title.trim() || !newOrder.location.trim() || loading
            }
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? "Добавление..." : "Добавить заказ"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог обновления местоположения */}
      <Dialog
        open={updateLocationDialog}
        onClose={() => !loading && setUpdateLocationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            📍 Подтверждение обновления
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Вы уверены, что хотите обновить местоположение заказа?
          </Typography>

          {locationUpdate.orderId && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Новое местоположение:</strong> {locationUpdate.location}
              </Typography>
              <Typography variant="body2">
                <strong>Статус:</strong> {locationUpdate.status}
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: 1, borderColor: "divider", p: 2 }}>
          <Button
            onClick={() => setUpdateLocationDialog(false)}
            disabled={loading}
            color="inherit"
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpdateLocation}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <LocationIcon />
            }
          >
            {loading ? "Обновление..." : "Подтвердить"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;
