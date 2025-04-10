import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({
    correo: '',
    contraseña: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/auth/login', {
        email: form.correo,
        password: form.contraseña
      });

      // Guardamos el token y usuario en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

      // Extraemos el usuario
      const usuario = response.data.usuario;

      // Redirigir según si es admin
      if (usuario.admin === true || usuario.email === 'admin@uptc.edu.co') {
        navigate('/admin');
      } else {
        navigate('/eleccion');
      }

    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        alert('Error de conexión con el servidor');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda - formulario */}
      <div className="w-1/2 flex items-center justify-center bg-black text-white">
        <div className="p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">
            ¡Bienvenido/a! Tu voto cuenta. <span className="text-yellow-500">¡Participa ahora!</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="correo"
              placeholder="Email"
              value={form.correo}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="contraseña"
                placeholder="Password"
                value={form.contraseña}
                onChange={handleChange}
                className="w-full p-2 pr-10 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-8 rounded transition text-white font-semibold"
              style={{ backgroundColor: '#957d03' }}
            >
              Log in
            </button>

            <p className="text-sm text-gray-400 text-center mt-4">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" style={{ color: '#ccae15' }} className="hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Columna derecha - imagen */}
      <div
        className="w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/uptc.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/40 to-transparent"></div>
      </div>
    </div>
  );
}
