import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { actualizarUsuario, obtenerUsuario } from '../services/usuario.service';

const Perfil = () => {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        if (user?.email) {
          const datos = await obtenerUsuario(user.email);
          setUsuario(datos);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };
    
    cargarDatosUsuario();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarUsuario(usuario);
      setMensaje('Datos actualizados correctamente');
      setEditando(false);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setMensaje('Error al actualizar los datos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Encabezado del perfil */}
        <div className="bg-primary p-6 text-white flex items-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden mr-6">
            <img 
              src="/assets/fotoPerfil.png" 
              alt="Foto de perfil" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {usuario.nombre || 'Usuario'} {usuario.apellido || ''}
            </h1>
            <p className="text-white/80">{user?.email || 'Correo no disponible'}</p>
          </div>
        </div>

        {/* Contenido del perfil */}
        <div className="p-6">
          {mensaje && (
            <div className={`mb-4 p-3 rounded ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {mensaje}
            </div>
          )}

          {editando ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={usuario.nombre}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={usuario.apellido}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={usuario.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={usuario.telefono}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={usuario.direccion}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-gray-500 text-sm">Nombre</h3>
                  <p className="text-lg">{usuario.nombre || 'No especificado'}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Apellido</h3>
                  <p className="text-lg">{usuario.apellido || 'No especificado'}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Email</h3>
                  <p className="text-lg">{usuario.email || 'No especificado'}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Teléfono</h3>
                  <p className="text-lg">{usuario.telefono || 'No especificado'}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-gray-500 text-sm">Dirección</h3>
                  <p className="text-lg">{usuario.direccion || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setEditando(true)}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Editar perfil
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sección de mascotas (opcional) */}
        <div className="border-t p-6">
          <h2 className="text-xl font-semibold mb-4">Mis Mascotas</h2>
          <p className="text-gray-600">Aquí podrás ver y gestionar tus mascotas registradas.</p>
          {/* Aquí podrías agregar un listado de mascotas como en tu ejemplo */}
        </div>
      </div>
    </div>
  );
};

export default Perfil;