import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

const TelegramWebApp = ({ children }) => {
  const [telegramLoaded, setTelegramLoaded] = useState(false);

  useEffect(() => {
    // Проверяем, загружен ли Telegram Web App SDK
    const checkTelegram = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;

        // Инициализируем Web App
        tg.ready();
        tg.expand(); // Растягиваем на весь экран
        tg.enableClosingConfirmation(); // Подтверждение закрытия
        tg.setBackgroundColor("#f8f9fa"); // Цвет фона
        tg.setHeaderColor("secondary_bg_color"); // Цвет заголовка

        setTelegramLoaded(true);
        return true;
      }
      return false;
    };

    // Если SDK уже загружен (из index.html)
    if (checkTelegram()) {
      return;
    }

    // Если не загружен, пытаемся загрузить
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = () => {
      setTimeout(checkTelegram, 100); // Даем время на инициализацию
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Если Telegram не загружен, показываем загрузку
  if (!telegramLoaded && window.location.pathname.includes("/mini-app")) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f8f9fa",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>{children}</Box>;
};

export default TelegramWebApp;
