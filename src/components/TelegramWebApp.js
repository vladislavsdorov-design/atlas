import React, { useEffect } from "react";
import { Box } from "@mui/material";

const TelegramWebApp = ({ children }) => {
  useEffect(() => {
    // Скрипт для инициализации Telegram Web App
    if (typeof window !== "undefined" && !window.Telegram) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Стили для Telegram Web App
  const telegramStyles = {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  };

  return <Box sx={telegramStyles}>{children}</Box>;
};

export default TelegramWebApp;
