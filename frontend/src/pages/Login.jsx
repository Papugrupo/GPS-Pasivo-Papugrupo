import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Validación de correo electrónico
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validar correo en tiempo real
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Correo electrónico inválido');
      } else {
        setEmailError('');
      }
    }

    // Limpiar errores al escribir
    if (loginError) setLoginError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos antes de enviar
    if (!formData.email || !validateEmail(formData.email)) {
      setEmailError('Ingrese un correo válido');
      return;
    }

    if (!formData.password) {
      setLoginError('Ingrese una contraseña');
      return;
    }

    // Autenticación simplificada (acepta cualquier combinación válida)
    login(formData.email); // Guarda el email en el contexto/auth
    navigate('/mapa'); // Redirige a la página protegida
  };

  return (
    <div className="min-h-screen w-full bg-[url('/assets/fondo.png')] flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Iniciar Sesión</h1>

        {loginError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
            {loginError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                emailError ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'
              }`}
              placeholder="ejemplo@correo.com"
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <span className="text-sm">Ocultar</span>
                ) : (
                  <span className="text-sm">Mostrar</span>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;