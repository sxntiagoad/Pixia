import { useState, useEffect } from 'react';
import { getTemplatesApi } from '../api/template';

export function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await getTemplatesApi();
      console.log('Templates response:', response.data); // Para debugging

      if (response.data.success) {
        setTemplates(response.data.templates);
      } else {
        setError(response.data.message || 'Error al cargar las plantillas');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setError(error.response?.data?.message || 'Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando plantillas...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!templates?.length) return <div>No hay plantillas disponibles</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div key={template._id} className="border rounded-lg p-4">
          <h3 className="text-lg font-bold">{template.name}</h3>
          {template.previewImagePath && (
            <img 
              src={template.previewImagePath} 
              alt={template.name}
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
                console.error('Error loading image:', template.previewImagePath);
                e.target.src = '/placeholder.png';
              }}
            />
          )}
          <p className="mt-2">Categoría: {template.category}</p>
        </div>
      ))}
    </div>
  );
}