import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import axios from 'axios';

export default function VotacionRepresentante() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const [userData, setUserData] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    const parsedUser = JSON.parse(storedUser);
    setUserData(parsedUser);

    const fetchDatos = async () => {
      try {
        const eleccionesRes = await axios.get('http://localhost:5000/api/elecciones/elecciones');
        const candidatosRes = await axios.get('http://localhost:5000/api/candidatos/candidates'); // ← tu endpoint para obtener todos los candidatos

        const elecciones = eleccionesRes.data;
        const todosLosCandidatos = candidatosRes.data;

        const eleccionActual = elecciones.find(e => e._id === id);
        if (!eleccionActual) {
          console.warn('No se encontró la elección con ID:', id);
          return;
        }

        setTitulo(eleccionActual.titulo || 'Votación');

        // Filtrar los candidatos cuyo ID esté en eleccionActual.candidatos (que es un array de strings)
        const candidatosFiltrados = todosLosCandidatos.filter(candidato =>
          eleccionActual.candidatos.includes(candidato._id)
        );

        if (candidatosFiltrados.length > 0) {
          setCandidatos(candidatosFiltrados);
        } else {
          console.warn('No se encontraron candidatos coincidentes con los IDs');
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchDatos();
  }, [id]);


  const handleSeleccion = (candidato) => {
    setSeleccionado(candidato);
  };

  const registrarVoto = async (candidato) => {
    const storedUser = localStorage.getItem('usuario');
    const parsedUser = JSON.parse(storedUser);

    const voterId = parsedUser.id;

    const voto = {
      voterId: voterId,
      electionId: id,
      candidateId: candidato._id,

    };

    try {
      const res = await axios.post('http://localhost:5000/api/votos/votos', voto);

      setSeleccionado(candidato); // Actualizar interfaz con el nombre del candidato votado
      //  console.log(candidato)

      navigate(-1);
      alert("El voto se registro correctamente por: " + candidato.nombre + " " + candidato.apellido)
    } catch (error) {
      console.error('Error al registrar el voto:', error);
      alert('Error al registrar el voto');
    }
  };


  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleLogout = () => navigate('/');
  const handleVolver = () => navigate('/eleccion');

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}

      {sidebarVisible && (
        <div className="bg-black text-white w-64 flex flex-col items-stretch p-6 relative z-10">
          <User size={40} className="mb-4 self-center" />
          <div className="text-center mb-6">
            <p className="text-white">{userData?.nombre || 'Usuario'}</p>
            <p className="text-sm text-gray-400">{userData?.email || 'correo@ejemplo.com'}</p>
          </div>
          <hr className="border-white my-2" />
          <button
            onClick={handleLogout}
            className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full"
          >
            Cerrar sesión
          </button>
          <hr className="border-white my-2" />
          <button
            onClick={handleVolver}
            className="text-white hover:underline text-sm font-medium"
          >
            Volver al menú principal
          </button>

          <button
            onClick={toggleSidebar}
            className="absolute right-[-16px] top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1 hover:bg-gray-300 z-20"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      )}

      {!sidebarVisible && (
        <button
          onClick={toggleSidebar}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1 hover:bg-gray-300 z-20"
        >
          <ArrowLeft size={20} className="transform rotate-180" />
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 bg-white p-10 relative"
        style={{
          backgroundImage: 'url("/fondo.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <h1 className="text-3xl font-bold text-center mb-10">
          {seleccionado ? `Has votado por: ${seleccionado.nombre}` : titulo || 'Votación'}
        </h1>

        {candidatos.length > 0 ? (
          <div className="flex flex-col space-y-10">
            {candidatos.reduce((rows, candidato, index) => {
              if (index % 2 === 0) {
                rows.push([candidato]);
              } else {
                rows[rows.length - 1].push(candidato);
              }
              return rows;
            }, []).map((fila, i) => (
              <div key={i} className="flex justify-between space-x-10">
                {fila.map((candidato, index) => (
                  <div key={index} className="flex w-1/2 items-start space-x-4">
                    {/* Imagen + botón */}
                    <div className="flex flex-col items-center space-y-2">
                      {/* Info */}
                      <div className="bg-black text-yellow-400 p-4 w-60 h-[184px] text-sm leading-snug flex flex-col justify-center">
                        <p><strong>Nombre:</strong> {candidato.nombre}</p>
                        <p><strong>Apellido:</strong> {candidato.apellido}</p>
                        <p><strong>Codigo:</strong> {candidato.codigoEstudiantil}</p>
                        <p><strong>Propuestas:</strong> {candidato.propuestas}</p>
                      </div>
                      <button
                        onClick={() => registrarVoto(candidato)}
                        className="bg-yellow-300 text-black font-bold px-4 py-2 border border-black hover:bg-yellow-400 w-40"
                      >
                        Votar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No hay candidatos disponibles para esta elección.</p>
        )}
      </div>
    </div>
  );
}
