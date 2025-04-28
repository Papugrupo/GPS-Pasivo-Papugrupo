import React, { useState, useRef, useEffect } from 'react';
import { obtenerMascota } from '../services/mascota.service.js';

const ModalMascota = ({ idMascota, closeModal }) => {
  const [mascota, setMascota] = useState('');
  const imagenMascota = mascota.urlFoto || '/assets/mascotaPorDefecto.png'; // Imagen por defecto si no tiene una imagen

  const modalRef = useRef(null); // Usamos un ref para referenciar el modal

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

  const handleOutsideClick = (e) => {
    // Si el clic es fuera del modal, cerramos el modal
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-4 sm:p-8 rounded-lg w-11/12 sm:w-1/2 md:w-2/3 lg:w-1/3 flex relative border shadow-lg"
        style={{ maxWidth: '90%' }}
      >
        {/* Botón de cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          onClick={closeModal}
        >
          X
        </button>

        {/* Imagen de la mascota a la izquierda */}
        <div className="w-full sm:w-1/3 p-4">
          <img
            src={imagenMascota}
            alt={`Imagen de ${mascota.nombre}`}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Datos de la mascota a la derecha */}
        <div className="w-full sm:w-2/3 p-4 flex flex-col space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">{mascota.nombre}</h2>

            <div className="flex flex-col space-y-3">
              <div className="p-3 bg-primary rounded-lg text-black">
                <strong>Especie:</strong> {mascota.especie}
              </div>
              <div className="p-3 bg-primary rounded-lg text-black">
                <strong>Raza:</strong> {mascota.raza}
              </div>
              <div className="p-3 bg-primary rounded-lg text-black">
                <strong>Edad:</strong> {calcularEdad(mascota.fechaNacimiento)} años
              </div>
              <div className="p-3 bg-primary rounded-lg text-black">
                <strong>Sexo:</strong> {mascota.sexo}
              </div>
              <div className="p-3 bg-primary rounded-lg text-black">
                <strong>Fecha de Nacimiento:</strong> {mascota.fechaNacimiento}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMascota;
