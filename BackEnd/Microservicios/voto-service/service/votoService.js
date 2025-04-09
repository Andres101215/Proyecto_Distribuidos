const Voto = require('../models/voto');

const crearVoto = async (data) => {
  const { usuarioId, eleccionId, candidatoId } = data;

  // Verificar si ya votó
  const yaVoto = await Voto.findOne({ usuarioId, eleccionId });
  if (yaVoto) throw new Error('El usuario ya votó en esta elección');

  const nuevoVoto = new Voto({ usuarioId, eleccionId, candidatoId });
  return await nuevoVoto.save();
};

module.exports = { crearVoto };
