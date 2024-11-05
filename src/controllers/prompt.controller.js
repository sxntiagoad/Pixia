import axios from 'axios';
import { API_KEY } from '../config.js';

const CLAUDE_URL = "https://api.segmind.com/v1/claude-3-haiku";

const improvePrompt = async (userPrompt) => {
  const data = {
    model: "claude-3-haiku",
    max_tokens: 300,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: `Mejora este prompt para generar una imagen: "${userPrompt}"

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
           - Ambiente y contexto
           
        Ejemplo de formato de respuesta:
        professional female software engineer, modern corporate office, rembrandt lighting setup, ultra realistic 8k photograph, 85mm portrait lens, rule of thirds composition, natural skin texture and facial features, navy business suit, sitting at ergonomic desk, multiple curved monitors, late afternoon sunlight through windows, shallow depth of field, professional color grading`
      }
    ]
  };

  try {
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
    throw new Error('Error al procesar el prompt con IA');
  }
};

const generateVacancyPrompt = async (title, description, requirements) => {
  const basePrompt = `Create a professional corporate image for a job vacancy with the following details:
    Position: ${title}
    Job Description: ${description}
    Requirements: ${requirements}
    
    The image should show a professional person representing this role in their work environment, 
    highlighting the professional nature of the position and the workplace setting.`;

  try {
    const improvedPrompt = await improvePrompt(basePrompt);
    return improvedPrompt;
  } catch (error) {
    console.error('Error generando prompt de vacante:', error);
    throw error;
  }
};

const generateVacancyTexts = async (title, description, requirements) => {
  const data = {
    model: "claude-3-haiku",
    max_tokens: 300,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: `Generate a compelling job posting title and two brief texts based on these job details:

        Original Title: ${title}
        Description: ${description}
        Requirements: ${requirements}

        Rules:
        1. Generate these 3 elements:
           - An attention-grabbing job title (max 50 characters)
           - A brief, engaging description text (max 100 characters)
           - A concise requirements text (max 100 characters)
        2. The texts should be professional but engaging
        3. Use clear, direct language
        4. Focus on the most important aspects
        5. Make it attractive for potential candidates
        6. Return only the three elements in this format:
           TITLE: [generated title]
           TEXT1: [generated description]
           TEXT2: [generated requirements]`
      }
    ]
  };

  try {
    const response = await axios.post(CLAUDE_URL, data, {
      headers: { 
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.data?.content?.[0]?.text) {
      const text = response.data.content[0].text;
      
      // Extraer los tres elementos usando regex
      const titleMatch = text.match(/TITLE:\s*(.+)/);
      const text1Match = text.match(/TEXT1:\s*(.+)/);
      const text2Match = text.match(/TEXT2:\s*(.+)/);

      return {
        title: titleMatch ? titleMatch[1].trim() : '',
        text1: text1Match ? text1Match[1].trim() : '',
        text2: text2Match ? text2Match[1].trim() : ''
      };
    }

    throw new Error('Formato de respuesta no reconocido');
    
  } catch (error) {
    console.error('Error al generar textos de la vacante:', error);
    throw error;
  }
};

export const processPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es requerido' });
    }

    const improvedPrompt = await improvePrompt(prompt);
    
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

export const processVacancyPrompt = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;
    
    if (!title || !description || !requirements) {
      return res.status(400).json({ 
        error: 'Se requieren título, descripción y requisitos' 
      });
    }

    const generatedPrompt = await generateVacancyPrompt(
      title,
      description,
      requirements
    );
    
    res.json({ 
      prompt: generatedPrompt,
      vacancyData: {
        title,
        description,
        requirements
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al generar el prompt de la vacante', 
      details: error.message 
    });
  }
};

export const processVacancyTexts = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;
    
    if (!title || !description || !requirements) {
      return res.status(400).json({ 
        error: 'Se requieren título, descripción y requisitos originales' 
      });
    }

    const generatedTexts = await generateVacancyTexts(
      title,
      description,
      requirements
    );
    
    res.json({ 
      generatedTexts,
      originalData: {
        title,
        description,
        requirements
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al generar los textos de la vacante', 
      details: error.message 
    });
  }
};

export { improvePrompt, generateVacancyPrompt, generateVacancyTexts };
