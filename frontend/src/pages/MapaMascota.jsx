import React from 'react';
import Map from '../components/MapComponent.jsx';
import { obtenerMascota } from '../services/mascota.service.js';
import { useEffect} from 'react';
  

const MapaMascota = () => {
  const idMascota = '9401620d-dbae-4d67-984e-5f47637ac4c6'; // Ejemplo de ID de mascota, puedes hacerlo dinámico si lo deseas

  useEffect(() => {
    // Llamada para obtener los datos de la mascota
    const fetchMascota = async () => {
      try {
        const data = await obtenerMascota(idMascota);
        console.log(data); // Aquí puedes manejar los datos de la mascota como desees
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
        <div className="w-1/2 bg-gray-200">
          <div className="h-full w-full">
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaMascota;