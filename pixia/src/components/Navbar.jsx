import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 bg-opacity-80 p-4 flex justify-between items-center">
      <div className="flex space-x-6">
        <Link to="/" className="text-gray-300 hover:text-white transition duration-300">Inicio</Link>
        <Link to="/crear-vacante" className="text-gray-300 hover:text-white transition duration-300">Crear Vacante</Link>
        <Link to="/vacantes" className="text-gray-300 hover:text-white transition duration-300">Vacantes</Link>
        <Link to="/ajustes" className="text-gray-300 hover:text-white transition duration-300">Ajustes</Link>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Cerrar sesión
            </button>
            <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
              {/* Aquí puedes agregar la imagen del usuario si está disponible */}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-650 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="bg-green-650 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
