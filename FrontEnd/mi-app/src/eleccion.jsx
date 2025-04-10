import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Eleccion() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [opciones, setOpciones] = useState([]);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleLogout = () => navigate('/');

  useEffect(() => {
    axios.get('http://localhost:5000/api/elecciones/elecciones')
      .then(response => {
        console.log('Respuesta de la API:', response.data); // <-- Aquí
        const elecciones = response.data;
        setOpciones(elecciones.map(e => e.titulo)); // Solo si quieres solo los títulos
      })
      .catch(error => {
        console.error('Error al obtener elecciones:', error);
      });
  }, []);
  

  const handleSelect = (titulo) => {
    navigate(`/votacion?titulo=${encodeURIComponent(titulo)}`);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      {sidebarVisible && (
        <div className="bg-black text-white w-64 flex flex-col items-stretch p-6 relative z-10">
          <User size={40} className="mb-4 self-center" />
          <div className="text-center mb-6">
            <p className="text-white">Nombre usuario</p>
            <p className="text-sm text-gray-400">Código</p>
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
      <div
        className="flex-1 relative flex items-center justify-center p-8"
        style={{
          backgroundImage: 'url("/fondo.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-3xl font-bold text-white mb-10">Vota por el futuro de la UPTC</h1>
          <div className="space-y-6 w-full max-w-md">
            {opciones.map((eleccion) => (
              <button
                key={eleccion._id}
                onClick={() => handleSelect(eleccion)}
                className="w-full py-5 rounded-lg text-white font-semibold transition transform duration-150 hover:scale-105 bg-black"
              >
                {eleccion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
