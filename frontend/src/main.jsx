import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './index.css';
import Login from './pages/LogIn';
import RegistrarUsuario from './pages/RegistrarUsuario';
import MapaMascota from './pages/MapaMascota';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> {/* Envuelve todo con <Router> */}
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/registro" element={<RegistrarUsuario />} />
        <Route path="/mapa" element={<MapaMascota />} />  
      </Routes>
    </Router>
  </StrictMode>
);