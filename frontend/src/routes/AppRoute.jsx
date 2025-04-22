// AppRoute.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import RegistrarUsuario from '../pages/RegistrarUsuario';
import MapaMascota from '../pages/MapaMascota';
import PruebaQR from '../pages/PruebaQR';
import { PrivateRoute } from '../routes/PrivateRoute';
import Landing from '../pages/Landing.jsx';
import RegistrarMascota from '../pages/RegistrarMascota.jsx';

export default function AppRoute() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistrarUsuario />} />
        <Route path="/pruebaQR" element={<PruebaQR />} />
        <Route path="/" element={<Landing />} />
        <Route path="/registro-mascota" element={<RegistrarMascota/>} />

        {/* Rutas protegidas */}
        <Route
          path="/mapa"
          element={
            <PrivateRoute>
              <MapaMascota />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro-mascota"
          element={
            <PrivateRoute>
              <RegistrarMascota />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MapaMascota />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
