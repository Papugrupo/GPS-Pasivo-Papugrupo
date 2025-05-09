import React, { useState, useEffect } from 'react';
import { obtenerMascota } from '../services/mascota.service.js';
import ModalQR from './ModalQR';
import ModalMascota from './ModalMascota.jsx';
import { IoIosArrowDropdown,IoIosArrowDropup } from "react-icons/io";

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
  const cardClassName = `w-full hover:bg-blue-300 rounded-lg p-2 mb-2 ${seleccionada ? 'bg-blue-400 border-blue-400' : 'bg-blue-100'}`;

  return (
    // Aplicar clase condicional al div principal
    <div className={cardClassName} > 
      <div className='flex flex-row justify-center items-end'>
        <button className="flex w-full items-center justify-between" onClick={handleSeleccionChange}> 
          {/* Quitar stopPropagation de este div */}
          <div className="flex w-full gap-2 items-center"> 
            <img src={imagenMascota} alt="Foto mascota" className="flex w-10 h-10 transition-all delay-100 hover:w-30 hover:h-30 object-cover rounded-2xl" />
            <span className="font-semibold">{mascota.nombre || 'Cargando...'}</span>
            
          </div>
          {/* 
            El input radio ahora es el ÚNICO control para la selección.
            Se mantiene checked={seleccionada} para reflejar el estado.
            Se mantiene onChange={handleSeleccionChange} para detectar el click.
            onClick con stopPropagation ya no es estrictamente necesario aquí, pero se puede dejar por seguridad.
          */}

        </button>
        <button onClick={toggleDesplegado} className={`flex h-10 hover:bg-blue-200 ${desplegado ? 'bg-white': null} rounded items-center justify-end`}>
          <div className="self-center px-2 text-gray-500 focus:outline-none" >
                {desplegado ? <IoIosArrowDropup /> : <IoIosArrowDropdown /> }
          </div>
        </button>
      </div>
      

      {desplegado && (
        <div className="mt-2 p-2 bg-white rounded shadow">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">   
            
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