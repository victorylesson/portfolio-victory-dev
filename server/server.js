require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Lead = require("./models/Lead");
const app = express();

app.use(cors());
app.use(express.json()); // add
// Conecta ao banco
mongoose
  .connect(
    process.env.MONGODB_URI, // ← lê do .env
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
