import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageGeneratorPage from './pages/ImageGeneratorPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageGeneratorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
