import React, { useState } from 'react';

const TarjetaMascota = ({ mascota }) => {
  const [desplegado, setDesplegado] = useState(false);

  const toggleDesplegado = () => {
    setDesplegado(!desplegado);
  };

  const imagenDisponible = mascota.urlFoto && mascota.urlFoto.trim() !== '';

  return (
    <div className="border rounded-lg p-2 mb-2 bg-blue-100">
      <div className="flex items-center justify-between cursor-pointer" onClick={toggleDesplegado}>
        <div className="flex items-center">
          <button className="mr-2 focus:outline-none">
            {desplegado ? '▼' : '▶'}
          </button>
          <span className="font-semibold">{mascota.nombre}</span>
        </div>
        <input type="radio" name="seleccionMascota" className="ml-2" />
      </div>

      {desplegado && (
        <div className="mt-2 p-2 bg-white rounded shadow">
          <div className="flex items-center space-x-4">
            {imagenDisponible ? (
              <img src={mascota.urlFoto} alt="Foto mascota" className="w-20 h-20 object-cover rounded" />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded flex items-center justify-center text-gray-500">
                Sin foto
              </div>
            )}
            <div className="text-sm">
              <p><strong>Nombre:</strong> {mascota.nombre || 'N/A'}</p>
              <p><strong>Raza:</strong> {mascota.raza || 'N/A'}</p>
              <p><strong>Edad:</strong> {mascota.edad !== undefined ? mascota.edad + ' años' : 'N/A'}</p>
              <p className="mt-2 font-semibold">Última ubicación:</p>
              <p>Lat: {mascota.latitud || 'N/A'}</p>
              <p>Long: {mascota.longitud || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarjetaMascota;
