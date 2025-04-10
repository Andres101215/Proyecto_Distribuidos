const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST - Registrar candidato
router.post('/register', async (req, res) => {
    const { nombre, apellido, propuestas, codigoEstudiantil, email, password } = req.body;

    try {
        const existing = await Candidate.findOne({ $or: [{ email }, { codigoEstudiantil }] });
        if (existing) {
            return res.status(400).json({ msg: 'Ya existe un candidato con ese correo o código.' });
        }

        const newCandidate = new Candidate({
            nombre,
            apellido,
            codigoEstudiantil,
            email,
            password,
            propuestas
        });

        await newCandidate.save();

        res.status(201).json({ msg: 'Candidato registrado exitosamente.', candidato: newCandidate });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
});

// GET - Listar todos los candidatos
router.get('/', async (req, res) => {
    try {
        const candidatos = await Candidate.find();
        res.status(200).json(candidatos);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener candidatos', error: err.message });
    }
});

//Obtener una eleccion por ID (GET)
router.get("/:id", async (req, res) => {
  try {
      const candidato = await Candidate.findById(req.params.id);
      if (!candidato) {
          return res.status(404).json({ mensaje: "Candidato no encontrada" });
      }
      res.json(candidato);
  } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener el candidato", error });
  }
});

// GET - Buscar por código estudiantil
router.get('/:codigo', async (req, res) => {
    try {
        const candidato = await Candidate.findOne({ codigoEstudiantil: req.params.codigo });
        if (!candidato) return res.status(404).json({ msg: 'Candidato no encontrado' });
        res.json(candidato);
    } catch (err) {
        res.status(500).json({ msg: 'Error al buscar candidato', error: err.message });
    }
});

// DELETE - Eliminar candidato
router.delete('/:codigo', async (req, res) => {
    try {
        const deleted = await Candidate.findOneAndDelete({ codigoEstudiantil: req.params.codigo });
        if (!deleted) return res.status(404).json({ msg: 'Candidato no encontrado' });
        res.json({ msg: 'Candidato eliminado' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al eliminar', error: err.message });
    }
});

// PUT - Editar candidato
router.put('/:codigo', async (req, res) => {
    const { nombre, apellido, propuestas, email } = req.body;

    try {
        const updatedCandidate = await Candidate.findOneAndUpdate(
            { codigoEstudiantil: req.params.codigo },
            {
                $set: {
                    nombre,
                    apellido,
                    propuestas,
                    email
                }
            },
            { new: true }
        );

        if (!updatedCandidate) {
            return res.status(404).json({ msg: 'Candidato no encontrado' });
        }

        res.status(200).json({ msg: 'Candidato actualizado', candidato: updatedCandidate });
    } catch (err) {
        res.status(500).json({ msg: 'Error al actualizar candidato', error: err.message });
    }
});



module.exports = router;
