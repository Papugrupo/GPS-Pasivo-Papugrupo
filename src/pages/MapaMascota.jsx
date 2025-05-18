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

      //ordenar las ubicaciones por fecha ascendente
      ubicacionesOriginales.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

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
    <div className="flex flex-col min-h-screen md:min-h-170 md:h-[95vh]  p-2 md:pt-2 " 
    style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.3)), url('/assets/gps_background.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'bottom',
    }}>
      <div className="h-full flex justify-center">
        {/* Mitad izquierda - listado de mascotas */}
        <div className='flex flex-col md:flex-row w-full md:w-4/5 md:justify-center rounded-2xl shadow-xl bg-blue-600/10 p-2'>
          <div className="flex flex-col  md:w-2/5  rounded-2xl ">
            <div className="flex flex-col flex-5/6  p-4 rounded-lg shadow-xl ">
            
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
                    seleccionada={selectedMascotaId === mascota.idMascota} 
                  />
                ))}
              </div>
            </div>
            <div className=' flex-1/6 '/> {/* Para el espacio despues del listado de mascotas */}
          </div>

          {/* Mitad derecha - mapa y controles */}
          {selectedMascotaId ? ( 
            <div className="md:ml-2 md:w-4/5 flex flex-col p-4 h-200 md:h-150 shadow-xl rounded-2xl">
              <div className='flex items-center justify-center gap-3 mb-3'>
                <MdMap />
                <h2 className="text-xl font-semibold  ">Mapa de ubicaciones</h2>
              </div>
              {/* Contenedor del mapa */}
              <div className="max-h-70 w-full px-5 h-full ">
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
              <div className="w-full px-5 py-4 flex justify-between items-center h-fit ">
                {/* Botones de control de ubicaciones */}
                <div className="flex justify-around w-full  ">
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
              <div className="w-full shadow-2xl">
                <div className='flex items-center justify-center gap-3 mb-3'>
                  <MdLocationPin />
                  <h2 className="text-xl font-semibold ">Ubicaciones de {nombreMascota || 'mascota seleccionada'}</h2>
                </div>
                
                {/* Pasar los puntos YA TRANSFORMADOS a la tabla */}
                <TablaUbicacionMascota datos={puntosActivos} /> 
              </div>
            </div>
            
          ) : (
            <div className="flex p-8 w-1/2 h-full flex items-center justify-center text-gray-900">
              <p>Selecciona una mascota de la lista.</p> 
            </div>
          )}
        </div>
      </div>
       {mascotaParaModal && 
          <ModalMascota 
            idMascota={mascotaParaModal} 
            closeModal={cerrarModal} 
            onMascotaActualizada={() => {
                // Recargar las mascotas después de una actualización
                const cargarMascotas = async () => {
                  setLoadingMascotas(true);
                  try {
                    const response = await obtenerListadoMascotas();
                    setMascotas(response);
                  } catch (error) {
                    console.error('Error al cargar mascotas:', error);
                    setErrorMascotas('Error al cargar las mascotas');
                  }
                  setLoadingMascotas(false);
                };
                cargarMascotas();
              }}
          />} 
       
    </div>
  );
};

export default MapaMascota;