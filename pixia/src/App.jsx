import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import ImageGeneratorPage from './pages/imageGeneratorPage';
import VacancyHistoryPage from './pages/PostHistoryPage';
import PostVacancie from './pages/PostVacancie';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster 
      />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/historial-vacantes" element={<VacancyHistoryPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/ImageGeneratorPage" element={<ImageGeneratorPage />} />
              <Route path="/post-vacancies" element={<PostVacancie />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App; 