import React, { useState, useEffect } from 'react';
import MapMascotaComponent from '../components/MapMascotaComponent.jsx';
import { obtenerMascota, obtenerListadoMascotas } from '../services/mascota.service.js';
import TablaUbicacionMascota from '../components/TablaUbicacionMascota.jsx';
import TarjetaMascota from '../components/TarjetaMascota.jsx';

const datosDeEjemplo = [
  {
    dia: '26',
    mes: '04',
    anio: '2025',
    hora: '14',
    minuto: '30',
    segundo: '15',
    latitud: -35.00155,
    longitud: -71.23025,
  },
  {
    dia: '26',
    mes: '04',
    anio: '2025',
    hora: '14',
    minuto: '35',
    segundo: '15',
    latitud: -35.00158,
    longitud: -71.240,
  },
];

const MapaMascota = () => {
  const idMascota = 'ab5eaf9d-76a4-4d22-8396-aee77111f6e6';
  
  const [nombreMascota, setNombreMascota] = useState('');
  const [imagenMascota, setImagenMascota] = useState('');
  const [listaMascotas, setListaMascotas] = useState([]);

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const data = await obtenerMascota(idMascota);
        setNombreMascota(data.nombre);
        setImagenMascota(data.urlFoto);
      } catch (err) {
        console.error('Error al obtener la mascota', err);
      }
    };

    const fetchListadoMascotas = async () => {
      console.log('obteniendo listado de mascotas');
      try {
        const data = await obtenerListadoMascotas();
        setListaMascotas(data);
      } catch (err) {
        console.error('Error al obtener el listado de mascotas', err);
      }
    };

    fetchMascota();
    fetchListadoMascotas();
  }, [idMascota]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow">
        {/* Mitad izquierda - listado de mascotas */}
        <div className="w-1/2 p-4 bg-gray-100 overflow-y-auto">
          <div className="bg-white p-4 rounded-lg shadow h-full">
            <h2 className="text-xl font-semibold mb-4">Mascotas</h2>
            <p>Lista de mascotas:</p>
            <div className="mt-4">
              {listaMascotas.map((mascota) => (
                <TarjetaMascota key={mascota.id} mascota={mascota} />
              ))}
            </div>
          </div>
        </div>

        {/* Mitad derecha - mapa y tabla */}
        <div className="w-1/2 h-full flex flex-col">
          <div className="h-fit w-full mt-10 px-5">
            <MapMascotaComponent imagen={imagenMascota} puntos={datosDeEjemplo} />
          </div>
          <div className="h-fit w-full mt-2 px-10 max-h-[20vh]">
            <h1 className="text-2xl font-bold mb-4">Ubicaciones de {nombreMascota}</h1>
            <TablaUbicacionMascota datos={datosDeEjemplo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaMascota;
