const auditoriaService = require('../services/auditoriaService');

const contarVotos = async (req, res) => {
  try {
    const resultado = await auditoriaService.contarVotos(req.params.eleccionId);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const finalizarEleccion = async (req, res) => {
  try {
    const resultado = await auditoriaService.finalizarEleccion(req.params.eleccionId);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const declararGanador = async (req, res) => {
  try {
    const resultado = await auditoriaService.declararGanador(req.params.eleccionId);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { contarVotos, finalizarEleccion, declararGanador };
