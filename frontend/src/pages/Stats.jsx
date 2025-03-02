import React, { useState, useEffect } from 'react'; 
import api from '../utils/axios';

export default function Stats() {
  // Variables de estado para gestionar los datos y el estado de la carga
  const [activities, setActivities] = useState([]); // Lista de actividades
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Mensaje de error
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [totalActivities, setTotalActivities] = useState(0); // Total de actividades

  // Función para cargar las actividades desde la API
  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities', {
        params: {
          page: currentPage, // Páginas de actividades
          per_page: 10, // Número de actividades por página
        },
      });
      setActivities(response.data.data); // Guardamos las actividades obtenidas
      setTotalActivities(response.data.total); // Total de actividades
      setTotalPages(Math.ceil(response.data.total / 10)); // Calculamos las páginas
      setLoading(false); // Cambiamos el estado de carga
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      setError('Hubo un error al cargar las actividades. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };

  // Cargar las actividades cuando se monta el componente o cambia la página
  useEffect(() => {
    fetchActivities();
  }, [currentPage]);

  // Mostrar mensaje mientras cargan las actividades o si ocurre un error
  if (loading) {
    return <p className="text-center text-black">Cargando actividades...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-black mb-6">Actividades Registradas</h1>

      {/* Tabla para mostrar las actividades */}
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-black">ID</th>
              <th className="py-3 px-4 text-left text-black">ID Usuario</th>
              <th className="py-3 px-4 text-left text-black">Acción</th>
              <th className="py-3 px-4 text-left text-black">Descripción</th>
              <th className="py-3 px-4 text-left text-black">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <tr key={activity.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-black">{activity.id}</td>
                  <td className="py-3 px-4 text-black">{activity.user_id}</td>
                  <td className="py-3 px-4 text-black">{activity.action}</td>
                  <td className="py-3 px-4 text-black">{activity.description}</td>
                  <td className="py-3 px-4 text-black">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-black">
                  No hay actividades registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-black">
              Página {currentPage} de {totalPages} ({totalActivities} actividades en total)
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              Anterior
            </button>

            {/* Botones para navegar entre páginas */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
