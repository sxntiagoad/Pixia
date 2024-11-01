import axios from 'axios';
import { API_KEY } from '../config.js';
import Template from '../models/template.model.js';

const CLAUDE_URL = "https://api.segmind.com/v1/claude-3-haiku";

const improvePrompt = async (userPrompt, templateId) => {
  try {
    // Obtener la plantilla
    const template = await Template.findById(templateId);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    const { composition, promptGuide } = template.aiImageConfig;
    
    const data = {
      model: "claude-3-haiku",
      max_tokens: 300,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `Mejora este prompt para generar una imagen: "${userPrompt}"

          Instrucciones específicas de composición:
          - Posición del sujeto: ${composition.subjectPosition}
          - Tipo de sujeto: ${composition.subjectType}
          - Perspectiva: ${composition.perspective}
          - Tipo de recorte: ${composition.cropType}
          - Fondo: ${composition.background}
          
          Guía adicional de la plantilla:
          ${promptGuide}

          Reglas:
          1. El prompt debe estar en inglés y usar términos técnicos fotográficos precisos
          2. Incluye detalles específicos sobre:
             - Estilo artístico (photorealistic, cinematic, editorial, etc)
             - Iluminación (rembrandt lighting, soft diffused light, golden hour, etc) 
             - Composición (rule of thirds, centered composition, etc)
             - Lente y ángulo de cámara (wide angle, portrait lens, eye level, etc)
          3. Mantén el prompt conciso pero altamente descriptivo usando palabras clave
          4. No uses comillas, caracteres especiales ni paréntesis
          5. No des explicaciones, solo devuelve el prompt mejorado
          6. Enfócate en generar personas humanas hiperrealistas:
             - Rasgos faciales detallados y naturales
             - Expresiones y poses auténticas
             - Ropa y accesorios realistas
             - Texturas de piel y cabello fotorrealistas
          7. La imagen debe ser completamente realista:
             - Anatomía humana precisa
             - Entornos y objetos del mundo real
             - Iluminación y sombras naturales
             - Sin elementos fantásticos o surreales
          8. Especifica siempre:
             - Calidad de imagen (8k, ultra HD, etc)
             - Tipo de fotografía (portrait, full body, etc)
             - Ambiente y contexto`
        }
      ]
    };

    const response = await axios.post(CLAUDE_URL, data, {
      headers: { 
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.data?.content?.[0]?.text) {
      return response.data.content[0].text.trim();
    }

    throw new Error('Formato de respuesta no reconocido');
    
  } catch (error) {
    console.error('Error al mejorar el prompt:', error.message);
    throw error;
  }
};

export const processPrompt = async (req, res) => {
  try {
    const { prompt, templateId } = req.body;
    
    if (!prompt || !templateId) {
      return res.status(400).json({ 
        error: 'El prompt y el ID de la plantilla son requeridos' 
      });
    }

    const improvedPrompt = await improvePrompt(prompt, templateId);
    
    if (!improvedPrompt) {
      throw new Error('No se pudo generar un prompt mejorado');
    }
    
    res.json({ improvedPrompt });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al procesar el prompt', 
      details: error.message 
    });
  }
};
