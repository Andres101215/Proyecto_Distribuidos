const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST - Registrar candidato
router.post('/register', async (req, res) => {
    const { nombre, apellido, propuestas, codigoEstudiantil, email, password, categoria } = req.body;

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
            propuestas,
            categoria  // Se espera un ObjectId (el ID de la colección Eleccion)
        });

        await newCandidate.save();

        res.status(201).json({ msg: 'Candidato registrado exitosamente.', candidato: newCandidate });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
});

// GET - Listar todos los candidatos (con información de categoría)
router.get('/', async (req, res) => {
    try {
        const candidatos = await Candidate.find().populate('categoria');
        res.status(200).json(candidatos);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener candidatos', error: err.message });
    }
});

// GET - Buscar por código estudiantil (con populate)
router.get('/:codigo', async (req, res) => {
    try {
        const candidato = await Candidate.findOne({ codigoEstudiantil: req.params.codigo }).populate('categoria');
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
    const { nombre, apellido, propuestas, email, categoria } = req.body;

    try {
        const updatedCandidate = await Candidate.findOneAndUpdate(
            { codigoEstudiantil: req.params.codigo },
            {
                $set: {
                    nombre,
                    apellido,
                    propuestas,
                    email,
                    categoria // también puedes actualizar la categoría si se requiere
                }
            },
            { new: true }
        ).populate('categoria');

        if (!updatedCandidate) {
            return res.status(404).json({ msg: 'Candidato no encontrado' });
        }

        res.status(200).json({ msg: 'Candidato actualizado', candidato: updatedCandidate });
    } catch (err) {
        res.status(500).json({ msg: 'Error al actualizar candidato', error: err.message });
    }
});



module.exports = router;
