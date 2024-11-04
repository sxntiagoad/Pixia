import Vacancy from '../models/vacancy.model.js';

export const createVacancy = async (req, res) => {
    try {
        const { vacancyId, title, description, requirements } = req.body;

        // Verificar si ya existe una vacante con ese ID
        const existingVacancy = await Vacancy.findOne({ vacancyId });
        if (existingVacancy) {
            return res.status(400).json({
                message: 'Ya existe una vacante con ese ID'
            });
        }

        // Crear nueva vacante
        const newVacancy = new Vacancy({
            vacancyId,
            title,
            description,
            requirements
        });

        // Guardar en la base de datos
        const savedVacancy = await newVacancy.save();

        res.status(201).json({
            message: 'Vacante creada exitosamente',
            vacancy: savedVacancy
        });

    } catch (error) {
        console.error('Error al crear vacante:', error);
        res.status(500).json({
            message: 'Error al crear la vacante',
            error: error.message
        });
    }
};

// Función adicional para obtener todas las vacantes
export const getVacancies = async (req, res) => {
    try {
        const vacancies = await Vacancy.find();
        res.json(vacancies);
    } catch (error) {
        console.error('Error al obtener vacantes:', error);
        res.status(500).json({
            message: 'Error al obtener las vacantes',
            error: error.message
        });
    }
};