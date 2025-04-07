const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
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
  password: { type: String, required: true } ,
  
    puesto: { type: String, required: true }, // Ej: "Presidente"
    propuestas: { type: String, required: true },
});

module.exports = mongoose.model('Candidate', candidateSchema);
