import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ELECCION_SERVICE_URL = 'http://localhost:5000/api/elecciones/elecciones';
const AUDITORIA_SERVICE_URL = 'http://localhost:5000/api/auditoria/auditoria';
const CANDIDATO_SERVICE_URL = 'http://localhost:5005/candidates';

export default function AdminEleccion() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [elecciones, setElecciones] = useState([]);
  const [resultados, setResultados] = useState({});
  const [usuario, setUsuario] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatosAgregados, setCandidatosAgregados] = useState([]);
  const [formData, setFormData] = useState({
    electionId: '',
    candidateId: '',
    nombre: '',
    descripcion: '',
    estado: 'activo',
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerElecciones = async () => {
      try {
        const { data } = await axios.get(ELECCION_SERVICE_URL);
        setElecciones(data);
      } catch (err) {
        console.error('Error al obtener elecciones:', err);
      }
    };

    const obtenerCandidatos = async () => {
      try {
        const { data } = await axios.get(CANDIDATO_SERVICE_URL);
        setCandidatos(data);
      } catch (err) {
        console.error('Error al obtener candidatos:', err);
      }
    };

    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(usuarioGuardado);
    obtenerElecciones();
    obtenerCandidatos();
  }, []);

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        electionId: formData.electionId,
        candidatos: candidatosAgregados.map((c) => c.codigoEstudiantil),
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        estado: formData.estado,
      };

      if (modoEdicion) {
        await axios.put(`${ELECCION_SERVICE_URL}/${editId}`, payload);
        setModoEdicion(false);
        setEditId(null);
      } else {
        await axios.post(ELECCION_SERVICE_URL, payload);
      }

      const { data } = await axios.get(ELECCION_SERVICE_URL);
      setElecciones(data);
      setFormData({
        electionId: '',
        candidateId: '',
        nombre: '',
        descripcion: '',
        estado: 'activo',
      });
      setCandidatosAgregados([]);
    } catch (err) {
      console.error('Error al guardar la elección:', err);
    }
  };

  const editarEleccion = (eleccion) => {
    setFormData({
      electionId: eleccion.electionId || '',
      candidateId: '',
      nombre: eleccion.nombre,
      descripcion: eleccion.descripcion,
      estado: eleccion.estado || 'activo',
    });

    setCandidatosAgregados(
      candidatos.filter((c) => eleccion.candidatos.includes(c.codigoEstudiantil))
    );

    setModoEdicion(true);
    setEditId(eleccion._id);
  };

  const eliminarEleccion = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta elección?')) return;
    try {
      await axios.delete(`${ELECCION_SERVICE_URL}/${id}`);
      setElecciones((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Error al eliminar elección:', err);
    }
  };

  const finalizarEleccion = async (eleccionId) => {
    if (!window.confirm('¿Desea finalizar la elección?')) return;
    try {
      await axios.put(`${AUDITORIA_SERVICE_URL}/finalizar-eleccion/${eleccionId}`);
      const { data: conteo } = await axios.get(`${AUDITORIA_SERVICE_URL}/contar-votos/${eleccionId}`);
      const { data: resultado } = await axios.post(`${AUDITORIA_SERVICE_URL}/ganador/${eleccionId}`);
      setResultados((prev) => ({
        ...prev,
        [eleccionId]: { finalizada: true, conteo, resultado },
      }));
      setElecciones((prev) =>
        prev.map((e) => (e._id === eleccionId ? { ...e, estado: 'finalizado' } : e))
      );
    } catch (err) {
      console.error(err);
      alert('Error al finalizar la elección.');
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      {sidebarVisible && (
        <div className="bg-black text-white w-64 flex flex-col items-stretch p-6 relative z-10">
          <User size={40} className="mb-4 self-center" />
          <div className="text-center mb-6">
            <p className="text-white font-bold">
              {usuario?.email === 'admin@uptc.edu.co' ? 'Administrador' : usuario?.nombre || 'Usuario'}
            </p>
            <p className="text-sm text-gray-400">{usuario?.email}</p>
          </div>
          <hr className="border-white my-2" />
          <button onClick={() => navigate('/admin/elecciones')} className="py-2 text-left hover:bg-gray-800 px-3 rounded mb-1">
            Elecciones
          </button>
          <button onClick={() => navigate('/admin/votantes')} className="py-2 text-left hover:bg-gray-800 px-3 rounded mb-1">
            Votantes
          </button>
          <button onClick={() => navigate('/admin/candidatos')} className="py-2 text-left hover:bg-gray-800 px-3 rounded mb-4">
            Candidatos
          </button>
          <button onClick={() => navigate('/')} className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full">
            Cerrar sesión
          </button>
          <hr className="border-white my-2" />
          <button onClick={() => setSidebarVisible(false)} className="absolute right-[-16px] top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1 hover:bg-gray-300 z-20">
            <ArrowLeft size={20} />
          </button>
        </div>
      )}

      {!sidebarVisible && (
        <button onClick={() => setSidebarVisible(true)} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1 hover:bg-gray-300 z-20">
          <ArrowLeft size={20} className="transform rotate-180" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-cover bg-center relative" style={{ backgroundImage: 'url("/fondo.jpg")' }}>
        <div className="absolute inset-0 bg-black opacity-50 z-0" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-10 text-center">Panel de Administración</h1>

          {/* Formulario */}
          <form onSubmit={manejarSubmit} className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto mb-10">
            <h2 className="text-xl font-bold mb-4">{modoEdicion ? 'Editar Elección' : 'Crear Nueva Elección'}</h2>
            <input
              type="text"
              name="electionId"
              value={formData.electionId}
              onChange={manejarCambio}
              placeholder="ID de la Elección"
              required
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />

            {/* Selección de candidatos */}
            <div className="flex gap-2 mb-3">
              <select
                name="candidateId"
                value={formData.candidateId}
                onChange={manejarCambio}
                className="flex-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Seleccione un candidato</option>
                {candidatos.map((c) => (
                  <option key={c._id} value={c.codigoEstudiantil}>
                    {c.nombre} {c.apellido} - {c.codigoEstudiantil}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const candidatoSeleccionado = candidatos.find(c => c.codigoEstudiantil === formData.candidateId);
                  if (!candidatoSeleccionado || candidatosAgregados.some(c => c.codigoEstudiantil === candidatoSeleccionado.codigoEstudiantil)) return;
                  setCandidatosAgregados(prev => [...prev, candidatoSeleccionado]);
                  setFormData(prev => ({ ...prev, candidateId: '' }));
                }}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Agregar
              </button>
            </div>

            {/* Tabla candidatos agregados */}
            {candidatosAgregados.length > 0 && (
              <table className="w-full mb-4 text-sm border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Nombre</th>
                    <th className="border px-2 py-1">Código</th>
                    <th className="border px-2 py-1">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatosAgregados.map((c) => (
                    <tr key={c.codigoEstudiantil}>
                      <td className="border px-2 py-1">{c.nombre} {c.apellido}</td>
                      <td className="border px-2 py-1">{c.codigoEstudiantil}</td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setCandidatosAgregados(prev =>
                              prev.filter((cand) => cand.codigoEstudiantil !== c.codigoEstudiantil)
                            )
                          }
                          className="text-red-500 hover:underline"
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={manejarCambio}
              placeholder="Nombre"
              required
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={manejarCambio}
              placeholder="Descripción"
              required
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              {modoEdicion ? 'Guardar Cambios' : 'Crear'}
            </button>
          </form>

          {/* Tarjetas elecciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elecciones.map((eleccion) => {
              const resultado = resultados[eleccion._id];
              return (
                <div key={eleccion._id} className="bg-white rounded-2xl shadow-lg p-6 relative">
                  <h2 className="text-xl font-bold mb-2 text-center">{eleccion.nombre}</h2>
                  <p className="text-sm text-gray-600 text-center mb-2">{eleccion.descripcion}</p>
                  <p className="text-sm text-gray-500 text-center mb-2">electionId: {eleccion.electionId}</p>
                  <p className={`text-sm text-center mb-4 font-semibold ${eleccion.estado === 'activo' ? 'text-green-600' : 'text-red-600'}`}>
                    Estado: {eleccion.estado}
                  </p>
                  {resultado && (
                    <div className="mb-4">
                      <p className="text-green-700 font-semibold">Elección finalizada</p>
                      <p className="text-sm mt-2"><strong>Ganador(es):</strong></p>
                      <ul className="list-disc list-inside">
                        {resultado.resultado.ganadores.map((g) => (
                          <li key={g.codigoEstudiantil}>ID: {g.codigoEstudiantil} — Votos: {g.votos}</li>
                        ))}
                      </ul>
                      {resultado.resultado.empate && (
                        <p className="text-red-600 mt-2">¡Empate detectado!</p>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4 space-x-2">
                    <button onClick={() => editarEleccion(eleccion)} className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                      <Edit size={16} className="inline-block mr-1" /> Editar
                    </button>
                    <button onClick={() => eliminarEleccion(eleccion._id)} className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600">
                      <Trash2 size={16} className="inline-block mr-1" /> Eliminar
                    </button>
                  </div>
                  <button
                    className={`w-full mt-3 py-2 rounded-lg font-semibold transition ${
                      eleccion.estado === 'finalizado'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                    }`}
                    onClick={() => finalizarEleccion(eleccion._id)}
                    disabled={eleccion.estado === 'finalizado'}
                  >
                    ¿Desea finalizar elección?
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
