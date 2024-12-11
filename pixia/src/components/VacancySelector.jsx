import React, { useEffect, useState } from 'react';
import { getVacanciesApi } from '../api/vacancy';

const VacancySelector = ({ onSelect }) => {
    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const data = await getVacanciesApi();
                setVacancies(data);
            } catch (error) {
                console.error('Error al obtener vacantes:', error);
            }
        };

        fetchVacancies();
    }, []);

    return (
        <div>
            <h2>Selecciona una Vacante</h2>
            <select onChange={(e) => onSelect(vacancies[e.target.value])}>
                <option value="">-- Selecciona una vacante --</option>
                {vacancies.map((vacancy, index) => (
                    <option key={vacancy.vacancyId} value={index}>
                        {vacancy.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default VacancySelector;
