import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './index.css';
import Login from './pages/Login';
import RegistrarUsuario from './pages/RegistrarUsuario';
import MapaMascota from './pages/MapaMascota';
import PruebaQR from './pages/PruebaQr.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PrivateRoute } from './routes/PrivateRoute';
import Landing from './pages/Landing.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistrarUsuario />} />
          <Route path="/" element={<Landing />} />
          
          {/* Rutas protegidas */}
          <Route path="/mapa" element={
            <PrivateRoute>
              <MapaMascota />
            </PrivateRoute>
          } />
          
          <Route path="/" element={
            <PrivateRoute>
              <MapaMascota />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);