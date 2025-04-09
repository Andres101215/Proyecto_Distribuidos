const express = require('express');
const router = express.Router();
const Eleccion = require('../models/eleccion');


//Obtener todos las elecciones (GET)
router.get("/", async (req, res) => {
  try {
      const elecciones = await Eleccion.find();
      res.json(elecciones);
  } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener las elecciones", error });
  }
});

// Registrar un nuevo eleccion
router.post('/', async (req, res) => {
  try {
    const eleccion = new Eleccion(req.body);
    await eleccion.save();
    res.status(201).json({ mensaje: 'Eleccion registrado correctamente', voto });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Obtener una eleccion por ID (GET)
router.get("/:id", async (req, res) => {
  try {
      const eleccion = await Eleccion.findById(req.params.id);
      if (!eleccion) {
          return res.status(404).json({ mensaje: "Eleccion no encontrada" });
      }
      res.json(eleccion);
  } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener la eleccion", error });
  }
});

//Actualizar una eleccion por ID (PUT)
router.put("/:id", async (req, res) => {
  try {
      const eleccionActualizado = await Eleccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!eleccionActualizado) {
          return res.status(404).json({ mensaje: "Eleccion no encontrada" });
      }
      res.json(eleccionActualizado);
  } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar la eleccion", error });
  }
});

// Eliminar un producto por ID (DELETE)
router.delete("/:id", async (req, res) => {
  try {
      const eleccionEliminado = await Eleccion.findByIdAndDelete(req.params.id);
      if (!eleccionEliminado) {
          return res.status(404).json({ mensaje: "eleccion no encontrada" });
      }
      res.json({ mensaje: "eleccion eliminado" });
  } catch (error) {
      res.status(500).json({ mensaje: "Error al eliminar la eleccion", error });
  }
});


module.exports = router;
