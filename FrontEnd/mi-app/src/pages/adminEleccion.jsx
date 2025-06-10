import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AUDITORIA_SERVICE_URL = 'http://localhost:5000/api/auditoria/auditoria';

export default function AdminEleccion() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [elecciones, setElecciones] = useState([]);
  const [resultados, setResultados] = useState({});
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

 useEffect(() => {
  const obtenerElecciones = async () => {
    const { data } = await axios.get('http://localhost:5000/api/elecciones/elecciones');
    setElecciones(data);

    const resultadosTemp = {};

    // Ejecutar llamadas paralelas para elecciones finalizadas
    const promesas = data.map(async (eleccion) => {
      if (eleccion.finalizada) {
        try {
          const { data: resultado } = await axios.post(
            `${AUDITORIA_SERVICE_URL}/ganador/${eleccion._id}`
          );
          resultadosTemp[eleccion._id] = { resultado };
        } catch (err) {
          console.error(`Error cargando resultado de elección ${eleccion._id}:`, err);
        }
      }
    });

    await Promise.all(promesas); // Esperar que todas terminen
    setResultados(resultadosTemp); // Actualizar resultados todos a la vez
  };

  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
  setUsuario(usuarioGuardado);
  obtenerElecciones();
}, []);


  const finalizarEleccion = async (eleccionId) => {
    const confirm = window.confirm('¿Desea finalizar la elección?');
    if (!confirm) return;

    try {
      await axios.put(`${AUDITORIA_SERVICE_URL}/finalizar-eleccion/${eleccionId}`);
      await axios.get(`${AUDITORIA_SERVICE_URL}/contar-votos/${eleccionId}`);
      const { data: resultado } = await axios.post(
        `${AUDITORIA_SERVICE_URL}/ganador/${eleccionId}`
      );

      setResultados(prev => ({
        ...prev,
        [eleccionId]: { resultado }
      }));

      setElecciones(prev =>
        prev.map(e => e._id === eleccionId ? { ...e, finalizada: true } : e)
      );
    } catch (err) {
      console.error(err);
      alert('Error al finalizar la elección.');
    }
  };

  return (
    <div className="flex min-h-screen relative">
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

          {usuario?.email === 'admin@uptc.edu.co' && (
            <>
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
            </>
          )}

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

      <div className="flex-1 p-8 overflow-y-auto bg-cover bg-center relative" style={{ backgroundImage: 'url("/fondo.jpg")' }}>
        <div className="absolute inset-0 bg-black opacity-50 z-0" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-10 text-center">Panel de Administración</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elecciones.map(eleccion => {
              const resultado = resultados[eleccion._id];
              return (
                <div key={eleccion._id} className="bg-white rounded-2xl shadow-lg p-6 relative">
                  <h2 className="text-xl font-bold mb-2 text-center">{eleccion.nombre}</h2>
                  <p className="text-sm text-gray-600 text-center mb-4">{eleccion.descripcion}</p>

                  {resultado && (
                    <div className="mb-4">
                      <p className="text-green-700 font-semibold">Elección finalizada</p>
                      <p className="text-sm mt-2"><strong>Ganador(es):</strong></p>
                      <ul className="list-disc list-inside">
                        {resultado.resultado.ganadores.map(g => (
                          <li key={g.candidatoId}>
                            Candidato: {g.nombreCompleto} — Votos: {g.votos}
                          </li>
                        ))}
                      </ul>
                      {resultado.resultado.empate && (
                        <p className="text-red-600 mt-2">¡Empate detectado!</p>
                      )}
                    </div>
                  )}

                  {!eleccion.finalizada && (
                    <button
                      className="w-full mt-2 py-2 rounded-lg font-semibold bg-yellow-400 hover:bg-yellow-500 text-black transition"
                      onClick={() => finalizarEleccion(eleccion._id)}
                    >
                      ¿Desea finalizar elección?
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
