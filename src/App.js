// import React, { useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useLocation,
// } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Container,
//   Box,
// } from "@mui/material";
// import AdminPanel from "./components/AdminPanel";
// import MiniApp from "./components/MiniApp";
// import TelegramWebApp from "./components/TelegramWebApp";

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
//           to="/admin"
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
//   // Проверяем, запущено ли в Telegram Web App
//   const isTelegramWebApp = window.Telegram?.WebApp;

//   // Если запущено в Telegram Web App, скрываем навигацию
//   if (isTelegramWebApp) {
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

//   // Обычный веб-сайт
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
//           <Button color="inherit" component={Link} to="/admin">
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
//           <Route path="/admin" element={<AdminPanel />} />
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
  useLocation,
  Navigate,
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
import TelegramWebApp from "./components/TelegramWebApp";
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

      <Box sx={{ mt: 8, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          📋 Как работает система:
        </Typography>
        <Box component="ol" sx={{ textAlign: "left", pl: 4 }}>
          <li>Администратор создает пользователя в панели управления</li>
          <li>Пользователь получает ключ в Telegram боте</li>
          <li>Пользователь вводит ключ в мини-приложении</li>
          <li>Администратор добавляет и отслеживает заказы</li>
          <li>Пользователь видит обновления в реальном времени</li>
          <li>Уведомления приходят в Telegram при обновлениях</li>
        </Box>
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
        // Проверяем что прошло не более 24 часов
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const currentTime = Date.now();

        if (currentTime - parseInt(loginTime) < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Сессия истекла
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

// Компонент для проверки запуска в Telegram
function MainLayout({ children }) {
  const location = useLocation();
  const isMiniApp = location.pathname === "/mini-app";

  // Если мы в мини-приложении, оборачиваем в TelegramWebApp
  if (isMiniApp) {
    return <TelegramWebApp>{children}</TelegramWebApp>;
  }

  // Иначе показываем обычный интерфейс
  return children;
}

function App() {
  // Проверяем, запущено ли в Telegram Web App
  const isTelegramWebApp = window.Telegram?.WebApp;

  // Если запущено в Telegram Web App, скрываем навигацию
  if (isTelegramWebApp) {
    return (
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/mini-app" element={<MiniApp />} />
            <Route path="*" element={<MiniApp />} />
          </Routes>
        </MainLayout>
      </Router>
    );
  }

  // Обычный веб-сайт
  return (
    <Router>
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

      <MainLayout>
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
      </MainLayout>
    </Router>
  );
}

export default App;
