import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric-pure-browser';
import { FaFont, FaTrash, FaSave, FaLayerGroup, FaArrowUp, FaArrowDown, FaImage, FaRedo } from 'react-icons/fa';
import TextProperties from './TextProperties';

const ImageEdit = ({ imageUrl, overlayImage, initialTexts, onSave }) => {
    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const [currentComponent, setCurrentComponent] = useState(null);
    const [selectItem, setSelectItem] = useState(null);
    const [layers, setLayers] = useState([]);

    const generateUniqueId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

        // Cargar imagen de fondo (template)
        if (imageUrl) {
            fabric.Image.fromURL(imageUrl, (img) => {
                const maxSize = 600;
                const scale = Math.min(
                    maxSize / img.width,
                    maxSize / img.height,
                    1
                );
                
                const newWidth = img.width * scale;
                const newHeight = img.height * scale;
                
                fabricRef.current.setDimensions({
                    width: newWidth,
                    height: newHeight
                });
                
                img.scale(scale);
                img.set({
                    left: 0,
                    top: 0,
                    selectable: false,
                    id: 'background-image'
                });
                
                fabricRef.current.add(img);

                // Cargar imagen superpuesta (sin fondo)
                if (overlayImage) {
                    fabric.Image.fromURL(overlayImage, (overlayImg) => {
                        overlayImg.scale(scale);
                        overlayImg.set({
                            left: 0,
                            top: 0,
                            id: 'overlay-image'
                        });
                        fabricRef.current.add(overlayImg);
                        
                        // Añadir textos iniciales
                        if (initialTexts) {
                            initialTexts.forEach(textData => {
                                const text = new fabric.Textbox(textData.text, {
                                    left: textData.left,
                                    top: textData.top,
                                    fontSize: textData.fontSize,
                                    fill: '#000000',
                                    fontFamily: 'Arial',
                                    id: textData.id
                                });
                                fabricRef.current.add(text);
                            });
                        }
                        
                        fabricRef.current.renderAll();
                        saveState();
                    });
                }
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
    }, [imageUrl, overlayImage, initialTexts, handleSelection, handleSelectionCleared]);

    // Guardar estado
    const saveState = useCallback(() => {
        if (!fabricRef.current) return;
        
        const objects = fabricRef.current.getObjects();
        setLayers(objects
            .filter(obj => obj.id !== 'background-image')
            .reverse()
            .map(obj => ({
                id: obj.id || generateUniqueId(obj.type),
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
                id: obj.id || generateUniqueId(obj.type),
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
            id: generateUniqueId('text')
        });
        fabricRef.current.add(text);
        fabricRef.current.setActiveObject(text);
        fabricRef.current.renderAll();
        saveState();
    };

    const addText1 = (preText) => {
        const text = new fabric.Textbox(preText, {
            left: 0,
            top: 0,
            fontSize: 20,
            fill: '#000000',
            fontFamily: 'Arial',
            id: generateUniqueId('text1')
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
            // Obtener el canvas actual
            const canvas = fabricRef.current;
            
            // Crear un canvas temporal con fondo blanco
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const ctx = tempCanvas.getContext('2d');
            
            // Dibujar fondo blanco
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Convertir el canvas a una URL de datos
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: 2 // Para mejor calidad
            });
            
            // Crear un elemento <a> temporal para la descarga
            const link = document.createElement('a');
            link.download = `pixia-edit-${Date.now()}.png`;
            link.href = dataURL;
            
            // Simular clic para iniciar la descarga
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Si existe onSave, también llamamos a la función original
            if (onSave) {
                onSave(canvas.toJSON());
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
                        id: generateUniqueId('image')
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

    // Añadir función de recarga
    const handleReload = () => {
        if (!fabricRef.current) return;
        
        // Limpiar el canvas manteniendo solo la imagen de fondo
        const objects = fabricRef.current.getObjects();
        objects.forEach(obj => {
            if (obj.id !== 'background-image') {
                fabricRef.current.remove(obj);
            }
        });

        // Recargar la imagen superpuesta
        if (overlayImage) {
            fabric.Image.fromURL(overlayImage, (overlayImg) => {
                const maxSize = 600;
                const scale = Math.min(
                    maxSize / overlayImg.width,
                    maxSize / overlayImg.height,
                    1
                );
                
                overlayImg.scale(scale);
                overlayImg.set({
                    left: 0,
                    top: 0,
                    id: 'overlay-image'
                });
                fabricRef.current.add(overlayImg);
                
                // Recargar textos iniciales
                if (initialTexts) {
                    initialTexts.forEach(textData => {
                        const text = new fabric.Textbox(textData.text, {
                            left: textData.left,
                            top: textData.top,
                            fontSize: textData.fontSize,
                            fill: '#000000',
                            fontFamily: 'Arial',
                            id: textData.id
                        });
                        fabricRef.current.add(text);
                    });
                }
                
                fabricRef.current.renderAll();
                saveState();
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="bg-gray-800 p-4 rounded-lg flex flex-wrap gap-4">
                <button
                    onClick={handleReload}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white"
                    title="Recargar"
                >
                    <FaRedo /> Recargar
                </button>
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