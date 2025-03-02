import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { BiEdit, BiTrash, BiSearch, BiPlus, BiFilter } from 'react-icons/bi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Users() {
  // Estados para gestionar los datos y la UI
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [userGrowth, setUserGrowth] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchUsers();
    fetchUserGrowthData();
  }, [currentPage, perPage]);

  // Función para obtener usuarios con paginación y filtros
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: perPage,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (dateRange.start) {
        params.start_date = dateRange.start;
      }

      if (dateRange.end) {
        params.end_date = dateRange.end;
      }

      const response = await api.get('/users', { params });
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      setTotalUsers(response.data.total);
      setTotalPages(Math.ceil(response.data.total / perPage));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  // Reiniciar filtros cuando no hay búsqueda
  useEffect(() => {
    if (!searchQuery && !dateRange.start && !dateRange.end) {
      setFilteredUsers(users);
    }
  }, [searchQuery, dateRange, users]);

  // Ejecutar búsqueda cuando cambian los criterios
  useEffect(() => {
    fetchUsers();
  }, [currentPage, perPage, searchQuery, dateRange]);

  // Función para obtener datos de crecimiento de usuarios para el gráfico
  const fetchUserGrowthData = async () => {
    try {
      const response = await api.get('/reports/recent-users', {
        params: { days: 30 }
      });

      if (response.data && Array.isArray(response.data)) {
        const usersByDate = {};

        response.data.forEach(user => {
          if (user.created_at) {
            const dateOnly = user.created_at.split('T')[0];
            if (usersByDate[dateOnly]) {
              usersByDate[dateOnly]++;
            } else {
              usersByDate[dateOnly] = 1;
            }
          }
        });

        const formattedData = Object.keys(usersByDate).map(date => ({
          date: new Date(date).toLocaleDateString(),
          count: usersByDate[date]
        }));

        formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (formattedData.length < 30) {
          const today = new Date();
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);

          const existingDates = new Set(formattedData.map(item => item.date));

          for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toLocaleDateString();
            if (!existingDates.has(dateStr)) {
              formattedData.push({
                date: dateStr,
                count: 0
              });
            }
          }

          formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        setUserGrowth(formattedData);
      } else {
        setUserGrowth([]);
      }
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      setUserGrowth([]);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!editingUser && !formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria para nuevos usuarios';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingUser) {
        // Actualizar usuario
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password.trim()) {
          delete dataToUpdate.password; 
        }

        // Enviar solo los campos necesarios
        const { name, email, phone } = dataToUpdate;
        const response = await api.put(`/users/${editingUser.id}`, { name, email, phone });

        // Actualizar la lista de usuarios
        const updatedUsers = users.map(user =>
          user.id === editingUser.id ? response.data : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        // Crear nuevo usuario
        await api.post('/users', formData);
      }

      // Cerrar modal y recargar datos
      setShowModal(false);
      fetchUsers();
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: ''
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ form: 'Error al guardar. Intente nuevamente.' });
      }
    }
  };

  // Preparar formulario para edición
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '' 
    });
    setShowModal(true);
  };

  // Preparar confirmación de eliminación
  const handleDeleteConfirmation = (user) => {
    setDeleteConfirmation(user);
  };

  // Procesar eliminación de usuario
  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await api.delete(`/users/${deleteConfirmation.id}`);
      setDeleteConfirmation(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Configuración para el gráfico de crecimiento
  const userGrowthChartData = {
    labels: userGrowth.map(entry => entry.date),
    datasets: [
      {
        label: 'Nuevos usuarios',
        data: userGrowth.map(entry => entry.count),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
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
        text: 'Crecimiento de usuarios en los últimos 30 días',
        color: '#000'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#000'
        }
      },
      x: {
        ticks: {
          color: '#000'
        }
      }
    }
  };

  return (
    <div className="flex flex-col p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>

      {/* Sección de estadísticas y gráfico */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Crecimiento de Usuarios</h2>
        <div className="h-64">
          {userGrowth.length > 0 ? (
            <Line data={userGrowthChartData} options={chartOptions} />
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-black">No hay datos suficientes</p>
            </div>
          )}
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar por nombre, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-md pl-10 text-black"
            />
            <BiSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-white rounded-md hover:bg-gray-200"
            >
              <BiFilter />
              Filtros
            </button>

            
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {filterOpen && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-2 text-black">Filtros Avanzados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-black mb-1">Fecha de inicio</label>
                <DatePicker
                  selected={dateRange.start ? new Date(dateRange.start) : null}
                  onChange={(date) =>
                    setDateRange({ ...dateRange, start: date.toISOString().split('T')[0] })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm text-black mb-1">Fecha de fin</label>
                <DatePicker
                  selected={dateRange.end ? new Date(dateRange.end) : null}
                  onChange={(date) =>
                    setDateRange({ ...dateRange, end: date.toISOString().split('T')[0] })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">Lista de Usuarios</h2>
          <p className="text-black">Total: {totalUsers} usuarios</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left text-black">ID</th>
                  <th className="py-3 px-4 text-left text-black">Nombre</th>
                  <th className="py-3 px-4 text-left text-black">Email</th>
                  <th className="py-3 px-4 text-left text-black">Teléfono</th>
                  <th className="py-3 px-4 text-left text-black">Fecha de Registro</th>
                  <th className="py-3 px-4 text-center text-black">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-black">{user.id}</td>
                      <td className="py-3 px-4 text-black">{user.name}</td>
                      <td className="py-3 px-4 text-black">{user.email}</td>
                      <td className="py-3 px-4 text-black">{user.phone || '-'}</td>
                      <td className="py-3 px-4 text-black">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <BiEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirmation(user)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <BiTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-black">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div>
                  <select
                    value={perPage}
                    onChange={e => setPerPage(Number(e.target.value))}
                    className="border rounded-md p-2 text-black"
                  >
                    <option value={10}>10 por página</option>
                    <option value={25}>25 por página</option>
                    <option value={50}>50 por página</option>
                    <option value={100}>100 por página</option>
                  </select>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                  >
                    Anterior
                  </button>

                  {/* Botones de página */}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
          </>
        )}
      </div>

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-black">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md text-black ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md text-black ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md text-black ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {!editingUser && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-black mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md text-black ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>
                )}

                {errors.form && <p className="mb-4 text-sm text-red-600">{errors.form}</p>}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingUser ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmación de eliminación */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-black">Confirmar eliminación</h2>
            <p className="mb-6 text-black">
              ¿Está seguro que desea eliminar al usuario <span className="font-semibold">{deleteConfirmation.name}</span>?
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}