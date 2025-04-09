const express = require('express');
const router = express.Router();
const Voto = require('../models/voto');
const { crearVoto } = require('../service/votoService');


//Obtener todos los votos (GET)
router.get("/", async (req, res) => {
  try {
      const votos = await Voto.find();
      res.json(votos);
  } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener los votos", error });
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
