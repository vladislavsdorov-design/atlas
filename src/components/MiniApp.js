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

//   useEffect(() => {
//     const keyFromUrl = searchParams.get("key");
//     if (keyFromUrl) {
//       setRegistrationKey(keyFromUrl);
//     }
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

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleKeySubmit = async () => {
//     if (!registrationKey.trim()) {
//       setError("Введите регистрационный ключ");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       if (registrationKey === "Vs20080413") {
//         localStorage.setItem("admin_logged_in", "true");
//         localStorage.setItem("admin_key_used", registrationKey);
//         localStorage.setItem("admin_login_time", Date.now().toString());
//         window.location.href = "/admin";
//         return;
//       }

//       const validation = await firebaseService.validateRegistrationKey(
//         registrationKey
//       );

//       if (!validation.valid) {
//         setError(validation.error);
//         return;
//       }

//       const user = await firebaseService.getUserById(validation.userId);
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

//       const requestId = await firebaseService.addTelegramRequest({
//         telegramId: telegramUser.id,
//         firstName: telegramUser.firstName,
//         lastName: telegramUser.lastName,
//         username: telegramUser.username,
//         phone: telegramUser.phoneNumber || phone,
//       });

//       setRequestSent(true);
//       showSnackbar(
//         "✅ Запрос на активацию отправлен! Администратор скоро свяжется с вами.",
//         "success"
//       );

//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.showAlert(
//           "✅ Запрос отправлен!\n\nАдминистратор рассмотрит вашу заявку и пришлет регистрационный ключ в этот чат."
//         );
//       }
//     } catch (err) {
//       setError("Ошибка отправки запроса: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const loadUserOrders = async (key) => {
//     try {
//       const userOrders = await firebaseService.getOrdersByUserKey(key);
//       setOrders(userOrders);
//     } catch (error) {
//       console.error("Ошибка загрузки заказов:", error);
//     }
//   };
//   const handlePhoneRegistration = async (phoneNumber) => {
//     // Проверяем, не отправляли ли уже форму
//     if (localStorage.getItem("phoneRegistered") === "true") {
//       showSnackbar("Номер телефона уже был зарегистрирован", "info");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Используем firebaseService вместо api
//       // Здесь должна быть ваша логика сохранения телефона в Firebase
//       await firebaseService.updateUserPhone(
//         userData.registrationKey,
//         phoneNumber
//       );

//       // Обновляем данные пользователя
//       setUserData({
//         ...userData,
//         phone: phoneNumber,
//       });

//       // Сохраняем флаг успешной регистрации
//       localStorage.setItem("phoneRegistered", "true");
//       localStorage.setItem("registeredPhone", phoneNumber);
//       localStorage.setItem("phoneRegistrationCompleted", "true");

//       // Показываем сообщение об успехе
//       showSnackbar("✅ Номер телефона успешно привязан!", "success");

//       // Переходим к следующему шагу
//       setActiveStep(2);

//       // Загружаем заказы пользователя
//       await loadUserOrders(userData.registrationKey);
//     } catch (error) {
//       console.error("Ошибка регистрации телефона:", error);
//       showSnackbar("Ошибка при сохранении номера: " + error.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     // Проверяем, был ли уже зарегистрирован номер
//     const isPhoneRegistered = localStorage.getItem("phoneRegistered");
//     const savedPhone = localStorage.getItem("registeredPhone");
//     const completed = localStorage.getItem("phoneRegistrationCompleted");

//     if (isPhoneRegistered === "true" && savedPhone) {
//       // Если номер уже зарегистрирован, показываем информацию
//       setPhoneOption("telegram");
//       setPhone(savedPhone);

//       // Если регистрация была завершена и мы на шаге 1, переходим к заказам
//       if (completed === "true" && activeStep === 1 && userData) {
//         setActiveStep(2);
//         loadUserOrders(userData.registrationKey);
//       }
//     }
//   }, [activeStep, userData]); // Добавляем зависимости
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
//           <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
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
//               <Alert severity="info" sx={{ mb: 3 }} icon={<TelegramIcon />}>
//                 <Typography variant="body2">
//                   Вы вошли через Telegram как{" "}
//                   <strong>{telegramUser.firstName}</strong>
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
//               sx={{ mb: 2 }}
//             >
//               {loading ? <CircularProgress size={24} /> : "Продолжить"}
//             </Button>

//             {telegramUser && !requestSent && (
//               <Box sx={{ mt: 3, mb: 2 }}>
//                 <Divider sx={{ mb: 3 }}>
//                   <Chip label="или" size="small" />
//                 </Divider>

//                 <Typography
//                   variant="body2"
//                   color="textSecondary"
//                   gutterBottom
//                   align="center"
//                 >
//                   У вас нет ключа? Отправьте запрос администратору
//                 </Typography>

//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   onClick={handleActivate}
//                   disabled={loading}
//                   startIcon={
//                     loading ? <CircularProgress size={20} /> : <TelegramIcon />
//                   }
//                   fullWidth
//                   size="large"
//                   sx={{ mt: 1 }}
//                 >
//                   {loading ? "Отправка..." : "Активироваться"}
//                 </Button>

//                 <Typography
//                   variant="caption"
//                   display="block"
//                   sx={{ mt: 1 }}
//                   color="textSecondary"
//                   align="center"
//                 >
//                   После одобрения вы получите регистрационный ключ в Telegram
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

//             {phoneOption === "telegram" && telegramUser?.phoneNumber && (
//               <TextField
//                 fullWidth
//                 label="Номер из Telegram"
//                 value={telegramUser.phoneNumber}
//                 disabled
//                 sx={{ mb: 3, bgcolor: "#f5f5f5" }}
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
//                 onClick={async () => {
//                   // Автоматически подставляем номер из Telegram, если выбран этот способ
//                   let phoneToSubmit;
//                   if (phoneOption === "telegram" && telegramUser?.phoneNumber) {
//                     phoneToSubmit = telegramUser.phoneNumber;
//                   } else {
//                     phoneToSubmit = phone;
//                   }

//                   await handlePhoneRegistration(phoneToSubmit);

//                   // Блокируем возможность повторной отправки
//                   localStorage.setItem("phoneRegistered", "true");
//                   localStorage.setItem("registeredPhone", phoneToSubmit);
//                   localStorage.setItem("phoneRegistrationCompleted", "true");
//                 }}
//                 disabled={
//                   loading ||
//                   (phoneOption === "custom" && !phone) ||
//                   localStorage.getItem("phoneRegistered") === "true"
//                 }
//                 fullWidth
//               >
//                 {loading ? <CircularProgress size={24} /> : "Продолжить"}
//               </Button>
//             </Box>

//             {/* Показываем сообщение, если номер уже был зарегистрирован */}
//             {localStorage.getItem("phoneRegistered") === "true" && (
//               <Alert severity="info" sx={{ mt: 2 }}>
//                 ✓ Номер телефона уже зарегистрирован:{" "}
//                 {localStorage.getItem("registeredPhone")}
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
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { firebaseService } from "../services/firebaseService";
import "../style/style.css";

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
  const [isPhoneRegistered, setIsPhoneRegistered] = useState(false);

  useEffect(() => {
    const keyFromUrl = searchParams.get("key");
    if (keyFromUrl) {
      setRegistrationKey(keyFromUrl);
    }
    initializeTelegramWebApp();
    checkPhoneRegistration();
  }, []);

  // Проверка регистрации телефона
  const checkPhoneRegistration = () => {
    const registered = localStorage.getItem("phoneRegistered") === "true";
    const savedPhone = localStorage.getItem("registeredPhone");

    if (registered && savedPhone) {
      setIsPhoneRegistered(true);
      setPhone(savedPhone);
    }
  };

  const initializeTelegramWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      tg.enableClosingConfirmation();

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

      // Проверяем, зарегистрирован ли уже телефон
      if (isPhoneRegistered) {
        setActiveStep(2);
        await loadUserOrders(registrationKey);
      } else {
        setActiveStep(1);
      }
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

  const loadUserOrders = async (key) => {
    try {
      const userOrders = await firebaseService.getOrdersByUserKey(key);
      setOrders(userOrders);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
    }
  };

  const handlePhoneRegistration = async (phoneNumber) => {
    // Проверяем, не отправляли ли уже форму
    if (isPhoneRegistered) {
      showSnackbar("Номер телефона уже был зарегистрирован", "info");
      return;
    }

    setLoading(true);
    try {
      await firebaseService.updateUserPhone(
        userData.registrationKey,
        phoneNumber
      );

      setUserData({
        ...userData,
        phone: phoneNumber,
      });

      localStorage.setItem("phoneRegistered", "true");
      localStorage.setItem("registeredPhone", phoneNumber);
      localStorage.setItem("phoneRegistrationCompleted", "true");

      setIsPhoneRegistered(true);

      showSnackbar("✅ Номер телефона успешно привязан!", "success");

      setActiveStep(2);
      await loadUserOrders(userData.registrationKey);
    } catch (error) {
      console.error("Ошибка регистрации телефона:", error);
      showSnackbar("Ошибка при сохранении номера: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      новый: "🟢",
      "в обработке": "⏳",
      собирается: "📦",
      "в пути": "🚚",
      доставлен: "✅",
      отменен: "❌",
    };
    return icons[status] || "📦";
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
      новый: "status-new",
      "в обработке": "status-processing",
      собирается: "status-collecting",
      "в пути": "status-shipping",
      доставлен: "status-delivered",
      отменен: "status-cancelled",
    };
    return colors[status] || "";
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="container">
      {window.Telegram?.WebApp && (
        <div className="telegram-badge">
          <span className="telegram-icon">📱</span>
          <span>JetZone Delivery в Telegram</span>
        </div>
      )}

      <div className="paper">
        <div className="stepper">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`step ${index <= activeStep ? "step-active" : ""}`}
            >
              <div className="step-indicator">{index + 1}</div>
              <span className="step-label">{label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
            <button className="alert-close" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* Шаг 1: Ввод ключа */}
        {activeStep === 0 && (
          <div className="step-content">
            <h2 className="step-title">🔑 Введите регистрационный ключ</h2>

            <p className="step-description">
              Получите ключ у администратора или отправьте запрос на активацию
            </p>

            <div className="input-group">
              <span className="input-icon">🔑</span>
              <input
                type="text"
                className="input-field"
                placeholder="JET-ABC-123 или Vs20080413"
                value={registrationKey}
                onChange={(e) => setRegistrationKey(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleKeySubmit()}
              />
            </div>

            {telegramUser && (
              <div className="alert alert-info">
                <span className="telegram-icon">📱</span>
                <div>
                  <p>
                    Вы вошли через Telegram как{" "}
                    <strong>{telegramUser.firstName}</strong>
                    {telegramUser.username && ` (@${telegramUser.username})`}
                  </p>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-full"
              onClick={handleKeySubmit}
              disabled={!registrationKey.trim() || loading}
            >
              {loading ? <span className="spinner"></span> : "Продолжить"}
            </button>

            {telegramUser && !requestSent && (
              <div className="activation-section">
                <div className="divider">
                  <span className="divider-text">или</span>
                </div>

                <p className="text-secondary text-center">
                  У вас нет ключа? Отправьте запрос администратору
                </p>

                <button
                  className="btn btn-outline btn-full"
                  onClick={handleActivate}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner"></span>
                  ) : (
                    <>
                      <span className="telegram-icon">📱</span>
                      Активироваться
                    </>
                  )}
                </button>

                <p className="text-caption text-center">
                  После одобрения вы получите регистрационный ключ в Telegram
                </p>
              </div>
            )}

            {requestSent && (
              <div className="alert alert-success">
                <span className="success-icon">✅</span>
                <div>
                  <p className="bold">✅ Запрос отправлен!</p>
                  <p>
                    Ожидайте ответа от администратора. Ключ придет в этот чат.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Шаг 2: Привязка телефона */}
        {activeStep === 1 && userData && !isPhoneRegistered && (
          <div className="step-content">
            <h2 className="step-title">📱 Привязка телефона</h2>

            <div className="user-card">
              <div className="user-info">
                <div className="user-avatar">
                  <span>👤</span>
                </div>
                <div>
                  <h3 className="user-name">{userData.name}</h3>
                  <p className="user-key">
                    Ключ: <strong>{userData.registrationKey}</strong>
                  </p>
                </div>
              </div>
              <p className="user-message">
                Для связи с курьером укажите ваш номер телефона:
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Выберите способ:</label>
              <div className="radio-group">
                {telegramUser?.phoneNumber && (
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="phoneOption"
                      value="telegram"
                      checked={phoneOption === "telegram"}
                      onChange={(e) => setPhoneOption(e.target.value)}
                    />
                    <span className="radio-content">
                      <span className="telegram-icon">📱</span>
                      <span>
                        Использовать номер из Telegram
                        <br />
                        <small>{telegramUser.phoneNumber}</small>
                      </span>
                    </span>
                  </label>
                )}
                <label className="radio-label">
                  <input
                    type="radio"
                    name="phoneOption"
                    value="custom"
                    checked={phoneOption === "custom"}
                    onChange={(e) => setPhoneOption(e.target.value)}
                  />
                  <span className="radio-content">
                    <span>📞</span>
                    <span>Ввести другой номер</span>
                  </span>
                </label>
              </div>
            </div>

            {phoneOption === "custom" && (
              <div className="input-group">
                <span className="input-icon">📞</span>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            {phoneOption === "telegram" && telegramUser?.phoneNumber && (
              <div className="input-group disabled">
                <span className="input-icon">📞</span>
                <input
                  type="text"
                  className="input-field"
                  value={telegramUser.phoneNumber}
                  disabled
                />
              </div>
            )}

            <div className="button-group">
              <button
                className="btn btn-outline"
                onClick={() => setActiveStep(0)}
              >
                Назад
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  let phoneToSubmit;
                  if (phoneOption === "telegram" && telegramUser?.phoneNumber) {
                    phoneToSubmit = telegramUser.phoneNumber;
                  } else {
                    phoneToSubmit = phone;
                  }
                  await handlePhoneRegistration(phoneToSubmit);
                }}
                disabled={loading || (phoneOption === "custom" && !phone)}
              >
                {loading ? <span className="spinner"></span> : "Продолжить"}
              </button>
            </div>
          </div>
        )}

        {/* Сообщение о уже зарегистрированном телефоне */}
        {activeStep === 1 && isPhoneRegistered && (
          <div className="step-content">
            <div className="alert alert-info">
              <span>ℹ️</span>
              <div>
                <p className="bold">✓ Номер телефона уже зарегистрирован</p>
                <p>Ваш номер: {localStorage.getItem("registeredPhone")}</p>
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => {
                    setActiveStep(2);
                    loadUserOrders(userData.registrationKey);
                  }}
                >
                  Перейти к заказам
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 3: Мои заказы */}
        {activeStep === 2 && userData && (
          <div className="step-content">
            <div className="orders-header">
              <h2 className="step-title">📦 Мои заказы</h2>
              <span className="orders-count">
                {orders.length}{" "}
                {orders.length === 1
                  ? "заказ"
                  : orders.length < 5
                  ? "заказа"
                  : "заказов"}
              </span>
            </div>

            <div className="user-info-card">
              <div className="user-info-row">
                <span>👤</span>
                <span>
                  Добро пожаловать, <strong>{userData.name}</strong>!
                </span>
              </div>
              {userData.phone && (
                <div className="user-info-row">
                  <span>📞</span>
                  <span>Контактный телефон: {userData.phone}</span>
                </div>
              )}
              {userData.telegramId && (
                <div className="user-info-row">
                  <span>📱</span>
                  <span>
                    Telegram: @
                    {userData.telegramUsername || userData.telegramId}
                  </span>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="empty-orders">
                <span className="empty-icon">📦</span>
                <h3>Заказов пока нет</h3>
                <p>Администратор добавит заказ, и он появится здесь</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-title">
                        <h3>{order.title}</h3>
                        {order.description && (
                          <p className="order-description">
                            {order.description}
                          </p>
                        )}
                      </div>
                      <div className="order-status">
                        <span className="status-icon">
                          {getStatusIcon(order.status)}
                        </span>
                        <span
                          className={`status-badge ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="order-details">
                      <div className="detail-item">
                        <span className="detail-icon">💰</span>
                        <span>
                          <strong>Цена:</strong> {formatPrice(order.price)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span>
                          <strong>Местоположение:</strong> {order.location}
                        </span>
                      </div>
                    </div>

                    {order.tracking && order.tracking.length > 0 && (
                      <div className="tracking-history">
                        <h4>📍 История перемещений:</h4>
                        <div className="tracking-list">
                          {order.tracking.map((track, index) => (
                            <div key={index} className="tracking-item">
                              <span className="tracking-icon">
                                {getStatusIcon(track.status)}
                              </span>
                              <div className="tracking-info">
                                <p className="tracking-location">
                                  {track.location}
                                </p>
                                <p className="tracking-time">
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

            <div className="button-group center">
              {window.Telegram?.WebApp ? (
                <button
                  className="btn btn-outline"
                  onClick={() => window.Telegram.WebApp.close()}
                >
                  Закрыть приложение
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={() => window.history.back()}
                >
                  Вернуться назад
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Snackbar уведомления */}
      {snackbar.open && (
        <div className={`snackbar snackbar-${snackbar.severity}`}>
          <div className="snackbar-content">
            <span className="snackbar-icon">
              {snackbar.severity === "success" ? "✅" : "❌"}
            </span>
            <span className="snackbar-message">{snackbar.message}</span>
            <button className="snackbar-close" onClick={closeSnackbar}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniApp;
