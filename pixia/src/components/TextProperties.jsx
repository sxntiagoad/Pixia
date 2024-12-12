import React, { useState, useEffect } from 'react';

const AVAILABLE_FONTS = [
    'Arial',
    'Roboto',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Oswald',
    'Dancing Script',
    'Pacifico',
    'Bebas Neue',
    'Raleway',
    'Quicksand',
    'Comfortaa',
    'Righteous',
    'Permanent Marker',
    'Satisfy'
];

const TextProperties = ({ canvas, onChange }) => {
    const [textProps, setTextProps] = useState({
        fontSize: 20,
        fontFamily: 'Arial',
        textAlign: 'left',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        fill: '#FFFFFFFF',
        lineHeight: 1.2
    });

    useEffect(() => {
        if (canvas) {
            const updateFromSelection = () => {
                const activeObject = canvas.getActiveObject();
                if (activeObject && activeObject.type === 'textbox') {
                    setTextProps({
                        fontSize: activeObject.fontSize,
                        fontFamily: activeObject.fontFamily,
                        textAlign: activeObject.textAlign,
                        fontWeight: activeObject.fontWeight,
                        fontStyle: activeObject.fontStyle,
                        textDecoration: activeObject.textDecoration,
                        fill: activeObject.fill
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

    const handlePropertyChange = (property, value) => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            activeObject.set(property, value);
            canvas.renderAll();
            setTextProps(prev => ({ ...prev, [property]: value }));
            if (onChange) onChange();
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-white text-sm">Fuente</label>
                <select
                    value={textProps.fontFamily}
                    onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded-lg"
                    style={{ fontFamily: textProps.fontFamily }}
                >
                    {AVAILABLE_FONTS.map(font => (
                        <option 
                            key={font} 
                            value={font}
                            style={{ fontFamily: font }}
                        >
                            {font}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-1 items-center">
                <span className="text-md w-[70px]">Size : </span>
                <input
                    type="number"
                    className="w-[70px] border border-gray-700 bg-transparent outline-none px-2 rounded-md"
                    value={textProps.fontSize}
                    onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                    min="1"
                    max="200"
                />
            </div>

            <div className="flex gap-1 items-center">
                <span className="text-md w-[70px]">Weight : </span>
                <input
                    type="number"
                    className="w-[70px] border border-gray-700 bg-transparent outline-none px-2 rounded-md"
                    value={textProps.fontWeight}
                    onChange={(e) => handlePropertyChange('fontWeight', parseInt(e.target.value))}
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
                    value={textProps.fill}
                    onChange={(e) => handlePropertyChange('fill', e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-white text-sm">Interlineado</label>
                <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={textProps.lineHeight}
                    onChange={(e) => handlePropertyChange('lineHeight', parseFloat(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                    <span>0.5</span>
                    <span>{textProps.lineHeight.toFixed(1)}</span>
                    <span>3.0</span>
                </div>
            </div>
        </div>
    );
};

export default TextProperties;