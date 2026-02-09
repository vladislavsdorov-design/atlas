// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useLocation,
//   Navigate,
// } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Container,
//   Box,
//   CircularProgress,
// } from "@mui/material";
// import AdminPanel from "./components/AdminPanel";
// import MiniApp from "./components/MiniApp";
// import TelegramWebApp from "./components/TelegramWebApp";
// import AdminLogin from "./components/AdminLogin";

// function HomePage() {
//   return (
//     <Container sx={{ textAlign: "center", mt: 10 }}>
//       <Typography variant="h2" gutterBottom>
//         🚀 JetZone Delivery System
//       </Typography>
//       <Typography variant="h5" color="textSecondary" paragraph>
//         Система отслеживания посылок с Telegram интеграцией
//       </Typography>

//       <Box
//         sx={{
//           mt: 6,
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           maxWidth: 400,
//           mx: "auto",
//         }}
//       >
//         <Button
//           variant="contained"
//           size="large"
//           component={Link}
//           to="/admin/login"
//           sx={{ py: 2 }}
//         >
//           👨‍💼 Панель администратора
//         </Button>

//         <Button
//           variant="outlined"
//           size="large"
//           component="a"
//           href="https://t.me/jetzone_delivery_bot"
//           target="_blank"
//           sx={{ py: 2 }}
//         >
//           🤖 Открыть Telegram бота
//         </Button>

//         <Button
//           variant="outlined"
//           size="large"
//           component={Link}
//           to="/mini-app"
//           sx={{ py: 2 }}
//         >
//           📱 Мини-приложение для пользователей
//         </Button>
//       </Box>

//       <Box sx={{ mt: 8, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
//         <Typography variant="h6" gutterBottom>
//           📋 Как работает система:
//         </Typography>
//         <Box component="ol" sx={{ textAlign: "left", pl: 4 }}>
//           <li>Администратор создает пользователя в панели управления</li>
//           <li>Пользователь получает ключ в Telegram боте</li>
//           <li>Пользователь вводит ключ в мини-приложении</li>
//           <li>Администратор добавляет и отслеживает заказы</li>
//           <li>Пользователь видит обновления в реальном времени</li>
//           <li>Уведомления приходят в Telegram при обновлениях</li>
//         </Box>
//       </Box>
//     </Container>
//   );
// }

// // Компонент для защиты админ-роута
// function ProtectedRoute({ children }) {
//   const [isChecking, setIsChecking] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = () => {
//       const auth = localStorage.getItem("admin_logged_in");
//       const loginTime = localStorage.getItem("admin_login_time");

//       if (auth === "true" && loginTime) {
//         // Проверяем что прошло не более 24 часов
//         const twentyFourHours = 24 * 60 * 60 * 1000;
//         const currentTime = Date.now();

//         if (currentTime - parseInt(loginTime) < twentyFourHours) {
//           setIsAuthenticated(true);
//         } else {
//           // Сессия истекла
//           localStorage.removeItem("admin_logged_in");
//           localStorage.removeItem("admin_login_time");
//           localStorage.removeItem("admin_key_used");
//         }
//       }
//       setIsChecking(false);
//     };

//     checkAuth();
//   }, []);

//   if (isChecking) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return isAuthenticated ? children : <Navigate to="/admin/login" />;
// }

// // Компонент для проверки запуска в Telegram
// function MainLayout({ children }) {
//   const location = useLocation();
//   const isMiniApp = location.pathname === "/mini-app";

//   // Если мы в мини-приложении, оборачиваем в TelegramWebApp
//   if (isMiniApp) {
//     return <TelegramWebApp>{children}</TelegramWebApp>;
//   }

//   // Иначе показываем обычный интерфейс
//   return children;
// }

// function App() {
//   const location = useLocation(); // ДОБАВЛЯЕМ хук для получения текущего пути
//   const isTelegramWebApp = window.Telegram?.WebApp;

//   // 🔴 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: проверяем, находимся ли мы на админ-странице
//   const isAdminPage = location.pathname.startsWith("/admin");

//   // Если запущено в Telegram Web App, НО мы на админке - показываем админку
//   // Если не на админке - показываем MiniApp
//   if (isTelegramWebApp && !isAdminPage) {
//     return (
//       <Router>
//         <MainLayout>
//           <Routes>
//             <Route path="/mini-app" element={<MiniApp />} />
//             <Route path="*" element={<MiniApp />} />
//           </Routes>
//         </MainLayout>
//       </Router>
//     );
//   }

//   // Обычный веб-сайт ИЛИ Telegram Web App на админке
//   return (
//     <Router>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography
//             variant="h6"
//             component={Link}
//             to="/"
//             sx={{ flexGrow: 1, color: "white", textDecoration: "none" }}
//           >
//             JetZone Delivery
//           </Typography>
//           <Button color="inherit" component={Link} to="/">
//             Главная
//           </Button>
//           <Button color="inherit" component={Link} to="/admin/login">
//             Админка
//           </Button>
//           <Button color="inherit" component={Link} to="/mini-app">
//             Мини-приложение
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <MainLayout>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/admin/login" element={<AdminLogin />} />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <AdminPanel />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/mini-app" element={<MiniApp />} />
//         </Routes>
//       </MainLayout>
//     </Router>
//   );
// }

// export default App;
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import AdminPanel from "./components/AdminPanel";
import MiniApp from "./components/MiniApp";
import AdminLogin from "./components/AdminLogin";

function HomePage() {
  return (
    <Container sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h2" gutterBottom>
        🚀 JetZone Delivery System
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Система отслеживания посылок с Telegram интеграцией
      </Typography>

      <Box
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/admin/login"
          sx={{ py: 2 }}
        >
          👨‍💼 Панель администратора
        </Button>

        <Button
          variant="outlined"
          size="large"
          component="a"
          href="https://t.me/jetzone_delivery_bot"
          target="_blank"
          sx={{ py: 2 }}
        >
          🤖 Открыть Telegram бота
        </Button>

        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/mini-app"
          sx={{ py: 2 }}
        >
          📱 Мини-приложение для пользователей
        </Button>
      </Box>
    </Container>
  );
}

// Компонент для защиты админ-роута
function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("admin_logged_in");
      const loginTime = localStorage.getItem("admin_login_time");

      if (auth === "true" && loginTime) {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const currentTime = Date.now();

        if (currentTime - parseInt(loginTime) < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("admin_logged_in");
          localStorage.removeItem("admin_login_time");
          localStorage.removeItem("admin_key_used");
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

// Отдельный компонент, который будет внутри Router
function MainApp() {
  const location = useLocation();
  const isTelegramWebApp = window.Telegram?.WebApp;
  const isAdminPage = location.pathname.startsWith("/admin");

  // Если в Telegram и не на админке - показываем только MiniApp
  if (isTelegramWebApp && !isAdminPage) {
    return (
      <Routes>
        <Route path="/mini-app" element={<MiniApp />} />
        <Route path="*" element={<MiniApp />} />
      </Routes>
    );
  }

  // Иначе обычная маршрутизация с навигацией
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, color: "white", textDecoration: "none" }}
          >
            JetZone Delivery
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Главная
          </Button>
          <Button color="inherit" component={Link} to="/admin/login">
            Админка
          </Button>
          <Button color="inherit" component={Link} to="/mini-app">
            Мини-приложение
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/mini-app" element={<MiniApp />} />
      </Routes>
    </>
  );
}

// Главный компонент App
function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;
