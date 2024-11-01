import mongoose from "mongoose";
import path from "path";

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Imagen de preview para mostrar al usuario
  previewImagePath: {
    type: String,
    required: true,
    get: function(filePath) {
      return `/src/assets/previews/${filePath}`;
    }
  },
  // Imagen base que será editada
  baseImagePath: {
    type: String,
    required: true,
    get: function(filePath) {
      return `/src/assets/templates/${filePath}`;
    }
  },
  // Configuración para la imagen AI
  aiImageConfig: {
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    },
    promptGuide: { type: String, required: true } // Guía para orientar la generación de la imagen
  },
  // Configuración para los textos
  textFields: [{
    name: { type: String, required: true }, // Identificador del campo de texto
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    },
    style: {
      fontSize: { type: Number, required: true },
      fontFamily: { type: String, required: true },
      color: { type: String, required: true },
      maxWidth: { type: Number, required: true }
    }
  }],
  // Categoría de la plantilla (opcional)
  category: {
    type: String,
    enum: ['social', 'marketing', 'personal', 'otros'],
    default: 'otros'
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export default mongoose.model("Template", templateSchema);



