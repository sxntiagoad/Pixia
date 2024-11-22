import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric-pure-browser';
import { FaFont, FaTrash, FaSave, FaLayerGroup, FaArrowUp, FaArrowDown, FaImage } from 'react-icons/fa';
import TextProperties from './TextProperties';

const ImageEdit = ({ imageUrl, onSave }) => {
    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const [currentComponent, setCurrentComponent] = useState(null);
    const [selectItem, setSelectItem] = useState(null);
    const [layers, setLayers] = useState([]);

    // Manejadores de selección
    const handleSelection = useCallback((e) => {
        if (!fabricRef.current) return;
        
        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            setCurrentComponent({
                id: activeObject.id || Date.now(),
                type: activeObject.type,
                name: activeObject.type === 'textbox' ? 'text' : activeObject.type
            });
            setSelectItem(activeObject.id);
        }
    }, []);

    const handleSelectionCleared = useCallback(() => {
        setCurrentComponent(null);
        setSelectItem(null);
    }, []);

    // Inicialización del canvas
    useEffect(() => {
        if (!canvasRef.current) return;

        fabricRef.current = new fabric.Canvas(canvasRef.current, {
            backgroundColor: '#f0f0f0',
            preserveObjectStacking: true,
            controlsAboveOverlay: true,
            centeredScaling: true,
            snapAngle: 45,
            snapThreshold: 10
        });

        if (imageUrl) {
            fabric.Image.fromURL(imageUrl, (img) => {
                // Calcular el factor de escala para ajustar la imagen
                const maxSize = 600; // Tamaño máximo deseado
                const scale = Math.min(
                    maxSize / img.width,
                    maxSize / img.height,
                    1 // No ampliar imágenes pequeñas
                );
                
                // Establecer las nuevas dimensiones del canvas
                const newWidth = img.width * scale;
                const newHeight = img.height * scale;
                
                fabricRef.current.setDimensions({
                    width: newWidth,
                    height: newHeight
                });
                
                // Escalar y posicionar la imagen
                img.scale(scale);
                img.set({
                    left: 0,
                    top: 0,
                    selectable: false,
                    id: 'background-image'
                });
                
                fabricRef.current.add(img);
                fabricRef.current.renderAll();
                saveState();
            });
        }

        const canvas = fabricRef.current;
        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', handleSelectionCleared);
        canvas.on('object:modified', saveState);

        return () => {
            if (fabricRef.current) {
                canvas.off('selection:created', handleSelection);
                canvas.off('selection:updated', handleSelection);
                canvas.off('selection:cleared', handleSelectionCleared);
                canvas.off('object:modified', saveState);
                
                canvas.getObjects().forEach((obj) => canvas.remove(obj));
                canvas.renderAll();
                
                try {
                    canvas.dispose();
                } catch (error) {
                    console.log('Error al limpiar el canvas:', error);
                }
                
                fabricRef.current = null;
            }
        };
    }, [imageUrl, handleSelection, handleSelectionCleared]);

    // Guardar estado
    const saveState = useCallback(() => {
        if (!fabricRef.current) return;
        
        const objects = fabricRef.current.getObjects();
        setLayers(objects
            .filter(obj => obj.id !== 'background-image')
            .reverse()
            .map(obj => ({
                id: obj.id || Date.now(),
                name: obj.type === 'textbox' ? 'Texto' : 'Imagen',
                type: obj.type
            }))
        );
    }, []);

    // Funciones de capas
    const updateLayers = () => {
        const objects = fabricRef.current.getObjects();
        setLayers(objects
            .filter(obj => obj.id !== 'background-image')
            .reverse()
            .map(obj => ({
                id: obj.id || Date.now(),
                name: obj.type === 'textbox' ? 'Texto' : 'Imagen',
                type: obj.type
            }))
        );
    };

    const moveLayerUp = () => {
        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            fabricRef.current.bringForward(activeObject);
            fabricRef.current.renderAll();
            saveState();
        }
    };

    const moveLayerDown = () => {
        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            fabricRef.current.sendBackwards(activeObject);
            fabricRef.current.renderAll();
            saveState();
        }
    };

    // Funciones de objetos
    const addText = () => {
        const text = new fabric.Textbox('Texto nuevo', {
            left: 100,
            top: 100,
            fontSize: 20,
            fill: '#000000',
            fontFamily: 'Arial',
            id: Date.now()
        });
        fabricRef.current.add(text);
        fabricRef.current.setActiveObject(text);
        fabricRef.current.renderAll();
        saveState();
    };

    const deleteSelected = () => {
        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            fabricRef.current.remove(activeObject);
            fabricRef.current.renderAll();
            setCurrentComponent(null);
            saveState();
        }
    };

    const handleSave = () => {
        if (fabricRef.current) {
            // Convertir el canvas a una URL de datos
            const dataURL = fabricRef.current.toDataURL({
                format: 'png',
                quality: 1
            });
            
            // Crear un elemento <a> temporal para la descarga
            const link = document.createElement('a');
            link.download = `pixia-edit-${Date.now()}.png`; // Nombre del archivo
            link.href = dataURL;
            
            // Simular clic para iniciar la descarga
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Si existe onSave, también llamamos a la función original
            if (onSave) {
                onSave(fabricRef.current.toJSON());
            }
        }
    };

    // Añadir esta nueva función para manejar la subida de imágenes
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file && fabricRef.current) {
            const reader = new FileReader();
            reader.onload = (event) => {
                fabric.Image.fromURL(event.target?.result, (img) => {
                    // Escalar la imagen si es muy grande
                    const maxSize = 200;
                    const scale = Math.min(
                        maxSize / img.width,
                        maxSize / img.height,
                        1
                    );
                    
                    img.scale(scale);
                    img.set({
                        left: 50,
                        top: 50,
                        id: Date.now()
                    });
                    
                    fabricRef.current.add(img);
                    fabricRef.current.setActiveObject(img);
                    fabricRef.current.renderAll();
                    saveState();
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="bg-gray-800 p-4 rounded-lg flex flex-wrap gap-4">
                <button
                    onClick={addText}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
                >
                    <FaFont /> Texto
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white cursor-pointer">
                    <FaImage /> Imagen
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>
                <button
                    onClick={deleteSelected}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                >
                    <FaTrash /> Eliminar
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white ml-auto"
                >
                    <FaSave /> Guardar
                </button>
                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={moveLayerUp}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                        title="Subir capa"
                    >
                        <FaArrowUp />
                    </button>
                    <button
                        onClick={moveLayerDown}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                        title="Bajar capa"
                    >
                        <FaArrowDown />
                    </button>
                </div>
            </div>

            <div className="flex gap-4">
                {/* Sidebar */}
                <div className="w-64 flex flex-col gap-4">
                    {/* Panel de capas */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <FaLayerGroup /> Capas
                        </h3>
                        <div className="space-y-2">
                            {layers.map((layer) => (
                                <div
                                    key={layer.id}
                                    className="flex items-center justify-between bg-gray-700 p-2 rounded"
                                >
                                    <span className="text-white">{layer.name}</span>
                                    <span className="text-gray-400 text-sm">
                                        {layer.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel de propiedades */}
                    {currentComponent && currentComponent.name === 'text' && (
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <TextProperties 
                                canvas={fabricRef.current}
                                onChange={saveState}
                            />
                        </div>
                    )}
                </div>

                {/* Canvas container */}
                <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center"
                     style={{ 
                         width: 'fit-content',
                         height: 'fit-content',
                         minWidth: '200px'  // Para evitar que sea demasiado pequeño
                     }}>
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    );
};

export default ImageEdit;