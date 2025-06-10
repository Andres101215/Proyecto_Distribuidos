import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ELECCION_SERVICE_URL = 'http://localhost:5000/api/elecciones/elecciones';
const AUDITORIA_SERVICE_URL = 'http://localhost:5000/api/auditoria/auditoria';
const CANDIDATO_SERVICE_URL = 'http://localhost:5005/candidates';

export default function AdminEleccion() {

  const [mostrarModal, setMostrarModal] = useState(false);
  const [candidatosModal, setCandidatosModal] = useState([]);
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
        ...formData,
        candidatos: candidatosAgregados.map((c) => c._id),
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

    // Buscar candidatos por su código
    const candidatosSeleccionados = candidatos.filter((c) =>
      eleccion.candidatos.includes(c._id)
    );
    setCandidatosAgregados(candidatosSeleccionados);

    setModoEdicion(true);
    setEditId(eleccion._id);
  };

  const abrirModalCandidatos = (eleccion) => {
    const candidatosDeEleccion = candidatos.filter((c) =>
      eleccion.candidatos?.includes(c._id)
    );
    setCandidatosModal(candidatosDeEleccion);
    setMostrarModal(true);
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
      // 1. Finaliza la elección
      await axios.put(`${AUDITORIA_SERVICE_URL}/finalizar-eleccion/${eleccionId}`);

      // 2. Declara al ganador (ya incluye el conteo)
      const { data: resultado } = await axios.post(`${AUDITORIA_SERVICE_URL}/ganador/${eleccionId}`);

      // 3. Guarda el resultado y marca la elección como finalizada en UI
      setResultados((prev) => ({
        ...prev,
        [eleccionId]: { finalizada: true, resultado }, // 👈 ya no necesitas "conteo"
      }));
      setElecciones((prev) =>
        prev.map((e) => (e._id === eleccionId ? { ...e, estado: 'finalizado' } : e))
      );
    } catch (err) {
      console.error(err);
      alert('Error al finalizar la elección.');
    }
  };

   const resultadosEleccion = async (eleccionId) => {
    try {
      const { data: resultado } = await axios.post(`${AUDITORIA_SERVICE_URL}/ganador/${eleccionId}`);

      // 3. Guarda el resultado y marca la elección como finalizada en UI
      setResultados((prev) => ({
        ...prev,
        [eleccionId]: { finalizada: true, resultado }, // 👈 ya no necesitas "conteo"
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

            {/* Select + Agregar */}
            <div className="flex gap-2 mb-3">
              <select
                name="candidateId"
                value={formData.candidateId}
                onChange={manejarCambio}
                className="flex-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Seleccione un candidato</option>
                {candidatos.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nombre} {c.apellido} - {c.codigoEstudiantil}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const candidatoSeleccionado = candidatos.find(c => c._id === formData.candidateId);
                  if (!candidatoSeleccionado || candidatosAgregados.some(c => c._id === candidatoSeleccionado._id)) return;
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
                    <tr key={c._id}>
                      <td className="border px-2 py-1">{c.nombre} {c.apellido}</td>
                      <td className="border px-2 py-1">{c.codigoEstudiantil}</td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setCandidatosAgregados(prev =>
                              prev.filter((cand) => cand._id !== c._id)
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

          {/* Tarjetas de elecciones existentes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elecciones.map((eleccion) => {
              const resultado = resultados[eleccion._id];
              return (
                <div key={eleccion._id} className="bg-white rounded-2xl shadow-lg p-6 relative hover:shadow-xl transition-shadow">
                  <h2 className="text-xl font-bold mb-2 text-center text-gray-800">{eleccion.nombre}</h2>
                  <p className="text-sm text-gray-600 text-center mb-2">{eleccion.descripcion}</p>
                  <p className="text-sm text-gray-500 text-center mb-2">ID: {eleccion.electionId}</p>
                  <div className="text-center mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${eleccion.estado === 'activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {eleccion.estado.toUpperCase()}
                    </span>
                  </div>

                  {resultado && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-700 font-semibold mb-2">Elección finalizada</p>
                      <div className="text-sm">
                        <p className="font-medium">Ganador(es):</p>
                        <ul className="mt-1 space-y-1">
                          {resultado.resultado.ganadores.map((g) => (
                            <li key={g.codigoEstudiantil} className="flex justify-between">
                              <span>Candidato: {g.nombreCompleto}</span>
                              <span className="font-medium">votos: {g.votos} </span>
                            </li>
                          ))}
                        </ul>
                        <p className="font-medium">Resultados:</p>
                        <ul className="mt-1 space-y-1">
                          {resultado.resultado.resultados.map((g) => (
                            <li key={g.codigoEstudiantil} className="flex justify-between">
                              <span>Candidato: {g.nombreCompleto}</span>
                              <span className="font-medium">votos: {g.votos} </span>
                            </li>
                          ))}
                        </ul>
                        {resultado.resultado.empate && (
                          <p className="text-red-600 mt-2 font-semibold">¡Empate detectado!</p>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => abrirModalCandidatos(eleccion)}
                    className="w-full mb-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Ver Candidatos ({eleccion.candidatos?.length || 0})
                  </button>

                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => editarEleccion(eleccion)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center font-medium"
                    >
                      <Edit size={16} className="mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => eliminarEleccion(eleccion._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center font-medium"
                    >
                      <Trash2 size={16} className="mr-1" /> Eliminar
                    </button>
                  </div>

                  <button
                    onClick={() => finalizarEleccion(eleccion._id)}
                    disabled={eleccion.estado === 'finalizado'}
                    className={`w-full py-2 rounded-lg  font-semibold transition-colors  mb-2 ${eleccion.estado === 'finalizado'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                      }`}
                  >
                    {eleccion.estado === 'finalizado' ? 'Elección Finalizada' : 'Finalizar Elección'}
                  </button>

                  <button
                    onClick={() => resultadosEleccion(eleccion._id)}
                    disabled={eleccion.estado === 'activo'}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${eleccion.estado === 'activo'
                        ? 'bg-blue-400 text-white cursor-not-allowed'
                        : 'bg-blue-400 hover:bg-blue-500 text-black'
                      }`}
                  >
                    Ver resultados
                  </button>

                </div>
              );
            })}
          </div>

          {elecciones.length === 0 && (
            <div className="text-center text-white mt-10">
              <p className="text-xl">No hay elecciones creadas</p>
              <p className="text-gray-300 mt-2">Crea tu primera elección usando el formulario anterior</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de candidatos */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Candidatos de la Elección</h3>
            {candidatosModal.length > 0 ? (
              <div className="space-y-3">
                {candidatosModal.map((c) => (
                  <div key={c._id} className="p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors">
                    <p className="font-semibold text-gray-800">{c.nombre} {c.apellido}</p>
                    <p className="text-sm text-gray-600">Código: {c.codigoEstudiantil}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay candidatos asociados a esta elección.</p>
              </div>
            )}
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
