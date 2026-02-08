const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(200).json({ method: "GET", message: "Bot webhook endpoint" });
  }
};
