import React, { useState, useEffect } from 'react';

const TextProperties = ({ canvas, onChange }) => {
    const [textProps, setTextProps] = useState({
        fontFamily: 'Arial',
        fontSize: 20,
        color: '#000000',
        weight: 400,
        padding: 5
    });

    useEffect(() => {
        if (canvas) {
            const updateFromSelection = () => {
                const activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'textbox') {
                    setTextProps({
                        fontFamily: activeObject.fontFamily,
                        fontSize: activeObject.fontSize,
                        color: activeObject.fill,
                        weight: activeObject.fontWeight,
                        padding: activeObject.padding
                    });
                }
            };

            canvas.on('selection:created', updateFromSelection);
            canvas.on('selection:updated', updateFromSelection);

            return () => {
                canvas.off('selection:created', updateFromSelection);
                canvas.off('selection:updated', updateFromSelection);
            };
        }
    }, [canvas]);

    const updateProperty = (property, value) => {
        const activeObject = canvas?.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            activeObject.set(property, value);
            canvas.renderAll();
            onChange?.();
            setTextProps(prev => ({ ...prev, [property]: value }));
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-1 items-center">
                <span className="text-md w-[70px]">Font : </span>
                <select
                    className="w-[120px] border border-gray-700 bg-transparent outline-none px-2 rounded-md"
                    value={textProps.fontFamily}
                    onChange={(e) => updateProperty('fontFamily', e.target.value)}
                >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                </select>
            </div>

            <div className="flex gap-1 items-center">
                <span className="text-md w-[70px]">Size : </span>
                <input
                    type="number"
                    className="w-[70px] border border-gray-700 bg-transparent outline-none px-2 rounded-md"
                    value={textProps.fontSize}
                    onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
                    min="1"
                    max="200"
                />
            </div>

            <div className="flex gap-1 items-center">
                <span className="text-md w-[70px]">Weight : </span>
                <input
                    type="number"
                    className="w-[70px] border border-gray-700 bg-transparent outline-none px-2 rounded-md"
                    value={textProps.weight}
                    onChange={(e) => updateProperty('fontWeight', parseInt(e.target.value))}
                    step="100"
                    min="100"
                    max="900"
                />
            </div>

            <div className="flex gap-1 items-center">
                <span className="text-md w-[70px]">Color : </span>
                <input
                    type="color"
                    className="w-[70px] h-[30px] border border-gray-700 bg-transparent outline-none rounded-md"
                    value={textProps.color}
                    onChange={(e) => updateProperty('fill', e.target.value)}
                />
            </div>
        </div>
    );
};

export default TextProperties;