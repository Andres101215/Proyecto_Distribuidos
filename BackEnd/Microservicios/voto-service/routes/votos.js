const express = require('express');
const router = express.Router();
const Voto = require('../models/voto');

// Registrar un nuevo voto
router.post('/', async (req, res) => {
  try {
    const voto = new Voto(req.body);
    await voto.save();
    res.status(201).json({ mensaje: 'Voto registrado correctamente', voto });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener conteo de votos por candidato
router.get('/conteo/:electionId', async (req, res) => {
  try {
    const result = await Voto.aggregate([
      { $match: { electionId: req.params.electionId, status: "valid" } },
      { $group: { _id: "$candidateId", total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
