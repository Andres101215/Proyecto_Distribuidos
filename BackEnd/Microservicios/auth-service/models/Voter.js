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
    }
  })

module.exports = mongoose.model('Voter', voterSchema);
