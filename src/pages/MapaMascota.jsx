import React, { useState, useEffect } from 'react';
import MapMascotaComponent from '../components/MapMascotaComponent.jsx';
import { obtenerMascota, obtenerListadoMascotas, obtenerUbicacionesMascota } from '../services/mascota.service.js'; 
import TablaUbicacionMascota from '../components/TablaUbicacionMascota.jsx';
import ModalMascota from '../components/ModalMascota.jsx';
import TarjetaMascota from '../components/TarjetaMascota.jsx';

// Helper function to transform location data
const transformarUbicacion = (ubicacion) => {
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
      idUbicacion: ubicacion.idUbicacion, // Mantener ID si existe
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
  const [selectedMascotaId, setSelectedMascotaId] = useState(null); 
  const [nombreMascota, setNombreMascota] = useState('');
  const [imagenMascota, setImagenMascota] = useState('');
  const [listaMascotas, setListaMascotas] = useState([]);
  const [mascotaParaModal, setMascotaParaModal] = useState(null); 
  const [puntosActivos, setPuntosActivos] = useState([]); 
  const [vistaActiva, setVistaActiva] = useState(null); 
  const [zoom, setZoom] = useState(15);
  const [cargandoUltima, setCargandoUltima] = useState(false); 
  const [cargandoTodas, setCargandoTodas] = useState(false); 

  const handleSeleccionarMascota = (idMascota) => {
    console.log("TarjetaMascota seleccionada con ID:", idMascota);
    setSelectedMascotaId(idMascota);
    setPuntosActivos([]); 
    setVistaActiva(null); 
  };

  useEffect(() => {
    const fetchListadoMascotas = async () => {
      console.log('Obteniendo listado de mascotas...');
      try {
        const data = await obtenerListadoMascotas();
        setListaMascotas(data);
      } catch (err) {
        console.error('Error al obtener el listado de mascotas', err);
      }
    };
    fetchListadoMascotas();
  }, []); 

  useEffect(() => {
    const fetchDatosBasicosMascota = async () => {
      if (!selectedMascotaId) { 
         setNombreMascota('');
         setImagenMascota('');
         return;
      }
      
      console.log(`Obteniendo datos básicos para mascota con ID: ${selectedMascotaId}`);
      try {
        const dataMascota = await obtenerMascota(selectedMascotaId);
        setNombreMascota(dataMascota.nombre);
        setImagenMascota(dataMascota.urlFoto);
      } catch (err) {
        console.error('Error al obtener datos básicos de la mascota seleccionada', err);
         setNombreMascota('');
         setImagenMascota('');
      }
    };

    fetchDatosBasicosMascota();
  }, [selectedMascotaId]); 

  const cerrarModal = () => {
    setMascotaParaModal(null); 
  };

  // Función para obtener la ÚLTIMA ubicación al presionar el botón
  const handleMostrarUltimaUbicacion = async () => {
    console.log("Botón 'Última ubicación' presionado. ID seleccionado:", selectedMascotaId); 

    if (!selectedMascotaId) {
      console.log("No hay mascota seleccionada.");
      return; 
    }

    setCargandoUltima(true); 
    setVistaActiva('ultima'); 

    try {
      const responseData = await obtenerUbicacionesMascota(selectedMascotaId);
      console.log("Respuesta completa del servicio:", responseData); 

      const ubicacionesOriginales = responseData && Array.isArray(responseData.ubicaciones) ? responseData.ubicaciones : [];

      if (ubicacionesOriginales.length > 0) {
        const ultimaUbicacionOriginal = ubicacionesOriginales[ubicacionesOriginales.length - 1];
        // Transformar la última ubicación al formato esperado por la tabla
        const ultimaUbicacionTransformada = transformarUbicacion(ultimaUbicacionOriginal);
        
        if (ultimaUbicacionTransformada) {
          console.log("Última ubicación transformada:", ultimaUbicacionTransformada);
          setPuntosActivos([ultimaUbicacionTransformada]); // Poner la ubicación transformada en el estado
        } else {
          console.log("No se pudo transformar la última ubicación.");
          setPuntosActivos([]);
        }
      } else {
        console.log("No se encontraron ubicaciones (array vacío o propiedad no encontrada)."); 
        setPuntosActivos([]); 
      }
    } catch (error) {
      console.error("Error al obtener la última ubicación:", error);
      setPuntosActivos([]); 
    } finally {
      setCargandoUltima(false); 
    }
  };

  // Función para obtener TODAS las ubicaciones al presionar el botón
  const handleMostrarTodasUbicaciones = async () => {
    console.log("Botón 'Todas las ubicaciones' presionado. ID seleccionado:", selectedMascotaId);

    if (!selectedMascotaId) {
      console.log("No hay mascota seleccionada.");
      return; 
    }

    setCargandoTodas(true);
    setVistaActiva('todas'); 

    try {
      const responseData = await obtenerUbicacionesMascota(selectedMascotaId);
      console.log("Respuesta completa del servicio:", responseData); 

      const ubicacionesOriginales = responseData && Array.isArray(responseData.ubicaciones) ? responseData.ubicaciones : [];
      
      // Transformar TODAS las ubicaciones al formato esperado por la tabla
      const ubicacionesTransformadas = ubicacionesOriginales
        .map(transformarUbicacion) // Aplica la función de transformación a cada elemento
        .filter(u => u !== null); // Filtra cualquier resultado nulo de la transformación

      console.log("Todas las ubicaciones transformadas:", ubicacionesTransformadas);
      setPuntosActivos(ubicacionesTransformadas); // Poner las ubicaciones transformadas en el estado

      if (ubicacionesTransformadas.length === 0 && ubicacionesOriginales.length > 0) {
         console.warn("Se recibieron ubicaciones pero no se pudieron transformar.");
      } else if (ubicacionesOriginales.length === 0) {
         console.log("No se encontraron ubicaciones (array vacío o propiedad no encontrada).");
      }

    } catch (error) {
      console.error("Error al obtener todas las ubicaciones:", error);
      setPuntosActivos([]); 
    } finally {
      setCargandoTodas(false);
    }
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
              <p>Selecciona una mascota:</p>
              <div className="mt-2 h-[80%] md:h-[95%] overflow-y-auto">
                {listaMascotas.map((mascota) => (
                  <TarjetaMascota 
                    key={mascota.idMascota} 
                    idMascota={mascota.idMascota} 
                    onSeleccionar={handleSeleccionarMascota} 
                    seleccionada={selectedMascotaId === mascota.idMascota} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mitad derecha - mapa y controles */}
          {selectedMascotaId ? ( 
            <div className="md:w-3/5 md:h-[92%] flex flex-col mt-4 h-[60%]">
              {/* Contenedor del mapa */}
              <div className="h-[50%] w-full px-5">
                {/* MapMascotaComponent probablemente espera latitud/longitud, así que no necesita la transformación */}
                <MapMascotaComponent 
                  imagen={imagenMascota} 
                  // Pasar los puntos transformados (que aún tienen lat/lon)
                  puntos={puntosActivos} 
                  zoom={zoom}
                  key={selectedMascotaId} 
                />
              </div>

              {/* Controles debajo del mapa */}
              <div className="w-full px-5 mt-4 flex justify-between items-center h-fit ">
                {/* Botones de control de ubicaciones */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleMostrarUltimaUbicacion}
                    disabled={!selectedMascotaId || cargandoUltima || cargandoTodas} 
                    className={`px-4 py-2 rounded-md shadow ${vistaActiva === 'ultima' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'} ${(!selectedMascotaId || cargandoUltima || cargandoTodas) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {cargandoUltima ? 'Cargando...' : 'Última ubicación'} 
                  </button>
                  <button
                    onClick={handleMostrarTodasUbicaciones}
                    disabled={!selectedMascotaId || cargandoUltima || cargandoTodas} 
                    className={`px-4 py-2 rounded-md shadow ${vistaActiva === 'todas' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'} ${(!selectedMascotaId || cargandoUltima || cargandoTodas) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {cargandoTodas ? 'Cargando...' : 'Todas las ubicaciones'}
                  </button>
                </div>
                
                {/* Controles de zoom */}
                {/*<div className="flex space-x-2">
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
                </div>*/}
              </div>

              {/* Tabla de ubicaciones */}
              <div className="h-fit w-full mt-4 px-5 md:px-10 max-h-[20vh]">
                <h1 className="text-2xl font-bold mb-4">Ubicaciones de {nombreMascota || 'mascota seleccionada'}</h1>
                {/* Pasar los puntos YA TRANSFORMADOS a la tabla */}
                <TablaUbicacionMascota datos={puntosActivos} /> 
              </div>
            </div>
            
          ) : (
            <div className="w-1/2 h-full flex items-center justify-center text-gray-500">
              <p>Selecciona una mascota de la lista.</p> 
            </div>
          )}
        </div>
      </div>
       {mascotaParaModal && <ModalMascota idMascota={mascotaParaModal} closeModal={cerrarModal} />} 
       
    </div>
  );
};

export default MapaMascota;