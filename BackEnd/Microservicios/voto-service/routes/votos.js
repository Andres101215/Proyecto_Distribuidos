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

module.exports = router;
