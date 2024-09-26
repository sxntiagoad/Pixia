import React from 'react'
import { Link } from 'react-router-dom'
import backgroundImage from '../assets/fondoPixia.jpg';

function LandingPage() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Barra superior */}
      <nav className="bg-gray-800 bg-opacity-80 p-4 flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/crear-vacante" className="text-gray-300 hover:text-white transition duration-300">Crear Vacante</Link>
          <Link to="/vacantes" className="text-gray-300 hover:text-white transition duration-300">Vacantes</Link>
          <Link to="/ajustes" className="text-gray-300 hover:text-white transition duration-300">Ajustes</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="bg-blue-650 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="bg-green-650 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Registrarse
          </Link>
          <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
            {/* Comentado temporalmente para evitar errores si userAvatar no está definido */}
            {/* <img src={userAvatar} alt="Usuario" className="w-full h-full object-cover" /> */}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center bg-black bg-opacity-50">
        <h1 className="text-5xl font-bold text-white mb-6">Bienvenido a Pixia</h1>
        <p className="text-xl text-gray-400 mb-12">Crea vacantes atractivas con el poder de la inteligencia artificial</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-3">Creación Rápida</h2>
            <p className="text-gray-400">Describe tu idea y observa cómo la IA genera una vacante atractiva al instante.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-3">Optimización Inteligente</h2>
            <p className="text-gray-400">Mejora tus vacantes con nuestras herramientas de optimización impulsadas por IA.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-3">Gestión Eficiente</h2>
            <p className="text-gray-400">Organiza y administra tus vacantes con nuestro sistema inteligente.</p>
          </div>
        </div>

        <Link to="/ImageGeneratorPage" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-xl transition duration-300">
          Comenzar a Crear
        </Link>
      </main>
    </div>
  );
}

export default LandingPage