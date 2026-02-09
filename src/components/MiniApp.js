// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Stepper,
//   Step,
//   StepLabel,
//   Card,
//   CardContent,
//   Chip,
//   Alert,
//   CircularProgress,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Divider,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   Avatar,
// } from "@mui/material";
// import {
//   Phone as PhoneIcon,
//   Person as PersonIcon,
//   Key as KeyIcon,
//   ShoppingBag as ShoppingBagIcon,
//   LocationOn as LocationIcon,
//   AttachMoney as MoneyIcon,
//   Telegram as TelegramIcon,
//   CheckCircle as CheckCircleIcon,
//   LocalShipping as ShippingIcon,
//   Schedule as ScheduleIcon,
// } from "@mui/icons-material";
// import { useSearchParams } from "react-router-dom";
// import { firebaseService } from "../services/firebaseService";

// const steps = ["Ввод ключа", "Привязка телефона", "Мои заказы"];

// const MiniApp = () => {
//   const [searchParams] = useSearchParams();
//   const [activeStep, setActiveStep] = useState(0);
//   const [userData, setUserData] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [phone, setPhone] = useState("");
//   const [phoneOption, setPhoneOption] = useState("telegram");
//   const [registrationKey, setRegistrationKey] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [telegramUser, setTelegramUser] = useState(null);
//   const [showPhoneDialog, setShowPhoneDialog] = useState(false);

//   // Проверяем параметры URL
//   useEffect(() => {
//     const keyFromUrl = searchParams.get("key");
//     const telegramIdFromUrl = searchParams.get("telegramId");

//     if (keyFromUrl) {
//       setRegistrationKey(keyFromUrl);
//     }

//     // Проверяем, зарегистрирован ли пользователь
//     if (telegramIdFromUrl) {
//       checkUserRegistration(telegramIdFromUrl);
//     }

//     // Инициализируем Telegram Web App если доступен
//     initializeTelegramWebApp();
//   }, []);

//   const initializeTelegramWebApp = () => {
//     if (window.Telegram && window.Telegram.WebApp) {
//       const tg = window.Telegram.WebApp;

//       tg.expand();
//       tg.enableClosingConfirmation();
//       tg.setBackgroundColor("#f8f9fa");
//       tg.setHeaderColor("secondary_bg_color");

//       const user = tg.initDataUnsafe?.user;
//       if (user) {
//         setTelegramUser({
//           id: user.id,
//           firstName: user.first_name,
//           lastName: user.last_name || "",
//           username: user.username || "",
//           phoneNumber: user.phone_number || "",
//         });

//         if (user.phone_number) {
//           setPhone(user.phone_number);
//         }
//       }
//     }
//   };

//   const checkUserRegistration = async (telegramId) => {
//     try {
//       setLoading(true);
//       const user = await firebaseService.getUserByTelegramId(telegramId);

//       if (user) {
//         setUserData(user);
//         setActiveStep(2);
//         loadOrders(user.id);
//       } else {
//         setActiveStep(0);
//       }
//     } catch (err) {
//       setError("Ошибка проверки регистрации");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeySubmit = async () => {
//     if (!registrationKey.trim()) {
//       setError("Введите регистрационный ключ");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       // 🔥 ПРОВЕРКА НА АДМИНСКИЙ КЛЮЧ
//       if (registrationKey === "Vs20080413") {
//         // Сохраняем что пользователь - админ
//         localStorage.setItem("admin_logged_in", "true");
//         localStorage.setItem("admin_key_used", registrationKey);

//         // Перенаправляем в админку
//         window.location.href = "/admin";
//         return;
//       }

//       // Если не админский ключ, продолжаем обычную проверку
//       const validation = await firebaseService.validateRegistrationKey(
//         registrationKey
//       );

//       if (!validation.valid) {
//         setError(validation.error);
//         return;
//       }

//       // Если пользователь из Telegram, привязываем аккаунт
//       if (telegramUser) {
//         await firebaseService.useRegistrationKey(registrationKey, {
//           id: telegramUser.id,
//           username: telegramUser.username || `user_${telegramUser.id}`,
//         });

//         const user = await firebaseService.getUserById(validation.userId);
//         setUserData(user);
//       } else {
//         // Для веб-версии просто переходим к следующему шагу
//         const user = await firebaseService.getUserById(validation.userId);
//         setUserData(user);
//       }

//       setActiveStep(1);
//     } catch (err) {
//       setError("Ошибка проверки ключа: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhoneRegistration = async () => {
//     if (phoneOption === "custom" && !phone.trim()) {
//       setError("Введите номер телефона");
//       return;
//     }

//     try {
//       setLoading(true);

//       if (phoneOption === "custom") {
//         await firebaseService.updateUserPhone(userData.id, phone);
//       } else if (telegramUser?.phoneNumber) {
//         await firebaseService.updateUserPhone(
//           userData.id,
//           telegramUser.phoneNumber
//         );
//       }

//       setActiveStep(2);
//       loadOrders(userData.id);
//     } catch (err) {
//       setError("Ошибка регистрации: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadOrders = (userId) => {
//     firebaseService.subscribeToUserOrders(userId, (ordersList) => {
//       setOrders(ordersList);
//     });
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       новый: <CheckCircleIcon color="primary" />,
//       "в обработке": <ScheduleIcon color="warning" />,
//       собирается: <ShoppingBagIcon color="info" />,
//       "в пути": <ShippingIcon color="secondary" />,
//       доставлен: <CheckCircleIcon color="success" />,
//       отменен: <CheckCircleIcon color="error" />,
//     };
//     return icons[status] || <CheckCircleIcon />;
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("ru-RU", {
//       style: "currency",
//       currency: "RUB",
//       minimumFractionDigits: 0,
//     }).format(price);
//   };
//   // В начале MiniApp.js, после импортов, добавить:
//   const telegramUtils = {
//     // Проверка, запущено ли в Telegram
//     isTelegramWebApp: () => {
//       return window.Telegram && window.Telegram.WebApp;
//     },

//     // Получение данных пользователя Telegram
//     getTelegramUser: () => {
//       if (this.isTelegramWebApp()) {
//         return window.Telegram.WebApp.initDataUnsafe?.user;
//       }
//       return null;
//     },

//     // Получение параметров запуска
//     getLaunchParams: () => {
//       if (this.isTelegramWebApp()) {
//         return window.Telegram.WebApp.initData;
//       }
//       return "";
//     },

//     // Закрыть Web App
//     closeWebApp: () => {
//       if (this.isTelegramWebApp()) {
//         window.Telegram.WebApp.close();
//       }
//     },

//     // Показать подтверждение
//     showConfirm: (message, callback) => {
//       if (this.isTelegramWebApp()) {
//         window.Telegram.WebApp.showConfirm(message, callback);
//       } else {
//         if (window.confirm(message)) {
//           callback(true);
//         }
//       }
//     },

//     // Включить/выключить кнопку назад
//     setBackButton: (visible) => {
//       if (this.isTelegramWebApp()) {
//         if (visible) {
//           window.Telegram.WebApp.BackButton.show();
//         } else {
//           window.Telegram.WebApp.BackButton.hide();
//         }
//       }
//     },
//   };

//   // Затем в useEffect MiniApp добавить:
//   useEffect(() => {
//     // Инициализация Telegram Web App
//     if (telegramUtils.isTelegramWebApp()) {
//       const tg = window.Telegram.WebApp;

//       // Настройка Web App
//       tg.ready();
//       tg.expand();
//       tg.enableClosingConfirmation();
//       tg.setBackgroundColor("#f8f9fa");
//       tg.setHeaderColor("secondary_bg_color");

//       // Настройка кнопки назад
//       tg.BackButton.onClick(() => {
//         if (activeStep > 0) {
//           setActiveStep(activeStep - 1);
//         } else {
//           tg.close();
//         }
//       });

//       // Показать/скрыть кнопку назад
//       if (activeStep > 0) {
//         tg.BackButton.show();
//       } else {
//         tg.BackButton.hide();
//       }

//       // Получение данных пользователя
//       const user = tg.initDataUnsafe?.user;
//       if (user) {
//         setTelegramUser({
//           id: user.id,
//           firstName: user.first_name,
//           lastName: user.last_name || "",
//           username: user.username || "",
//           languageCode: user.language_code || "ru",
//           phoneNumber: user.phone_number || "",
//         });

//         if (user.phone_number) {
//           setPhone(user.phone_number);
//         }
//       }
//     }
//   }, [activeStep]); // Добавляем activeStep в зависимости
//   const getStatusColor = (status) => {
//     const colors = {
//       новый: "primary",
//       "в обработке": "warning",
//       собирается: "info",
//       "в пути": "secondary",
//       доставлен: "success",
//       отменен: "error",
//     };
//     return colors[status] || "default";
//   };

//   if (loading && activeStep === 0) {
//     return (
//       <Container
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md" sx={{ py: 2, minHeight: "100vh" }}>
//       {/* Telegram Web App верхняя панель */}
//       {window.Telegram?.WebApp && (
//         <Box sx={{ mb: 2, textAlign: "center" }}>
//           <Chip
//             icon={<TelegramIcon />}
//             label="JetZone Delivery в Telegram"
//             color="primary"
//             size="small"
//           />
//         </Box>
//       )}

//       <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
//         <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {/* Шаг 1: Ввод ключа */}
//         {activeStep === 0 && (
//           <Box>
//             <Typography variant="h5" gutterBottom align="center">
//               🔑 Введите регистрационный ключ
//             </Typography>

//             <Typography
//               variant="body1"
//               color="textSecondary"
//               paragraph
//               align="center"
//             >
//               Получите ключ у администратора или в Telegram боте
//             </Typography>

//             <TextField
//               fullWidth
//               label="Регистрационный ключ"
//               value={registrationKey}
//               onChange={(e) => setRegistrationKey(e.target.value)}
//               placeholder="JET-ABC-123"
//               sx={{ mb: 3, mt: 2 }}
//               InputProps={{
//                 startAdornment: (
//                   <KeyIcon sx={{ mr: 1, color: "action.active" }} />
//                 ),
//               }}
//             />

//             {telegramUser && (
//               <Alert severity="info" sx={{ mb: 3 }}>
//                 <Typography variant="body2">
//                   Вы вошли через Telegram как {telegramUser.firstName}
//                   {telegramUser.username && ` (@${telegramUser.username})`}
//                 </Typography>
//               </Alert>
//             )}

//             <Button
//               variant="contained"
//               onClick={handleKeySubmit}
//               disabled={!registrationKey.trim() || loading}
//               fullWidth
//               size="large"
//             >
//               {loading ? <CircularProgress size={24} /> : "Продолжить"}
//             </Button>

//             <Box sx={{ mt: 3, textAlign: "center" }}>
//               <Typography variant="body2" color="textSecondary">
//                 Нет ключа? Получите его в нашем Telegram боте:
//               </Typography>
//               <Button
//                 variant="outlined"
//                 href="https://t.me/jetzone_delivery_bot"
//                 target="_blank"
//                 startIcon={<TelegramIcon />}
//                 sx={{ mt: 1 }}
//               >
//                 Открыть бота
//               </Button>
//             </Box>
//           </Box>
//         )}

//         {/* Шаг 2: Привязка телефона */}
//         {activeStep === 1 && userData && (
//           <Box>
//             <Typography variant="h5" gutterBottom align="center">
//               📱 Привязка телефона
//             </Typography>

//             <Card sx={{ mb: 3, bgcolor: "#e3f2fd" }}>
//               <CardContent>
//                 <Box
//                   sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
//                 >
//                   <Avatar sx={{ bgcolor: "primary.main" }}>
//                     <PersonIcon />
//                   </Avatar>
//                   <Box>
//                     <Typography variant="subtitle1">{userData.name}</Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Ключ: {userData.registrationKey}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Typography variant="body2" paragraph>
//                   Для связи с курьером укажите ваш номер телефона:
//                 </Typography>
//               </CardContent>
//             </Card>

//             <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
//               <FormLabel component="legend">Выберите способ:</FormLabel>
//               <RadioGroup
//                 value={phoneOption}
//                 onChange={(e) => setPhoneOption(e.target.value)}
//               >
//                 {telegramUser?.phoneNumber && (
//                   <FormControlLabel
//                     value="telegram"
//                     control={<Radio />}
//                     label={
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                       >
//                         <TelegramIcon color="primary" />
//                         <Box>
//                           <Typography>
//                             Использовать номер из Telegram
//                           </Typography>
//                           <Typography variant="caption" color="textSecondary">
//                             {telegramUser.phoneNumber}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     }
//                   />
//                 )}

//                 <FormControlLabel
//                   value="custom"
//                   control={<Radio />}
//                   label={
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <PhoneIcon />
//                       <Typography>Ввести другой номер</Typography>
//                     </Box>
//                   }
//                 />
//               </RadioGroup>
//             </FormControl>

//             {phoneOption === "custom" && (
//               <TextField
//                 fullWidth
//                 label="Ваш номер телефона"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="+7 (999) 123-45-67"
//                 sx={{ mb: 3 }}
//               />
//             )}

//             <Box sx={{ display: "flex", gap: 2 }}>
//               <Button
//                 variant="outlined"
//                 onClick={() => setActiveStep(0)}
//                 fullWidth
//               >
//                 Назад
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handlePhoneRegistration}
//                 disabled={loading}
//                 fullWidth
//               >
//                 {loading ? <CircularProgress size={24} /> : "Продолжить"}
//               </Button>
//             </Box>
//           </Box>
//         )}

//         {/* Шаг 3: Мои заказы */}
//         {activeStep === 2 && userData && (
//           <Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 3,
//               }}
//             >
//               <Typography variant="h4">📦 Мои заказы</Typography>
//               <Chip
//                 label={`${orders.length} заказ${
//                   orders.length === 1 ? "" : "а"
//                 }`}
//                 color="primary"
//                 icon={<ShoppingBagIcon />}
//               />
//             </Box>

//             <Alert severity="info" sx={{ mb: 3 }}>
//               <Box
//                 sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
//               >
//                 <PersonIcon />
//                 <Typography variant="body1">
//                   Добро пожаловать, <strong>{userData.name}</strong>!
//                 </Typography>
//               </Box>
//               {userData.phone && (
//                 <Typography variant="body2">
//                   <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
//                   Контактный телефон: {userData.phone}
//                 </Typography>
//               )}
//               {userData.telegramId && (
//                 <Typography variant="body2">
//                   <TelegramIcon fontSize="small" sx={{ mr: 0.5 }} />
//                   Telegram: @{userData.telegramUsername || userData.telegramId}
//                 </Typography>
//               )}
//             </Alert>

//             {orders.length === 0 ? (
//               <Paper sx={{ p: 4, textAlign: "center" }}>
//                 <ShoppingBagIcon
//                   sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
//                 />
//                 <Typography variant="h6" color="textSecondary">
//                   Заказов пока нет
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Администратор добавит заказ, и он появится здесь
//                 </Typography>
//               </Paper>
//             ) : (
//               <Grid container spacing={2}>
//                 {orders.map((order) => (
//                   <Grid item xs={12} key={order.id}>
//                     <Card
//                       elevation={2}
//                       sx={{
//                         "&:hover": {
//                           boxShadow: 6,
//                           transform: "translateY(-2px)",
//                           transition: "all 0.3s ease",
//                         },
//                       }}
//                     >
//                       <CardContent>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "flex-start",
//                             mb: 2,
//                           }}
//                         >
//                           <Box sx={{ flex: 1 }}>
//                             <Typography variant="h6" gutterBottom>
//                               {order.title}
//                             </Typography>
//                             {order.description && (
//                               <Typography color="textSecondary" paragraph>
//                                 {order.description}
//                               </Typography>
//                             )}
//                           </Box>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             {getStatusIcon(order.status)}
//                             <Chip
//                               label={order.status}
//                               color={getStatusColor(order.status)}
//                               size="small"
//                             />
//                           </Box>
//                         </Box>

//                         <Grid container spacing={2}>
//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <MoneyIcon
//                                 sx={{ mr: 1, color: "success.main" }}
//                               />
//                               <Typography>
//                                 <strong>Цена:</strong>{" "}
//                                 {formatPrice(order.price)}
//                               </Typography>
//                             </Box>
//                           </Grid>
//                           <Grid item xs={12} sm={6} md={9}>
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <LocationIcon
//                                 sx={{ mr: 1, color: "primary.main" }}
//                               />
//                               <Typography>
//                                 <strong>Местоположение:</strong>{" "}
//                                 {order.location}
//                               </Typography>
//                             </Box>
//                           </Grid>
//                         </Grid>

//                         {/* История перемещений */}
//                         {order.tracking && order.tracking.length > 0 && (
//                           <Box sx={{ mt: 3 }}>
//                             <Typography variant="subtitle2" gutterBottom>
//                               📍 История перемещений:
//                             </Typography>
//                             <List dense>
//                               {order.tracking.map((track, index) => (
//                                 <ListItem key={index} sx={{ py: 0.5 }}>
//                                   <ListItemIcon sx={{ minWidth: 36 }}>
//                                     {getStatusIcon(track.status)}
//                                   </ListItemIcon>
//                                   <ListItemText
//                                     primary={track.location}
//                                     secondary={
//                                       <Typography
//                                         variant="caption"
//                                         color="textSecondary"
//                                       >
//                                         {new Date(
//                                           track.timestamp
//                                         ).toLocaleString("ru-RU")}{" "}
//                                         • {track.status}
//                                       </Typography>
//                                     }
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </Box>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}

//             <Box
//               sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
//             >
//               {window.Telegram?.WebApp ? (
//                 <Button
//                   variant="outlined"
//                   onClick={() => window.Telegram.WebApp.close()}
//                 >
//                   Закрыть приложение
//                 </Button>
//               ) : (
//                 <Button
//                   variant="outlined"
//                   onClick={() => window.history.back()}
//                 >
//                   Вернуться назад
//                 </Button>
//               )}
//               <Button
//                 variant="contained"
//                 href={`https://t.me/jetzone_delivery_bot`}
//                 target="_blank"
//                 startIcon={<TelegramIcon />}
//               >
//                 Открыть в Telegram боте
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </Paper>
//     </Container>
//   );
// };

// export default MiniApp;
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Avatar,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Person as PersonIcon,
  Key as KeyIcon,
  ShoppingBag as ShoppingBagIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Telegram as TelegramIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";

// Мок сервис для демонстрации
const mockFirebaseService = {
  async validateRegistrationKey(key) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (key.startsWith("JET-")) {
      return {
        valid: true,
        userId: `user_${Date.now()}`,
        userName: "Тестовый пользователь",
      };
    }

    return {
      valid: false,
      error: "Неверный ключ. Ключ должен начинаться с JET-",
    };
  },

  async getUserById(userId) {
    return {
      id: userId,
      name: "Тестовый пользователь",
      registrationKey: "JET-TEST-123",
    };
  },

  async updateUserPhone(userId, phone) {
    console.log("Обновлен телефон:", phone);
    return true;
  },

  subscribeToUserOrders(userId, callback) {
    // Демо данные
    setTimeout(() => {
      callback([
        {
          id: "order_1",
          title: "Тестовый заказ",
          description: "Описание тестового заказа",
          price: 1500,
          location: "Москва, Красная площадь",
          status: "в пути",
          tracking: [
            {
              status: "новый",
              location: "Склад отправки",
              timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              status: "в пути",
              location: "Москва, Красная площадь",
              timestamp: new Date().toISOString(),
            },
          ],
        },
      ]);
    }, 500);

    // Возвращаем функцию отписки
    return () => {};
  },
};

const steps = ["Ввод ключа", "Привязка телефона", "Мои заказы"];

const MiniApp = () => {
  const [searchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState("");
  const [phoneOption, setPhoneOption] = useState("telegram");
  const [registrationKey, setRegistrationKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    const keyFromUrl = searchParams.get("key");
    const telegramIdFromUrl = searchParams.get("telegramId");

    if (keyFromUrl) {
      setRegistrationKey(keyFromUrl);
    }

    // Инициализируем Telegram Web App если доступен
    initializeTelegramWebApp();
  }, []);

  const initializeTelegramWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.expand();
      tg.enableClosingConfirmation();
      tg.setBackgroundColor("#f8f9fa");
      tg.setHeaderColor("secondary_bg_color");

      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramUser({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name || "",
          username: user.username || "",
          phoneNumber: user.phone_number || "",
        });

        if (user.phone_number) {
          setPhone(user.phone_number);
        }
      }
    }
  };

  const handleKeySubmit = async () => {
    if (!registrationKey.trim()) {
      setError("Введите регистрационный ключ");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🔥 ПРОВЕРКА НА АДМИНСКИЙ КЛЮЧ
      // 🔥 ПРОВЕРКА НА АДМИНСКИЙ КЛЮЧ
      if (registrationKey === "Vs20080413") {
        // Сохраняем что пользователь - админ
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("admin_key_used", registrationKey);
        localStorage.setItem("admin_login_time", Date.now().toString());

        // Перенаправляем в админку
        window.location.href = "/admin";
        return;
      }

      // Если не админский ключ, продолжаем обычную проверку
      const validation = await mockFirebaseService.validateRegistrationKey(
        registrationKey
      );

      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      // Для демо просто создаем пользователя
      const user = await mockFirebaseService.getUserById(validation.userId);
      setUserData({
        ...user,
        registrationKey: registrationKey,
      });

      setActiveStep(1);
    } catch (err) {
      setError("Ошибка проверки ключа: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegistration = async () => {
    if (phoneOption === "custom" && !phone.trim()) {
      setError("Введите номер телефона");
      return;
    }

    try {
      setLoading(true);

      if (phoneOption === "custom") {
        await mockFirebaseService.updateUserPhone(userData.id, phone);
      } else if (telegramUser?.phoneNumber) {
        await mockFirebaseService.updateUserPhone(
          userData.id,
          telegramUser.phoneNumber
        );
      }

      setActiveStep(2);
      mockFirebaseService.subscribeToUserOrders(userData.id, (ordersList) => {
        setOrders(ordersList);
      });
    } catch (err) {
      setError("Ошибка регистрации: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      новый: <CheckCircleIcon color="primary" />,
      "в обработке": <ScheduleIcon color="warning" />,
      собирается: <ShoppingBagIcon color="info" />,
      "в пути": <ShippingIcon color="secondary" />,
      доставлен: <CheckCircleIcon color="success" />,
      отменен: <CheckCircleIcon color="error" />,
    };
    return icons[status] || <CheckCircleIcon />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
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

  if (loading && activeStep === 0) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 2, minHeight: "100vh" }}>
      {/* Telegram Web App верхняя панель */}
      {window.Telegram?.WebApp && (
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Chip
            icon={<TelegramIcon />}
            label="JetZone Delivery в Telegram"
            color="primary"
            size="small"
          />
        </Box>
      )}

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Шаг 1: Ввод ключа */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom align="center">
              🔑 Введите регистрационный ключ
            </Typography>

            <Typography
              variant="body1"
              color="textSecondary"
              paragraph
              align="center"
            >
              Получите ключ у администратора или в Telegram боте
            </Typography>

            <TextField
              fullWidth
              label="Регистрационный ключ"
              value={registrationKey}
              onChange={(e) => setRegistrationKey(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleKeySubmit()}
              placeholder="JET-ABC-123 или Vs20080413"
              sx={{ mb: 3, mt: 2 }}
              InputProps={{
                startAdornment: (
                  <KeyIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />

            {telegramUser && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Вы вошли через Telegram как {telegramUser.firstName}
                  {telegramUser.username && ` (@${telegramUser.username})`}
                </Typography>
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={handleKeySubmit}
              disabled={!registrationKey.trim() || loading}
              fullWidth
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : "Продолжить"}
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="textSecondary">
                Нет ключа? Получите его в нашем Telegram боте:
              </Typography>
              <Button
                variant="outlined"
                href="https://t.me/jetzone_delivery_bot"
                target="_blank"
                startIcon={<TelegramIcon />}
                sx={{ mt: 1 }}
              >
                Открыть бота
              </Button>
            </Box>
          </Box>
        )}

        {/* Шаг 2: Привязка телефона */}
        {activeStep === 1 && userData && (
          <Box>
            <Typography variant="h5" gutterBottom align="center">
              📱 Привязка телефона
            </Typography>

            <Card sx={{ mb: 3, bgcolor: "#e3f2fd" }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{userData.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ключ: {userData.registrationKey}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" paragraph>
                  Для связи с курьером укажите ваш номер телефона:
                </Typography>
              </CardContent>
            </Card>

            <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
              <FormLabel component="legend">Выберите способ:</FormLabel>
              <RadioGroup
                value={phoneOption}
                onChange={(e) => setPhoneOption(e.target.value)}
              >
                {telegramUser?.phoneNumber && (
                  <FormControlLabel
                    value="telegram"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TelegramIcon color="primary" />
                        <Box>
                          <Typography>
                            Использовать номер из Telegram
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {telegramUser.phoneNumber}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                )}

                <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon />
                      <Typography>Ввести другой номер</Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {phoneOption === "custom" && (
              <TextField
                fullWidth
                label="Ваш номер телефона"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                sx={{ mb: 3 }}
              />
            )}

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setActiveStep(0)}
                fullWidth
              >
                Назад
              </Button>
              <Button
                variant="contained"
                onClick={handlePhoneRegistration}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Продолжить"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Шаг 3: Мои заказы */}
        {activeStep === 2 && userData && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h4">📦 Мои заказы</Typography>
              <Chip
                label={`${orders.length} заказ${
                  orders.length === 1 ? "" : "а"
                }`}
                color="primary"
                icon={<ShoppingBagIcon />}
              />
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <PersonIcon />
                <Typography variant="body1">
                  Добро пожаловать, <strong>{userData.name}</strong>!
                </Typography>
              </Box>
              {userData.phone && (
                <Typography variant="body2">
                  <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Контактный телефон: {userData.phone}
                </Typography>
              )}
              {userData.telegramId && (
                <Typography variant="body2">
                  <TelegramIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Telegram: @{userData.telegramUsername || userData.telegramId}
                </Typography>
              )}
            </Alert>

            {orders.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <ShoppingBagIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="textSecondary">
                  Заказов пока нет
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Администратор добавит заказ, и он появится здесь
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {orders.map((order) => (
                  <Grid item xs={12} key={order.id}>
                    <Card
                      elevation={2}
                      sx={{
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-2px)",
                          transition: "all 0.3s ease",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {order.title}
                            </Typography>
                            {order.description && (
                              <Typography color="textSecondary" paragraph>
                                {order.description}
                              </Typography>
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {getStatusIcon(order.status)}
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </Box>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <MoneyIcon
                                sx={{ mr: 1, color: "success.main" }}
                              />
                              <Typography>
                                <strong>Цена:</strong>{" "}
                                {formatPrice(order.price)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={9}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LocationIcon
                                sx={{ mr: 1, color: "primary.main" }}
                              />
                              <Typography>
                                <strong>Местоположение:</strong>{" "}
                                {order.location}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* История перемещений */}
                        {order.tracking && order.tracking.length > 0 && (
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              📍 История перемещений:
                            </Typography>
                            <List dense>
                              {order.tracking.map((track, index) => (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    {getStatusIcon(track.status)}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={track.location}
                                    secondary={
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        {new Date(
                                          track.timestamp
                                        ).toLocaleString("ru-RU")}{" "}
                                        • {track.status}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            <Box
              sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
            >
              {window.Telegram?.WebApp ? (
                <Button
                  variant="outlined"
                  onClick={() => window.Telegram.WebApp.close()}
                >
                  Закрыть приложение
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                >
                  Вернуться назад
                </Button>
              )}
              <Button
                variant="contained"
                href={`https://t.me/jetzone_delivery_bot`}
                target="_blank"
                startIcon={<TelegramIcon />}
              >
                Открыть в Telegram боте
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default MiniApp;
