// AppRoute.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import RegistrarUsuario from '../pages/RegistrarUsuario';
import MapaMascota from '../pages/MapaMascota';
import PruebaQR from '../pages/PruebaQR';
import { PrivateRoute } from '../routes/PrivateRoute';
import Landing from '../pages/Landing.jsx';
import RegistrarMascota from '../pages/RegistrarMascota.jsx';
import Layout from '../components/Layout';
import ReportarMascota from '../pages/ReportarMascota.jsx';

export default function AppRoute() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistrarUsuario />} />
        <Route path="/pruebaQR" element={<PruebaQR />} />
        <Route path="/" element={<Landing />} />
        <Route path="/registro-mascota" element={<RegistrarMascota/>} />
        <Route path="/reportar-mascota" element={<ReportarMascota/>}/>

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
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
        </Route>
      </Routes>
    </Router>
  );
}
