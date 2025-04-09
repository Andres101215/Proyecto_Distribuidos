import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminEleccion() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selected, setSelected] = useState(null);
  const [elecciones, setElecciones] = useState([]);
  const [nuevaEleccion, setNuevaEleccion] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [candidatosSeleccionados, setCandidatosSeleccionados] = useState([]);
  const [candidatosDisponibles, setCandidatosDisponibles] = useState([]);

  const [nombreCandidato, setNombreCandidato] = useState('');
  const [edad, setEdad] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [propuesta, setPropuesta] = useState(null);
  const [eleccionCandidato, setEleccionCandidato] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const predeterminadas = [
      { nombre: 'Representante estudiantil', descripcion: '' },
      { nombre: 'Representante bienestarin@', descripcion: '' },
      { nombre: 'Representante de la carrera', descripcion: '' },
      { nombre: 'Representante de la seccional', descripcion: '' },
    ];

    const guardadas = JSON.parse(localStorage.getItem('elecciones')) || [];
    const nombresExistentes = new Set(guardadas.map((e) => e.nombre));
    const nuevas = predeterminadas.filter((e) => !nombresExistentes.has(e.nombre));
    const combinadas = [...guardadas, ...nuevas];
    setElecciones(combinadas);
    localStorage.setItem('elecciones', JSON.stringify(combinadas));

    const candidatosGuardados = JSON.parse(localStorage.getItem('candidatos')) || [];
    setCandidatosDisponibles(candidatosGuardados);
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleLogout = () => navigate('/');

  const handleSelect = (option) => {
    if (typeof option === 'string' && elecciones.find(e => e.nombre === option)) {
      navigate(`/votacion?titulo=${encodeURIComponent(option)}`);
    } else {
      setSelected(option);
    }
  };

  const handleAceptar = () => {
    if (nuevaEleccion.trim() !== '') {
      setElecciones((prev) => {
        if (!prev.some(e => e.nombre === nuevaEleccion.trim())) {
          const actualizadas = [...prev, {
            nombre: nuevaEleccion.trim(),
            descripcion: nuevaDescripcion.trim(),
            candidatos: candidatosSeleccionados
          }];
          localStorage.setItem('elecciones', JSON.stringify(actualizadas));
          return actualizadas;
        }
        return prev;
      });
      setNuevaEleccion('');
      setNuevaDescripcion('');
      setCandidatosSeleccionados([]);
      setSelected(null);
    }
  };

  const handleCrearCandidato = () => {
    const nuevoCandidato = {
      id: Date.now().toString(),
      nombre: nombreCandidato,
      edad,
      codigo,
      descripcion,
      foto,
      propuesta
    };

    const actualizados = [...candidatosDisponibles, nuevoCandidato];
    setCandidatosDisponibles(actualizados);
    localStorage.setItem('candidatos', JSON.stringify(actualizados));

    setNombreCandidato('');
    setEdad('');
    setCodigo('');
    setDescripcion('');
    setFoto(null);
    setPropuesta(null);
    setEleccionCandidato('');
    setSelected(null);
  };

  return (
    <div className="flex min-h-screen relative">
      {sidebarVisible && (
        <div className="bg-black text-white w-64 flex flex-col items-stretch p-6 relative z-10">
          <User size={40} className="mb-4 self-center" />
          <div className="text-center mb-6">
            <p className="text-white">Administrador</p>
            <p className="text-sm text-gray-400">admin@uptc.edu.co</p>
          </div>
          <hr className="border-white my-2" />
          <button onClick={() => handleSelect('crear-eleccion')} className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full">Crear elección</button>
          <hr className="border-white my-2" />
          <button onClick={() => handleSelect('crear-candidato')} className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full">Crear candidato</button>
          <hr className="border-white my-2" />
          <button onClick={handleLogout} className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full">Cerrar sesión</button>
          <hr className="border-white my-2" />
          <button onClick={toggleSidebar} className="absolute right-[-16px] top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1 hover:bg-gray-300 z-20">
            <ArrowLeft size={20} />
          </button>
        </div>
      )}

      {!sidebarVisible && (
        <button onClick={toggleSidebar} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-1 hover:bg-gray-300 z-20">
          <ArrowLeft size={20} className="transform rotate-180" />
        </button>
      )}

      <div className="flex-1 relative flex items-center justify-center p-8" style={{ backgroundImage: 'url("/fondo.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-black opacity-50 z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-3xl font-bold text-white mb-10">Panel de Administración</h1>
          <div className="space-y-6 w-full max-w-md">
            {elecciones.map((eleccion, index) => (
              <button key={index} onClick={() => handleSelect(eleccion.nombre)} className={`w-full py-5 rounded-lg text-white font-semibold transition transform duration-150 hover:scale-105 bg-black ${selected === eleccion.nombre ? 'scale-105' : ''}`}>{eleccion.nombre}</button>
            ))}
          </div>
        </div>

        {selected === 'crear-eleccion' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] relative">
              <button onClick={() => setSelected(null)} className="absolute top-2 right-2 text-black font-bold text-lg">×</button>
              <h2 className="text-xl font-bold mb-4">Crear nueva elección</h2>

              <label className="block font-semibold mb-1">Nombre de la elección</label>
              <input type="text" value={nuevaEleccion} onChange={(e) => setNuevaEleccion(e.target.value)} className="w-full p-2 border rounded mb-4 bg-yellow-100" />

              <label className="block font-semibold mb-1">Descripción</label>
              <textarea value={nuevaDescripcion} onChange={(e) => setNuevaDescripcion(e.target.value)} className="w-full p-2 border rounded mb-4 bg-yellow-100" />

              <label className="block font-semibold mb-1">Seleccionar candidatos</label>
              <select multiple value={candidatosSeleccionados} onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setCandidatosSeleccionados(options);
              }} className="w-full p-2 border rounded mb-4 bg-yellow-100">
                {candidatosDisponibles.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>

              <div className="flex justify-between">
                <button onClick={() => setSelected(null)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                <button onClick={handleAceptar} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded">Aceptar</button>
              </div>
            </div>
          </div>
        )}

        {selected === 'crear-candidato' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] relative">
              <button onClick={() => setSelected(null)} className="absolute top-2 right-2 text-black font-bold text-lg">×</button>
              <h2 className="text-xl font-bold mb-4">Crear nuevo candidato</h2>

              <label className="block font-semibold mb-1">Nombre completo</label>
              <input type="text" value={nombreCandidato} onChange={(e) => setNombreCandidato(e.target.value)} className="w-full p-2 border rounded mb-4 bg-yellow-100" />

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Edad</label>
                  <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} className="w-full p-2 border rounded mb-4 bg-yellow-100" />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Código</label>
                  <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full p-2 border rounded mb-4 bg-yellow-100" />
                </div>
              </div>

              <label className="block font-semibold mb-1">Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full p-2 border rounded mb-4 bg-yellow-100" />

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Foto</label>
                  <input type="file" onChange={(e) => setFoto(e.target.files[0])} className="w-full mb-4" />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Propuesta</label>
                  <input type="file" onChange={(e) => setPropuesta(e.target.files[0])} className="w-full mb-4" />
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setSelected(null)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                <button onClick={handleCrearCandidato} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded">Aceptar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
