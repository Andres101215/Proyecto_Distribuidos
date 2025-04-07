const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register', async (req, res) => {
    const { nombre, apellido, codigoEstudiantil, email, password } = req.body;
  
    try {
      // Verificar duplicados
      const existingUser = await Voter.findOne({
        $or: [
          { email },
          { codigoEstudiantil }
        ]
      });
  
      if (existingUser) {
        return res.status(400).json({
          msg: 'Ya existe un usuario con ese correo o código estudiantil.'
        });
      }
  
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      const newVoter = new Voter({
        nombre,
        apellido,
        codigoEstudiantil,
        email,
        password: hashedPassword
      });
  
      await newVoter.save();
      res.status(201).json({ msg: 'Registro exitoso' });
  
    } catch (err) {
      res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
  });
  

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const voter = await Voter.findOne({ email });
        if (!voter) return res.status(404).json({ msg: 'No registrado. Por favor regístrese.' });

        const match = await bcrypt.compare(password, voter.password);
        if (!match) return res.status(401).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: voter._id, codigo: voter.codigoEstudiantil }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ msg: 'Inicio de sesión exitoso', token });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
});


//Get
router.get('/voters', async (req, res) => {
    try {
      const votantes = await Voter.find().select('-password'); // excluye la contraseña
      res.status(200).json(votantes);
    } catch (err) {
      res.status(500).json({ msg: 'Error al obtener votantes', error: err.message });
    }
  });

  //findByCode
  router.get('/voters/:codigo', async (req, res) => {
    try {
      const { codigo } = req.params;
      const voter = await Voter.findOne({ codigoEstudiantil: codigo }).select('-password');
      if (!voter) {
        return res.status(404).json({ msg: 'Votante no encontrado' });
      }
      res.status(200).json(voter);
    } catch (err) {
      res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
  });

  //delete
  router.delete('/voters/:codigo', async (req, res) => {
    try {
      const { codigo } = req.params;
      const deleted = await Voter.findOneAndDelete({ codigoEstudiantil: codigo });
      if (!deleted) {
        return res.status(404).json({ msg: 'Votante no encontrado para eliminar' });
      }
      res.status(200).json({ msg: 'Votante eliminado exitosamente' });
    } catch (err) {
      res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
  });

  // Editar votante por código estudiantil
router.put('/voters/:codigoEstudiantil', async (req, res) => {
  const { codigoEstudiantil } = req.params;
  const { nombre, apellido, email, password } = req.body;

  try {
    // Buscar el votante existente
    const voter = await Voter.findOne({ codigoEstudiantil });
    if (!voter) return res.status(404).json({ msg: 'Votante no encontrado' });

    // Actualizar campos si fueron enviados en el body
    if (nombre) voter.nombre = nombre;
    if (apellido) voter.apellido = apellido;
    if (email) voter.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      voter.password = hashedPassword;
    }

    await voter.save();
    res.status(200).json({ msg: 'Votante actualizado correctamente', voter });

  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar votante', error: err.message });
  }
});

  
  

module.exports = router;
