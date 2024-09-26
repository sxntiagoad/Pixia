import { createContext, useState, useContext, useEffect } from 'react';
import { registerRequest, loginRequest } from '../api/auth';
import axios from 'axios';
import Cookie from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);   

    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response.data);
        }
    }

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            if(Array.isArray(error.response.data)){
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const logout = async () => {
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
            setUser(null);
            setIsAuthenticated(false);
            Cookie.remove('token');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get('/api/profile', { withCredentials: true });
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        const token = Cookie.get('token');
        if (token) {
            fetchUserProfile();
        }
    }, []);

    useEffect(() => {
        if(errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 4500);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <AuthContext.Provider value={{
            signup,
            signin, // Añadir signin al contexto
            logout, // Añadimos logout al contexto
            user,
            isAuthenticated,
            errors
        }}>
            {children}
        </AuthContext.Provider>
    )
}
