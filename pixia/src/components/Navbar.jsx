import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import pixiaLogo from '../assets/pixia.png';
import { motion } from 'framer-motion';
import { FaHome, FaImage, FaHistory, FaBriefcase, FaPencilAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: <FaHome className="text-xl" />, label: 'Inicio' },
    { path: '/ImageGeneratorPage', icon: <FaImage className="text-xl" />, label: 'Crear Post' },
    { path: '/historial-vacantes', icon: <FaHistory className="text-xl" />, label: 'Post Generados' },
    { path: '/post-vacancies', icon: <FaBriefcase className="text-xl" />, label: 'Crear Vacante' },
    { path: '/test-editor', icon: <FaPencilAlt className="text-xl" />, label: 'Editor' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center">
              <img src={pixiaLogo} alt="Pixia Logo" className="h-10 w-auto" />
            </Link>
          </motion.div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  onHoverStart={() => setHoverIndex(index)}
                  onHoverEnd={() => setHoverIndex(null)}
                  className="relative"
                >
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                      ${location.pathname === item.path 
                        ? 'text-green-400' 
                        : 'text-gray-300 hover:text-white'}`}
                  >
                    <span className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute inset-0 bg-green-400/10 rounded-lg z-[-1]"
                        layoutId="navbar-active"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {hoverIndex === index && location.pathname !== item.path && (
                      <motion.div
                        className="absolute inset-0 bg-gray-700/40 rounded-lg z-[-1]"
                        layoutId="navbar-hover"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                >
                  <FaSignOutAlt />
                  <span>Cerrar sesión</span>
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-400/20 hover:border-green-400/40 transition-colors duration-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-500/20" />
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-green-400">
                      {user?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all duration-200"
                  >
                    Iniciar Sesión
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all duration-200"
                  >
                    Registrarse
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
