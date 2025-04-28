import React, { useState, useRef, useEffect } from 'react';
import { obtenerMascota } from '../services/mascota.service.js';
import QRCode from 'qrcode';

const ModalQR = ({ idMascota, closeModal }) => {
  const [mascota, setMascota] = useState(null);
  const [imagenQR, setImagenQR] = useState(null);
  const [cargandoQR, setCargandoQR] = useState(true);

  const modalRef = useRef(null);
  const urlBaseQR = 'https://gps.bustamantedev.cl/registrar-ubicacion';

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

  useEffect(() => {
    const generarQR = async () => {
        console.log('generando QR');
        console.log('mascota', mascota);
      if (mascota) {
        try {
          setCargandoQR(true);
          console.log('mascota', mascota);
          const dataURL = await QRCode.toDataURL(urlBaseQR+"/"+idMascota);
          setImagenQR(dataURL);
        } catch (err) {
          console.error('Error al generar el QR:', err);
        } finally {
          setCargandoQR(false);
        }
      }
    };
    generarQR();
  }, [mascota]);

  const handleOutsideClick = (e) => {
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
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          onClick={closeModal}
        >
          X
        </button>

        {/* Imagen del QR o "cargando..." */}
        <div className="w-full sm:w-1/3 p-4 flex justify-center items-center">
          {cargandoQR ? (
            <p className="text-gray-500">Cargando QR...</p>
          ) : (
            <img
              src={imagenQR}
              alt={`QR de ${mascota.nombre}`}
              className="w-full h-48 object-contain rounded-lg"
            />
          )}
        </div>

        {/* Datos de la mascota */}
        <div className="w-full sm:w-2/3 p-4 flex flex-col space-y-4">
          {mascota && (
            <div className="text-center">
            <div className="flex flex-col space-y-3">
                <h2 className="text-2xl font-semibold mb-4">Información de Mascota</h2>
                <div className="p-3 bg-primary rounded-lg text-black">
                <strong>Nombre:</strong> {mascota.nombre}
                </div>
                <div className="p-3 bg-primary rounded-lg text-black">
                <strong>Raza:</strong> {mascota.raza}
                </div>
                <div className="p-3 bg-primary rounded-lg text-black">
                <strong>Edad:</strong> {calcularEdad(mascota.fechaNacimiento)} años
                </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalQR;
