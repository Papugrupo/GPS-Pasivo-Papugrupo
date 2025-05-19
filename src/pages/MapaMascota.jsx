import React, { useState, useEffect } from 'react';
import MapMascotaComponent from '../components/MapMascotaComponent.jsx';
import { obtenerMascota, obtenerListadoMascotas, obtenerUbicacionesMascota } from '../services/mascota.service.js';
import TablaUbicacionMascota from '../components/TablaUbicacionMascota.jsx';
import ModalMascota from '../components/ModalMascota.jsx';
import TarjetaMascota from '../components/TarjetaMascota.jsx';
import { MdPets } from "react-icons/md";
import { MdMap } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";

// Helper function to transform location data
const transformarUbicacion = (ubicacion, mascotaId) => {
  if (!ubicacion || !ubicacion.fecha) {
    console.warn("Ubicación inválida o sin fecha:", ubicacion);
    return null; // O retornar un objeto con valores por defecto/N/A
  }
  try {
    const fechaObj = new Date(ubicacion.fecha);
    if (isNaN(fechaObj.getTime())) {
      console.warn("Fecha inválida en ubicación:", ubicacion.fecha);
      return null; // O manejar como prefieras
    }
    return {
      idUbicacion: ubicacion.idUbicacion,
      mascotaId: mascotaId, // Agregamos el ID de la mascota
      latitud: ubicacion.latitud,
      longitud: ubicacion.longitud,
      dia: fechaObj.getDate(),
      mes: fechaObj.getMonth() + 1, // getMonth() es 0-indexado
      anio: fechaObj.getFullYear(),
      hora: fechaObj.getHours(),
      minuto: fechaObj.getMinutes(),
      segundo: fechaObj.getSeconds(),
    };
  } catch (error) {
    console.error("Error transformando ubicación:", error, ubicacion);
    return null;
  }
};


const MapaMascota = () => {
  const [selectedMascotas, setSelectedMascotas] = useState([]); // Cambiamos a array de IDs
  const [mascotasData, setMascotasData] = useState([]); // Objeto para guardar datos de mascotas
  const [listaMascotas, setListaMascotas] = useState([]);
  const [puntosActivos, setPuntosActivos] = useState([]);
  const [vistaActiva, setVistaActiva] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Modificamos la función de selección para manejar múltiples mascotas
  const handleSeleccionarMascota = (idMascota) => {
    setSelectedMascotas(prev => {
      if (prev.includes(idMascota)) {
        // Si ya está seleccionada, la removemos
        return prev.filter(id => id !== idMascota);
      } else {
        // Si no está seleccionada, la agregamos
        return [...prev, idMascota];
      }
    });
    
    // Limpiamos los puntos al cambiar selección
    setPuntosActivos([]);
    setVistaActiva(null);
  };

  useEffect(() => {
    const fetchListadoMascotas = async () => {
      console.log('Obteniendo listado de mascotas...');
      try {
        const data = await obtenerListadoMascotas();
        console.log('Listado de mascotas:', data);
        setListaMascotas(data);
        // Pre-cargamos datos básicos de todas las mascotas
        const mascotasDataArray = [];
        for (const mascota of data) {
          mascotasDataArray[mascota.idMascota] = {
            nombre: mascota.nombre,
            urlFoto: mascota.urlFoto,
          };
        }
        setMascotasData(mascotasDataArray);
      } catch (err) {
        console.error('Error al obtener el listado de mascotas', err);
      }
    };
    fetchListadoMascotas();
  }, []); 

  // Función para obtener la ÚLTIMA ubicación de las mascotas seleccionadas
  const handleMostrarUltimaUbicacion = async () => {
    if (selectedMascotas.length === 0) {
      console.log("No hay mascotas seleccionadas.");
      return;
    }

    setCargando(true);
    setVistaActiva('ultima');

    try {
      const todasUbicaciones = [];
      
      // Obtenemos ubicaciones para cada mascota seleccionada
      for (const mascotaId of selectedMascotas) {
        const responseData = await obtenerUbicacionesMascota(mascotaId);
        const ubicacionesOriginales = responseData && Array.isArray(responseData.ubicaciones) ? 
          responseData.ubicaciones : [];

        if (ubicacionesOriginales.length > 0) {
          // Ordenamos y tomamos la última
          ubicacionesOriginales.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
          const ultimaUbicacion = ubicacionesOriginales[ubicacionesOriginales.length - 1];
          const ubicacionTransformada = transformarUbicacion(ultimaUbicacion, mascotaId);
          
          if (ubicacionTransformada) {
            todasUbicaciones.push(ubicacionTransformada);
          }
        }
      }

      setPuntosActivos(todasUbicaciones);
    } catch (error) {
      console.error("Error al obtener las últimas ubicaciones:", error);
      setPuntosActivos([]);
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener TODAS las ubicaciones de las mascotas seleccionadas
  const handleMostrarTodasUbicaciones = async () => {
    if (selectedMascotas.length === 0) {
      console.log("No hay mascotas seleccionadas.");
      return;
    }

    setCargando(true);
    setVistaActiva('todas');

    try {
      const todasUbicaciones = [];
      
      // Obtenemos todas las ubicaciones para cada mascota seleccionada
      for (const mascotaId of selectedMascotas) {
        const responseData = await obtenerUbicacionesMascota(mascotaId);
        const ubicacionesOriginales = responseData && Array.isArray(responseData.ubicaciones) ? 
          responseData.ubicaciones : [];

        const ubicacionesTransformadas = ubicacionesOriginales
          .map(ubicacion => transformarUbicacion(ubicacion, mascotaId))
          .filter(u => u !== null);

        todasUbicaciones.push(...ubicacionesTransformadas);
      }

      setPuntosActivos(todasUbicaciones);
    } catch (error) {
      console.error("Error al obtener todas las ubicaciones:", error);
      setPuntosActivos([]);
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener nombres de mascotas seleccionadas
  const getNombresMascotasSeleccionadas = () => {
    return selectedMascotas.map(id => mascotasData[id]?.nombre || 'Mascota').join(', ');
  };

  return (
    <div className="flex flex-col min-h-screen md:min-h-170 md:h-[95vh] p-2 md:pt-2"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.3)), url('/assets/gps_background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }}>
      <div className="h-full flex justify-center">
        {/* Mitad izquierda - listado de mascotas */}
        <div className='flex flex-col md:flex-row w-full md:w-4/5 md:justify-center rounded-2xl shadow-xl bg-blue-600/10 p-2'>
          <div className="flex flex-col md:w-2/5 rounded-2xl">
            <div className="flex flex-col flex-5/6 p-4 rounded-lg shadow-xl">
              <div className='flex justify-center items-center gap-3 pb-3'>
                <MdPets />
                <h2 className="text-xl font-semibold">Mis Mascotas</h2>
              </div>
              <div className="md:h-[95%] overflow-y-auto md:max-h-130 max-h-50">
                {listaMascotas.map((mascota) => (
                  <TarjetaMascota
                    key={mascota.idMascota}
                    idMascota={mascota.idMascota}
                    onSeleccionar={handleSeleccionarMascota}
                    seleccionada={selectedMascotas.includes(mascota.idMascota)}
                  />
                ))}
              </div>
            </div>
            <div className='flex-1/6' />
          </div>

          {/* Mitad derecha - mapa y controles */}
          {selectedMascotas.length > 0 ? (
            <div className="md:ml-2 md:w-4/5 flex flex-col p-4 h-200 md:h-150 shadow-xl rounded-2xl">
              <div className='flex items-center justify-center gap-3 mb-3'>
                <MdMap />
                <h2 className="text-xl font-semibold">Mapa de ubicaciones</h2>
              </div>
              
              {/* Contenedor del mapa */}
              <div className="max-h-70 w-full px-5 h-full">
                <MapMascotaComponent
                  // Pasamos todas las imágenes de las mascotas seleccionadas
                  mascotas={mascotasData}
                  puntos={puntosActivos}
                  key={selectedMascotas.join(',')} // Actualizamos la key cuando cambian las selecciones
                />
              </div>

              {/* Controles debajo del mapa */}
              <div className="w-full px-5 py-4 flex justify-between items-center h-fit">
                {/* Botones de control de ubicaciones */}
                <div className="flex justify-around w-full">
                  <button
                    onClick={handleMostrarUltimaUbicacion}
                    disabled={selectedMascotas.length === 0 || cargando}
                    className={`px-4 py-2 rounded-md shadow ${vistaActiva === 'ultima' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'} ${(selectedMascotas.length === 0 || cargando) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {cargando ? 'Cargando...' : 'Última ubicación'}
                  </button>
                  <button
                    onClick={handleMostrarTodasUbicaciones}
                    disabled={selectedMascotas.length === 0 || cargando}
                    className={`px-4 py-2 rounded-md shadow ${vistaActiva === 'todas' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'} ${(selectedMascotas.length === 0 || cargando) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {cargando ? 'Cargando...' : 'Todas las ubicaciones'}
                  </button>
                </div>
              </div>

              {/* Tabla de ubicaciones */}
              <div className="w-full shadow-2xl">
                <div className='flex items-center justify-center gap-3 mb-3'>
                  <MdLocationPin />
                  <h2 className="text-xl font-semibold">
                    Ubicaciones de {getNombresMascotasSeleccionadas() || 'mascotas seleccionadas'}
                  </h2>
                </div>
                
                {/* Pasar los puntos YA TRANSFORMADOS a la tabla */}
                <TablaUbicacionMascota 
                  datos={puntosActivos} 
                  mascotas={mascotasData} // Pasamos los datos de las mascotas para mostrar nombres
                />
              </div>
            </div>
          ) : (
            <div className="flex p-8 w-1/2 h-full flex items-center justify-center text-gray-900">
              <p>Selecciona una o más mascotas de la lista.</p>
            </div>
          )}
        </div>
      </div>
       
    </div>
  );
};

export default MapaMascota;