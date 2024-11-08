import React, { useState } from 'react';
import { FaDownload, FaCheck, FaCopy } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImagePreview = ({ imageUrl, format = 'NORMAL_POST', isFinalStep = false }) => {
  const [copied, setCopied] = useState(false);

  const getImageClasses = () => {
    const baseClasses = "mx-auto rounded-lg shadow-lg border-2 border-gray-700";
    return format === 'STORIES_POST' ? `${baseClasses} max-h-[600px] w-auto` : `${baseClasses} max-w-full h-auto`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      toast.success('URL copiada al portapapeles', {
        icon: '📋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Error al copiar URL');
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = imageUrl.split('/').pop();
      const response = await axios({
        url: `/api/images/download/${fileName}`,
        method: 'GET',
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `imagen_${Date.now()}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
    }
  };

  return imageUrl ? (
    <div className="mt-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl text-gray-200 font-semibold">
          {isFinalStep ? "Imagen Final" : "Vista Previa"}
        </h2>
        {isFinalStep && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <FaCheck size={14} />
              <span className="text-sm font-medium">Final</span>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
            >
              <FaDownload size={14} />
              <span className="text-sm font-medium">Descargar Imagen</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative bg-gray-900 p-4 rounded-xl w-full">
        <img 
          src={imageUrl} 
          alt={isFinalStep ? "Imagen Final" : "Vista Previa"}
          className={getImageClasses()}
          style={{
            objectFit: 'contain',
            maxHeight: format === 'STORIES_POST' ? '600px' : 'auto'
          }}
        />
      </div>

      {/* Sección de URL - Solo se muestra si es el paso final */}
      {isFinalStep && (
        <div className="mt-6 w-full animate-fade-up">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-200 font-medium">URL de la imagen</h3>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {copied ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <FaCopy className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {copied ? 'Copiado' : 'Copiar'}
                </span>
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg bg-gray-900/50 p-3">
              <p className="whitespace-nowrap font-mono text-sm text-gray-300">
                {imageUrl}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default ImagePreview;
