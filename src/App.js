import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import AdminPanel from "./components/AdminPanel";
import MiniApp from "./components/MiniApp";
import TelegramWebApp from "./components/TelegramWebApp";

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
          to="/admin"
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

function App() {
  const isTelegramWebApp = window.Telegram?.WebApp;

  if (isTelegramWebApp) {
    return (
      <Router>
        <Routes>
          <Route
            path="/mini-app"
            element={
              <TelegramWebApp>
                <MiniApp />
              </TelegramWebApp>
            }
          />
          <Route
            path="*"
            element={
              <TelegramWebApp>
                <MiniApp />
              </TelegramWebApp>
            }
          />
        </Routes>
      </Router>
    );
  }

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
          <Button color="inherit" component={Link} to="/admin">
            Админка
          </Button>
          <Button color="inherit" component={Link} to="/mini-app">
            Мини-приложение
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/mini-app"
          element={
            <TelegramWebApp>
              <MiniApp />
            </TelegramWebApp>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
