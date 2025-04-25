import React from 'react';
import Map from '../components/MapComponent.jsx';

const MapaMascota = () => {
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
          <div className="h-fit w-full bg-gray-200 mt-10">
            <Map />
          </div>
          <div className="h-fit w-full mt-2 pl-5">
            Ultimas Ubicaciones
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaMascota;