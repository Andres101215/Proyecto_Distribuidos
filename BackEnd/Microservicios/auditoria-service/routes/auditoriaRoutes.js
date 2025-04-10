const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

router.get('/contar-votos/:eleccionId', auditoriaController.contarVotos);
router.put('/finalizar-eleccion/:eleccionId', auditoriaController.finalizarEleccion);
router.post('/ganador/:eleccionId', auditoriaController.declararGanador);

module.exports = router;
