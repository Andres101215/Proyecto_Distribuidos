const axios = require('axios');
const VOTO_SERVICE_URL = process.env.VOTO_SERVICE_URL;
const ELECCION_SERVICE_URL = process.env.ELECCION_SERVICE_URL;
const CANDIDATO_SERVICE_URL = process.env.CANDIDATO_SERVICE_URL;

const contarVotos = async (eleccionId) => {
  const { data: votos } = await axios.get(`${VOTO_SERVICE_URL}?electionId=${eleccionId}`);
  const conteo = {};

  votos.forEach(voto => {
    const candidato = voto.candidateId;
    conteo[candidato] = (conteo[candidato] || 0) + 1;
  });

  return conteo;
};

const finalizarEleccion = async (eleccionId) => {
  try {
    const { data } = await axios.put(`${ELECCION_SERVICE_URL}/${eleccionId}`, {
      estado: 'finalizado'
    });

    return {
      mensaje: 'Elección finalizada exitosamente',
      eleccion: data
    };
  } catch (error) {
    console.error('Error al finalizar la elección:', error.message);
    throw new Error('No se pudo finalizar la elección');
  }
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

  const maxVotos = Math.max(...Object.values(conteo));
  const ganadoresIds = Object.keys(conteo).filter(id => conteo[id] === maxVotos);

  const ganadores = await Promise.all(
    ganadoresIds.map(async (id) => {

      try {
        const { data: candidato } = await axios.get(`${CANDIDATO_SERVICE_URL}/${id}`);
        return {
          nombreCompleto: `${candidato.nombre} ${candidato.apellido}`,
          votos: maxVotos
        };
      } catch (error) {
        console.error(`Error obteniendo candidato con ID ${id}:`, error.message);
        return {
          nombreCompleto: 'Nombre no disponible',
          votos: maxVotos
        };
      }
    })
  );

  return {
    eleccionId,
    maxVotos,
    ganadores,
    empate: ganadores.length > 1
  };
};

module.exports = { contarVotos, finalizarEleccion, declararGanador };
