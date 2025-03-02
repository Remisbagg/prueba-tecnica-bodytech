import React, { useState, useEffect } from 'react';
import api from '../utils/axios';  
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [recentUsers, setRecentUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [activityMetrics, setActivityMetrics] = useState({
    total_activities: 0,
    most_active_user: '',
    most_common_action: ''
  });
  const [userActions, setUserActions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se obtiene la información necesaria cuando el componente se monta
    const fetchData = async () => {
      try {
        const [recentUsersRes, activeUsersRes, activityMetricsRes, userActionsRes, allUsersRes] = await Promise.all([
          api.get('/reports/recent-users'),  
          api.get('/reports/active-users'),
          api.get('/reports/activity-metrics'),
          api.get('/reports/user-actions'),
          api.get('/users'), 
        ]);

        console.log("actividades",userActionsRes.data); 
        console.log(allUsersRes.data); 

        setRecentUsers(recentUsersRes.data);
        setActiveUsers(activeUsersRes.data);
        setActivityMetrics(activityMetricsRes.data);
        setUserActions(userActionsRes.data);
        setAllUsers(allUsersRes.data.data); 


      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Función que devuelve el nombre de un usuario usando su ID
  const getUserNameById = (userId) => {
    if (Array.isArray(allUsers)) {
      const user = allUsers.find(user => user.id === userId);
      console.log("El usuario es:",user);
      return user ? user.name : `Usuario ${userId}`;
    }
    return `Usuario ${userId}`;  // Devuelve un valor por defecto si allUsers no es un array
  };

  // Datos para el gráfico de donut que muestra las acciones por usuario
  const activityByUserData = {
    labels: Array.isArray(userActions) 
      ? userActions.slice(0, 5).map(action => getUserNameById(action.user_id))
      : [],
    datasets: [
      {
        label: 'Actividades por Usuario',
        data: Array.isArray(userActions) 
          ? userActions.slice(0, 5).map(action => action.action_count)
          : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Datos para el gráfico de barras con los usuarios más activos
  const topActiveUsersData = {
    labels: activeUsers.slice(0, 5).map(user => user.name),
    datasets: [
      {
        label: 'Número de Actividades',
        data: activeUsers.slice(0, 5).map(user => user.activity_count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Usuarios Más Activos',
        color: '#000'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Actividades por Usuario',
        color: '#000'
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

  return (
    <div className="flex flex-col space-y-8 p-8">
      {/* Encabezado del Dashboard */}
      <h1 className="text-3xl font-bold text-black">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Muestra la lista de usuarios recientes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">Usuarios Recientes</h2>
          <ul>
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <li key={user.id} className="text-gray-700 mb-2">{user.name} - {user.email}</li>
              ))
            ) : (
              <li className="text-gray-500">No hay usuarios recientes</li>
            )}
          </ul>
        </div>

        {/* Muestra la lista de usuarios activos */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">Usuarios Activos</h2>
          <ul>
            {activeUsers.length > 0 ? (
              activeUsers.map((user) => (
                <li key={user.id} className="text-gray-700 mb-2">{user.name} - {user.activity_count} actividades</li>
              ))
            ) : (
              <li className="text-gray-500">No hay usuarios activos</li>
            )}
          </ul>
        </div>

        {/* Muestra las métricas de las actividades */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">Métricas de Actividades</h2>
          <div className="flex flex-col space-y-2">
            <p className="text-gray-700">Total de Actividades: <span className="font-semibold">{activityMetrics.total_activities}</span></p>
            <p className="text-gray-700">Usuario Más Activo: <span className="font-semibold">{activityMetrics.most_active_user}</span></p>
            <p className="text-gray-700">Acción Más Común: <span className="font-semibold">{activityMetrics.most_common_action}</span></p>
          </div>
        </div>
      </div>

      {/* Sección de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de los usuarios más activos */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">Top Usuarios Más Activos</h2>
          {activeUsers.length > 0 ? (
            <Bar data={topActiveUsersData} options={chartOptions} />
          ) : (
            <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico</p>
          )}
        </div>

        {/* Gráfico de la distribución de actividades por usuario */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">Distribución de Actividades</h2>
          {Array.isArray(userActions) && userActions.length > 0 ? (
            <Doughnut data={activityByUserData} options={pieChartOptions} />
          ) : (
            <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico</p>
          )}
        </div>
      </div>

      {/* Sección de Acciones Rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/users" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Gestionar Usuarios
          </Link>
        </div>
      </div>

      {/* Tabla con las acciones realizadas por usuario */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Acciones Realizadas por Usuario</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left text-black">Usuario</th>
                <th className="py-2 px-4 text-left text-black">Número de Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(userActions) && userActions.length > 0 ? (
                userActions.map((action) => (
                  <tr key={action.user_id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-gray-700">{getUserNameById(action.user_id)}</td>
                    <td className="py-2 px-4 text-gray-700">{action.action_count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="py-4 px-4 text-center text-gray-500">No hay datos de acciones de usuario</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;