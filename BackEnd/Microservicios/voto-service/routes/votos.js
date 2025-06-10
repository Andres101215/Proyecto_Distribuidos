const express = require('express');
const router = express.Router();
const Voto = require('../models/voto');
const { crearVoto } = require('../service/votoService');


// Obtener todos los votos o solo los de un usuario específico
router.get('/', async (req, res) => {
  try {
    const voterId = req.query.voterId;

    let votos;

    if (voterId) {
      votos = await Voto.find({ voterId });
    } else {
      votos = await Voto.find();
    }

    res.json(votos);
  } catch (error) {
    console.error('Error al obtener los votos:', error);
    res.status(500).json({ error: 'Error al obtener los votos' });
  }
});


// Registrar un nuevo voto
router.post('/', async (req, res) => {
  try {
    const voto = await crearVoto(req.body);
    res.status(201).json({ mensaje: 'Voto registrado correctamente', voto });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// endpoint GET /votos?eleccionId=e1
router.get('/votos', async (req, res) => {
  const {electionId } = req.query;
  if (!electionId) {
    return res.status(400).json({ message: 'eleccionId es requerido' });
  }

  try {
    const votos = await Voto.find({electionId});
    res.json(votos);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar votos' });
  }
});

module.exports = router;
