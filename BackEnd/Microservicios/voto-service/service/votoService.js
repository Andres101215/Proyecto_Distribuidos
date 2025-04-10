const Voto = require('../models/voto');

const crearVoto = async (data) => {
  const { voterId, electionId, candidateId } = data;

  // Verificar si ya votó
  const yaVoto = await Voto.findOne({ voterId, electionId });
  if (yaVoto) throw new Error('El usuario ya votó en esta elección');

  const nuevoVoto = new Voto({ voterId, electionId, candidateId });
  return await nuevoVoto.save();
};

module.exports = { crearVoto };
