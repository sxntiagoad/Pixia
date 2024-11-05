import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaBriefcase, FaFileAlt, FaListUl, FaArrowRight } from 'react-icons/fa';
import { createVacancyApi } from '../api/vacancy';

export const PostVacancie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar errores al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validación básica
    if (!formData.title.trim() || !formData.description.trim() || !formData.requirements.trim()) {
      setError('Todos los campos son obligatorios');
      setIsLoading(false);
      return;
    }

    try {
      const response = await createVacancyApi(formData);
      
      if (response.data && response.data.vacancy) {
        setSuccess(true);
        // Esperar 1.5 segundos antes de redirigir
        setTimeout(() => {
          navigate('/ImageGeneratorPage', { 
            state: { vacancy: response.data.vacancy }
          });
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la vacante');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-200 mb-8 flex items-center">
            <FaBriefcase className="mr-3 text-indigo-500" />
            Nueva Vacante
          </h1>

          <motion.form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6"
          >
            {/* Título */}
            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <FaFileAlt className="mr-2 text-indigo-400" />
                Título de la Vacante
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="ej: Desarrollador Frontend Senior"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <FaFileAlt className="mr-2 text-indigo-400" />
                Descripción del Puesto
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="Describe las responsabilidades y el rol del puesto..."
                required
              />
            </div>

            {/* Requisitos */}
            <div>
              <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                <FaListUl className="mr-2 text-indigo-400" />
                Requisitos
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="Lista los requisitos necesarios para el puesto..."
                required
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading || success}
                className={`w-full ${
                  success 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </span>
                ) : success ? (
                  <span className="flex items-center">
                    ¡Vacante Creada! 
                    <FaArrowRight className="ml-2" />
                  </span>
                ) : (
                  'Crear Vacante'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                disabled={isLoading || success}
              >
                Cancelar
              </button>
            </div>
          </motion.form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-300"
            >
              ¡Vacante creada exitosamente! Redirigiendo al generador de imágenes...
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PostVacancie; 