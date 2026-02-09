// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Stepper,
//   Step,
//   StepLabel,
//   TextareaAutosize,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Send as SendIcon,
//   LocationOn as LocationIcon,
//   Phone as PhoneIcon,
//   Telegram as TelegramIcon,
//   ContentCopy as CopyIcon,
//   Visibility as ViewIcon,
//   LocalShipping as ShippingIcon,
// } from "@mui/icons-material";
// import { firebaseService } from "../services/firebaseService";
// import { telegramService } from "../services/telegramService";

// function TabPanel({ children, value, index }) {
//   return (
//     <div hidden={value !== index}>
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// const AdminPanel = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newUser, setNewUser] = useState({ name: "", phone: "" });
//   const [newOrder, setNewOrder] = useState({
//     title: "",
//     description: "",
//     price: "",
//     location: "",
//   });
//   const [locationUpdate, setLocationUpdate] = useState({
//     orderId: "",
//     location: "",
//     status: "",
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [addUserDialog, setAddUserDialog] = useState(false);
//   const [addOrderDialog, setAddOrderDialog] = useState(false);
//   const [updateLocationDialog, setUpdateLocationDialog] = useState(false);
//   const [userOrders, setUserOrders] = useState([]);
//   const [generatedKey, setGeneratedKey] = useState("");

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     const allUsers = await firebaseService.getAllUsers();
//     setUsers(allUsers);
//   };

//   const handleCreateUser = async () => {
//     if (!newUser.name.trim()) {
//       showSnackbar("Введите имя пользователя", "error");
//       return;
//     }

//     try {
//       const { userId, key } = await firebaseService.createUser(newUser);

//       showSnackbar("Пользователь создан! Ключ отправлен в Telegram");
//       setGeneratedKey(key);

//       // Отправляем ключ в Telegram
//       await telegramService.sendRegistrationKey(
//         userId,
//         `🔑 Ваш регистрационный ключ для JetZone:\n\n` +
//           `📛 Ключ: *${key}*\n` +
//           `👤 Имя: ${newUser.name}\n\n` +
//           `Используйте этот ключ в мини-приложении для регистрации.`
//       );

//       setNewUser({ name: "", phone: "" });
//       setAddUserDialog(false);
//       loadUsers();
//     } catch (error) {
//       showSnackbar("Ошибка создания пользователя: " + error.message, "error");
//     }
//   };

//   const handleAddOrder = async () => {
//     if (!selectedUser || !newOrder.title.trim() || !newOrder.location.trim()) {
//       showSnackbar("Заполните все обязательные поля", "error");
//       return;
//     }

//     try {
//       const orderId = await firebaseService.addOrder(selectedUser.id, {
//         ...newOrder,
//         price: parseFloat(newOrder.price) || 0,
//       });

//       showSnackbar("Заказ успешно добавлен!");

//       // Отправляем уведомление в Telegram
//       if (selectedUser.telegramId) {
//         await telegramService.sendOrderUpdate(
//           selectedUser.id,
//           orderId,
//           `📦 *Новый заказ добавлен!*\n\n` +
//             `*${newOrder.title}*\n` +
//             `${newOrder.description}\n` +
//             `💰 ${newOrder.price} ₽\n` +
//             `📍 ${newOrder.location}\n\n` +
//             `Статус: 🆕 новый`
//         );
//       }

//       setNewOrder({ title: "", description: "", price: "", location: "" });
//       setAddOrderDialog(false);

//       // Загружаем обновленные заказы
//       if (selectedUser) {
//         loadUserOrders(selectedUser.id);
//       }
//     } catch (error) {
//       showSnackbar("Ошибка добавления заказа: " + error.message, "error");
//     }
//   };

//   const handleUpdateLocation = async () => {
//     if (!locationUpdate.orderId || !locationUpdate.location.trim()) {
//       showSnackbar("Введите местоположение", "error");
//       return;
//     }

//     try {
//       const success = await firebaseService.updateOrderLocation(
//         selectedUser.id,
//         locationUpdate.orderId,
//         locationUpdate.location,
//         locationUpdate.status
//       );

//       if (success) {
//         showSnackbar("Местоположение обновлено!");

//         // Отправляем уведомление в Telegram
//         if (selectedUser.telegramId) {
//           await telegramService.sendOrderUpdate(
//             selectedUser.id,
//             locationUpdate.orderId,
//             `📍 *Обновление местоположения!*\n\n` +
//               `Новое местоположение: *${locationUpdate.location}*\n` +
//               `Статус: ${locationUpdate.status || "в пути"}\n\n` +
//               `✅ Посылка движется к вам!`
//           );
//         }

//         setLocationUpdate({ orderId: "", location: "", status: "" });
//         setUpdateLocationDialog(false);
//         loadUserOrders(selectedUser.id);
//       }
//     } catch (error) {
//       showSnackbar("Ошибка обновления: " + error.message, "error");
//     }
//   };

//   const loadUserOrders = async (userId) => {
//     const orders = await firebaseService.getUserOrders(userId);
//     setUserOrders(orders);
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     showSnackbar("Скопировано в буфер обмена");
//   };

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
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
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       <Typography variant="h3" gutterBottom>
//         👨‍💼 Панель администратора JetZone Delivery
//       </Typography>

//       <Paper elevation={3} sx={{ mt: 3 }}>
//         <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
//           <Tab label="Пользователи" />
//           <Tab label="Добавить заказ" />
//           <Tab label="Обновить местоположение" />
//           <Tab label="Отправка уведомлений" />
//         </Tabs>

//         <TabPanel value={tabValue} index={0}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//             <Typography variant="h6">
//               Все пользователи ({users.length})
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setAddUserDialog(true)}
//             >
//               Создать пользователя
//             </Button>
//           </Box>

//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Имя</TableCell>
//                   <TableCell>Телефон</TableCell>
//                   <TableCell>Telegram</TableCell>
//                   <TableCell>Регистрационный ключ</TableCell>
//                   <TableCell>Заказов</TableCell>
//                   <TableCell>Действия</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.map((user) => (
//                   <TableRow
//                     key={user.id}
//                     hover
//                     selected={selectedUser?.id === user.id}
//                     onClick={() => {
//                       setSelectedUser(user);
//                       loadUserOrders(user.id);
//                     }}
//                   >
//                     <TableCell>
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                       >
//                         {user.telegramId && (
//                           <TelegramIcon color="primary" fontSize="small" />
//                         )}
//                         {user.name}
//                       </Box>
//                     </TableCell>
//                     <TableCell>{user.phone || "-"}</TableCell>
//                     <TableCell>
//                       {user.telegramId ? (
//                         <Chip
//                           label={`@${user.telegramUsername || user.telegramId}`}
//                           size="small"
//                           color="success"
//                           icon={<TelegramIcon />}
//                         />
//                       ) : (
//                         <Chip
//                           label="Не привязан"
//                           size="small"
//                           color="default"
//                         />
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                       >
//                         <Typography variant="body2" fontFamily="monospace">
//                           {user.registrationKey}
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             copyToClipboard(user.registrationKey);
//                           }}
//                         >
//                           <CopyIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       {user.orders ? Object.keys(user.orders).length : 0}
//                     </TableCell>
//                     <TableCell>
//                       <IconButton
//                         size="small"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedUser(user);
//                           loadUserOrders(user.id);
//                           setTabValue(1);
//                         }}
//                       >
//                         <AddIcon />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedUser(user);
//                           loadUserOrders(user.id);
//                           setTabValue(2);
//                         }}
//                       >
//                         <LocationIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </TabPanel>

//         <TabPanel value={tabValue} index={1}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     {selectedUser
//                       ? `Добавить заказ для ${selectedUser.name}`
//                       : "Выберите пользователя"}
//                   </Typography>

//                   {selectedUser ? (
//                     <Box sx={{ mb: 3 }}>
//                       <List dense>
//                         <ListItem>
//                           <ListItemText
//                             primary="Имя"
//                             secondary={selectedUser.name}
//                           />
//                         </ListItem>
//                         <ListItem>
//                           <ListItemText
//                             primary="Телефон"
//                             secondary={selectedUser.phone || "не указан"}
//                           />
//                         </ListItem>
//                         <ListItem>
//                           <ListItemText
//                             primary="Telegram"
//                             secondary={
//                               selectedUser.telegramId
//                                 ? `@${
//                                     selectedUser.telegramUsername ||
//                                     selectedUser.telegramId
//                                   }`
//                                 : "не привязан"
//                             }
//                           />
//                         </ListItem>
//                         <ListItem>
//                           <ListItemText
//                             primary="Ключ регистрации"
//                             secondary={selectedUser.registrationKey}
//                           />
//                         </ListItem>
//                       </List>
//                     </Box>
//                   ) : (
//                     <Typography color="textSecondary">
//                       Выберите пользователя из списка
//                     </Typography>
//                   )}

//                   <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={() => setAddOrderDialog(true)}
//                     disabled={!selectedUser}
//                     fullWidth
//                   >
//                     Добавить заказ
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} md={8}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Заказы пользователя ({userOrders.length})
//                   </Typography>

//                   {userOrders.length === 0 ? (
//                     <Typography
//                       color="textSecondary"
//                       align="center"
//                       sx={{ py: 4 }}
//                     >
//                       Нет заказов
//                     </Typography>
//                   ) : (
//                     <Grid container spacing={2}>
//                       {userOrders.map((order) => (
//                         <Grid item xs={12} key={order.id}>
//                           <Paper
//                             sx={{
//                               p: 2,
//                               borderLeft: 4,
//                               borderColor: "primary.main",
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "flex-start",
//                               }}
//                             >
//                               <Box>
//                                 <Typography
//                                   variant="subtitle1"
//                                   fontWeight="bold"
//                                 >
//                                   {order.title}
//                                 </Typography>
//                                 <Typography
//                                   variant="body2"
//                                   color="textSecondary"
//                                 >
//                                   {order.description}
//                                 </Typography>
//                               </Box>
//                               <Chip
//                                 label={order.status}
//                                 color={getStatusColor(order.status)}
//                                 size="small"
//                               />
//                             </Box>

//                             <Grid container spacing={2} sx={{ mt: 1 }}>
//                               <Grid item xs={12} sm={6} md={3}>
//                                 <Typography variant="body2">
//                                   💰 <strong>Цена:</strong> {order.price} ₽
//                                 </Typography>
//                               </Grid>
//                               <Grid item xs={12} sm={6} md={9}>
//                                 <Typography variant="body2">
//                                   📍 <strong>Местоположение:</strong>{" "}
//                                   {order.location}
//                                 </Typography>
//                               </Grid>
//                             </Grid>

//                             {order.tracking && order.tracking.length > 0 && (
//                               <Box sx={{ mt: 2 }}>
//                                 <Typography
//                                   variant="caption"
//                                   color="textSecondary"
//                                 >
//                                   История перемещений:
//                                 </Typography>
//                                 <Stepper orientation="vertical" sx={{ mt: 1 }}>
//                                   {order.tracking.map((track, index) => (
//                                     <Step key={index} completed>
//                                       <StepLabel>
//                                         <Typography variant="caption">
//                                           {track.location} -{" "}
//                                           {new Date(
//                                             track.timestamp
//                                           ).toLocaleString("ru-RU")}
//                                         </Typography>
//                                       </StepLabel>
//                                     </Step>
//                                   ))}
//                                 </Stepper>
//                               </Box>
//                             )}
//                           </Paper>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </TabPanel>

//         <TabPanel value={tabValue} index={2}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Обновить местоположение
//                   </Typography>

//                   {selectedUser ? (
//                     <>
//                       <Typography variant="body1" gutterBottom>
//                         Пользователь: <strong>{selectedUser.name}</strong>
//                       </Typography>

//                       <TextField
//                         select
//                         fullWidth
//                         label="Выберите заказ"
//                         value={locationUpdate.orderId}
//                         onChange={(e) => {
//                           const orderId = e.target.value;
//                           setLocationUpdate({ ...locationUpdate, orderId });

//                           // Находим выбранный заказ
//                           const order = userOrders.find(
//                             (o) => o.id === orderId
//                           );
//                           if (order) {
//                             setLocationUpdate((prev) => ({
//                               ...prev,
//                               location: order.location,
//                               status: order.status,
//                             }));
//                           }
//                         }}
//                         SelectProps={{ native: true }}
//                         sx={{ mb: 2, mt: 1 }}
//                       >
//                         <option value="">Выберите заказ</option>
//                         {userOrders.map((order) => (
//                           <option key={order.id} value={order.id}>
//                             {order.title} ({order.status})
//                           </option>
//                         ))}
//                       </TextField>

//                       <TextField
//                         fullWidth
//                         label="Новое местоположение"
//                         value={locationUpdate.location}
//                         onChange={(e) =>
//                           setLocationUpdate({
//                             ...locationUpdate,
//                             location: e.target.value,
//                           })
//                         }
//                         sx={{ mb: 2 }}
//                       />

//                       <TextField
//                         fullWidth
//                         select
//                         label="Статус"
//                         value={locationUpdate.status}
//                         onChange={(e) =>
//                           setLocationUpdate({
//                             ...locationUpdate,
//                             status: e.target.value,
//                           })
//                         }
//                         SelectProps={{ native: true }}
//                         sx={{ mb: 3 }}
//                       >
//                         <option value="в пути">🚚 В пути</option>
//                         <option value="сортировка">📦 Сортировка</option>
//                         <option value="в доставке">🚛 В доставке</option>
//                         <option value="доставлен">✅ Доставлен</option>
//                         <option value="задержан">⚠️ Задержан</option>
//                       </TextField>

//                       <Button
//                         variant="contained"
//                         startIcon={<LocationIcon />}
//                         onClick={handleUpdateLocation}
//                         disabled={
//                           !locationUpdate.orderId ||
//                           !locationUpdate.location.trim()
//                         }
//                         fullWidth
//                       >
//                         Обновить местоположение
//                       </Button>
//                     </>
//                   ) : (
//                     <Typography color="textSecondary">
//                       Выберите пользователя из списка
//                     </Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} md={8}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     История обновлений
//                   </Typography>

//                   {selectedUser && userOrders.length > 0 ? (
//                     <List>
//                       {userOrders.flatMap((order) =>
//                         (order.tracking || []).map((track, index) => (
//                           <ListItem key={`${order.id}-${index}`}>
//                             <ListItemText
//                               primary={
//                                 <Box
//                                   sx={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     gap: 1,
//                                   }}
//                                 >
//                                   <Typography variant="subtitle2">
//                                     {order.title}
//                                   </Typography>
//                                   <Chip
//                                     label={track.status}
//                                     size="small"
//                                     color={getStatusColor(track.status)}
//                                   />
//                                 </Box>
//                               }
//                               secondary={
//                                 <>
//                                   <Typography variant="body2">
//                                     📍 {track.location}
//                                   </Typography>
//                                   <Typography
//                                     variant="caption"
//                                     color="textSecondary"
//                                   >
//                                     {new Date(track.timestamp).toLocaleString(
//                                       "ru-RU"
//                                     )}
//                                   </Typography>
//                                 </>
//                               }
//                             />
//                           </ListItem>
//                         ))
//                       )}
//                     </List>
//                   ) : (
//                     <Typography
//                       color="textSecondary"
//                       align="center"
//                       sx={{ py: 4 }}
//                     >
//                       Нет данных об обновлениях
//                     </Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </TabPanel>

//         <TabPanel value={tabValue} index={3}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Отправка уведомлений
//               </Typography>

//               {selectedUser ? (
//                 <Box>
//                   <Typography variant="body1" paragraph>
//                     Отправить уведомление пользователю:{" "}
//                     <strong>{selectedUser.name}</strong>
//                   </Typography>

//                   {selectedUser.telegramId ? (
//                     <Box sx={{ mt: 3 }}>
//                       <TextField
//                         fullWidth
//                         multiline
//                         rows={4}
//                         label="Сообщение для отправки"
//                         placeholder="Введите текст уведомления..."
//                         sx={{ mb: 2 }}
//                       />

//                       <Box sx={{ display: "flex", gap: 2 }}>
//                         <Button
//                           variant="contained"
//                           startIcon={<SendIcon />}
//                           onClick={async () => {
//                             try {
//                               await telegramService.sendNotification(
//                                 selectedUser.id,
//                                 "📢 Тестовое уведомление от администратора!"
//                               );
//                               showSnackbar("Тестовое уведомление отправлено!");
//                             } catch (error) {
//                               showSnackbar(
//                                 "Ошибка отправки: " + error.message,
//                                 "error"
//                               );
//                             }
//                           }}
//                         >
//                           Отправить тестовое уведомление
//                         </Button>

//                         <Button
//                           variant="outlined"
//                           startIcon={<TelegramIcon />}
//                           href={`https://t.me/${
//                             selectedUser.telegramUsername ||
//                             selectedUser.telegramId
//                           }`}
//                           target="_blank"
//                         >
//                           Написать в Telegram
//                         </Button>
//                       </Box>
//                     </Box>
//                   ) : (
//                     <Alert severity="warning">
//                       Пользователь еще не привязал Telegram. Уведомления будут
//                       отправлены после привязки.
//                     </Alert>
//                   )}
//                 </Box>
//               ) : (
//                 <Typography color="textSecondary">
//                   Выберите пользователя из списка для отправки уведомлений
//                 </Typography>
//               )}
//             </CardContent>
//           </Card>
//         </TabPanel>
//       </Paper>

//       {/* Диалог создания пользователя */}
//       <Dialog
//         open={addUserDialog}
//         onClose={() => setAddUserDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Создание нового пользователя</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             fullWidth
//             label="Имя пользователя *"
//             value={newUser.name}
//             onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//             sx={{ mb: 2, mt: 1 }}
//           />

//           <TextField
//             fullWidth
//             label="Телефон (опционально)"
//             value={newUser.phone}
//             onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
//             placeholder="+7 (999) 123-45-67"
//             sx={{ mb: 2 }}
//           />

//           {generatedKey && (
//             <Alert severity="success" sx={{ mt: 2 }}>
//               <Typography variant="subtitle2">
//                 Ключ создан: <strong>{generatedKey}</strong>
//               </Typography>
//               <Typography variant="body2">
//                 Ключ будет автоматически отправлен пользователю в Telegram
//               </Typography>
//             </Alert>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAddUserDialog(false)}>Отмена</Button>
//           <Button
//             variant="contained"
//             onClick={handleCreateUser}
//             disabled={!newUser.name.trim()}
//           >
//             Создать пользователя
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Диалог добавления заказа */}
//       <Dialog
//         open={addOrderDialog}
//         onClose={() => setAddOrderDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Добавить заказ</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             fullWidth
//             label="Название заказа *"
//             value={newOrder.title}
//             onChange={(e) =>
//               setNewOrder({ ...newOrder, title: e.target.value })
//             }
//             sx={{ mb: 2, mt: 1 }}
//           />

//           <TextField
//             fullWidth
//             multiline
//             rows={2}
//             label="Описание"
//             value={newOrder.description}
//             onChange={(e) =>
//               setNewOrder({ ...newOrder, description: e.target.value })
//             }
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             type="number"
//             label="Цена (₽)"
//             value={newOrder.price}
//             onChange={(e) =>
//               setNewOrder({ ...newOrder, price: e.target.value })
//             }
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             fullWidth
//             multiline
//             rows={2}
//             label="Местоположение *"
//             value={newOrder.location}
//             onChange={(e) =>
//               setNewOrder({ ...newOrder, location: e.target.value })
//             }
//             placeholder="Москва, ул. Ленина, д. 1, кв. 5"
//             helperText="Укажите полный адрес доставки"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAddOrderDialog(false)}>Отмена</Button>
//           <Button
//             variant="contained"
//             onClick={handleAddOrder}
//             disabled={!newOrder.title.trim() || !newOrder.location.trim()}
//           >
//             Добавить заказ
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default AdminPanel;
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
  TextareaAutosize,
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
  Visibility as ViewIcon,
  LocalShipping as ShippingIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Мок сервисы для демонстрации (замените на реальные)
const mockFirebaseService = {
  generateRegistrationKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "JET-";
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 2) key += "-";
    }
    return key;
  },

  async createUser(userData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const key = this.generateRegistrationKey();
    const userId = `user_${Date.now()}`;
    return { userId, key };
  },

  async getAllUsers() {
    return [
      {
        id: "user_1",
        name: "Иван Иванов",
        phone: "+79991234567",
        registrationKey: "JET-ABC-123",
        telegramId: "123456789",
        telegramUsername: "ivanov",
        orders: { order1: {}, order2: {} },
        createdAt: new Date().toISOString(),
      },
      {
        id: "user_2",
        name: "Мария Петрова",
        phone: "+79998765432",
        registrationKey: "JET-DEF-456",
        telegramId: null,
        telegramUsername: null,
        orders: { order1: {} },
        createdAt: new Date().toISOString(),
      },
    ];
  },

  async addOrder(userId, orderData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return `order_${Date.now()}`;
  },

  async getUserOrders(userId) {
    return [
      {
        id: "order_1",
        title: "Доставка документов",
        description: "Важные документы для подписания",
        price: 1500,
        location: "Москва, ул. Тверская, д. 10",
        status: "в пути",
        createdAt: new Date().toISOString(),
        tracking: [
          {
            status: "новый",
            location: "Склад на Ленинградском шоссе",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            status: "в пути",
            location: "Москва, ул. Тверская, д. 10",
            timestamp: new Date().toISOString(),
          },
        ],
      },
    ];
  },
};

const mockTelegramService = {
  async sendRegistrationKey(userId, message) {
    console.log("Отправка ключа в Telegram:", message);
    return { success: true };
  },

  async sendOrderUpdate(userId, orderId, message) {
    console.log("Отправка обновления заказа:", message);
    return { success: true };
  },

  async sendNotification(userId, message) {
    console.log("Отправка уведомления:", message);
    return { success: true };
  },
};

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", phone: "" });
  const [newOrder, setNewOrder] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });
  const [locationUpdate, setLocationUpdate] = useState({
    orderId: "",
    location: "",
    status: "",
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

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const allUsers = await mockFirebaseService.getAllUsers();
    setUsers(allUsers);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_key_used");
    localStorage.removeItem("admin_login_time");
    navigate("/");
  };

  const handleCreateUser = async () => {
    if (!newUser.name.trim()) {
      showSnackbar("Введите имя пользователя", "error");
      return;
    }

    try {
      const { userId, key } = await mockFirebaseService.createUser(newUser);

      showSnackbar("Пользователь создан! Ключ отправлен в Telegram");
      setGeneratedKey(key);

      // Отправляем ключ в Telegram
      await mockTelegramService.sendRegistrationKey(
        userId,
        `🔑 Ваш регистрационный ключ для JetZone:\n\n📛 Ключ: *${key}*\n👤 Имя: ${newUser.name}\n\nИспользуйте этот ключ в мини-приложении для регистрации.`
      );

      setNewUser({ name: "", phone: "" });
      setAddUserDialog(false);
      loadUsers();
    } catch (error) {
      showSnackbar("Ошибка создания пользователя: " + error.message, "error");
    }
  };

  const handleAddOrder = async () => {
    if (!selectedUser || !newOrder.title.trim() || !newOrder.location.trim()) {
      showSnackbar("Заполните все обязательные поля", "error");
      return;
    }

    try {
      const orderId = await mockFirebaseService.addOrder(selectedUser.id, {
        ...newOrder,
        price: parseFloat(newOrder.price) || 0,
      });

      showSnackbar("Заказ успешно добавлен!");

      // Отправляем уведомление в Telegram
      if (selectedUser.telegramId) {
        await mockTelegramService.sendOrderUpdate(
          selectedUser.id,
          orderId,
          `📦 *Новый заказ добавлен!*\n\n*${newOrder.title}*\n${newOrder.description}\n💰 ${newOrder.price} ₽\n📍 ${newOrder.location}\n\nСтатус: 🆕 новый`
        );
      }

      setNewOrder({ title: "", description: "", price: "", location: "" });
      setAddOrderDialog(false);

      // Загружаем обновленные заказы
      if (selectedUser) {
        loadUserOrders(selectedUser.id);
      }
    } catch (error) {
      showSnackbar("Ошибка добавления заказа: " + error.message, "error");
    }
  };

  const handleUpdateLocation = async () => {
    if (!locationUpdate.orderId || !locationUpdate.location.trim()) {
      showSnackbar("Введите местоположение", "error");
      return;
    }

    try {
      showSnackbar("Местоположение обновлено!");

      // Отправляем уведомление в Telegram
      if (selectedUser.telegramId) {
        await mockTelegramService.sendOrderUpdate(
          selectedUser.id,
          locationUpdate.orderId,
          `📍 *Обновление местоположения!*\n\nНовое местоположение: *${
            locationUpdate.location
          }*\nСтатус: ${
            locationUpdate.status || "в пути"
          }\n\n✅ Посылка движется к вам!`
        );
      }

      setLocationUpdate({ orderId: "", location: "", status: "" });
      setUpdateLocationDialog(false);
      loadUserOrders(selectedUser.id);
    } catch (error) {
      showSnackbar("Ошибка обновления: " + error.message, "error");
    }
  };

  const loadUserOrders = async (userId) => {
    const orders = await mockFirebaseService.getUserOrders(userId);
    setUserOrders(orders);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar("Скопировано в буфер обмена");
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h3" gutterBottom>
          👨‍💼 Панель администратора JetZone Delivery
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ ml: 2 }}
        >
          Выйти
        </Button>
      </Box>

      <Paper elevation={3} sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Пользователи" />
          <Tab label="Добавить заказ" />
          <Tab label="Обновить местоположение" />
          <Tab label="Отправка уведомлений" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">
              Все пользователи ({users.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddUserDialog(true)}
            >
              Создать пользователя
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Имя</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Telegram</TableCell>
                  <TableCell>Регистрационный ключ</TableCell>
                  <TableCell>Заказов</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    selected={selectedUser?.id === user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      loadUserOrders(user.id);
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {user.telegramId && (
                          <TelegramIcon color="primary" fontSize="small" />
                        )}
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      {user.telegramId ? (
                        <Chip
                          label={`@${user.telegramUsername || user.telegramId}`}
                          size="small"
                          color="success"
                          icon={<TelegramIcon />}
                        />
                      ) : (
                        <Chip
                          label="Не привязан"
                          size="small"
                          color="default"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" fontFamily="monospace">
                          {user.registrationKey}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(user.registrationKey);
                          }}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {user.orders ? Object.keys(user.orders).length : 0}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                          loadUserOrders(user.id);
                          setTabValue(1);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                          loadUserOrders(user.id);
                          setTabValue(2);
                        }}
                      >
                        <LocationIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedUser
                      ? `Добавить заказ для ${selectedUser.name}`
                      : "Выберите пользователя"}
                  </Typography>

                  {selectedUser ? (
                    <Box sx={{ mb: 3 }}>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Имя"
                            secondary={selectedUser.name}
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
                              selectedUser.telegramId
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
                            secondary={selectedUser.registrationKey}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  ) : (
                    <Typography color="textSecondary">
                      Выберите пользователя из списка
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddOrderDialog(true)}
                    disabled={!selectedUser}
                    fullWidth
                  >
                    Добавить заказ
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Заказы пользователя ({userOrders.length})
                  </Typography>

                  {userOrders.length === 0 ? (
                    <Typography
                      color="textSecondary"
                      align="center"
                      sx={{ py: 4 }}
                    >
                      Нет заказов
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {userOrders.map((order) => (
                        <Grid item xs={12} key={order.id}>
                          <Paper
                            sx={{
                              p: 2,
                              borderLeft: 4,
                              borderColor: "primary.main",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  {order.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {order.description}
                                </Typography>
                              </Box>
                              <Chip
                                label={order.status}
                                color={getStatusColor(order.status)}
                                size="small"
                              />
                            </Box>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">
                                  💰 <strong>Цена:</strong> {order.price} ₽
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={9}>
                                <Typography variant="body2">
                                  📍 <strong>Местоположение:</strong>{" "}
                                  {order.location}
                                </Typography>
                              </Grid>
                            </Grid>

                            {order.tracking && order.tracking.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  История перемещений:
                                </Typography>
                                <Stepper orientation="vertical" sx={{ mt: 1 }}>
                                  {order.tracking.map((track, index) => (
                                    <Step key={index} completed>
                                      <StepLabel>
                                        <Typography variant="caption">
                                          {track.location} -{" "}
                                          {new Date(
                                            track.timestamp
                                          ).toLocaleString("ru-RU")}
                                        </Typography>
                                      </StepLabel>
                                    </Step>
                                  ))}
                                </Stepper>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Обновить местоположение
                  </Typography>

                  {selectedUser ? (
                    <>
                      <Typography variant="body1" gutterBottom>
                        Пользователь: <strong>{selectedUser.name}</strong>
                      </Typography>

                      <TextField
                        select
                        fullWidth
                        label="Выберите заказ"
                        value={locationUpdate.orderId}
                        onChange={(e) => {
                          const orderId = e.target.value;
                          setLocationUpdate({ ...locationUpdate, orderId });

                          // Находим выбранный заказ
                          const order = userOrders.find(
                            (o) => o.id === orderId
                          );
                          if (order) {
                            setLocationUpdate((prev) => ({
                              ...prev,
                              location: order.location,
                              status: order.status,
                            }));
                          }
                        }}
                        SelectProps={{ native: true }}
                        sx={{ mb: 2, mt: 1 }}
                      >
                        <option value="">Выберите заказ</option>
                        {userOrders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.title} ({order.status})
                          </option>
                        ))}
                      </TextField>

                      <TextField
                        fullWidth
                        label="Новое местоположение"
                        value={locationUpdate.location}
                        onChange={(e) =>
                          setLocationUpdate({
                            ...locationUpdate,
                            location: e.target.value,
                          })
                        }
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        fullWidth
                        select
                        label="Статус"
                        value={locationUpdate.status}
                        onChange={(e) =>
                          setLocationUpdate({
                            ...locationUpdate,
                            status: e.target.value,
                          })
                        }
                        SelectProps={{ native: true }}
                        sx={{ mb: 3 }}
                      >
                        <option value="в пути">🚚 В пути</option>
                        <option value="сортировка">📦 Сортировка</option>
                        <option value="в доставке">🚛 В доставке</option>
                        <option value="доставлен">✅ Доставлен</option>
                        <option value="задержан">⚠️ Задержан</option>
                      </TextField>

                      <Button
                        variant="contained"
                        startIcon={<LocationIcon />}
                        onClick={handleUpdateLocation}
                        disabled={
                          !locationUpdate.orderId ||
                          !locationUpdate.location.trim()
                        }
                        fullWidth
                      >
                        Обновить местоположение
                      </Button>
                    </>
                  ) : (
                    <Typography color="textSecondary">
                      Выберите пользователя из списка
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    История обновлений
                  </Typography>

                  {selectedUser && userOrders.length > 0 ? (
                    <List>
                      {userOrders.flatMap((order) =>
                        (order.tracking || []).map((track, index) => (
                          <ListItem key={`${order.id}-${index}`}>
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="subtitle2">
                                    {order.title}
                                  </Typography>
                                  <Chip
                                    label={track.status}
                                    size="small"
                                    color={getStatusColor(track.status)}
                                  />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography variant="body2">
                                    📍 {track.location}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="textSecondary"
                                  >
                                    {new Date(track.timestamp).toLocaleString(
                                      "ru-RU"
                                    )}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))
                      )}
                    </List>
                  ) : (
                    <Typography
                      color="textSecondary"
                      align="center"
                      sx={{ py: 4 }}
                    >
                      Нет данных об обновлениях
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Отправка уведомлений
              </Typography>

              {selectedUser ? (
                <Box>
                  <Typography variant="body1" paragraph>
                    Отправить уведомление пользователю:{" "}
                    <strong>{selectedUser.name}</strong>
                  </Typography>

                  {selectedUser.telegramId ? (
                    <Box sx={{ mt: 3 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Сообщение для отправки"
                        placeholder="Введите текст уведомления..."
                        sx={{ mb: 2 }}
                      />

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<SendIcon />}
                          onClick={async () => {
                            try {
                              await mockTelegramService.sendNotification(
                                selectedUser.id,
                                "📢 Тестовое уведомление от администратора!"
                              );
                              showSnackbar("Тестовое уведомление отправлено!");
                            } catch (error) {
                              showSnackbar(
                                "Ошибка отправки: " + error.message,
                                "error"
                              );
                            }
                          }}
                        >
                          Отправить тестовое уведомление
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<TelegramIcon />}
                          href={`https://t.me/${
                            selectedUser.telegramUsername ||
                            selectedUser.telegramId
                          }`}
                          target="_blank"
                        >
                          Написать в Telegram
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="warning">
                      Пользователь еще не привязал Telegram. Уведомления будут
                      отправлены после привязки.
                    </Alert>
                  )}
                </Box>
              ) : (
                <Typography color="textSecondary">
                  Выберите пользователя из списка для отправки уведомлений
                </Typography>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Диалог создания пользователя */}
      <Dialog
        open={addUserDialog}
        onClose={() => setAddUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Создание нового пользователя</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Имя пользователя *"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            fullWidth
            label="Телефон (опционально)"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            placeholder="+7 (999) 123-45-67"
            sx={{ mb: 2 }}
          />

          {generatedKey && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                Ключ создан: <strong>{generatedKey}</strong>
              </Typography>
              <Typography variant="body2">
                Ключ будет автоматически отправлен пользователю в Telegram
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserDialog(false)}>Отмена</Button>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            disabled={!newUser.name.trim()}
          >
            Создать пользователя
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления заказа */}
      <Dialog
        open={addOrderDialog}
        onClose={() => setAddOrderDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить заказ</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Название заказа *"
            value={newOrder.title}
            onChange={(e) =>
              setNewOrder({ ...newOrder, title: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Описание"
            value={newOrder.description}
            onChange={(e) =>
              setNewOrder({ ...newOrder, description: e.target.value })
            }
            sx={{ mb: 2 }}
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
          />

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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOrderDialog(false)}>Отмена</Button>
          <Button
            variant="contained"
            onClick={handleAddOrder}
            disabled={!newOrder.title.trim() || !newOrder.location.trim()}
          >
            Добавить заказ
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;
