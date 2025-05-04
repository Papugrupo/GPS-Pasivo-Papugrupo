import React, { useState, useEffect } from 'react';
import MapMascotaComponent from '../components/MapMascotaComponent.jsx';
import { obtenerMascota, obtenerListadoMascotas } from '../services/mascota.service.js';
import TablaUbicacionMascota from '../components/TablaUbicacionMascota.jsx';
import ModalMascota from '../components/ModalMascota.jsx';
  
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
  const idMascota = '5cdfb9a7-17d7-460c-93d6-0d34e2d81cff';
  
  const [nombreMascota, setNombreMascota] = useState('');
  const[imagenMascota,setImagenMascota] = useState('')
  const [listaMascotas, setListaMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');
  const [puntosActivos, setPuntosActivos] = useState(datosDeEjemplo);
  const [mostrarTodosPuntos, setMostrarTodosPuntos] = useState(true);
  const [zoom, setZoom] = useState(15);

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

  const cerrarModal = () => {
    setMascotaSeleccionada(null); // Cerrar el modal
  };

  const handleMostrarUltimaUbicacion = () => {
    if (puntosActivos.length > 0) {
      setPuntosActivos([puntosActivos[puntosActivos.length - 1]]);
      setMostrarTodosPuntos(false);
    }
  };

  const handleMostrarTodasUbicaciones = () => {
    setPuntosActivos(datosDeEjemplo);
    setMostrarTodosPuntos(true);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 10));
  };

  return (
    <div className="flex flex-col md:h-[85vh] h-screen">
      <div className="h-full flex justify-center">
        {/* Mitad izquierda - listado de mascotas */}
        <div className='flex flex-col md:flex-row w-full md:w-4/5 md:h-full md:justify-center bg-gray-100 rounded-2xl'>
          <div className="md:w-2/5 p-4 md:h-[100%] h-[30%]">
            <div className="bg-white p-4 rounded-lg shadow h-full">
              <h2 className="text-xl font-semibold mb-4">Mascotas</h2>
              <div className="mt-2 h-[80%] md:h-[95%] overflow-y-auto">
                {listaMascotas.map((mascota) => (
                  <TarjetaMascota key={mascota} idMascota={mascota.idMascota} />
                ))}
              </div>
            </div>
          </div>

          {/* Mitad derecha - mapa y controles */}
          <div className="md:w-3/5 md:h-[92%] flex flex-col mt-4 h-[60%]">
            {/* Contenedor del mapa */}
            <div className="h-[50%] w-full px-5">
              <MapMascotaComponent 
                imagen={imagenMascota} 
                puntos={puntosActivos} 
                zoom={zoom}
              />
            </div>

            {/* Controles debajo del mapa */}
            <div className="w-full px-5 mt-4 flex justify-between items-center h-fit ">
              {/* Botones de control de ubicaciones */}
              <div className="flex space-x-2">
                <button
                  onClick={handleMostrarUltimaUbicacion}
                  className={`px-2 py-2 rounded-md shadow ${!mostrarTodosPuntos ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                >
                  Última ubicación
                </button>
                <button
                  onClick={handleMostrarTodasUbicaciones}
                  className={`px-2 py-2 rounded-md shadow ${mostrarTodosPuntos ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                >
                  Todas las ubicaciones
                </button>
              </div>
              
              {/* Controles de zoom 
              
                <div className="flex space-x-2">
                  <button 
                    onClick={handleZoomOut}
                    className="bg-white p-2 rounded-md shadow hover:bg-gray-100"
                    title="Alejar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleZoomIn}
                    className="bg-white p-2 rounded-md shadow hover:bg-gray-100"
                    title="Acercar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              */}
            </div>


            {/* Tabla de ubicaciones */}
            <div className="h-fit w-full mt-4 px-5 md:px-10 max-h-[20vh]">
              <h1 className="text-2xl font-bold mb-4">Ubicaciones de {nombreMascota}</h1>
              <TablaUbicacionMascota datos={puntosActivos} />
            </div>
          </div>
        </div>
      </div>
       {/* Modal de la mascota seleccionada */}
       {mascotaSeleccionada && <ModalMascota idMascota={mascotaSeleccionada} closeModal={cerrarModal} />}
    </div>
  );
};

export default MapaMascota;