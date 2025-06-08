import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Spinner from '../components/Spinner.jsx';

const MapMascotaComponent = ({ mascotas, puntos, ultimaUbicacionGlobal, botonUltimaUbicacion }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [cargando, setCargando] = useState(true);
  // Eliminamos lineaIndex y animationIntervalRef ya que ahora serán por mascota
  const animationIntervalsRef = useRef({}); // Usaremos un objeto para almacenar los intervalos por mascota

  console.log(puntos);

  // Tu API key de MapTiler
  const apiKey = import.meta.env.VITE_MAPTILER_KEY;

  // Función para iniciar o reiniciar la animación
  const startLineAnimation = (orderedPoints, sourceId) => {
    // Generar un ID único para el intervalo de esta mascota
    const intervalId = `animationInterval-${sourceId}`;

    // Limpiar cualquier intervalo existente para esta mascota
    if (animationIntervalsRef.current[intervalId]) {
      clearInterval(animationIntervalsRef.current[intervalId]);
    }

    if (orderedPoints.length > 1) {
      let currentIndex = 0;

      // Resetear las coordenadas de la fuente a solo el primer punto para cada animación
      if (map.current && map.current.getSource(sourceId)) {
        map.current.getSource(sourceId).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [orderedPoints[0].longitud, orderedPoints[0].latitud]
            ]
          }
        });
      }

      animationIntervalsRef.current[intervalId] = setInterval(() => {
        currentIndex = (currentIndex + 1) % orderedPoints.length;
        const currentCoords = [orderedPoints[currentIndex].longitud, orderedPoints[currentIndex].latitud];

        // Asegúrate de que el mapa y la fuente existan antes de actualizar
        if (map.current && map.current.getSource(sourceId)) {
          const lineData = map.current.getSource(sourceId)._data;
          // Evitar añadir el mismo punto si la animación se reinicia y el punto ya está
          if (lineData.geometry.coordinates.length <= currentIndex) {
             lineData.geometry.coordinates.push(currentCoords);
          } else {
            // Si el índice ya existe, significa que el array se reinició o estamos en un ciclo.
            // Reconstruimos las coordenadas hasta el punto actual para evitar duplicados.
            lineData.geometry.coordinates = orderedPoints.slice(0, currentIndex + 1).map(p => [p.longitud, p.latitud]);
          }
          map.current.getSource(sourceId).setData(lineData);
        }
      }, 800);
    }
  };

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      console.log("Inicializando mapa...");
      setCargando(true);

      try {
        const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`;

        console.log("ultimaUbicacionGlobal", ultimaUbicacionGlobal);
        const ubicacionCentro = ultimaUbicacionGlobal || {
          latitud: -35.41963979516562,
          longitud: -71.6741795041245,
        };

        let zoom = 9;
        if (botonUltimaUbicacion) {
          zoom = 15;
        }

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: styleUrl,
          center: [ubicacionCentro.longitud, ubicacionCentro.latitud],
          zoom: zoom
        });

        console.log("Mapa inicializado");

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
          console.log("Mapa cargado completamente");

          // Crea una copia invertida para no modificar el prop 'puntos' directamente
          const puntosInvertidos = [...puntos].reverse();

          // Agrupar los puntos por mascotaId
          const puntosPorMascota = puntosInvertidos.reduce((acc, punto) => {
            if (!acc[punto.mascotaId]) {
              acc[punto.mascotaId] = [];
            }
            acc[punto.mascotaId].push(punto);
            return acc;
          }, {});

          // Añadir marcadores para todos los puntos
          puntosInvertidos.forEach((punto) => {
            const contenedor = document.createElement('div');
            contenedor.style.display = 'flex';
            contenedor.style.flexDirection = 'column';
            contenedor.style.alignItems = 'center';
            contenedor.style.textAlign = 'center';

            const marcador = document.createElement('div');
            const urlFoto = mascotas[punto.mascotaId]?.urlFoto || '/assets/mascotaPorDefecto.png';
            marcador.className = 'w-10 h-10 bg-no-repeat bg-contain cursor-pointer rounded-full border-4 border-red-500';
            marcador.style.backgroundImage = `url(${urlFoto})`;
            marcador.style.backgroundSize = 'cover';
            marcador.style.backgroundPosition = 'center';

            const texto = document.createElement('div');
            texto.className = 'text-xs bg-white px-1 rounded mt-1 shadow-md';
            texto.innerText = `${punto.dia}/${punto.mes} ${punto.hora}:${punto.minuto}`;

            contenedor.appendChild(marcador);
            contenedor.appendChild(texto);

            new maplibregl.Marker({ element: contenedor })
              .setLngLat([punto.longitud, punto.latitud])
              .addTo(map.current);
          });

          // Inicializar fuentes y capas para cada mascota y sus rutas
          Object.keys(puntosPorMascota).forEach(mascotaId => {
            const puntosDeEstaMascota = puntosPorMascota[mascotaId];
            const sourceId = `ruta-mascota-${mascotaId}`;
            const layerId = `linea-ruta-mascota-${mascotaId}`;

            if (puntosDeEstaMascota.length > 0) {
              map.current.addSource(sourceId, {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [puntosDeEstaMascota[0].longitud, puntosDeEstaMascota[0].latitud]
                    ]
                  }
                }
              });
            } else {
              // Si no hay puntos, inicializa con un array vacío de coordenadas
              map.current.addSource(sourceId, {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: []
                  }
                }
              });
            }

            // Agrega una capa para cada ruta de mascota
            map.current.addLayer({
              id: layerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                // Puedes personalizar el color de la línea por mascota si lo deseas
                'line-color': 'red',
                'line-width': 4,
                'line-dasharray': [1, 2]
              }
            });

            // Iniciar la animación para cada mascota
            startLineAnimation(puntosDeEstaMascota, sourceId);
          });

          setCargando(false);
        });

        map.current.on('error', (e) => {
          console.error("Error en el mapa:", e);
        });
      } catch (error) {
        console.error("Error al inicializar mapa:", error);
      }
    }

    return () => {
      if (map.current) {
        console.log("Eliminando mapa");
        // Limpiar todos los intervalos de animación al desmontar el componente
        Object.values(animationIntervalsRef.current).forEach(clearInterval);
        animationIntervalsRef.current = {}; // Reiniciar el objeto de intervalos
        map.current.remove();
        map.current = null;
      }
    };
  }, [mascotas, puntos]); // Las dependencias siguen siendo 'mascotas' y 'puntos' originales

  // Eliminamos el useEffect para 'lineaIndex' ya que la animación ahora es por mascota

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {cargando && (
        <Spinner mensaje="Cargando ubicaciones..." />
      )}
      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

export default MapMascotaComponent;