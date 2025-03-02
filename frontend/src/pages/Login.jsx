import icono from '../assets/icono.png';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';

const Login = () => {
  // Variables de estado para manejar la visibilidad de la contraseña, email, contraseña y errores
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error al intentar iniciar sesión
  
  // Hook de navegación
  const navigate = useNavigate();
  
  // Función para alternar la visibilidad de la contraseña
  const handleClickShowPassword = () => setIsPasswordShown(!isPasswordShown);

  // Enviar los datos de login al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Llamada a la API para hacer login
      const response = await api.post('/login', {
        email: email,
        password: password,
      });
      
      // Guardar el token en el almacenamiento local
      localStorage.setItem('token', response.data.access_token);
      console.log(response);
      navigate('/dashboard'); // Redirigir a la página del dashboard
    } catch (error) {
      // Mostrar mensaje de error si las credenciales son incorrectas
      setError('Credenciales incorrectas. Intenta de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sección izquierda con el logo */}
      <div className="fixed left-0 top-0 w-2/3 h-full bg-gray-100 flex justify-center items-center">
        <img 
          src={icono} 
          alt="Icono de la aplicación" 
          className="max-w-md w-2/5" 
        />
      </div>

      {/* Sección del formulario de login */}
      <div className="fixed right-0 top-0 w-full sm:w-1/3 md:w-1/3 lg:w-1/3 h-full bg-white shadow-lg p-8 overflow-auto">
        <div className="flex justify-center mb-6">
          {/* Título del formulario */}
          <h1 className="text-2xl font-bold text-blue-600">Login</h1>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">¡Bienvenido!👋</h2>
          <p className="text-gray-600 mt-1">Por favor inicia sesión para comenzar</p>
        </div>

        {/* Mostrar mensaje de error si hay uno */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo para el email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          
          {/* Campo para la contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={isPasswordShown ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleClickShowPassword}
              >
                {isPasswordShown ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 000-1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Iniciar Sesión
          </button>
          
          {/* Enlace para ir al formulario de registro */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Sin usuario?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Crear un usuario
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
