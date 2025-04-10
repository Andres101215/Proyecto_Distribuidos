const mongoose = require('mongoose');

// Definición del esquema de Votante
const voterSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  codigoEstudiantil: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  }
}, {collection: 'Votantes' });

const Votante = mongoose.model('Votantes', voterSchema);

module.exports = Votante;
