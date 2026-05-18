const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Lead = require("./models/Lead");
const app = express();

app.use(
  cors({
    origin: ["https://victory-dev.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

// Conecta ao banco
mongoose
  .connect(
    "mongodb://victorymendestech_db_user:s8oMIBaGBlsfwSFu@ac-xrli92b-shard-00-00.0hw4wha.mongodb.net:27017,ac-xrli92b-shard-00-01.0hw4wha.mongodb.net:27017,ac-xrli92b-shard-00-02.0hw4wha.mongodb.net:27017/victory_dev?tls=true&replicaSet=atlas-y188w4-shard-0&authSource=admin",
    {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      family: 4,
      tlsAllowInvalidCertificates: true,
    },
  )
  .then(() => console.log("Banco conectado!"))
  .catch((err) => console.log(err));

// CREATE: salva o lead
app.post("/leads", async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ mensagem: "Lead salvo com sucesso!" });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// READ: lista todos os leads
app.get("/leads", async (req, res) => {
  const leads = await Lead.find().sort({ criadoEm: -1 });
  res.json(leads);
});

// DELETE: remove um lead por ID
app.delete("/leads/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ mensagem: "Lead removido." });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
