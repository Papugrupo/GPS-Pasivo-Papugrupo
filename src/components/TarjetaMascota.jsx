import React, { useState, useEffect } from 'react';
import { obtenerMascota } from '../services/mascota.service.js';
import ModalQR from './ModalQR';
import ModalMascota from './ModalMascota.jsx';

// Añadir onSeleccionar y seleccionada a las props
const TarjetaMascota = ({ idMascota, onSeleccionar, seleccionada }) => { 
  const [desplegado, setDesplegado] = useState(false);
  const [mascota, setMascota] = useState('');
  const imagenMascota = mascota.urlFoto || '/assets/mascotaPorDefecto.png';
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [mascotaParaModalDetalles, setMascotaParaModalDetalles] = useState(''); // Renombrado para claridad

  const toggleDesplegado = () => {
    setDesplegado(!desplegado);
  };

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const data = await obtenerMascota(idMascota);
        setMascota(data);
      } catch (err) {
        console.error('Error al obtener la mascota', err);
      }
    };
    fetchMascota();
  }, [idMascota]);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A'; // Manejar caso undefined/null
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
    const mes = fechaActual.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad >= 0 ? `${edad} años` : 'N/A'; // Asegurar que la edad no sea negativa
  };

  const abrirModalDetalles = () => {
    console.log('Abrir modal detalles para:', idMascota);
    setMascotaParaModalDetalles(idMascota); 
  }

  const cerrarModalDetalles = () => {
    setMascotaParaModalDetalles(''); 
  }

  const cerrarModalQR = () => {
    setMostrarModalQR(false);
  };  

  // Función para manejar el cambio SOLO en el radio button
  const handleSeleccionChange = () => {
    console.log(`Radio button seleccionado para mascota: ${mascota.nombre} (ID: ${idMascota})`); // Mensaje actualizado
    if (onSeleccionar) {
      onSeleccionar(idMascota); // Llama a la función pasada desde MapaMascota
    }
  };

  // Determinar el estilo si la tarjeta está seleccionada
  const cardClassName = `border rounded-lg p-2 mb-2 ${seleccionada ? 'bg-blue-200 border-blue-400' : 'bg-blue-100'}`;

  return (
    // Aplicar clase condicional al div principal
    <div className={cardClassName}> 
      {/* Quitar onClick de este div */}
      <div className="flex items-center justify-between"> 
        {/* Quitar stopPropagation de este div */}
        <div className="flex items-center"> 
          <button className="mr-2 focus:outline-none" onClick={toggleDesplegado}>
            {desplegado ? '▼' : '▶'}
          </button>
          <span className="font-semibold">{mascota.nombre || 'Cargando...'}</span>
        </div>
        {/* 
          El input radio ahora es el ÚNICO control para la selección.
          Se mantiene checked={seleccionada} para reflejar el estado.
          Se mantiene onChange={handleSeleccionChange} para detectar el click.
          onClick con stopPropagation ya no es estrictamente necesario aquí, pero se puede dejar por seguridad.
        */}
        <input 
          type="radio" 
          name="seleccionMascota" // Asegúrate que el name sea el mismo para todas las tarjetas para que actúen como un grupo de radio buttons
          className="ml-2 cursor-pointer" 
          checked={seleccionada} 
          onChange={handleSeleccionChange} // El cambio dispara la selección
          // onClick={(e) => e.stopPropagation()} // Opcional: previene que el click propague más arriba si fuera necesario
        />
      </div>

      {desplegado && (
        <div className="mt-2 p-2 bg-white rounded shadow">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">   
            <img src={imagenMascota} alt="Foto mascota" className="w-20 h-20 object-cover rounded" />
            <div className="text-sm">
              <p><strong>Nombre:</strong> {mascota.nombre || 'N/A'}</p>
              <p><strong>Raza:</strong> {mascota.raza || 'N/A'}</p>
              <p><strong>Edad:</strong> {calcularEdad(mascota.fechaNacimiento)}</p> {/* Usar la función directamente */}
              <p className="mt-2 font-semibold">Última ubicación (si aplica):</p>
              <p>Lat: {mascota.latitud || 'N/A'}</p>
              <p>Long: {mascota.longitud || 'N/A'}</p>
            </div>

            <button
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none" // Cambiado color para diferenciar
              onClick={(e) => { e.stopPropagation(); setMostrarModalQR(true); }} // Detener propagación
            >
              Ver QR
            </button>

            <button
              className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 focus:outline-none" // Cambiado color para diferenciar
              onClick={(e) => { e.stopPropagation(); abrirModalDetalles(); }} // Detener propagación
            >
              Ver Detalles
            </button>
          </div>

          {/* ModalQR */}
          {mostrarModalQR && <ModalQR idMascota={idMascota} closeModal={cerrarModalQR} />}
          {/* Modal de la mascota seleccionada */}
          {mascotaParaModalDetalles && <ModalMascota idMascota={mascotaParaModalDetalles} closeModal={cerrarModalDetalles} />}
        </div>
      )}
    </div>
  );
};

export default TarjetaMascota;