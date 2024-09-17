import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { AuthProvider } from './context/AuthContext';
import ImageGeneratorPage from './pages/imageGeneratorPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  console.log("App component is rendering");
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/imagegenerator" element={<ImageGeneratorPage />} />
          </Route>
        </Routes>  
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
