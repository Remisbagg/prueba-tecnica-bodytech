import icono from '../assets/icono.png';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';

const Register = () => {
  // Definición de los estados para el formulario
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [name, setName] = useState(''); // Almacena el nombre
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hook para navegar entre las páginas
  const navigate = useNavigate();

  // Función para alternar la visibilidad de la contraseña
  const handleClickShowPassword = () => setIsPasswordShown(!isPasswordShown);

  // Validación de los campos de entrada
  const validateInputs = () => {
    const nameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios permitidos en el nombre
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para validar email
    const passwordRegex = /^.{8,}$/; // La contraseña debe tener al menos 8 caracteres

    // Validación de cada campo
    if (!nameRegex.test(name)) {
      setError('El nombre solo debe contener letras y espacios.');
      return false;
    }

    if (!emailRegex.test(email)) {
      setError('El correo electrónico no es válido.');
      return false;
    }

    if (!passwordRegex.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return false;
    }

    return true;
  };

  // Envío de los datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Primero validamos los inputs
    if (!validateInputs()) {
      return;
    }

    try {
      // Verificamos los datos antes de enviarlos
      console.log('Datos enviados al backend:', {
        name: name,
        email: email,
        password: password,
      });

      // Enviar los datos al backend
      const _response = await api.post('/register', {
        name: name,
        email: email,
        password: password,
      });

      // Si el registro es exitoso, mostramos un mensaje de éxito
      setSuccessMessage('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
      setError('');
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setError('Hubo un problema al registrar el usuario. Intenta de nuevo.');

      console.error('Error al registrar el usuario:', error);

      // Mostrar detalles del error en consola
      if (error.response) {
        console.log('Detalles de la respuesta del error:', error.response);
      } else {
        console.log('Error sin respuesta:', error);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sección de la izquierda con el icono */}
      <div className="fixed left-0 top-0 w-2/3 h-full bg-gray-100 flex justify-center items-center">
        <img 
          src={icono} 
          alt="Icono de la aplicación" 
          className="max-w-md w-2/5" 
        />
      </div>

      {/* Formulario de registro a la derecha */}
      <div className="fixed right-0 top-0 w-full sm:w-1/3 md:w-1/3 lg:w-1/3 h-full bg-white shadow-lg p-8 overflow-auto">
        <div className="flex justify-center mb-6">
          {/* Título de la página */}
          <h1 className="text-2xl font-bold text-blue-600">Registro</h1>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">¡Bienvenido!👋</h2>
          <p className="text-gray-600 mt-1">Por favor registra tu cuenta</p>
        </div>

        {/* Mostrar mensajes de error o éxito */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 text-sm mb-4">{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo para el nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          
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

          {/* Campo para confirmar la contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type={isPasswordShown ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Registrarme
          </button>

          {/* Enlace para redirigir al login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/" className="text-blue-600 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
