import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { AuthProvider } from './context/AuthContext';
import ImageGeneratorPage from './pages/imageGeneratorPage';

function App() {
  console.log("App component is rendering");
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={ <LoginPage/> } />
          <Route path="/register" element={ <RegisterPage/> } />
          <Route path='/mainpage' element={ <MainPage/> }/>
          <Route path="/" element={<ImageGeneratorPage />} />
        </Routes>  
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
