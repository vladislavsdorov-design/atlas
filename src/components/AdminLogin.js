import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Key as KeyIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!adminKey.trim()) {
      setError("Введите ключ администратора");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (adminKey === "Vs20080413") {
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("admin_login_time", Date.now().toString());
        localStorage.setItem("admin_key_used", adminKey);
        navigate("/admin");
      } else {
        setError("Неверный ключ администратора");
        setLoading(false);
      }
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🔐 Вход в админку
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          sx={{ mb: 3 }}
        >
          JetZone Delivery System
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Ключ администратора"
            value={adminKey}
            onChange={(e) => {
              setAdminKey(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            placeholder="Vs20080413"
            sx={{ mb: 2 }}
            disabled={loading}
            autoFocus
            InputProps={{
              startAdornment: (
                <KeyIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !adminKey.trim()}
          >
            {loading ? <CircularProgress size={24} /> : "Войти в админку"}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="text" onClick={() => navigate("/")}>
            ← Вернуться на главную
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
