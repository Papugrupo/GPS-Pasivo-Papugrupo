import React, { useState, useMemo } from 'react';

const TablaUbicacionMascota = ({ datos, mascotas }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortAsc, setSortAsc] = useState(true);
  const itemsPerPage = 10;

  const sortedDatos = useMemo(() => {
    return [...datos].sort((a, b) => {
      const fechaA = new Date(`${a.anio}-${a.mes}-${a.dia}T${a.hora}:${a.minuto}:${a.segundo}`);
      const fechaB = new Date(`${b.anio}-${b.mes}-${b.dia}T${b.hora}:${b.minuto}:${b.segundo}`);
      return sortAsc ? fechaA - fechaB : fechaB - fechaA;
    });
  }, [datos, sortAsc]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = sortedDatos.slice(startIndex, endIndex);

  const totalPages = Math.ceil(datos.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  return (
    <div className="overflow-x-auto">
      <div className=" border border-gray-200 rounded-md bg-white">
        {/* Encabezado separado */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer w-1/2"
                onClick={toggleSort}
              >
                Fecha {sortAsc ? '↑' : '↓'}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Coordenadas</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mascota</th>
            </tr>
          </thead>
        </table>

        {/* Cuerpo scrollable */}
        <div className="max-h-80 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody>
              {pageData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-700 w-1/2">
                    {`${item.dia}/${item.mes}/${item.anio} ${item.hora}:${item.minuto}:${item.segundo}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 w-1/2">{item.latitud},{item.longitud}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 w-1/2">{mascotas[item.mascotaId]?.nombre || 'Desconocida'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de paginación */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-sm text-gray-700">
            Página {currentPage + 1} de {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaUbicacionMascota;
