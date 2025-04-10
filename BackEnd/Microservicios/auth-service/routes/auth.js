const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
//const { generarToken } = require('../utils');


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
      let tokenUnico;
let existe = true;

do {
  tokenUnico = generarToken();
  const encontrado = await Voter.findOne({ token: tokenUnico });
  existe = !!encontrado;
} while (existe);
const hashedPassword = password;
const newVoter = new Voter({
  nombre,
  apellido,
  codigoEstudiantil,
  email,
  password: hashedPassword,
  token: tokenUnico  // lo agregas aquí
});
  
      // Hashear la contraseña
  
      await newVoter.save();
      res.status(201).json({ msg: 'Registro exitoso' });
  
    } catch (err) {
      res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
  });
  

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Verifica si es el admin hardcodeado
    if (email === 'admin@uptc.edu.co' && password === '1234') {
      // Puedes generar un token falso o real (sin buscar en BD)
      const token = jwt.sign(
        { id: 'admin-fixed-id' }, // id ficticio
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return res.json({
        msg: 'Inicio de sesión exitoso (Admin)',
        token,
        usuario: {
          email,
          nombre: 'Administrador',
          admin: true
        }
      });
    }
  
    try {
      const voter = await Voter.findOne({ email });
      if (!voter) {
        return res.status(404).json({ msg: 'No registrado. Por favor regístrese.' });
      }
  
      if (password !== voter.password) {
        return res.status(401).json({ msg: 'Contraseña incorrecta' });
      }
  
      const token = jwt.sign(
        { id: voter._id, codigo: voter.codigoEstudiantil },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({
        msg: 'Inicio de sesión exitoso',
        token,
        usuario: {
          email: voter.email,
          nombre: voter.nombre,
          admin: voter.admin || false, // Asegura que siempre tenga este campo
          codigo: voter.codigoEstudiantil
        }
      });
    } catch (err) {
      res.status(500).json({ msg: 'Error en el servidor', error: err.message });
    }
  });


//Get
router.get('/voters', async (req, res) => {
    try {
      const votantes = await Voter.find(); // excluye la contraseña
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

// Función para generar un token aleatorio de 2 letras y 2 números
function generarToken() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  
  const letra1 = letras[Math.floor(Math.random() * letras.length)];
  const letra2 = letras[Math.floor(Math.random() * letras.length)];
  const numero1 = numeros[Math.floor(Math.random() * numeros.length)];
  const numero2 = numeros[Math.floor(Math.random() * numeros.length)];

  return `${letra1}${letra2}${numero1}${numero2}`;
}


  
  

module.exports = router;
