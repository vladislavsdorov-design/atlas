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
//   Divider,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   Avatar,
//   Snackbar,
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
// import "../style/style.css";

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
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [telegramUser, setTelegramUser] = useState(null);
//   const [requestSent, setRequestSent] = useState(false);
//   const [isPhoneRegistered, setIsPhoneRegistered] = useState(false);
//   const [userId, setUserId] = useState(null);

//   // Инициализация при загрузке
//   useEffect(() => {
//     const keyFromUrl = searchParams.get("key");
//     if (keyFromUrl) {
//       setRegistrationKey(keyFromUrl);
//     }
//     initializeTelegramWebApp();
//     checkSavedData();
//   }, []);

//   // Проверка сохраненных данных
//   const checkSavedData = async () => {
//     try {
//       const savedUserId = localStorage.getItem("jetzone_user_id");
//       const savedKey = localStorage.getItem("jetzone_registration_key");
//       const savedPhone = localStorage.getItem("jetzone_phone");
//       const phoneRegistered = localStorage.getItem("jetzone_phone_registered");

//       if (savedUserId && savedKey) {
//         setUserId(savedUserId);
//         setRegistrationKey(savedKey);

//         // Загружаем данные пользователя
//         const user = await firebaseService.getUserById(savedUserId);
//         if (user) {
//           setUserData({
//             ...user,
//             id: savedUserId,
//             registrationKey: savedKey,
//           });

//           // Если есть телефон в базе или localStorage
//           if (user.phone) {
//             setPhone(user.phone);
//             setIsPhoneRegistered(true);
//             setActiveStep(2);
//             await loadUserOrders(savedUserId);
//           } else if (savedPhone && phoneRegistered === "true") {
//             setPhone(savedPhone);
//             setIsPhoneRegistered(true);
//             setActiveStep(2);
//             await loadUserOrders(savedUserId);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Ошибка проверки сохраненных данных:", error);
//     }
//   };

//   const initializeTelegramWebApp = () => {
//     if (window.Telegram && window.Telegram.WebApp) {
//       const tg = window.Telegram.WebApp;
//       tg.expand();
//       tg.enableClosingConfirmation();
//       tg.setBackgroundColor("#0a0a0a");
//       tg.setHeaderColor("secondary_bg_color");

//       const user = tg.initDataUnsafe?.user;
//       if (user) {
//         console.log("Telegram user data:", user);
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

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });

//     if (window.Telegram?.WebApp && severity === "success") {
//       window.Telegram.WebApp.showPopup({
//         title: "Успешно",
//         message: message,
//         buttons: [{ type: "ok" }],
//       });
//     } else if (window.Telegram?.WebApp && severity === "error") {
//       window.Telegram.WebApp.showPopup({
//         title: "Ошибка",
//         message: message,
//         buttons: [{ type: "ok" }],
//       });
//     }
//   };

//   const handleKeySubmit = async () => {
//     if (!registrationKey.trim()) {
//       setError("Введите регистрационный ключ");
//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
//       }
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       // Проверка админского ключа
//       if (registrationKey === "VS20080413") {
//         localStorage.setItem("admin_logged_in", "true");
//         localStorage.setItem("admin_key_used", registrationKey);
//         localStorage.setItem("admin_login_time", Date.now().toString());

//         if (window.Telegram?.WebApp) {
//           window.Telegram.WebApp.showPopup({
//             title: "Вход в админку",
//             message: "Перенаправление в панель администратора...",
//             buttons: [{ type: "ok" }],
//           });
//         }

//         window.location.href = "/admin";
//         return;
//       }

//       // Валидация ключа
//       const validation = await firebaseService.validateRegistrationKey(
//         registrationKey
//       );

//       if (!validation.valid) {
//         setError(validation.error);
//         if (window.Telegram?.WebApp) {
//           window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
//         }
//         return;
//       }

//       // Получаем данные пользователя
//       const user = await firebaseService.getUserById(validation.userId);

//       const userDataWithId = {
//         ...user,
//         registrationKey: registrationKey,
//         id: validation.userId,
//       };

//       setUserData(userDataWithId);
//       setUserId(validation.userId);

//       // Сохраняем в localStorage
//       localStorage.setItem("jetzone_registration_key", registrationKey);
//       localStorage.setItem("jetzone_user_id", validation.userId);

//       // Если у пользователя уже есть телефон
//       if (user.phone) {
//         setPhone(user.phone);
//         setIsPhoneRegistered(true);
//         localStorage.setItem("jetzone_phone", user.phone);
//         localStorage.setItem("jetzone_phone_registered", "true");

//         setActiveStep(2);
//         await loadUserOrders(validation.userId);
//       } else {
//         setActiveStep(1);
//       }

//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
//       }
//     } catch (err) {
//       console.error("Ошибка проверки ключа:", err);
//       setError("Ошибка проверки ключа: " + err.message);
//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActivate = async () => {
//     if (!telegramUser) {
//       setError(
//         "Не удалось получить данные Telegram. Откройте приложение через Telegram."
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const requestData = {
//         telegramId: telegramUser.id,
//         firstName: telegramUser.firstName,
//         lastName: telegramUser.lastName,
//         username: telegramUser.username,
//         phone: telegramUser.phoneNumber || phone || "",
//       };

//       console.log("Отправка запроса на активацию:", requestData);

//       const requestId = await firebaseService.addTelegramRequest(requestData);

//       setRequestSent(true);

//       showSnackbar(
//         "✅ Запрос на активацию отправлен! Администратор скоро свяжется с вами.",
//         "success"
//       );

//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.showPopup({
//           title: "Запрос отправлен",
//           message:
//             "✅ Ваш запрос на активацию отправлен!\n\nАдминистратор рассмотрит вашу заявку и пришлет регистрационный ключ в этот чат.",
//           buttons: [{ type: "ok" }],
//         });
//       }
//     } catch (err) {
//       console.error("Ошибка отправки запроса:", err);
//       setError("Ошибка отправки запроса: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUserOrders = async (userId) => {
//     try {
//       const userOrders = await firebaseService.getUserOrders(userId);
//       console.log("Загружены заказы:", userOrders);
//       setOrders(Array.isArray(userOrders) ? userOrders : []);
//     } catch (error) {
//       console.error("Ошибка загрузки заказов:", error);
//       setOrders([]);
//     }
//   };

//   // ИСПРАВЛЕННАЯ функция регистрации телефона
//   const handlePhoneRegistration = async (phoneNumber) => {
//     // Проверяем номер
//     if (!phoneNumber || phoneNumber.trim() === "") {
//       showSnackbar("Введите номер телефона", "error");
//       return;
//     }

//     // Очищаем номер
//     const cleanPhone = phoneNumber.trim().replace(/[^\d+]/g, "");

//     // Проверяем наличие userData и userId
//     if (!userData || !userData.id) {
//       showSnackbar("Ошибка: данные пользователя не найдены", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log(
//         "Сохраняем телефон для пользователя:",
//         userData.id,
//         cleanPhone
//       );

//       // Сохраняем телефон в Firebase по ID пользователя
//       const success = await firebaseService.updateUserPhone(
//         userData.id,
//         cleanPhone
//       );

//       if (!success) {
//         throw new Error("Не удалось сохранить номер телефона");
//       }

//       // Обновляем данные пользователя
//       setUserData({
//         ...userData,
//         phone: cleanPhone,
//       });

//       // Сохраняем в localStorage
//       localStorage.setItem("jetzone_phone", cleanPhone);
//       localStorage.setItem("jetzone_phone_registered", "true");
//       localStorage.setItem(
//         "jetzone_phone_registration_date",
//         new Date().toISOString()
//       );

//       // Удаляем старые ключи
//       localStorage.removeItem("phoneRegistered");
//       localStorage.removeItem("registeredPhone");
//       localStorage.removeItem("phoneRegistrationCompleted");

//       setIsPhoneRegistered(true);

//       showSnackbar("✅ Номер телефона успешно привязан!", "success");

//       // СРАЗУ переходим к заказам без возврата
//       setActiveStep(2);

//       // Загружаем заказы пользователя
//       await loadUserOrders(userData.id);

//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
//       }
//     } catch (error) {
//       console.error("Ошибка регистрации телефона:", error);
//       showSnackbar("Ошибка при сохранении номера: " + error.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Функция для повторной отправки запроса
//   const handleResendRequest = () => {
//     setRequestSent(false);
//     setError("");
//   };

//   // Эффект для проверки при монтировании
//   useEffect(() => {
//     // Проверяем, был ли уже зарегистрирован номер в старом формате
//     const oldPhoneRegistered = localStorage.getItem("phoneRegistered");
//     const oldPhone = localStorage.getItem("registeredPhone");

//     if (
//       oldPhoneRegistered === "true" &&
//       oldPhone &&
//       !localStorage.getItem("jetzone_phone")
//     ) {
//       // Переносим старые данные в новый формат
//       localStorage.setItem("jetzone_phone", oldPhone);
//       localStorage.setItem("jetzone_phone_registered", "true");
//     }

//     // Проверяем новый формат
//     const savedPhone = localStorage.getItem("jetzone_phone");
//     const phoneRegistered = localStorage.getItem("jetzone_phone_registered");

//     if (savedPhone && phoneRegistered === "true") {
//       setPhone(savedPhone);
//       setIsPhoneRegistered(true);
//     }
//   }, []);

//   const getStatusIcon = (status) => {
//     const icons = {
//       новый: <CheckCircleIcon className="ro-icon ro-icon-primary" />,
//       "в обработке": <ScheduleIcon className="ro-icon ro-icon-warning" />,
//       собирается: <ShoppingBagIcon className="ro-icon ro-icon-info" />,
//       "в пути": <ShippingIcon className="ro-icon ro-icon-secondary" />,
//       доставлен: <CheckCircleIcon className="ro-icon ro-icon-success" />,
//       отменен: <CheckCircleIcon className="ro-icon ro-icon-error" />,
//     };
//     return icons[status] || <CheckCircleIcon className="ro-icon" />;
//   };

//   const formatPrice = (price) => {
//     const numPrice = Number(price);
//     if (isNaN(numPrice)) return "0 ₽";

//     return new Intl.NumberFormat("ru-RU", {
//       style: "currency",
//       currency: "RUB",
//       minimumFractionDigits: 0,
//     }).format(numPrice);
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       новый: "ro-chip-primary",
//       "в обработке": "ro-chip-warning",
//       собирается: "ro-chip-info",
//       "в пути": "ro-chip-secondary",
//       доставлен: "ro-chip-success",
//       отменен: "ro-chip-error",
//     };
//     return colors[status] || "ro-chip-default";
//   };

//   return (
//     <Container maxWidth="md" className="ro-container">
//       <Box className="ro-telegram-chip-wrapper">
//         <video src="/video.mp4" autoPlay muted loop playsInline />

//         <div className="ro-telegram-chip-text">ATLAS</div>
//       </Box>

//       <Paper className="ro-paper">
//         <Stepper activeStep={activeStep} className="ro-stepper">
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel className="ro-step-label">{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {error && (
//           <Alert
//             severity="error"
//             className="ro-alert ro-alert-error"
//             onClose={() => setError("")}
//             action={
//               requestSent && (
//                 <Button
//                   color="inherit"
//                   size="small"
//                   onClick={handleResendRequest}
//                   className="ro-alert-button"
//                 >
//                   Отправить снова
//                 </Button>
//               )
//             }
//           >
//             {error}
//           </Alert>
//         )}

//         {/* Шаг 1: Ввод ключа */}
//         {activeStep === 0 && (
//           <Box className="ro-step-content">
//             <Typography className="ro-step-title">
//               Введите регистрационный ключ
//             </Typography>

//             <Typography className="ro-step-subtitle">
//               Получите ключ у администратора или отправьте запрос на активацию
//             </Typography>

//             <TextField
//               fullWidth
//               label="Регистрационный ключ"
//               value={registrationKey}
//               onChange={(e) => setRegistrationKey(e.target.value.toUpperCase())}
//               onKeyPress={(e) => e.key === "Enter" && handleKeySubmit()}
//               placeholder="JET-ABC-123"
//               className="ro-text-field"
//               disabled={loading}
//               InputProps={{
//                 startAdornment: <KeyIcon className="ro-input-icon" />,
//               }}
//             />

//             {telegramUser && (
//               <Alert
//                 severity="info"
//                 className="ro-telegram-alert"
//                 icon={<TelegramIcon />}
//               >
//                 <Typography className="ro-telegram-alert-text">
//                   Вы вошли через Telegram как{" "}
//                   <strong>
//                     {telegramUser.firstName} {telegramUser.lastName}
//                   </strong>
//                 </Typography>
//                 {telegramUser.username && (
//                   <Typography className="ro-telegram-alert-text">
//                     @{telegramUser.username}
//                   </Typography>
//                 )}
//                 {telegramUser.phoneNumber && (
//                   <Typography className="ro-telegram-alert-text ro-telegram-alert-phone">
//                     📞 {telegramUser.phoneNumber}
//                   </Typography>
//                 )}
//               </Alert>
//             )}

//             <Button
//               variant="contained"
//               onClick={handleKeySubmit}
//               disabled={!registrationKey.trim() || loading}
//               fullWidth
//               size="large"
//               className="ro-button ro-button-primary"
//             >
//               {loading ? (
//                 <CircularProgress size={24} className="ro-loading-spinner" />
//               ) : (
//                 "Продолжить"
//               )}
//             </Button>

//             {/* КНОПКА АКТИВАЦИИ ВСЕГДА ВИДНА если есть Telegram */}
//             {telegramUser && (
//               <Box className="ro-activation-wrapper">
//                 <Divider className="ro-divider">
//                   <Chip
//                     label="Нет ключа?"
//                     size="small"
//                     className="ro-divider-chip"
//                   />
//                 </Divider>

//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   onClick={handleActivate}
//                   disabled={loading || requestSent}
//                   startIcon={
//                     loading ? (
//                       <CircularProgress
//                         size={20}
//                         className="ro-loading-spinner-small"
//                       />
//                     ) : (
//                       <TelegramIcon />
//                     )
//                   }
//                   fullWidth
//                   size="large"
//                   className="ro-button ro-button-outline"
//                 >
//                   {loading ? "Отправка..." : "🔑 Запросить ключ активации"}
//                 </Button>

//                 <Typography className="ro-activation-caption">
//                   Нажмите, если у вас нет ключа
//                 </Typography>
//               </Box>
//             )}

//             {requestSent && (
//               <Alert
//                 severity="success"
//                 className="ro-alert ro-alert-success"
//                 icon={<CheckCircleIcon />}
//               >
//                 <Typography className="ro-alert-title">
//                   ✅ Запрос отправлен!
//                 </Typography>
//                 <Typography className="ro-alert-text">
//                   Ожидайте ответа от администратора. Ключ придет в этот чат.
//                 </Typography>
//                 <Button
//                   size="small"
//                   onClick={() => setRequestSent(false)}
//                   className="ro-alert-resend"
//                 >
//                   Отправить еще раз
//                 </Button>
//               </Alert>
//             )}
//           </Box>
//         )}

//         {/* Шаг 2: Привязка телефона */}
//         {activeStep === 1 && userData && (
//           <Box className="ro-step-content">
//             <Typography className="ro-step-title">
//               📱 Привязка телефона
//             </Typography>

//             <Card className="ro-user-card">
//               <CardContent>
//                 <Box className="ro-user-info">
//                   <Avatar className="ro-user-avatar">
//                     <PersonIcon />
//                   </Avatar>
//                   <Box>
//                     <Typography className="ro-user-name">
//                       {userData.name}
//                     </Typography>
//                     <Typography className="ro-user-key">
//                       Ключ: <strong>{userData.registrationKey}</strong>
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Typography className="ro-user-instruction">
//                   Для отслеживания заказов укажите ваш номер телефона:
//                 </Typography>
//               </CardContent>
//             </Card>

//             <FormControl component="fieldset" className="ro-form-control">
//               <FormLabel component="legend" className="ro-form-label">
//                 Выберите способ:
//               </FormLabel>
//               <RadioGroup
//                 value={phoneOption}
//                 onChange={(e) => setPhoneOption(e.target.value)}
//                 className="ro-radio-group"
//               >
//                 {telegramUser?.phoneNumber && (
//                   <FormControlLabel
//                     value="telegram"
//                     control={<Radio className="ro-radio" />}
//                     label={
//                       <Box className="ro-radio-label">
//                         <TelegramIcon className="ro-radio-icon" />
//                         <Box>
//                           <Typography className="ro-radio-text">
//                             Использовать номер из Telegram
//                           </Typography>
//                           <Typography className="ro-radio-caption">
//                             {telegramUser.phoneNumber}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     }
//                   />
//                 )}
//                 <FormControlLabel
//                   value="custom"
//                   control={<Radio className="ro-radio" />}
//                   label={
//                     <Box className="ro-radio-label">
//                       <PhoneIcon className="ro-radio-icon" />
//                       <Typography className="ro-radio-text">
//                         Ввести другой номер
//                       </Typography>
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
//                 className="ro-text-field ro-text-field-custom"
//                 disabled={loading}
//                 required
//               />
//             )}

//             {phoneOption === "telegram" && telegramUser?.phoneNumber && (
//               <TextField
//                 fullWidth
//                 label="Номер из Telegram"
//                 value={telegramUser.phoneNumber}
//                 disabled
//                 className="ro-text-field ro-text-field-disabled"
//               />
//             )}

//             {/* Только кнопка ПРОДОЛЖИТЬ, без кнопки НАЗАД */}
//             <Button
//               variant="contained"
//               onClick={async () => {
//                 let phoneToSubmit;
//                 if (phoneOption === "telegram" && telegramUser?.phoneNumber) {
//                   phoneToSubmit = telegramUser.phoneNumber;
//                 } else {
//                   phoneToSubmit = phone;
//                 }

//                 await handlePhoneRegistration(phoneToSubmit);
//               }}
//               disabled={
//                 loading ||
//                 (phoneOption === "custom" && !phone) ||
//                 isPhoneRegistered
//               }
//               fullWidth
//               size="large"
//               className="ro-button ro-button-primary ro-button-large"
//             >
//               {loading ? (
//                 <CircularProgress size={24} className="ro-loading-spinner" />
//               ) : (
//                 "Продолжить"
//               )}
//             </Button>

//             {/* Показываем сообщение, если номер уже был зарегистрирован */}
//             {isPhoneRegistered && (
//               <Alert severity="info" className="ro-alert ro-alert-info">
//                 ✓ Номер телефона уже зарегистрирован: {phone}
//               </Alert>
//             )}
//           </Box>
//         )}

//         {/* Шаг 3: Мои заказы */}
//         {activeStep === 2 && userData && (
//           <Box className="ro-step-content">
//             <Box className="ro-orders-header">
//               <Typography className="ro-orders-title">📦 Мои заказы</Typography>
//               <Chip
//                 label={`${orders.length} ${
//                   orders.length === 1
//                     ? "заказ"
//                     : orders.length < 5
//                     ? "заказа"
//                     : "заказов"
//                 }`}
//                 className="ro-orders-chip"
//                 icon={<ShoppingBagIcon className="ro-orders-chip-icon" />}
//               />
//             </Box>

//             <Alert
//               severity="info"
//               className="ro-welcome-alert"
//               icon={<PersonIcon />}
//             >
//               <Box className="ro-welcome-text">
//                 <Typography className="ro-welcome-greeting">
//                   Добро пожаловать, <strong>{userData.name}</strong>!
//                 </Typography>
//               </Box>
//               {(userData.phone || phone) && (
//                 <Typography className="ro-contact-info">
//                   <PhoneIcon className="ro-contact-icon" />
//                   Контактный телефон: {userData.phone || phone}
//                 </Typography>
//               )}
//               {telegramUser && (
//                 <Typography className="ro-contact-info">
//                   <TelegramIcon className="ro-contact-icon" />
//                   Telegram: @{telegramUser.username || telegramUser.id}
//                 </Typography>
//               )}
//             </Alert>

//             {orders.length === 0 ? (
//               <Paper className="ro-empty-orders">
//                 <ShoppingBagIcon className="ro-empty-icon" />
//                 <Typography className="ro-empty-title">
//                   Заказов пока нет
//                 </Typography>
//                 <Typography className="ro-empty-text">
//                   Администратор добавит заказ, и он появится здесь
//                 </Typography>
//               </Paper>
//             ) : (
//               <Grid container spacing={2} className="ro-orders-grid">
//                 {orders.map((order) => (
//                   <Grid item xs={12} key={order.id}>
//                     <Card className="ro-order-card">
//                       <CardContent>
//                         <Box className="ro-order-header">
//                           <Box className="ro-order-info">
//                             <Typography className="ro-order-title">
//                               {order.title}
//                             </Typography>
//                             {order.description && (
//                               <Typography className="ro-order-description">
//                                 {order.description}
//                               </Typography>
//                             )}
//                           </Box>
//                           <Box className="ro-order-status">
//                             {getStatusIcon(order.status)}
//                             <Chip
//                               label={order.status}
//                               className={`ro-order-status-chip ${getStatusColor(
//                                 order.status
//                               )}`}
//                               size="small"
//                             />
//                           </Box>
//                         </Box>

//                         <Grid
//                           container
//                           spacing={2}
//                           className="ro-order-details"
//                         >
//                           <Grid item xs={12} sm={6} md={3}>
//                             <Box className="ro-order-detail">
//                               <MoneyIcon className="ro-detail-icon ro-detail-icon-price" />
//                               <Typography className="ro-detail-text">
//                                 <strong>Цена:</strong>{" "}
//                                 {formatPrice(order.price)}
//                               </Typography>
//                             </Box>
//                           </Grid>
//                           <Grid item xs={12} sm={6} md={9}>
//                             <Box className="ro-order-detail">
//                               <LocationIcon className="ro-detail-icon ro-detail-icon-location" />
//                               <Typography className="ro-detail-text">
//                                 <strong>Местоположение:</strong>{" "}
//                                 {order.location}
//                               </Typography>
//                             </Box>
//                           </Grid>
//                         </Grid>

//                         {order.tracking && order.tracking.length > 0 && (
//                           <Box className="ro-tracking-section">
//                             <Typography className="ro-tracking-title">
//                               📍 История перемещений:
//                             </Typography>
//                             <Box className="ro-tracking-list">
//                               {order.tracking.map((track, index) => (
//                                 <Box key={index} className="ro-tracking-item">
//                                   <Box className="ro-tracking-icon">
//                                     {getStatusIcon(track.status)}
//                                   </Box>
//                                   <Box className="ro-tracking-content">
//                                     <Typography className="ro-tracking-location">
//                                       {track.location}
//                                     </Typography>
//                                     <Typography className="ro-tracking-time">
//                                       {new Date(track.timestamp).toLocaleString(
//                                         "ru-RU"
//                                       )}{" "}
//                                       • {track.status}
//                                     </Typography>
//                                   </Box>
//                                 </Box>
//                               ))}
//                             </Box>
//                           </Box>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}

//             <Box className="ro-close-button-wrapper">
//               {window.Telegram?.WebApp ? (
//                 <Button
//                   variant="outlined"
//                   onClick={() => window.Telegram.WebApp.close()}
//                   size="large"
//                   className="ro-button ro-button-close"
//                 >
//                   Закрыть приложение
//                 </Button>
//               ) : (
//                 <Button
//                   variant="outlined"
//                   onClick={() => window.history.back()}
//                   size="large"
//                   className="ro-button ro-button-close"
//                 >
//                   Вернуться назад
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         )}
//       </Paper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         className="ro-snackbar"
//       >
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           className="ro-snackbar-alert"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default MiniApp;
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { firebaseService } from "../services/firebaseService";
import "../style/style.css";

// Иконки как React компоненты
const PhoneIcon = () => <span className="icon">📞</span>;
const PersonIcon = () => <span className="icon">👤</span>;
const KeyIcon = () => (
  <span className="icon">
    <i className="fa-solid fa-key" style={{ color: "rgb(47, 47, 47)" }}></i>
  </span>
);
const ShoppingBagIcon = () => <span className="icon">🛍️</span>;
const LocationIcon = () => <span className="icon">📍</span>;
const MoneyIcon = () => <span className="icon">💰</span>;
const TelegramIcon = () => <span className="icon">✈️</span>;
const CheckCircleIcon = () => <span className="icon">✓</span>;
const ShippingIcon = () => <span className="icon">🚚</span>;
const ScheduleIcon = () => <span className="icon">⏰</span>;

const steps = ["Entering the key", "Phone binding", "My orders"];

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
  const [isPhoneRegistered, setIsPhoneRegistered] = useState(false);
  const [userId, setUserId] = useState(null);

  // Инициализация при загрузке
  useEffect(() => {
    const keyFromUrl = searchParams.get("key");
    if (keyFromUrl) {
      setRegistrationKey(keyFromUrl);
    }
    initializeTelegramWebApp();
    checkSavedData();
  }, []);

  // Проверка сохраненных данных
  const checkSavedData = async () => {
    try {
      const savedUserId = localStorage.getItem("jetzone_user_id");
      const savedKey = localStorage.getItem("jetzone_registration_key");
      const savedPhone = localStorage.getItem("jetzone_phone");
      const phoneRegistered = localStorage.getItem("jetzone_phone_registered");

      if (savedUserId && savedKey) {
        setUserId(savedUserId);
        setRegistrationKey(savedKey);

        const user = await firebaseService.getUserById(savedUserId);
        if (user) {
          setUserData({
            ...user,
            id: savedUserId,
            registrationKey: savedKey,
          });

          if (user.phone) {
            setPhone(user.phone);
            setIsPhoneRegistered(true);
            setActiveStep(2);
            await loadUserOrders(savedUserId);
          } else if (savedPhone && phoneRegistered === "true") {
            setPhone(savedPhone);
            setIsPhoneRegistered(true);
            setActiveStep(2);
            await loadUserOrders(savedUserId);
          }
        }
      }
    } catch (error) {
      console.error("Ошибка проверки сохраненных данных:", error);
    }
  };

  const initializeTelegramWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      tg.enableClosingConfirmation();

      const user = tg.initDataUnsafe?.user;
      if (user) {
        console.log("Telegram user data:", user);
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

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showPopup({
        title: severity === "success" ? "Успешно" : "Ошибка",
        message: message,
        buttons: [{ type: "ok" }],
      });
    }

    setTimeout(() => {
      setSnackbar({ open: false, message: "", severity: "success" });
    }, 4000);
  };

  const handleKeySubmit = async () => {
    if (!registrationKey.trim()) {
      setError("Введите регистрационный ключ");
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
      }
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (registrationKey === "VS20080413") {
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("admin_key_used", registrationKey);
        localStorage.setItem("admin_login_time", Date.now().toString());

        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showPopup({
            title: "Вход в админку",
            message: "Перенаправление в панель администратора...",
            buttons: [{ type: "ok" }],
          });
        }

        window.location.href = "/admin";
        return;
      }

      const validation = await firebaseService.validateRegistrationKey(
        registrationKey
      );

      if (!validation.valid) {
        setError(validation.error);
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
        }
        return;
      }

      const user = await firebaseService.getUserById(validation.userId);

      const userDataWithId = {
        ...user,
        registrationKey: registrationKey,
        id: validation.userId,
      };

      setUserData(userDataWithId);
      setUserId(validation.userId);

      localStorage.setItem("jetzone_registration_key", registrationKey);
      localStorage.setItem("jetzone_user_id", validation.userId);

      if (user.phone) {
        setPhone(user.phone);
        setIsPhoneRegistered(true);
        localStorage.setItem("jetzone_phone", user.phone);
        localStorage.setItem("jetzone_phone_registered", "true");

        setActiveStep(2);
        await loadUserOrders(validation.userId);
      } else {
        setActiveStep(1);
      }

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
      }
    } catch (err) {
      console.error("Ошибка проверки ключа:", err);
      setError("Ошибка проверки ключа: " + err.message);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
      }
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

      const requestData = {
        telegramId: telegramUser.id,
        firstName: telegramUser.firstName,
        lastName: telegramUser.lastName,
        username: telegramUser.username,
        phone: telegramUser.phoneNumber || phone || "",
      };

      console.log("Отправка запроса на активацию:", requestData);

      await firebaseService.addTelegramRequest(requestData);

      setRequestSent(true);

      showSnackbar(
        "✅ Запрос на активацию отправлен! Администратор скоро свяжется с вами.",
        "success"
      );
    } catch (err) {
      console.error("Ошибка отправки запроса:", err);
      setError("Ошибка отправки запроса: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserOrders = async (userId) => {
    try {
      const userOrders = await firebaseService.getUserOrders(userId);
      console.log("Загружены заказы:", userOrders);
      setOrders(Array.isArray(userOrders) ? userOrders : []);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
      setOrders([]);
    }
  };

  const handlePhoneRegistration = async (phoneNumber) => {
    if (!phoneNumber || phoneNumber.trim() === "") {
      showSnackbar("Введите номер телефона", "error");
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/[^\d+]/g, "");

    if (!userData || !userData.id) {
      showSnackbar("Ошибка: данные пользователя не найдены", "error");
      return;
    }

    setLoading(true);
    try {
      console.log(
        "Сохраняем телефон для пользователя:",
        userData.id,
        cleanPhone
      );

      const success = await firebaseService.updateUserPhone(
        userData.id,
        cleanPhone
      );

      if (!success) {
        throw new Error("Не удалось сохранить номер телефона");
      }

      setUserData({
        ...userData,
        phone: cleanPhone,
      });

      localStorage.setItem("jetzone_phone", cleanPhone);
      localStorage.setItem("jetzone_phone_registered", "true");
      localStorage.setItem(
        "jetzone_phone_registration_date",
        new Date().toISOString()
      );

      setIsPhoneRegistered(true);

      showSnackbar("✅ Номер телефона успешно привязан!", "success");

      setActiveStep(2);
      await loadUserOrders(userData.id);

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
      }
    } catch (error) {
      console.error("Ошибка регистрации телефона:", error);
      showSnackbar("Ошибка при сохранении номера: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendRequest = () => {
    setRequestSent(false);
    setError("");
  };

  useEffect(() => {
    const oldPhoneRegistered = localStorage.getItem("phoneRegistered");
    const oldPhone = localStorage.getItem("registeredPhone");

    if (
      oldPhoneRegistered === "true" &&
      oldPhone &&
      !localStorage.getItem("jetzone_phone")
    ) {
      localStorage.setItem("jetzone_phone", oldPhone);
      localStorage.setItem("jetzone_phone_registered", "true");
    }

    const savedPhone = localStorage.getItem("jetzone_phone");
    const phoneRegistered = localStorage.getItem("jetzone_phone_registered");

    if (savedPhone && phoneRegistered === "true") {
      setPhone(savedPhone);
      setIsPhoneRegistered(true);
    }
  }, []);

  const getStatusIcon = (status) => {
    const icons = {
      новый: <CheckCircleIcon />,
      "в обработке": <ScheduleIcon />,
      собирается: <ShoppingBagIcon />,
      "в пути": <ShippingIcon />,
      доставлен: <CheckCircleIcon />,
      отменен: <CheckCircleIcon />,
    };
    return icons[status] || <CheckCircleIcon />;
  };

  const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return "0 ₽";

    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getStatusColor = (status) => {
    const colors = {
      новый: "ro-chip-primary",
      "в обработке": "ro-chip-warning",
      собирается: "ro-chip-info",
      "в пути": "ro-chip-secondary",
      доставлен: "ro-chip-success",
      отменен: "ro-chip-error",
    };
    return colors[status] || "ro-chip-default";
  };

  const renderStepper = () => {
    return (
      <div className="ro-stepper">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`ro-step ${
              index === activeStep
                ? "ro-step-active"
                : index < activeStep
                ? "ro-step-completed"
                : ""
            }`}
          >
            <div className="ro-step-icon">{index + 1}</div>
            <span className="ro-step-label">{label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderAlert = (type, message, onClose, action) => {
    return (
      <div className={`ro-alert ro-alert-${type}`}>
        <div className="ro-alert-content">
          <div className="ro-alert-message">{message}</div>
          {action && <div className="ro-alert-action">{action}</div>}
        </div>
        {onClose && (
          <button className="ro-alert-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="ro-container">
      <div className="ro-telegram-chip-wrapper">
        <video src="/video.mp4" autoPlay muted loop playsInline />
        <div className="ro-telegram-chip-text">ATLAS</div>
      </div>

      <div className="ro-paper">
        {renderStepper()}

        {error &&
          renderAlert(
            "error",
            error,
            () => setError(""),
            requestSent && (
              <button className="ro-alert-button" onClick={handleResendRequest}>
                Отправить снова
              </button>
            )
          )}

        {/* Шаг 1: Ввод ключа */}
        {activeStep === 0 && (
          <div className="ro-step-content">
            <h1 className="ro-step-title">Введите регистрационный ключ</h1>

            <p className="ro-step-subtitle">
              Получите ключ у администратора или отправьте запрос на активацию
            </p>

            <div className="ro-text-field">
              <label>Регистрационный ключ</label>
              <div className="ro-input-wrapper">
                <KeyIcon />
                <input
                  type="text"
                  value={registrationKey}
                  onChange={(e) =>
                    setRegistrationKey(e.target.value.toUpperCase())
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleKeySubmit()}
                  placeholder="JET-ABC-123"
                  disabled={loading}
                />
              </div>
            </div>

            {telegramUser && (
              <div className="ro-telegram-alert">
                <TelegramIcon />
                <div className="ro-telegram-alert-content">
                  <p className="ro-telegram-alert-text">
                    Вы вошли через Telegram как{" "}
                    <strong>
                      {telegramUser.firstName} {telegramUser.lastName}
                    </strong>
                  </p>
                  {telegramUser.username && (
                    <p className="ro-telegram-alert-text">
                      @{telegramUser.username}
                    </p>
                  )}
                  {telegramUser.phoneNumber && (
                    <p className="ro-telegram-alert-text ro-telegram-alert-phone">
                      📞 {telegramUser.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              className="ro-button ro-button-primary"
              onClick={handleKeySubmit}
              disabled={!registrationKey.trim() || loading}
            >
              {loading ? <span className="ro-loading-spinner" /> : "Продолжить"}
            </button>

            {telegramUser && (
              <div className="ro-activation-wrapper">
                <hr className="ro-divider" />
                <div className="ro-divider-chip">Нет ключа?</div>

                <button
                  className="ro-button ro-button-outline"
                  onClick={handleActivate}
                  disabled={loading || requestSent}
                >
                  {loading ? (
                    <span className="ro-loading-spinner-small" />
                  ) : (
                    <>
                      <TelegramIcon />
                      <span className="icon">
                        <i
                          className="fa-solid fa-key"
                          style={{ color: "rgb(255, 255, 255)" }}
                        ></i>
                      </span>{" "}
                      Запросить ключ активации
                    </>
                  )}
                </button>

                <p className="ro-activation-caption">
                  Нажмите, если у вас нет ключа
                </p>
              </div>
            )}

            {requestSent && (
              <div className="ro-alert ro-alert-success">
                <CheckCircleIcon />
                <div className="ro-alert-content">
                  <h3 className="ro-alert-title">✅ Запрос отправлен!</h3>
                  <p className="ro-alert-text">
                    Ожидайте ответа от администратора. Ключ придет в этот чат.
                  </p>
                  <button
                    className="ro-alert-resend"
                    onClick={() => setRequestSent(false)}
                  >
                    Отправить еще раз
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Шаг 2: Привязка телефона */}
        {activeStep === 1 && userData && (
          <div className="ro-step-content">
            <h1 className="ro-step-title">📱 Привязка телефона</h1>

            <div className="ro-user-card">
              <div className="ro-user-info">
                <div className="ro-user-avatar">
                  <PersonIcon />
                </div>
                <div>
                  <h3 className="ro-user-name">{userData.name}</h3>
                  <p className="ro-user-key">
                    Ключ: <strong>{userData.registrationKey}</strong>
                  </p>
                </div>
              </div>
              <p className="ro-user-instruction">
                Для отслеживания заказов укажите ваш номер телефона:
              </p>
            </div>

            <div className="ro-form-control">
              <label className="ro-form-label">Выберите способ:</label>
              <div className="ro-radio-group">
                {telegramUser?.phoneNumber && (
                  <label className="ro-radio">
                    <input
                      type="radio"
                      name="phoneOption"
                      value="telegram"
                      checked={phoneOption === "telegram"}
                      onChange={(e) => setPhoneOption(e.target.value)}
                    />
                    <div className="ro-radio-label">
                      <TelegramIcon />
                      <div>
                        <span className="ro-radio-text">
                          Использовать номер из Telegram
                        </span>
                        <span className="ro-radio-caption">
                          {telegramUser.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </label>
                )}
                <label className="ro-radio">
                  <input
                    type="radio"
                    name="phoneOption"
                    value="custom"
                    checked={phoneOption === "custom"}
                    onChange={(e) => setPhoneOption(e.target.value)}
                  />
                  <div className="ro-radio-label">
                    <PhoneIcon />
                    <span className="ro-radio-text">Ввести другой номер</span>
                  </div>
                </label>
              </div>
            </div>

            {phoneOption === "custom" && (
              <div className="ro-text-field ro-text-field-custom">
                <label>Ваш номер телефона</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  disabled={loading}
                  required
                />
              </div>
            )}

            {phoneOption === "telegram" && telegramUser?.phoneNumber && (
              <div className="ro-text-field ro-text-field-disabled">
                <label>Номер из Telegram</label>
                <input type="tel" value={telegramUser.phoneNumber} disabled />
              </div>
            )}

            <button
              className="ro-button ro-button-primary ro-button-large"
              onClick={async () => {
                let phoneToSubmit;
                if (phoneOption === "telegram" && telegramUser?.phoneNumber) {
                  phoneToSubmit = telegramUser.phoneNumber;
                } else {
                  phoneToSubmit = phone;
                }
                await handlePhoneRegistration(phoneToSubmit);
              }}
              disabled={
                loading ||
                (phoneOption === "custom" && !phone) ||
                isPhoneRegistered
              }
            >
              {loading ? <span className="ro-loading-spinner" /> : "Продолжить"}
            </button>

            {isPhoneRegistered && (
              <div className="ro-alert ro-alert-info">
                ✓ Номер телефона уже зарегистрирован: {phone}
              </div>
            )}
          </div>
        )}

        {/* Шаг 3: Мои заказы */}
        {activeStep === 2 && userData && (
          <div className="ro-step-content">
            <div className="ro-orders-header">
              <h2 className="ro-orders-title">📦 Мои заказы</h2>
              <div className="ro-orders-chip">
                <ShoppingBagIcon />
                <span>{`${orders.length} ${
                  orders.length === 1
                    ? "заказ"
                    : orders.length < 5
                    ? "заказа"
                    : "заказов"
                }`}</span>
              </div>
            </div>

            <div className="ro-welcome-alert">
              <PersonIcon />
              <div className="ro-welcome-content">
                <p className="ro-welcome-greeting">
                  Добро пожаловать, <strong>{userData.name}</strong>!
                </p>
                {(userData.phone || phone) && (
                  <p className="ro-contact-info">
                    <PhoneIcon />
                    Контактный телефон: {userData.phone || phone}
                  </p>
                )}
                {telegramUser && (
                  <p className="ro-contact-info">
                    <TelegramIcon />
                    Telegram: @{telegramUser.username || telegramUser.id}
                  </p>
                )}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="ro-empty-orders">
                <ShoppingBagIcon />
                <h3 className="ro-empty-title">Заказов пока нет</h3>
                <p className="ro-empty-text">
                  Администратор добавит заказ, и он появится здесь
                </p>
              </div>
            ) : (
              <div className="ro-orders-grid">
                {orders.map((order) => (
                  <div key={order.id} className="ro-order-card">
                    <div className="ro-order-header">
                      <div className="ro-order-info">
                        <h3 className="ro-order-title">{order.title}</h3>
                        {order.description && (
                          <p className="ro-order-description">
                            {order.description}
                          </p>
                        )}
                      </div>
                      <div className="ro-order-status">
                        <span className={`ro-icon ro-icon-${order.status}`}>
                          {getStatusIcon(order.status)}
                        </span>
                        <span
                          className={`ro-order-status-chip ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="ro-order-details">
                      <div className="ro-order-detail">
                        <MoneyIcon />
                        <p className="ro-detail-text">
                          <strong>Цена:</strong> {formatPrice(order.price)}
                        </p>
                      </div>
                      <div className="ro-order-detail">
                        <LocationIcon />
                        <p className="ro-detail-text">
                          <strong>Местоположение:</strong> {order.location}
                        </p>
                      </div>
                    </div>

                    {order.tracking && order.tracking.length > 0 && (
                      <div className="ro-tracking-section">
                        <h4 className="ro-tracking-title">
                          📍 История перемещений:
                        </h4>
                        <div className="ro-tracking-list">
                          {order.tracking.map((track, index) => (
                            <div key={index} className="ro-tracking-item">
                              <div className="ro-tracking-icon">
                                {getStatusIcon(track.status)}
                              </div>
                              <div className="ro-tracking-content">
                                <p className="ro-tracking-location">
                                  {track.location}
                                </p>
                                <p className="ro-tracking-time">
                                  {new Date(track.timestamp).toLocaleString(
                                    "ru-RU"
                                  )}{" "}
                                  • {track.status}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="ro-close-button-wrapper">
              {window.Telegram?.WebApp ? (
                <button
                  className="ro-button ro-button-close"
                  onClick={() => window.Telegram.WebApp.close()}
                >
                  Закрыть приложение
                </button>
              ) : (
                <button
                  className="ro-button ro-button-close"
                  onClick={() => window.history.back()}
                >
                  Вернуться назад
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {snackbar.open && (
        <div className="ro-snackbar">
          <div className={`ro-snackbar-alert ro-alert-${snackbar.severity}`}>
            {snackbar.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniApp;

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
//   Divider,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   Avatar,
//   Snackbar,
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
// import "../style/style.css";

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
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [telegramUser, setTelegramUser] = useState(null);
//   const [requestSent, setRequestSent] = useState(false);
//   const [isPhoneRegistered, setIsPhoneRegistered] = useState(false);
//   const [userId, setUserId] = useState(null);

//   // Инициализация при загрузке
//   useEffect(() => {
//     const keyFromUrl = searchParams.get("key");
//     if (keyFromUrl) {
//       setRegistrationKey(keyFromUrl);
//     }
//     initializeTelegramWebApp();
//     checkSavedData();
//   }, []);

//   // Проверка сохраненных данных
//   const checkSavedData = async () => {
//     try {
//       const savedUserId = localStorage.getItem("jetzone_user_id");
//       const savedKey = localStorage.getItem("jetzone_registration_key");
//       const savedPhone = localStorage.getItem("jetzone_phone");
//       const phoneRegistered = localStorage.getItem("jetzone_phone_registered");

//       if (savedUserId && savedKey) {
//         setUserId(savedUserId);
//         setRegistrationKey(savedKey);

//         // Загружаем данные пользователя
//         const user = await firebaseService.getUserById(savedUserId);
//         if (user) {
//           setUserData({
//             ...user,
//             id: savedUserId,
//             registrationKey: savedKey,
//           });

//           // Если есть телефон в базе или localStorage
//           if (user.phone) {
//             setPhone(user.phone);
//             setIsPhoneRegistered(true);
//             setActiveStep(2);
//             await loadUserOrders(savedUserId);
//           } else if (savedPhone && phoneRegistered === "true") {
//             setPhone(savedPhone);
//             setIsPhoneRegistered(true);
//             setActiveStep(2);
//             await loadUserOrders(savedUserId);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Ошибка проверки сохраненных данных:", error);
//     }
//   };

//   const initializeTelegramWebApp = () => {
//     if (window.Telegram && window.Telegram.WebApp) {
//       const tg = window.Telegram.WebApp;
//       tg.expand();
//       tg.enableClosingConfirmation();
//       tg.setBackgroundColor("#f8f9fa");
//       tg.setHeaderColor("secondary_bg_color");

//       const user = tg.initDataUnsafe?.user;
//       if (user) {
//         console.log("Telegram user data:", user);
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

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });

//     if (window.Telegram?.WebApp && severity === "success") {
//       window.Telegram.WebApp.showPopup({
//         title: "Успешно",
//         message: message,
//         buttons: [{ type: "ok" }],
//       });
//     } else if (window.Telegram?.WebApp && severity === "error") {
//       window.Telegram.WebApp.showPopup({
//         title: "Ошибка",
//         message: message,
//         buttons: [{ type: "ok" }],
//       });
//     }
//   };

//   const handleKeySubmit = async () => {
//     if (!registrationKey.trim()) {
//       setError("Введите регистрационный ключ");
//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
//       }
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       // Проверка админского ключа
//       if (registrationKey === "Vs20080413") {
//         localStorage.setItem("admin_logged_in", "true");
//         localStorage.setItem("admin_key_used", registrationKey);
//         localStorage.setItem("admin_login_time", Date.now().toString());

//         if (window.Telegram?.WebApp) {
//           window.Telegram.WebApp.showPopup({
//             title: "Вход в админку",
//             message: "Перенаправление в панель администратора...",
//             buttons: [{ type: "ok" }],
//           });
//         }

//         window.location.href = "/admin";
//         return;
//       }

//       // Валидация ключа
//       const validation = await firebaseService.validateRegistrationKey(
//         registrationKey
//       );

//       if (!validation.valid) {
//         setError(validation.error);
//         if (window.Telegram?.WebApp) {
//           window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
//         }
//         return;
//       }

//       // Получаем данные пользователя
//       const user = await firebaseService.getUserById(validation.userId);

//       const userDataWithId = {
//         ...user,
//         registrationKey: registrationKey,
//         id: validation.userId,
//       };

//       setUserData(userDataWithId);
//       setUserId(validation.userId);

//       // Сохраняем в localStorage
//       localStorage.setItem("jetzone_registration_key", registrationKey);
//       localStorage.setItem("jetzone_user_id", validation.userId);

//       // Если у пользователя уже есть телефон
//       if (user.phone) {
//         setPhone(user.phone);
//         setIsPhoneRegistered(true);
//         localStorage.setItem("jetzone_phone", user.phone);
//         localStorage.setItem("jetzone_phone_registered", "true");

//         setActiveStep(2);
//         await loadUserOrders(validation.userId);
//       } else {
//         setActiveStep(1);
//       }

//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
//       }
//     } catch (err) {
//       console.error("Ошибка проверки ключа:", err);
//       setError("Ошибка проверки ключа: " + err.message);
//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActivate = async () => {
//     if (!telegramUser) {
//       setError(
//         "Не удалось получить данные Telegram. Откройте приложение через Telegram."
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const requestData = {
//         telegramId: telegramUser.id,
//         firstName: telegramUser.firstName,
//         lastName: telegramUser.lastName,
//         username: telegramUser.username,
//         phone: telegramUser.phoneNumber || phone || "",
//       };

//       console.log("Отправка запроса на активацию:", requestData);

//       const requestId = await firebaseService.addTelegramRequest(requestData);

//       setRequestSent(true);

//       showSnackbar(
//         "✅ Запрос на активацию отправлен! Администратор скоро свяжется с вами.",
//         "success"
//       );

//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.showPopup({
//           title: "Запрос отправлен",
//           message:
//             "✅ Ваш запрос на активацию отправлен!\n\nАдминистратор рассмотрит вашу заявку и пришлет регистрационный ключ в этот чат.",
//           buttons: [{ type: "ok" }],
//         });
//       }
//     } catch (err) {
//       console.error("Ошибка отправки запроса:", err);
//       setError("Ошибка отправки запроса: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUserOrders = async (userId) => {
//     try {
//       const userOrders = await firebaseService.getUserOrders(userId);
//       console.log("Загружены заказы:", userOrders);
//       setOrders(Array.isArray(userOrders) ? userOrders : []);
//     } catch (error) {
//       console.error("Ошибка загрузки заказов:", error);
//       setOrders([]);
//     }
//   };

//   // ИСПРАВЛЕННАЯ функция регистрации телефона
//   const handlePhoneRegistration = async (phoneNumber) => {
//     // Проверяем номер
//     if (!phoneNumber || phoneNumber.trim() === "") {
//       showSnackbar("Введите номер телефона", "error");
//       return;
//     }

//     // Очищаем номер
//     const cleanPhone = phoneNumber.trim().replace(/[^\d+]/g, "");

//     // Проверяем наличие userData и userId
//     if (!userData || !userData.id) {
//       showSnackbar("Ошибка: данные пользователя не найдены", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log(
//         "Сохраняем телефон для пользователя:",
//         userData.id,
//         cleanPhone
//       );

//       // Сохраняем телефон в Firebase по ID пользователя
//       const success = await firebaseService.updateUserPhone(
//         userData.id,
//         cleanPhone
//       );

//       if (!success) {
//         throw new Error("Не удалось сохранить номер телефона");
//       }

//       // Обновляем данные пользователя
//       setUserData({
//         ...userData,
//         phone: cleanPhone,
//       });

//       // Сохраняем в localStorage
//       localStorage.setItem("jetzone_phone", cleanPhone);
//       localStorage.setItem("jetzone_phone_registered", "true");
//       localStorage.setItem(
//         "jetzone_phone_registration_date",
//         new Date().toISOString()
//       );

//       // Удаляем старые ключи
//       localStorage.removeItem("phoneRegistered");
//       localStorage.removeItem("registeredPhone");
//       localStorage.removeItem("phoneRegistrationCompleted");

//       setIsPhoneRegistered(true);

//       showSnackbar("✅ Номер телефона успешно привязан!", "success");

//       // СРАЗУ переходим к заказам без возврата
//       setActiveStep(2);

//       // Загружаем заказы пользователя
//       await loadUserOrders(userData.id);

//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
//       }
//     } catch (error) {
//       console.error("Ошибка регистрации телефона:", error);
//       showSnackbar("Ошибка при сохранении номера: " + error.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Функция для повторной отправки запроса
//   const handleResendRequest = () => {
//     setRequestSent(false);
//     setError("");
//   };

//   // Эффект для проверки при монтировании
//   useEffect(() => {
//     // Проверяем, был ли уже зарегистрирован номер в старом формате
//     const oldPhoneRegistered = localStorage.getItem("phoneRegistered");
//     const oldPhone = localStorage.getItem("registeredPhone");

//     if (
//       oldPhoneRegistered === "true" &&
//       oldPhone &&
//       !localStorage.getItem("jetzone_phone")
//     ) {
//       // Переносим старые данные в новый формат
//       localStorage.setItem("jetzone_phone", oldPhone);
//       localStorage.setItem("jetzone_phone_registered", "true");
//     }

//     // Проверяем новый формат
//     const savedPhone = localStorage.getItem("jetzone_phone");
//     const phoneRegistered = localStorage.getItem("jetzone_phone_registered");

//     if (savedPhone && phoneRegistered === "true") {
//       setPhone(savedPhone);
//       setIsPhoneRegistered(true);
//     }
//   }, []);

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
//     const numPrice = Number(price);
//     if (isNaN(numPrice)) return "0 ₽";

//     return new Intl.NumberFormat("ru-RU", {
//       style: "currency",
//       currency: "RUB",
//       minimumFractionDigits: 0,
//     }).format(numPrice);
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

//   return (
//     <Container maxWidth="md" sx={{ py: 2, minHeight: "100vh" }}>
//       {window.Telegram?.WebApp && (
//         <Box sx={{ mb: 2, textAlign: "center" }}>
//           <Chip
//             icon={<TelegramIcon />}
//             label="JetZone Delivery в Telegram"
//             color="primary"
//             size="small"
//             sx={{ borderRadius: 2 }}
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
//           <Alert
//             severity="error"
//             sx={{ mb: 2 }}
//             onClose={() => setError("")}
//             action={
//               requestSent && (
//                 <Button
//                   color="inherit"
//                   size="small"
//                   onClick={handleResendRequest}
//                 >
//                   Отправить снова
//                 </Button>
//               )
//             }
//           >
//             {error}
//           </Alert>
//         )}

//         {/* Шаг 1: Ввод ключа */}
//         {activeStep === 0 && (
//           <Box>
//             <Typography
//               variant="h5"
//               gutterBottom
//               align="center"
//               sx={{ fontWeight: "bold" }}
//             >
//               🔑 Введите регистрационный ключ
//             </Typography>

//             <Typography
//               variant="body1"
//               color="textSecondary"
//               paragraph
//               align="center"
//             >
//               Получите ключ у администратора или отправьте запрос на активацию
//             </Typography>

//             <TextField
//               fullWidth
//               label="Регистрационный ключ"
//               value={registrationKey}
//               onChange={(e) => setRegistrationKey(e.target.value.toUpperCase())}
//               onKeyPress={(e) => e.key === "Enter" && handleKeySubmit()}
//               placeholder="JET-ABC-123"
//               sx={{ mb: 3, mt: 2 }}
//               disabled={loading}
//               InputProps={{
//                 startAdornment: (
//                   <KeyIcon sx={{ mr: 1, color: "action.active" }} />
//                 ),
//               }}
//             />

//             {telegramUser && (
//               <Alert severity="info" sx={{ mb: 3 }} icon={<TelegramIcon />}>
//                 <Typography variant="body2">
//                   Вы вошли через Telegram как{" "}
//                   <strong>
//                     {telegramUser.firstName} {telegramUser.lastName}
//                   </strong>
//                 </Typography>
//                 {telegramUser.username && (
//                   <Typography variant="body2">
//                     @{telegramUser.username}
//                   </Typography>
//                 )}
//                 {telegramUser.phoneNumber && (
//                   <Typography variant="body2" sx={{ mt: 1 }}>
//                     📞 {telegramUser.phoneNumber}
//                   </Typography>
//                 )}
//               </Alert>
//             )}

//             <Button
//               variant="contained"
//               onClick={handleKeySubmit}
//               disabled={!registrationKey.trim() || loading}
//               fullWidth
//               size="large"
//               sx={{ mb: 2 }}
//             >
//               {loading ? <CircularProgress size={24} /> : "Продолжить"}
//             </Button>

//             {/* КНОПКА АКТИВАЦИИ ВСЕГДА ВИДНА если есть Telegram */}
//             {telegramUser && (
//               <Box sx={{ mt: 2 }}>
//                 <Divider sx={{ mb: 2 }}>
//                   <Chip label="Нет ключа?" size="small" />
//                 </Divider>

//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   onClick={handleActivate}
//                   disabled={loading || requestSent}
//                   startIcon={
//                     loading ? <CircularProgress size={20} /> : <TelegramIcon />
//                   }
//                   fullWidth
//                   size="large"
//                   sx={{
//                     py: 1.5,
//                     borderWidth: 2,
//                     "&:hover": {
//                       borderWidth: 2,
//                     },
//                   }}
//                 >
//                   {loading ? "Отправка..." : "🔑 Запросить ключ активации"}
//                 </Button>

//                 <Typography
//                   variant="caption"
//                   display="block"
//                   sx={{ mt: 1, textAlign: "center", fontWeight: 500 }}
//                   color="textSecondary"
//                 >
//                   Нажмите, если у вас нет ключа
//                 </Typography>
//               </Box>
//             )}

//             {requestSent && (
//               <Alert
//                 severity="success"
//                 sx={{ mt: 3 }}
//                 icon={<CheckCircleIcon />}
//               >
//                 <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                   ✅ Запрос отправлен!
//                 </Typography>
//                 <Typography variant="body2">
//                   Ожидайте ответа от администратора. Ключ придет в этот чат.
//                 </Typography>
//                 <Button
//                   size="small"
//                   sx={{ mt: 1 }}
//                   onClick={() => setRequestSent(false)}
//                   color="inherit"
//                 >
//                   Отправить еще раз
//                 </Button>
//               </Alert>
//             )}
//           </Box>
//         )}

//         {/* Шаг 2: Привязка телефона */}
//         {activeStep === 1 && userData && (
//           <Box>
//             <Typography
//               variant="h5"
//               gutterBottom
//               align="center"
//               sx={{ fontWeight: "bold" }}
//             >
//               📱 Привязка телефона
//             </Typography>

//             <Card sx={{ mb: 3, bgcolor: "#e3f2fd", borderRadius: 2 }}>
//               <CardContent>
//                 <Box
//                   sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
//                 >
//                   <Avatar sx={{ bgcolor: "primary.main" }}>
//                     <PersonIcon />
//                   </Avatar>
//                   <Box>
//                     <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//                       {userData.name}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Ключ: <strong>{userData.registrationKey}</strong>
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Typography variant="body2">
//                   Для отслеживания заказов укажите ваш номер телефона:
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
//                 disabled={loading}
//                 required
//               />
//             )}

//             {phoneOption === "telegram" && telegramUser?.phoneNumber && (
//               <TextField
//                 fullWidth
//                 label="Номер из Telegram"
//                 value={telegramUser.phoneNumber}
//                 disabled
//                 sx={{ mb: 3, bgcolor: "#f5f5f5" }}
//               />
//             )}

//             {/* Только кнопка ПРОДОЛЖИТЬ, без кнопки НАЗАД */}
//             <Button
//               variant="contained"
//               onClick={async () => {
//                 let phoneToSubmit;
//                 if (phoneOption === "telegram" && telegramUser?.phoneNumber) {
//                   phoneToSubmit = telegramUser.phoneNumber;
//                 } else {
//                   phoneToSubmit = phone;
//                 }

//                 await handlePhoneRegistration(phoneToSubmit);
//               }}
//               disabled={
//                 loading ||
//                 (phoneOption === "custom" && !phone) ||
//                 isPhoneRegistered
//               }
//               fullWidth
//               size="large"
//               sx={{ py: 1.5 }}
//             >
//               {loading ? <CircularProgress size={24} /> : "Продолжить"}
//             </Button>

//             {/* Показываем сообщение, если номер уже был зарегистрирован */}
//             {isPhoneRegistered && (
//               <Alert severity="info" sx={{ mt: 2 }}>
//                 ✓ Номер телефона уже зарегистрирован: {phone}
//               </Alert>
//             )}
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
//               <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//                 📦 Мои заказы
//               </Typography>
//               <Chip
//                 label={`${orders.length} ${
//                   orders.length === 1
//                     ? "заказ"
//                     : orders.length < 5
//                     ? "заказа"
//                     : "заказов"
//                 }`}
//                 color="primary"
//                 icon={<ShoppingBagIcon />}
//                 sx={{ borderRadius: 2 }}
//               />
//             </Box>

//             <Alert severity="info" sx={{ mb: 3 }} icon={<PersonIcon />}>
//               <Box
//                 sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
//               >
//                 <Typography variant="body1">
//                   Добро пожаловать, <strong>{userData.name}</strong>!
//                 </Typography>
//               </Box>
//               {(userData.phone || phone) && (
//                 <Typography variant="body2">
//                   <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
//                   Контактный телефон: {userData.phone || phone}
//                 </Typography>
//               )}
//               {telegramUser && (
//                 <Typography variant="body2">
//                   <TelegramIcon fontSize="small" sx={{ mr: 0.5 }} />
//                   Telegram: @{telegramUser.username || telegramUser.id}
//                 </Typography>
//               )}
//             </Alert>

//             {orders.length === 0 ? (
//               <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
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
//                     <Card elevation={2} sx={{ borderRadius: 2 }}>
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
//                             <Typography
//                               variant="h6"
//                               gutterBottom
//                               sx={{ fontWeight: "bold" }}
//                             >
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
//                               sx={{ borderRadius: 1 }}
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

//                         {order.tracking && order.tracking.length > 0 && (
//                           <Box sx={{ mt: 3 }}>
//                             <Typography
//                               variant="subtitle2"
//                               gutterBottom
//                               sx={{ fontWeight: "bold" }}
//                             >
//                               📍 История перемещений:
//                             </Typography>
//                             <Box sx={{ mt: 1 }}>
//                               {order.tracking.map((track, index) => (
//                                 <Box
//                                   key={index}
//                                   sx={{
//                                     display: "flex",
//                                     alignItems: "flex-start",
//                                     mb: 1,
//                                   }}
//                                 >
//                                   <Box sx={{ mr: 1, mt: 0.5 }}>
//                                     {getStatusIcon(track.status)}
//                                   </Box>
//                                   <Box>
//                                     <Typography variant="body2">
//                                       {track.location}
//                                     </Typography>
//                                     <Typography
//                                       variant="caption"
//                                       color="textSecondary"
//                                     >
//                                       {new Date(track.timestamp).toLocaleString(
//                                         "ru-RU"
//                                       )}{" "}
//                                       • {track.status}
//                                     </Typography>
//                                   </Box>
//                                 </Box>
//                               ))}
//                             </Box>
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
//                   size="large"
//                 >
//                   Закрыть приложение
//                 </Button>
//               ) : (
//                 <Button
//                   variant="outlined"
//                   onClick={() => window.history.back()}
//                   size="large"
//                 >
//                   Вернуться назад
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         )}
//       </Paper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default MiniApp;
