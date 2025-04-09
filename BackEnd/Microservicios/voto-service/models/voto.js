const mongoose = require('mongoose');

const votoSchema = new mongoose.Schema({
  electionId: String,
  candidateId: String,
  voterId: String,
  timestamp: { type: Date, default: Date.now },
}, { collection: "Voto" }); // Forzamos el nombre de la colección

votoSchema.index({ voterId: 1, electionId: 1 }, { unique: true })

const Voto = mongoose.model("Voto", votoSchema); // El primer parámetro no afecta la colección en la BD

module.exports = Voto;

