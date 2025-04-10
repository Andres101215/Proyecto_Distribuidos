// models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  codigoEstudiantil: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  propuestas: { type: String, required: true },

  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleccion',     // Referencia al modelo Eleccion
    required: true
  }
});

module.exports = mongoose.model('Candidatos', candidateSchema);
