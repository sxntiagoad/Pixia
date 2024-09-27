import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import fondoRegister from '../assets/fondo_login_register.jpg'; // Importamos la imagen

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/ImageGeneratorPage');
        }
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (values) => {
        signup(values);
    });

    return (
        <div className="min-h-screen flex">
            {/* Espacio con imagen de fondo a la izquierda */}
            <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: `url(${fondoRegister})` }}>
                {/* La imagen de fondo se muestra aquí */}
            </div>
            
            {/* Contenedor del formulario */}
            <div className='w-1/3 bg-zinc-900 flex items-center justify-end p-10'>
                <div className='bg-zinc-800 max-w-sm p-6 rounded-md'>
                <h1 className='text-white text-lg font-extrabold mb-2'>Registro</h1>
                    <form onSubmit={onSubmit}>
                    {registerErrors.map((error, i) => (
                        <div key={i} className="bg-red-500 p-2 text-white text-center my-2">
                            {error}
                        </div>
                        ))}
                        <input type="text" {...register('username', { required: true })} placeholder="Nombre de usuario" className='w-full bg-zinc-700 text-white px-3 py-2 rounded-md mb-2 text-sm' />
                        {errors.username && <p className='text-red-500 text-xs'>El nombre de usuario es requerido</p>}
                        <input type="email" {...register('email', { required: true })} placeholder="Correo electrónico" className='w-full bg-zinc-700 text-white px-3 py-2 rounded-md mb-2 text-sm' />
                        {errors.email && <p className='text-red-500 text-xs'>El correo electrónico es requerido</p>}
                        <input type="password" {...register('password', { required: true })} placeholder="Contraseña" className='w-full bg-zinc-700 text-white px-3 py-2 rounded-md mb-2 text-sm' />
                        {errors.password && <p className='text-red-500 text-xs'>La contraseña es requerida</p>}
                        <button type="submit" className='w-full bg-zinc-400 text-white px-3 py-2 rounded-md mt-2 text-sm'>Registrarse</button>
                    </form>
                    <p className="text-xs flex text-white gap-x-2 justify-center items-center mt-4">
                        ¿Ya tienes una cuenta?
                        <Link to="/login" className="text-sky-700"> Iniciar sesión </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
