const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  nicho: { type: String },
  servico: { type: String },
  mensagem: { type: String, default: "" },
  criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", leadSchema);
