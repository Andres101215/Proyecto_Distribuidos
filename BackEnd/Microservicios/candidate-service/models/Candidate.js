// models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  codigoEstudiantil: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  propuestas: { type: String, required: true }
  

}, { collection: "Candidatos" }); // Forzamos el nombre de la colección

  const Candidato = mongoose.model("Candidatos", candidateSchema); // El primer parámetro no afecta la colección en la BD
  
  module.exports = Candidato;