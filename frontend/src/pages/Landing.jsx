import React from 'react';
import Login from './Login';

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full bg-[url('/assets/fondo.png')] bg-cover bg-center">
      
      {/* Hero Section flotante - ancho completo, más alto y fuente más grande */}
      <div className="absolute top-24 w-full bg-primary text-center py-16 px-6 shadow-md">
        <h1 className="text-6xl md:text-7xl font-bold text-darkNeutral drop-shadow-lg">PET-GPS</h1>
        <p className="mt-4 text-lg md:text-xl font-medium text-darkNeutral drop-shadow">
          GPS Pasivo para Mascotas
        </p>
      </div>

      {/* Login Box flotante */}
      <div className="absolute top-15 right-10 bg-white shadow-xl rounded-2xl p-6 w-80 text-left">
        <Login />
      </div>

      {/* Content Section (más abajo) */}
      <div className="pt-100 grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded shadow overflow-hidden">
            <img
              src="assets/mascotas.jpg"
              alt="Mascotas"
              className="w-full h-100 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-sm mb-1 text-darkNeutral">Día de la mascota</h3>
              <p className="text-xs text-secondary text-darkNeutral">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis egestas gravida.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
