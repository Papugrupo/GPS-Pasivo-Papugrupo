import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapMascotaComponent = ({ imagen , puntos }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  // Tu API key de MapTiler
  const apiKey = import.meta.env.VITE_MAPTILER_KEY; 

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      console.log("Inicializando mapa...");
      
      try {
        // Especificar la URL del estilo correctamente
        const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`;
        
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: styleUrl, // URL completa al archivo style.json con la API key
          center: [-71.23025198746762, -35.00155919995224], 
          zoom: 9
        });
        
        console.log("Mapa inicializado");
        
        // Añadir controles de navegación
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        
        // Manejar eventos
        map.current.on('load', () => {
          console.log("Mapa cargado completamente");
    
          puntos.forEach((punto) => {
            // 1. Crear contenedor del marcador
            const contenedor = document.createElement('div');
            contenedor.style.display = 'flex';
            contenedor.style.flexDirection = 'column';
            contenedor.style.alignItems = 'center';
            contenedor.style.textAlign = 'center';
        
            // 2. Crear marcador (imagen)
            const marcador = document.createElement('div');
            marcador.className = 'w-10 h-10 bg-no-repeat bg-contain cursor-pointer rounded-full border-4 border-red-500';
            marcador.style.backgroundImage = `url(${imagen})`;
            marcador.style.backgroundSize = 'cover';
            marcador.style.backgroundPosition = 'center';
        
            // 3. Crear texto debajo (fecha y hora)
            const texto = document.createElement('div');
            texto.className = 'text-xs bg-white px-1 rounded mt-1 shadow-md'; 
            texto.innerText = `${punto.dia}/${punto.mes} ${punto.hora}:${punto.minuto}`;
        
            // 4. Meter el marcador y el texto en el contenedor
            contenedor.appendChild(marcador);
            contenedor.appendChild(texto);
        
            // 5. Crear el marcador en el mapa
            new maplibregl.Marker({ element: contenedor })
              .setLngLat([punto.longitud, punto.latitud])
              .addTo(map.current);
          });
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
        map.current.remove();
        map.current = null;
      }
    };
  }, [imagen, puntos]);

  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
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