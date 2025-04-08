const mongoose = require('mongoose');

const votoSchema = new mongoose.Schema({
  electionId: String,
  candidateId: String,
  token: String,
  timestamp: { type: Date, default: Date.now },
  status: String
}, { collection: "Voto" }); // Forzamos el nombre de la colección

const Voto = mongoose.model("Voto", votoSchema); // El primer parámetro no afecta la colección en la BD

module.exports = Voto;

