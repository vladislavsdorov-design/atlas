import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { firebaseService } from "../services/firebaseService";

const TelegramBotSimulator = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userState, setUserState] = useState("start");

  useEffect(() => {
    addBotMessage(
      "👋 Привет! Я бот JetZone. Введите /start для начала работы."
    );
  }, []);

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { text, isBot: true, time: new Date().toLocaleTimeString() },
    ]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { text, isBot: false, time: new Date().toLocaleTimeString() },
    ]);
  };

  const handleCommand = async (command) => {
    if (command === "/start") {
      addBotMessage(
        "Добро пожаловать! Пожалуйста, введите ваш регистрационный ключ:"
      );
      setUserState("awaiting_key");
    } else if (userState === "awaiting_key") {
      addUserMessage(command);

      const validation = await firebaseService.validateRegistrationKey(command);

      if (validation.valid) {
        const telegramId = Math.floor(Math.random() * 1000000);
        addBotMessage(
          "✅ Ключ принят! Теперь перейдите в мини-приложение для завершения регистрации."
        );
        addBotMessage("📱 Нажмите на кнопку ниже:");

        // Добавляем сообщение с кнопкой
        setMessages((prev) => [
          ...prev,
          {
            text: (
              <Button
                variant="contained"
                href={`/mini-app?key=${command}&telegramId=${telegramId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть мини-приложение
              </Button>
            ),
            isBot: true,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        addBotMessage(`❌ ${validation.error}. Попробуйте еще раз.`);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    addUserMessage(input);

    if (input.startsWith("/")) {
      handleCommand(input);
    } else {
      handleCommand(input);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          🤖 Telegram Bot Simulator
        </Typography>

        <Paper
          elevation={1}
          sx={{
            height: 400,
            overflow: "auto",
            mb: 2,
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent: msg.isBot ? "flex-start" : "flex-end",
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    bgcolor: msg.isBot ? "#e3f2fd" : "#dcf8c6",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography>{msg.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {msg.time}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Введите сообщение или команду..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleCommand("/start")}
          >
            /start
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            Тестовые ключи: ABC-123-XYZ, DEF-456-UVW, GHI-789-RST
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TelegramBotSimulator;
