import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, isAuthenticated, errors: signinErrors = [] } = useAuth(); // Asegurarse que signinErrors sea un array
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ImageGeneratorPage');
    }
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (data) => {
    signin(data);
  });

  return (
    <div className="min-h-screen flex">
      {/* Espacio en negro a la izquierda */}
      <div className="w-2/3 bg-black">
        {/* El espacio vacío queda negro */}
      </div>

      {/* Contenedor del formulario */}
      <div className='w-1/3 bg-zinc-900 flex items-center justify-end p-10'>
        <div className='bg-zinc-800 max-w-sm p-6 rounded-md'>
          <h1 className='text-white text-lg font-extrabold mb-2'>Login</h1> {/* Título de Login ajustado */}
          <form onSubmit={onSubmit}>
            {/* Mostrar errores de inicio de sesión si existen */}
            {signinErrors.length > 0 && signinErrors.map((error, i) => (
              <div key={i} className="bg-red-500 p-2 text-white text-center my-2">
                {error}
              </div>
            ))}
            {/* Input para el email */}
            <input 
              type="email" 
              {...register('email', { required: true })} 
              placeholder="Email" 
              className='w-full bg-zinc-700 text-white px-3 py-2 rounded-md mb-2 text-sm' 
            />
            {errors.email && <p className='text-red-500 text-xs'>Email is required</p>}

            {/* Input para el password */}
            <input 
              type="password" 
              {...register('password', { required: true })} 
              placeholder="Password" 
              className='w-full bg-zinc-700 text-white px-3 py-2 rounded-md mb-2 text-sm' 
            />
            {errors.password && <p className='text-red-500 text-xs'>Password is required</p>}

            {/* Botón de login */}
            <button 
              type="submit" 
              className='w-full bg-zinc-400 text-white px-3 py-2 rounded-md mt-2 text-sm'>
              Login
            </button>
          </form>
          <p className="text-xs text-white flex gap-x-2 justify-center items-center mt-4"> {/* Clase para disminuir el tamaño del texto */}
            Don't have an account? 
            <Link to="/register" className="text-sky-700"> Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
