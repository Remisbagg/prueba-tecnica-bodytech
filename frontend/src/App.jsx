import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import CustomSidebar from "./components/CustomSidebar";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Stats from "./pages/Stats";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Componente para determinar el layout según la ruta
function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="flex">
      {/* Muestra el sidebar solo si no estamos en la página de login o registro */}
      {!isLoginPage && <CustomSidebar />}

      {/* Contenido principal con margin-left condicional */}
      <div className={`flex-1 p-4 ${!isLoginPage ? "ml-16" : ""}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;