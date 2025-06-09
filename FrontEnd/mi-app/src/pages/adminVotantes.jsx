import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminVotantes() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [votantes, setVotantes] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({ codigoEstudiantil: '', nombre: '', apellido: '', email: '', password: '' });
    const [editandoCodigo, setEditandoCodigo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVotantes();
        const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
        setUsuario(usuarioGuardado);
    }, []);

    const fetchVotantes = async () => {
        const { data } = await axios.get('http://localhost:5000/api/usuarios/auth/voters');
        setVotantes(data);
    };

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editandoCodigo) {
                // PUT con el código como parámetro
                await axios.put(`http://localhost:5000/api/usuarios/auth/voters/${editandoCodigo}`, formData);
                setMensaje('Estudiante actualizado exitosamente');
            } else {
                await axios.post('http://localhost:5000/api/usuarios/auth/voters', formData);
            }
            setFormData({ codigoEstudiantil: '', nombre: '', apellido: '', email: '', password: '' });
            setEditandoCodigo(null);
            setMensaje('Estudiante registrado exitosamente');
            fetchVotantes();
        } catch (error) {
            setMensaje('Error al guardar votante:', error);
        }
    };

    const handleEditar = votante => {
        setFormData({
            codigoEstudiantil: votante.codigoEstudiantil, // deshabilitado al editar
            nombre: votante.nombre,
            apellido: votante.apellido,
            email: votante.email,
            password: '' // vacío por seguridad
        });
        setEditandoCodigo(votante.codigoEstudiantil);
    };

    const handleEliminar = async codigoEstudiantil => {
        if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
            try {
                await axios.delete(`http://localhost:5000/api/usuarios/auth/voters/${codigoEstudiantil}`);
                setMensaje('Estudiante eliminado correctamente');
               fetchVotantes();
            } catch (error) {
                console.error('Error al eliminar estudiante:', error);
                setMensaje('Error al eliminar estudiante');
            }
        } 
    };

    return (
        <div className="flex min-h-screen relative">
            {/* SIDEBAR */}
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


            <div className="flex-1 p-8 overflow-y-auto bg-cover bg-center relative" style={{ backgroundImage: 'url("/fondo.jpg")' }}>
                <div className="absolute inset-0 bg-black opacity-50 z-0" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-10 text-center">Administración de Votantes</h1>

                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4">{editandoCodigo ? 'Editar Votante' : 'Registrar Nuevo Votante'}</h2>
                        <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSubmit}>
                            <input type="text" name="codigoEstudiantil" value={formData.codigoEstudiantil} onChange={handleInputChange} placeholder="Código Estudiantil" className="p-2 border rounded" required disabled={!!editandoCodigo} />
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" className="p-2 border rounded" required />
                            <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" className="p-2 border rounded" required />
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Correo" className="p-2 border rounded" required />
                            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={editandoCodigo ? 'Nueva contraseña (opcional)' : 'Contraseña'} className="p-2 border rounded" />
                            <div className="md:col-span-4 text-right">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    {editandoCodigo ? 'Actualizar' : 'Registrar'}
                                </button>
                            </div>
                        </form>
                    </div>
                     {mensaje && <div className="alert alert-info mt-4">{mensaje}</div>}

                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Votantes Registrados</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2 border">Código</th>
                                        <th className="px-4 py-2 border">Nombre</th>
                                        <th className="px-4 py-2 border">Correo</th>
                                        <th className="px-4 py-2 border">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {votantes.map(v => (
                                        <tr key={v._id} className="hover:bg-gray-100">
                                            <td className="px-4 py-2 border">{v.codigoEstudiantil}</td>
                                            <td className="px-4 py-2 border">{v.nombre + " " + v.apellido}</td>
                                            <td className="px-4 py-2 border">{v.email}</td>
                                            <td className="px-4 py-2 border space-x-2">
                                                <button onClick={() => handleEditar(v)} className="btn btn-warning btn-sm me-2">Editar</button>
                                                <button onClick={() => handleEliminar(v.codigoEstudiantil)} className="btn btn-danger btn-sm">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {votantes.length === 0 && (
                                <p className="text-center text-gray-500 mt-4">No hay votantes registrados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
