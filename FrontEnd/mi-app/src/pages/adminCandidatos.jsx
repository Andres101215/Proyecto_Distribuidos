import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'https://api-gateway-14jr.onrender.com/api/candidatos';

export default function AdminCandidatos() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [candidatos, setCandidatos] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({ codigoEstudiantil: '', nombre: '', apellido: '', email: '', password: '', propuestas: '' });
    const [editandoCodigo, setEditandoCodigo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCandidatos();
        const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
        setUsuario(usuarioGuardado);
    }, []);

    const fetchCandidatos = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/candidates`);
            setCandidatos(data);
        } catch (error) {
            console.error('Error al cargar candidatos:', error);
        }
    };

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editandoCodigo) {
                await axios.put(`http://localhost:5000/api/candidatos/candidates/${editandoCodigo}`, formData);
                setMensaje('Candidato actualizado exitosamente');
            } else {
                await axios.post(`${BASE_URL}/candidates/register`, formData);
                setMensaje('Candidato registrado exitosamente');
            }
            setFormData({ codigoEstudiantil: '', nombre: '', apellido: '', email: '', password: '', propuestas: '' });
            setEditandoCodigo(null);
            fetchCandidatos();
        } catch (error) {
            setMensaje('Error al guardar candidato');
            console.error(error);
        }
    };

    const handleEditar = candidato => {
        setFormData({
            codigoEstudiantil: candidato.codigoEstudiantil,
            nombre: candidato.nombre,
            apellido: candidato.apellido,
            email: candidato.email,
            password: '',
            propuestas: candidato.propuesta || ''
        });
        setEditandoCodigo(candidato.codigoEstudiantil);
    };

    const handleEliminar = async codigoEstudiantil => {
        if (window.confirm('¿Está seguro de eliminar este candidato?')) {
            try {
                await axios.delete(`${BASE_URL}/candidates/${codigoEstudiantil}`);
                setMensaje('Candidato eliminado correctamente');
                fetchCandidatos();
            } catch (error) {
                console.error('Error al eliminar candidato:', error);
                setMensaje('Error al eliminar candidato');
            }
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
                    <button onClick={() => navigate('/admin/elecciones')} className="py-2 text-left hover:bg-gray-800 px-3 rounded mb-1">Elecciones</button>
                    <button onClick={() => navigate('/admin/votantes')} className="py-2 text-left hover:bg-gray-800 px-3 rounded mb-1">Votantes</button>
                    <button onClick={() => navigate('/admin/candidatos')} className="py-2 text-left hover:bg-gray-800 px-3 rounded mb-4">Candidatos</button>
                    <button onClick={() => navigate('/')} className="py-2 bg-black text-white font-semibold hover:bg-gray-800 transition text-center w-full">Cerrar sesión</button>
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
                    <h1 className="text-3xl font-bold text-white mb-10 text-center">Administración de Candidatos</h1>

                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4">{editandoCodigo ? 'Editar Candidato' : 'Registrar Nuevo Candidato'}</h2>
                        <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSubmit}>
                            <input type="text" name="codigoEstudiantil" value={formData.codigoEstudiantil} onChange={handleInputChange} placeholder="Código Estudiantil" className="p-2 border rounded" required disabled={!!editandoCodigo} />
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" className="p-2 border rounded" required />
                            <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" className="p-2 border rounded" required />
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Correo" className="p-2 border rounded" required />
                            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={editandoCodigo ? 'Nueva contraseña (opcional)' : 'Contraseña'} className="p-2 border rounded" />
                            <textarea name="propuestas" value={formData.propuestas} onChange={handleInputChange} placeholder="Propuesta del candidato" className="md:col-span-4 p-2 border rounded" rows="3" />
                            <div className="md:col-span-4 text-right">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    {editandoCodigo ? 'Actualizar' : 'Registrar'}
                                </button>
                            </div>
                        </form>
                    </div>
                    {mensaje && <div className="alert alert-info mt-4">{mensaje}</div>}

                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Candidatos Registrados</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2 border">Código</th>
                                        <th className="px-4 py-2 border">Nombre</th>
                                        <th className="px-4 py-2 border">Correo</th>
                                        <th className="px-4 py-2 border">Propuesta</th>
                                        <th className="px-4 py-2 border">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidatos.map(c => (
                                        <tr key={c._id} className="hover:bg-gray-100">
                                            <td className="px-4 py-2 border">{c.codigoEstudiantil}</td>
                                            <td className="px-4 py-2 border">{c.nombre + " " + c.apellido}</td>
                                            <td className="px-4 py-2 border">{c.email}</td>
                                            <td className="px-4 py-2 border">{c.propuestas}</td>
                                            <td className="px-4 py-2 border space-x-2">
                                                <button onClick={() => handleEditar(c)} className="btn btn-warning btn-sm me-1">Editar</button>
                                                <button onClick={() => handleEliminar(c.codigoEstudiantil)} className="btn btn-danger btn-sm">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {candidatos.length === 0 && (
                                <p className="text-center text-gray-500 mt-4">No hay candidatos registrados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
