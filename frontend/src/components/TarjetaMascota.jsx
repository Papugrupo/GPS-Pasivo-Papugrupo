import React, { useState, useEffect } from 'react';
import { obtenerMascota } from '../services/mascota.service.js';

const TarjetaMascota = ({ idMascota }) => {
  const [desplegado, setDesplegado] = useState(false);
    const [mascota, setMascota] = useState('');
    const imagenMascota = mascota.urlFoto || '/assets/mascotaPorDefecto.png'; // Imagen por defecto si no tiene una imagen
  
  const toggleDesplegado = () => {
    setDesplegado(!desplegado);
  };

  useEffect(() => {
    // Llamada para obtener los datos de la mascota
    console.log('idMascota', idMascota);
    const fetchMascota = async () => {
      try {
        const data = await obtenerMascota(idMascota);
        setMascota(data);
      } catch (err) {
        console.error('Error al obtener la mascota');
      }
    };
    fetchMascota();
  }, [idMascota]);

  const calcularEdad = (fechaNacimiento) => {
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
    const mes = fechaActual.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  };


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
              <img src={imagenMascota} alt="Foto mascota" className="w-20 h-20 object-cover rounded" />
            <div className="text-sm">
              <p><strong>Nombre:</strong> {mascota.nombre || 'N/A'}</p>
              <p><strong>Raza:</strong> {mascota.raza || 'N/A'}</p>
              <p><strong>Edad:</strong> { mascota.fechaNacimiento !== undefined ? calcularEdad(mascota.fechaNacimiento) + ' años' : 'N/A'}</p>
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
