import { NavLink, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserAlt } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosStats } from "react-icons/io";
import { MdSpaceDashboard } from "react-icons/md";
import PerfectScrollbar from "perfect-scrollbar";
import { useEffect, useRef, useState } from "react";

export default function CustomSidebar() {
  // Referencia para el contenedor del sidebar
  const sidebarRef = useRef(null);

  // Estado para controlar si el sidebar está expandido o no
  const [isHovered, setIsHovered] = useState(false);

  // Hook para redireccionar al usuario
  const navigate = useNavigate();

  // Inicializa PerfectScrollbar en el sidebar
  useEffect(() => {
    new PerfectScrollbar(sidebarRef.current);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    // Elimina el token del localStorage
    localStorage.removeItem('token');
    // Redirige al usuario a la página de login
    navigate('/');
  };

  return (
    <div
      className={`w-16 h-screen bg-blue-400 text-white fixed left-0 top-0 transition-all duration-300 ${
        isHovered ? "w-64" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)} // Expande el sidebar al pasar el mouse
      onMouseLeave={() => setIsHovered(false)} // Contraer el sidebar al quitar el mouse
    >
      {/* Contenedor del sidebar con scroll */}
      <div ref={sidebarRef} className="sidebar-wrapper">
        {/* Logo o título del menú */}
        <div className="logo">
          <h3
            className={`text-white ${isHovered ? "block opacity-100" : "hidden opacity-0"} transition-opacity duration-300`}
          >
            Menu
          </h3>
        </div>

        {/* Menú de navegación */}
        <nav>
          <ul>
            {/* Enlace al Dashboard */}
            <li className="flex items-center">
              <NavLink
                to="/dashboard"
                className="nav-link flex items-center w-full py-2 px-4 hover:bg-blue-600"
                activeClassName="bg-blue-600"
              >
                <MdSpaceDashboard className="mr-2 text-white" />
                <span className={`
                whitespace-nowrap overflow-hidden text-white
                ${isHovered 
                    ? "w-auto opacity-100 transition-all duration-300" 
                    : "w-0 opacity-0 transition-all duration-150"}
                `}>
                Dashboard
                </span>
              </NavLink>
            </li>

            {/* Enlace a la sección de Usuarios */}
            <li className="flex items-center">
              <NavLink
                to="/users"
                className="nav-link flex items-center w-full py-2 px-4 hover:bg-blue-600"
                activeClassName="bg-blue-600"
              >
                <FaUserAlt className="mr-2 text-white" />
                <span className={`
                whitespace-nowrap overflow-hidden text-white
                ${isHovered 
                    ? "w-auto opacity-100 transition-all duration-300" 
                    : "w-0 opacity-0 transition-all duration-150"}
                `}>
                Usuarios
                </span>
              </NavLink>
            </li>

            {/* Enlace a la sección de Actividades */}
            <li className="flex items-center">
              <NavLink
                to="/stats"
                className="nav-link flex items-center w-full py-2 px-4 hover:bg-blue-600"
                activeClassName="bg-blue-600"
              >
                <IoIosStats className="mr-2 text-white" />
                <span className={`
                whitespace-nowrap overflow-hidden text-white
                ${isHovered 
                    ? "w-auto opacity-100 transition-all duration-300" 
                    : "w-0 opacity-0 transition-all duration-150"}
                `}>
                Actividades
                </span>
              </NavLink>
            </li>

            {/* Botón para Cerrar Sesión */}
            <li className="flex items-center">
              <button
                onClick={handleLogout}
                className="nav-link flex items-center w-full py-2 px-4 hover:bg-blue-600"
              >
                <AiOutlineLogout className="mr-2 text-white" />
                <span className={`
                whitespace-nowrap overflow-hidden text-white
                ${isHovered 
                    ? "w-auto opacity-100 transition-all duration-300" 
                    : "w-0 opacity-0 transition-all duration-150"}
                `}>
                Cerrar Sesión
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}