import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import loginBackground from '../assets/loginbackground.jpg';
import pixiaLogo from '../assets/pixia.png'; 
import { FaArrowLeft } from 'react-icons/fa'; 


function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, isAuthenticated, errors: signinErrors = [] } = useAuth();
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
    <div className="min-h-screen flex relative">
      {/* Botón de volver al inicio */}
      <Link 
                to="/" 
                className="absolute top-4 right-4 flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
                <FaArrowLeft className="mr-2" />
                Volver al inicio
            </Link>
      {/* Fondo con imagen y logo */}
      <div 
        className="w-2/3 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        <img src={pixiaLogo} alt="Pixia Logo" className="w-1/4 max-w-56" />
      </div>

      {/* Contenedor del formulario */}
      <div className='w-1/3 bg-zinc-900 flex items-center justify-center'>
        <div className='bg-zinc-800 w-full max-w-md p-8 rounded-md'>
          <h1 className='text-white text-2xl font-extrabold mb-6'>Login</h1>
          <form onSubmit={onSubmit}>
            {signinErrors.length > 0 && signinErrors.map((error, i) => (
              <div key={i} className="bg-red-500 p-2 text-white text-center my-2">
                {error}
              </div>
            ))}
            <input 
              type="email" 
              {...register('email', { required: true })} 
              placeholder="Email" 
              className='w-full bg-zinc-700 text-white px-3 py-2 rounded-md mb-2 text-sm' 
            />
            {errors.email && <p className='text-red-500 text-xs'>Email is required</p>}

            <input 
              type="password" 
              {...register('password', { required: true })} 
              placeholder="Password" 
              className='w-full bg-zinc-700 text-white px-3 py-2 rounded-md mb-2 text-sm' 
            />
            {errors.password && <p className='text-red-500 text-xs'>Password is required</p>}

            <button 
              type="submit" 
              className='w-full bg-zinc-400 text-white px-3 py-2 rounded-md mt-2 text-sm'>
              Login
            </button>
          </form>
          <p className="text-sm text-white flex gap-x-2 justify-center items-center mt-6">
            Don't have an account? 
            <Link to="/register" className="text-green-500 hover:text-green-500"> Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
