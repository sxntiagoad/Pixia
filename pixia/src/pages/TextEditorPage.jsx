import React, { useState, useEffect } from 'react';
import ImageEdit from '../components/ImageEdit';
import Navbar from '../components/Navbar';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.7, ease: "easeInOut" }
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.7, ease: "easeInOut" }
};

const TextEditorPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Manejar la subida de imagen
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Por favor selecciona una imagen válida');
                return;
            }

            // Crear y precargar la imagen
            const img = new Image();
            const imageUrl = URL.createObjectURL(file);
            
            img.onload = () => {
                setSelectedImage(imageUrl);
                setIsImageLoaded(true);
            };

            img.onerror = () => {
                toast.error('Error al cargar la imagen');
                URL.revokeObjectURL(imageUrl);
            };

            img.src = imageUrl;
        }
    };

    // Limpiar URLs cuando cambie la imagen
    useEffect(() => {
        return () => {
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage);
            }
        };
    }, [selectedImage]);

    const handleSave = (data) => {
        setEditedData(data);
        toast.success('Imagen editada guardada');
    };

    const handleReset = () => {
        setSelectedImage(null);
        setEditedData(null);
        setIsImageLoaded(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="min-h-screen bg-gray-900"
            style={{ backgroundColor: '#111827' }}
        >
            <Navbar />
            <motion.div 
                {...fadeIn}
                className="min-h-screen bg-gray-900 text-white p-8"
                style={{ backgroundColor: '#111827' }}
            >
                <motion.div 
                    {...slideUp}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="max-w-7xl mx-auto"
                >
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="text-3xl font-bold mb-8"
                    >
                        Editor de Imágenes
                    </motion.h1>

                    <AnimatePresence mode="wait">
                        {!selectedImage ? (
                            <motion.div 
                                key="upload"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="imageInput"
                                />
                                <motion.label
                                    htmlFor="imageInput"
                                    className="cursor-pointer flex flex-col items-center gap-4"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <motion.div
                                        animate={{ 
                                            y: [0, -8, 0]
                                        }}
                                        transition={{ 
                                            repeat: Infinity, 
                                            duration: 1.5,
                                            ease: "easeInOut",
                                            repeatType: "reverse"
                                        }}
                                    >
                                        <FaUpload className="text-4xl text-gray-400" />
                                    </motion.div>
                                    <span className="text-gray-400">
                                        Haz click o arrastra una imagen aquí
                                    </span>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-300"
                                    >
                                        Seleccionar Imagen
                                    </motion.button>
                                </motion.label>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="editor"
                                {...fadeIn}
                                className="bg-gray-800 rounded-lg p-4"
                                style={{ 
                                    maxWidth: '1200px',
                                    width: '100%',
                                    margin: '0 auto'
                                }}
                            >
                                <div className="w-full">
                                    {isImageLoaded && (
                                        <ImageEdit
                                            imageUrl={selectedImage}
                                            onSave={handleSave}
                                            key={selectedImage}
                                        />
                                    )}
                                </div>
                                
                                <motion.div 
                                    {...slideUp}
                                    className="mt-4 flex gap-4"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-300"
                                    >
                                        Cambiar Imagen
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {editedData && (
                            <motion.div 
                                {...slideUp}
                                className="mt-8 bg-gray-800 rounded-lg p-6"
                            >
                                <h2 className="text-xl font-bold mb-4">Datos de la Edición:</h2>
                                <pre className="bg-gray-900 p-4 rounded-lg">
                                    {JSON.stringify(editedData, null, 2)}
                                </pre>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default TextEditorPage;