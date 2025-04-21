import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RegistrarUsuario from './pages/RegistrarUsuario.jsx'
import MapaMascota from './pages/MapaMascota.jsx'
import PruebaQR from './pages/PruebaQr.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegistrarUsuario />
  </StrictMode>,
)
