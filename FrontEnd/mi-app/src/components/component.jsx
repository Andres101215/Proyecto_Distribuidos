import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    codigo: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.contraseña !== form.confirmarContraseña) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/auth/register', {
        nombre: form.nombre,
        apellido: form.apellido,
        codigoEstudiantil: form.codigo,
        email: form.correo,
        password: form.contraseña
      });

      alert('¡Registro exitoso!');
      setForm({
        nombre: '',
        apellido: '',
        codigo: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: ''
      });

    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(`Error: ${error.response.data.msg}`);
      } else {
        alert('Error en la conexión con el servidor');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
     
      <div className="w-1/2 flex items-center justify-center bg-black text-white">
        <div className="p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-1">
            Create new account<span style={{ color: '#ccae15' }}>.</span>
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Already a member?{' '}
            <Link to="/" style={{ color: '#ccae15' }} className="hover:underline">
              Log in
            </Link>
          </p>


          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="flex gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="First name"
                value={form.nombre}
                onChange={handleChange}
                className="w-1/2 p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Last name"
                value={form.apellido}
                onChange={handleChange}
                className="w-1/2 p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          
            <input
              type="text"
              name="codigo"
              placeholder="Student code"
              value={form.codigo}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

           
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

         
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmarContraseña"
                placeholder="Confirm password"
                value={form.confirmarContraseña}
                onChange={handleChange}
                className="w-full p-2 pr-10 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                onClick={toggleConfirmPassword}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

          
            <button
              type="submit"
              className="w-full py-3 mt-8 rounded transition text-white font-semibold"
              style={{ backgroundColor: '#957d03' }}
            >
              Create account
            </button>
          </form>
        </div>
      </div>


      <div
        className="w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/uptc.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/40 to-transparent"></div>
      </div>
    </div>
  );
}
