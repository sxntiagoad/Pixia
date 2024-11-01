import Template from '../models/template.model.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Usar la ruta absoluta correcta
const FRONTEND_PATH = 'C:/Users/ricom/OneDrive/Desktop/Pixia/pixia';
const PREVIEWS_PATH = path.join(FRONTEND_PATH, 'src/assets/previews');
const TEMPLATES_PATH = path.join(FRONTEND_PATH, 'src/assets/templates');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = file.fieldname === 'preview' 
      ? PREVIEWS_PATH
      : TEMPLATES_PATH;
    
    console.log('Guardando archivo en:', dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(/\s+/g, '_');
    console.log('Nombre del archivo:', fileName);
    cb(null, fileName);
  }
});

export const upload = multer({ storage: storage });

// Obtener todas las plantillas
export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().lean();
    
    // Transformar las rutas para que sean accesibles
    const templatesWithUrls = templates.map(template => ({
      ...template,
      previewImagePath: `/assets/previews/${template.previewImagePath}`,
      baseImagePath: `/assets/templates/${template.baseImagePath}`
    }));

    console.log('Templates encontrados:', templatesWithUrls);

    res.json({
      success: true,
      templates: templatesWithUrls
    });
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Obtener una plantilla específica
export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).lean();
    
    if (!template) {
      return res.status(404).json({ 
        success: false,
        message: "Plantilla no encontrada" 
      });
    }

    // Transformar las rutas de las imágenes
    template.previewImagePath = `/assets/previews/${template.previewImagePath}`;
    template.baseImagePath = `/assets/templates/${template.baseImagePath}`;

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Error al obtener plantilla:', error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener la plantilla",
      error: error.message 
    });
  }
};

// Eliminar una plantilla
export const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Plantilla no encontrada" });
    }
    res.json({ message: "Plantilla eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una plantilla
export const createTemplate = async (req, res) => {
  try {
    console.log('Files received:', req.files); // Para debugging
    console.log('Body received:', req.body);   // Para debugging

    if (!req.files || !req.files.preview || !req.files.base) {
      return res.status(400).json({
        success: false,
        message: "Se requieren ambos archivos (preview y base)"
      });
    }

    const templateData = {
      name: req.body.name,
      previewImagePath: req.files.preview[0].filename,
      baseImagePath: req.files.base[0].filename,
      aiImageConfig: {
        dimensions: {
          width: parseInt(req.body.width),
          height: parseInt(req.body.height)
        },
        position: {
          x: parseInt(req.body.positionX),
          y: parseInt(req.body.positionY)
        },
        promptGuide: req.body.promptGuide
      },
      textFields: JSON.parse(req.body.textFields),
      category: req.body.category
    };

    const template = new Template(templateData);
    await template.save();

    res.status(201).json({
      success: true,
      message: "Plantilla creada exitosamente",
      template
    });

  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({
      success: false,
      message: "Error al crear la plantilla",
      error: error.message
    });
  }
};
