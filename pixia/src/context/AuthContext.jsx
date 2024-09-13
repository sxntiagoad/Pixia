import { createContext, useState, useContext, useEffect } from 'react';
import { registerRequest, loginRequest } from '../api/auth'; // Asegúrate de tener loginRequest
import { set } from 'mongoose';

export const AuthContext = createContext();  // Se crea el contexto
export const useAuth = () => {
    const context = useContext(AuthContext); // Obtener el contexto
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; // Se crea el hook para usar el contexto

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);   

    const signup = async (user) => {
        try {
            const res = await registerRequest(user)
            console.log(res.data)
            setUser(res.data)
            setIsAuthenticated(true)
        } catch (error) {
            setErrors(error.response.data)
        }
    }

    const signin = async (user) => {
        try {
            const res = await loginRequest(user)
            console.log(res.data)
            setUser(res.data)
            setIsAuthenticated(true)
        } catch (error) {
            if(Array.isArray(error.response.data)) {
                return setErrors(error.response.data)
            }
            setErrors([error.response.data.message])
        }
    }

    useEffect(() => {
        if(errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 4500)
            return () => clearTimeout(timer)
        }
    }, [errors])
    return (
        <AuthContext.Provider value={{
            signup,
            signin, // Añadir signin al contexto
            user,
            isAuthenticated,
            errors
        }}>
            {children}
        </AuthContext.Provider>
    )
}
