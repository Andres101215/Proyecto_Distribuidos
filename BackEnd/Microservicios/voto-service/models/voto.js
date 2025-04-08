const mongoose = require('mongoose');

const votoSchema = new mongoose.Schema({
  electionId: String,
  candidateId: String,
  token: String,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "valid" }
});

module.exports = mongoose.model('Voto', votoSchema);
