import axios from 'axios';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('token'); // Asegúrate que 'token' sea la clave correcta
    
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
  
    if (error.response && error.response.status === 401) {
      console.log('Error de autenticación: Token inválido o expirado');

    }
    return Promise.reject(error);
  }
);

export default api;