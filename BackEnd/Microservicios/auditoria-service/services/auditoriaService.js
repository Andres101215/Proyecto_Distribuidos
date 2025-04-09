const axios = require('axios');
const VOTO_SERVICE_URL = process.env.VOTO_SERVICE_URL;
const ELECCION_SERVICE_URL = process.env.ELECCION_SERVICE_URL;

const contarVotos = async (eleccionId) => {
  const { data: votos } = await axios.get(`${VOTO_SERVICE_URL}?eleccionId=${eleccionId}`);
  const conteo = {};

  votos.forEach(voto => {
    const candidato = voto.candidatoId;
    conteo[candidato] = (conteo[candidato] || 0) + 1;
  });

  return conteo;
};

const finalizarEleccion = async (eleccionId) => {
  const { data } = await axios.put(`${ELECCION_SERVICE_URL}/${eleccionId}/finalizar`);
  return data;
};

const declararGanador = async (eleccionId) => {
  const conteo = await contarVotos(eleccionId);
  const ganadorId = Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b);

  return {
    eleccionId,
    ganador: {
      candidatoId: ganadorId,
      votos: conteo[ganadorId]
    }
  };
};

module.exports = { contarVotos, finalizarEleccion, declararGanador };
