import { fileURLToPath } from 'url';
import path from 'path';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TemplateRegistry {
    constructor() {
        this.templates = new Map();
        this.initializeTemplates();
    }

    register(name, TemplateClass) {
        this.templates.set(name, TemplateClass);
    }

    get(name) {
        const TemplateClass = this.templates.get(name);
        if (!TemplateClass) {
            throw new Error(`Template '${name}' not found`);
        }
        return TemplateClass;
    }

    async initializeTemplates() {
        console.log('Iniciando registro automático de plantillas...');
        
        try {
            const templatePaths = await fg('../../controllers/templates/*.js', { cwd: __dirname });
            
            for (const path of templatePaths) {
                if (path.includes('t_') && path.endsWith('.js')) {
                    const templateName = path.split('/').pop().replace('.js', '');
                    const { default: Template } = await import(`../../controllers/templates/${templateName}.js`);
                    this.register(templateName, Template);
                }
            }
            
            console.log('Registro de plantillas completado');
        } catch (error) {
            console.error('Error al registrar plantillas:', error);
            throw error;
        }
    }
}

// Crear y exportar una única instancia
const templateRegistry = new TemplateRegistry();
export default templateRegistry;