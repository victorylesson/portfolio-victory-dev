require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Lead = require("./models/Lead");
const app = express();

app.use(cors());
app.use(express.json());

// ===== CONEXÃO COM MONGODB =====
const conectarBanco = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("Banco conectado!");
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err.message);
    // Tenta reconectar após 5 segundos
    setTimeout(conectarBanco, 5000);
  }
};

conectarBanco();

// Reconecta automaticamente se cair
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB desconectado. Reconectando...");
  setTimeout(conectarBanco, 5000);
});

// ===== HEALTH CHECK (para o UptimeRobot pingar) =====
app.get("/", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "ok" : "sem banco";
  res.json({ status, timestamp: new Date().toISOString() });
});

// ===== ROTAS =====

// CREATE: salva o lead
app.post("/leads", async (req, res) => {
  try {
    // Verifica se o banco está conectado antes de tentar salvar
    if (mongoose.connection.readyState !== 1) {
      return res
        .status(503)
        .json({
          erro: "Banco ainda conectando. Tente novamente em instantes.",
        });
    }

    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ mensagem: "Lead salvo com sucesso!" });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// READ: lista todos os leads
app.get("/leads", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ criadoEm: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// DELETE: remove um lead por ID
app.delete("/leads/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Lead removido." });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
