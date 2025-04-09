import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

const candidatos = [
  {
    id: 1,
    nombre: 'Laura Gómez',
    carrera: 'Ingeniería de Sistemas',
    edad: 22,
    descripcion: 'Apasionada por la tecnología y el cambio.',
    foto: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    nombre: 'Carlos Martínez',
    carrera: 'Administración de Empresas',
    edad: 24,
    descripcion: 'Con experiencia en liderazgo estudiantil.',
    foto: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    id: 3,
    nombre: 'Ana Torres',
    carrera: 'Derecho',
    edad: 23,
    descripcion: 'Defensora de los derechos estudiantiles.',
    foto: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 4,
    nombre: 'Daniel Ríos',
    carrera: 'Contaduría Pública',
    edad: 25,
    descripcion: 'Transparencia y compromiso.',
    foto: 'https://randomuser.me/api/portraits/men/76.jpg',
  },
];

export default function VotacionRepresentante() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const titulo = queryParams.get('titulo') || 'Representante';

  const handleSeleccion = (candidato) => {
    setSeleccionado(candidato);
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleLogout = () => navigate('/');
  const handleVolver = () => navigate('/admin');

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      {sidebarVisible && (
        <div className="bg-black text-white w-64 flex flex-col justify-between p-6 relative z-10">
          <div>
            <User size={35} className="mb-4 self-center mx-auto" />
            <div className="text-center mb-6">
              <p className="text-white">Administrador</p>
              <p className="text-sm text-gray-400">admin@uptc.edu.co</p>
            </div>

            <hr className="border-white my-2" />

            <button className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full">
              Crear elección
            </button>
            <hr className="border-white my-2" />

            <button className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full">
              Crear candidato
            </button>
            <hr className="border-white my-2" />

            <button
              onClick={handleLogout}
              className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full"
            >
              Cerrar sesión
            </button>
          </div>

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
      <div className="flex-1 bg-white p-10 relative">
        <h1 className="text-3xl font-bold text-center mb-10">
          {seleccionado ? `Has votado por: ${seleccionado.nombre}` : titulo}
        </h1>

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
              {fila.map((candidato) => (
                <div key={candidato.id} className="flex w-1/2 items-start space-x-4">
                  {/* Imagen + botón */}
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={candidato.foto}
                      alt={candidato.nombre}
                      className="w-40 h-40 object-cover rounded"
                    />
                    <button
                      onClick={() => handleSeleccion(candidato)}
                      className="bg-yellow-300 text-black font-bold px-4 py-2 border border-black hover:bg-yellow-400 w-40"
                    >
                      Votar
                    </button>
                  </div>

                  {/* Info */}
                  <div className="bg-black text-yellow-400 p-4 w-60 h-[184px] text-sm leading-snug flex flex-col justify-center">
                    <p><strong>Nombre:</strong> {candidato.nombre}</p>
                    <p><strong>Carrera:</strong> {candidato.carrera}</p>
                    <p><strong>Edad:</strong> {candidato.edad}</p>
                    <p><strong>Descripción:</strong> {candidato.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
