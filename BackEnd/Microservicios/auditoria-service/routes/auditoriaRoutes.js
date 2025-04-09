const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

router.post('/contar-votos/:eleccionId', auditoriaController.contarVotos);
router.post('/finalizar-eleccion/:eleccionId', auditoriaController.finalizarEleccion);
router.get('/ganador/:eleccionId', auditoriaController.declararGanador);

module.exports = router;
