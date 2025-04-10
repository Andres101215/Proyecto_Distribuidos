const axios = require('axios');
const VOTO_SERVICE_URL = process.env.VOTO_SERVICE_URL;
const ELECCION_SERVICE_URL = process.env.ELECCION_SERVICE_URL;
const CANDIDATO_SERVICE_URL = process.env.CANDIDATO_SERVICE_URL;

const contarVotos = async (eleccionId) => {
  const { data: votos } = await axios.get(`${VOTO_SERVICE_URL}?eleccionId=${eleccionId}`);
  const conteo = {};

  votos.forEach(voto => {
    const candidato = voto.candidateId;
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

  if (Object.keys(conteo).length === 0) {
    return {
      eleccionId,
      mensaje: "No hay votos registrados",
      ganadores: []
    };
  }

  // Obtener el número máximo de votos
  const maxVotos = Math.max(...Object.values(conteo));

  // Obtener todos los candidatos con esa cantidad de votos
  const ganadores = Object.keys(conteo).filter(candidatoId => conteo[candidatoId] === maxVotos);

  return {
    eleccionId,
    maxVotos,
    ganadores: ganadores.map(id => ({
      candidatoId: id,
      votos: maxVotos
    })),
    empate: ganadores.length > 1
  };
};

module.exports = { contarVotos, finalizarEleccion, declararGanador };
