export const TRABAJO_KEYWORDS = {
    // Roles y posiciones
    roles: [
      'gerente', 'director', 'analista', 'desarrollador', 'programador', 
      'diseñador', 'contador', 'administrador', 'supervisor', 'líder', 
      'consultor', 'especialista', 'coordinador', 'asistente', 'técnico', 
      'ingeniero', 'arquitecto', 'vendedor', 'manager', 'developer',
      'profesional', 'ejecutivo', 'empleado', 'trabajador', 'staff', 'auxiliar',
      'oficial', 'operador', 'instructor', 'analista', 'representante', 'asesor',
      'auditor', 'abogado', 'médico', 'enfermero', 'farmacéutico', 'químico',
      'fisioterapeuta', 'electricista', 'plomero', 'mecánico', 'chofer', 'recepcionista',
      'agente', 'investigador', 'asistente de ventas', 'cajero', 'mesero', 'chef',
      'consultor de TI', 'gerente de proyectos', 'jefe de operaciones', 'empleado de almacén',
    ],
  
    // Lugares de trabajo
    lugares: [
      'oficina', 'empresa', 'corporativo', 'compañía', 'organización', 
      'startup', 'corporación', 'negocio', 'workplace', 'coworking',
      'edificio', 'sucursal', 'sede', 'instalaciones', 'planta', 
      'fábrica', 'taller', 'laboratorio', 'estudio', 'agencia', 
      'consultorio', 'hospital', 'clínica', 'restaurante', 'cafetería',
      'hotel', 'hostal', 'residencia', 'aeropuerto', 'puerto', 'almacén',
      'supermercado', 'tienda', 'comercio', 'escuela', 'universidad', 
      'centro de investigación', 'parque empresarial', 'institución', 'entidad'
    ],
  
    // Conceptos laborales
    conceptos: [
      'trabajo', 'empleo', 'profesional', 'laboral', 'carrera', 
      'ocupación', 'puesto', 'vacante', 'posición', 'job', 'career', 
      'business', 'corporate', 'recursos humanos', 'rrhh', 'hr', 
      'recruitment', 'entrevista', 'contratación', 'selección',
      'experiencia', 'curriculum', 'cv', 'profesión', 'ocupación', 
      'ventas', 'comercial', 'emprendimiento', 'liderazgo', 'salario',
      'sueldo', 'prestaciones', 'bono', 'beneficios', 'compensación', 
      'jornada laboral', 'horario', 'contrato', 'renovación', 'despido', 
      'evaluación', 'promoción', 'ascenso', 'desarrollo profesional',
      'capacitación', 'formación', 'hábil', 'productividad', 'rendimiento',
    ],
  
    // Ambientes laborales
    ambientes: [
      'reunión', 'meeting', 'presentación', 'conferencia', 'escritorio', 
      'desk', 'computadora', 'laptop', 'team', 'equipo', 'grupo',
      'colaboración', 'proyecto', 'sala de juntas', 'boardroom',
      'espacio de trabajo', 'workstation', 'cubículo', 'recepción',
      'oficina remota', 'teletrabajo', 'home office', 'trabajo en campo',
      'sitio de construcción', 'espacio coworking', 'entorno colaborativo', 
      'videollamada', 'conferencia virtual', 'ambiente empresarial'
    ],
  
    // Acciones laborales
    acciones: [
      'trabajando', 'colaborando', 'presentando', 'analizando', 
      'desarrollando', 'programando', 'diseñando', 'gestionando',
      'supervisando', 'liderando', 'coordinando', 'planificando',
      'organizando', 'dirigiendo', 'administrando', 'capacitando',
      'consultando', 'negociando', 'contratando', 'evaluando', 
      'formando', 'despachando', 'distribuyendo', 'atendiendo',
      'resolviendo', 'asesorando', 'investigando', 'apoyando', 
      'inspeccionando', 'fabricando', 'montando', 'vendiendo', 
      'cotizando', 'asistiendo', 'gesticulando', 'redactando',
      'comunicando', 'estrategizando', 'analizando datos', 'optimizando'
    ]
  };
  
// Función helper para obtener todas las palabras en un solo array
export const getAllKeywords = () => {
  return Object.values(TRABAJO_KEYWORDS).flat();
};

// Función para validar si un prompt está relacionado con trabajo
export const isWorkRelatedPrompt = (prompt) => {
  const promptLower = prompt.toLowerCase();
  return getAllKeywords().some(keyword => promptLower.includes(keyword.toLowerCase()));
};
