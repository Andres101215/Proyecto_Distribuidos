const mongoose = require('mongoose');

const eleccionSchema = new mongoose.Schema({
  electionId: String,
  candidateId: String,
  token: String,
  timestamp: { type: Date, default: Date.now },
  status: String
}, { collection: "Eleccion" }); // Forzamos el nombre de la colección

const Eleccion = mongoose.model("Eleccion", eleccionSchema); // El primer parámetro no afecta la colección en la BD

module.exports = Eleccion;

