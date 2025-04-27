import React, { useState } from 'react';
import MapMascotaComponent from '../components/MapMascotaComponent.jsx';
import { obtenerMascota } from '../services/mascota.service.js';
import { useEffect} from 'react';
import TablaUbicacionMascota from '../components/TablaUbicacionMascota.jsx';
  
const datosDeEjemplo = [
  {
    dia: '26',
    mes: '04',
    anio: '2025',
    hora: '14',
    minuto: '30',
    segundo: '15',
    latitud:-35.00155,
    longitud:-71.23025,
  },
  {
    dia: '26',
    mes: '04',
    anio: '2025',
    hora: '14',
    minuto: '35',
    segundo: '15',
    latitud:-35.00158,
    longitud:-71.240,
  },
];

const MapaMascota = () => {
  const idMascota = 'ab5eaf9d-76a4-4d22-8396-aee77111f6e6'; // Ejemplo de ID de mascota, puedes hacerlo dinámico si lo deseas
  
  const [nombreMascota, setNombreMascota] = useState('');
  const[imagenMascota,setImagenMascota] = useState('')

  useEffect(() => {
    // Llamada para obtener los datos de la mascota
    const fetchMascota = async () => {
      try {
        const data = await obtenerMascota(idMascota);
        //console.log(data);
        setNombreMascota(data.nombre)
        setImagenMascota(data.urlFoto)
      } catch (err) {
        setError('Error al obtener la mascota');
      }
    };

    fetchMascota();
  }, [idMascota]);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow">
        {/* Mitad izquierda - puedes añadir contenido aquí */}
        <div className="w-1/2 p-4 bg-gray-100">
          <div className="bg-white p-4 rounded-lg shadow h-full">
            <h2 className="text-xl font-semibold mb-4">Mascotas</h2>
            <p>lista de mascotas.</p>  
          </div>
        </div>
        {/* Mitad derecha - mapa */}
        <div className="w-1/2 h-full flex flex-col ">
          <div className="h-fit w-full  mt-10 px-5">
            <MapMascotaComponent imagen={imagenMascota} puntos={datosDeEjemplo}/>
          </div>
          <div className="h-fit w-full mt-2 px-10 p max-h-[20vh]">
            <h1 className="text-2xl font-bold mb-4">Ubicaciones de {nombreMascota}</h1>
            <TablaUbicacionMascota datos={datosDeEjemplo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaMascota;