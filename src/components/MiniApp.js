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

// // Мок сервис для демонстрации
// const mockFirebaseService = {
//   async validateRegistrationKey(key) {
//     await new Promise((resolve) => setTimeout(resolve, 300));

//     if (key.startsWith("JET-")) {
//       return {
//         valid: true,
//         userId: `user_${Date.now()}`,
//         userName: "Тестовый пользователь",
//       };
//     }

//     return {
//       valid: false,
//       error: "Неверный ключ. Ключ должен начинаться с JET-",
//     };
//   },

//   async getUserById(userId) {
//     return {
//       id: userId,
//       name: "Тестовый пользователь",
//       registrationKey: "JET-TEST-123",
//     };
//   },

//   async updateUserPhone(userId, phone) {
//     console.log("Обновлен телефон:", phone);
//     return true;
//   },

//   subscribeToUserOrders(userId, callback) {
//     // Демо данные
//     // setTimeout(() => {
//     //   callback([
//     //     {
//     //       id: "order_1",
//     //       title: "Тестовый заказ",
//     //       description: "Описание тестового заказа",
//     //       price: 1500,
//     //       location: "Москва, Красная площадь",
//     //       status: "в пути",
//     //       tracking: [
//     //         {
//     //           status: "новый",
//     //           location: "Склад отправки",
//     //           timestamp: new Date(Date.now() - 86400000).toISOString(),
//     //         },
//     //         {
//     //           status: "в пути",
//     //           location: "Москва, Красная площадь",
//     //           timestamp: new Date().toISOString(),
//     //         },
//     //       ],
//     //     },
//     //   ]);
//     // }, 500);

//     // Возвращаем функцию отписки
//     return () => {};
//   },
// };

// const steps = ["Ввод ключа", "Привязка телефона", "Мои заказы"];
// // Добавьте эту функцию в компонент MiniApp
// const handleActivate = async () => {
//   if (!telegramUser) {
//     setError(
//       "Не удалось получить данные Telegram. Откройте приложение через Telegram."
//     );
//     return;
//   }

//   try {
//     setLoading(true);
//     setError("");

//     // Отправляем запрос на регистрацию в админ-панель
//     const requestId = await firebaseService.addTelegramRequest({
//       telegramId: telegramUser.id,
//       firstName: telegramUser.firstName,
//       lastName: telegramUser.lastName,
//       username: telegramUser.username,
//       phone: telegramUser.phoneNumber || phone,
//     });

//     showSnackbar(
//       "Запрос на активацию отправлен! Администратор скоро свяжется с вами.",
//       "success"
//     );

//     // Если есть Telegram WebApp, показываем уведомление
//     if (window.Telegram?.WebApp) {
//       window.Telegram.WebApp.showAlert(
//         "✅ Запрос отправлен!\n\nАдминистратор рассмотрит вашу заявку и пришлет регистрационный ключ."
//       );
//     }
//   } catch (err) {
//     setError("Ошибка отправки запроса: " + err.message);
//   } finally {
//     setLoading(false);
//   }
// };

// // Добавьте эту кнопку в интерфейс MiniApp (рядом с полем ввода ключа или под ним)
// {
//   /* Кнопка активации для передачи данных в админку */
// }
// {
//   telegramUser && (
//     <Box sx={{ mt: 3, mb: 2, textAlign: "center" }}>
//       <Divider sx={{ mb: 3 }}>
//         <Chip label="или" size="small" />
//       </Divider>

//       <Typography variant="body2" color="textSecondary" gutterBottom>
//         У вас нет ключа? Отправьте запрос администратору
//       </Typography>

//       <Button
//         variant="outlined"
//         color="primary"
//         onClick={handleActivate}
//         disabled={loading}
//         startIcon={loading ? <CircularProgress size={20} /> : <TelegramIcon />}
//         sx={{ mt: 1 }}
//         size="large"
//       >
//         {loading ? "Отправка..." : "Активироваться"}
//       </Button>

//       <Typography
//         variant="caption"
//         display="block"
//         sx={{ mt: 1 }}
//         color="textSecondary"
//       >
//         После одобрения вы получите регистрационный ключ в Telegram
//       </Typography>
//     </Box>
//   );
// }
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

//   useEffect(() => {
//     const keyFromUrl = searchParams.get("key");
//     const telegramIdFromUrl = searchParams.get("telegramId");

//     if (keyFromUrl) {
//       setRegistrationKey(keyFromUrl);
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

//   const handleKeySubmit = async () => {
//     if (!registrationKey.trim()) {
//       setError("Введите регистрационный ключ");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       // 🔥 ПРОВЕРКА НА АДМИНСКИЙ КЛЮЧ
//       // 🔥 ПРОВЕРКА НА АДМИНСКИЙ КЛЮЧ
//       if (registrationKey === "Vs20080413") {
//         // Сохраняем что пользователь - админ
//         localStorage.setItem("admin_logged_in", "true");
//         localStorage.setItem("admin_key_used", registrationKey);
//         localStorage.setItem("admin_login_time", Date.now().toString());

//         // Перенаправляем в админку
//         window.location.href = "/admin";
//         return;
//       }

//       // Если не админский ключ, продолжаем обычную проверку
//       const validation = await mockFirebaseService.validateRegistrationKey(
//         registrationKey
//       );

//       if (!validation.valid) {
//         setError(validation.error);
//         return;
//       }

//       // Для демо просто создаем пользователя
//       const user = await mockFirebaseService.getUserById(validation.userId);
//       setUserData({
//         ...user,
//         registrationKey: registrationKey,
//       });

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
//         await mockFirebaseService.updateUserPhone(userData.id, phone);
//       } else if (telegramUser?.phoneNumber) {
//         await mockFirebaseService.updateUserPhone(
//           userData.id,
//           telegramUser.phoneNumber
//         );
//       }

//       setActiveStep(2);
//       mockFirebaseService.subscribeToUserOrders(userData.id, (ordersList) => {
//         setOrders(ordersList);
//       });
//     } catch (err) {
//       setError("Ошибка регистрации: " + err.message);
//     } finally {
//       setLoading(false);
//     }
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
//               onKeyPress={(e) => e.key === "Enter" && handleKeySubmit()}
//               placeholder="JET-ABC-123 или Vs20080413"
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
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Avatar,
  Snackbar,
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
import { firebaseService } from "../services/firebaseService";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [telegramUser, setTelegramUser] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const keyFromUrl = searchParams.get("key");
    if (keyFromUrl) {
      setRegistrationKey(keyFromUrl);
    }
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleKeySubmit = async () => {
    if (!registrationKey.trim()) {
      setError("Введите регистрационный ключ");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (registrationKey === "Vs20080413") {
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("admin_key_used", registrationKey);
        localStorage.setItem("admin_login_time", Date.now().toString());
        window.location.href = "/admin";
        return;
      }

      const validation = await firebaseService.validateRegistrationKey(
        registrationKey
      );

      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      const user = await firebaseService.getUserById(validation.userId);
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

  const handleActivate = async () => {
    if (!telegramUser) {
      setError(
        "Не удалось получить данные Telegram. Откройте приложение через Telegram."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const requestId = await firebaseService.addTelegramRequest({
        telegramId: telegramUser.id,
        firstName: telegramUser.firstName,
        lastName: telegramUser.lastName,
        username: telegramUser.username,
        phone: telegramUser.phoneNumber || phone,
      });

      setRequestSent(true);
      showSnackbar(
        "✅ Запрос на активацию отправлен! Администратор скоро свяжется с вами.",
        "success"
      );

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(
          "✅ Запрос отправлен!\n\nАдминистратор рассмотрит вашу заявку и пришлет регистрационный ключ в этот чат."
        );
      }
    } catch (err) {
      setError("Ошибка отправки запроса: " + err.message);
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
        await firebaseService.updateUserPhone(userData.id, phone);
      } else if (telegramUser?.phoneNumber) {
        await firebaseService.updateUserPhone(
          userData.id,
          telegramUser.phoneNumber
        );
      }

      setActiveStep(2);

      const unsubscribe = firebaseService.subscribeToUserOrders(
        userData.id,
        (ordersList) => {
          setOrders(ordersList);
        }
      );

      return () => unsubscribe();
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

  return (
    <Container maxWidth="md" sx={{ py: 2, minHeight: "100vh" }}>
      {window.Telegram?.WebApp && (
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Chip
            icon={<TelegramIcon />}
            label="JetZone Delivery в Telegram"
            color="primary"
            size="small"
            sx={{ borderRadius: 2 }}
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
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Шаг 1: Ввод ключа */}
        {activeStep === 0 && (
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              🔑 Введите регистрационный ключ
            </Typography>

            <Typography
              variant="body1"
              color="textSecondary"
              paragraph
              align="center"
            >
              Получите ключ у администратора или отправьте запрос на активацию
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
              <Alert severity="info" sx={{ mb: 3 }} icon={<TelegramIcon />}>
                <Typography variant="body2">
                  Вы вошли через Telegram как{" "}
                  <strong>{telegramUser.firstName}</strong>
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
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Продолжить"}
            </Button>

            {telegramUser && !requestSent && (
              <Box sx={{ mt: 3, mb: 2 }}>
                <Divider sx={{ mb: 3 }}>
                  <Chip label="или" size="small" />
                </Divider>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  align="center"
                >
                  У вас нет ключа? Отправьте запрос администратору
                </Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleActivate}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <TelegramIcon />
                  }
                  fullWidth
                  size="large"
                  sx={{ mt: 1 }}
                >
                  {loading ? "Отправка..." : "Активироваться"}
                </Button>

                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1 }}
                  color="textSecondary"
                  align="center"
                >
                  После одобрения вы получите регистрационный ключ в Telegram
                </Typography>
              </Box>
            )}

            {requestSent && (
              <Alert
                severity="success"
                sx={{ mt: 3 }}
                icon={<CheckCircleIcon />}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  ✅ Запрос отправлен!
                </Typography>
                <Typography variant="body2">
                  Ожидайте ответа от администратора. Ключ придет в этот чат.
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* Шаг 2: Привязка телефона */}
        {activeStep === 1 && userData && (
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              📱 Привязка телефона
            </Typography>

            <Card sx={{ mb: 3, bgcolor: "#e3f2fd", borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {userData.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ключ: <strong>{userData.registrationKey}</strong>
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">
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
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                📦 Мои заказы
              </Typography>
              <Chip
                label={`${orders.length} ${
                  orders.length === 1
                    ? "заказ"
                    : orders.length < 5
                    ? "заказа"
                    : "заказов"
                }`}
                color="primary"
                icon={<ShoppingBagIcon />}
                sx={{ borderRadius: 2 }}
              />
            </Box>

            <Alert severity="info" sx={{ mb: 3 }} icon={<PersonIcon />}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
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
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
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
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ fontWeight: "bold" }}
                            >
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
                              sx={{ borderRadius: 1 }}
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

                        {order.tracking && order.tracking.length > 0 && (
                          <Box sx={{ mt: 3 }}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{ fontWeight: "bold" }}
                            >
                              📍 История перемещений:
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {order.tracking.map((track, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    mb: 1,
                                  }}
                                >
                                  <Box sx={{ mr: 1, mt: 0.5 }}>
                                    {getStatusIcon(track.status)}
                                  </Box>
                                  <Box>
                                    <Typography variant="body2">
                                      {track.location}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      {new Date(track.timestamp).toLocaleString(
                                        "ru-RU"
                                      )}{" "}
                                      • {track.status}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
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
            </Box>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MiniApp;
