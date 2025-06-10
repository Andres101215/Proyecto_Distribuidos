const mongoose = require('mongoose');

const eleccionSchema = new mongoose.Schema({
  electionId: String,
  candidatos: [String],  // <-- Solo IDs de los candidatos
  nombre: String,
  descripcion: String,
  timestamp: { type: Date, default: Date.now },
  estado: {
    type: String,
    enum: ['activo', 'finalizado'],
    default: 'activo'
  }
}, { collection: "Eleccion" });

const Eleccion = mongoose.model("Eleccion", eleccionSchema);

module.exports = Eleccion;
