const mongoose = require('mongoose');

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
}, {
  collection: 'Votantes' // 🔥 IMPORTANTE: asegura que use la colección correcta
});

module.exports = mongoose.model('Votantes', voterSchema);
