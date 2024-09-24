import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/landingPage';
import { AuthProvider } from './context/AuthContext';
import ImageGeneratorPage from './pages/ImageGeneratorPage';

function App() {
  console.log("App component is rendering");
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={ <LoginPage/> } />
          <Route path="/register" element={ <RegisterPage/> } />
          <Route path='/' element={ <LandingPage/> }/>
          <Route path="/ImageGeneratorPage" element={<ImageGeneratorPage />} />
        </Routes>  
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
