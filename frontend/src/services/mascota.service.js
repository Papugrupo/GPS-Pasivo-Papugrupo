import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_BACKEND;
const token = Cookies.get('token');

export const obtenerMascota = async (idMascota) => {
    try {
        const response = await axios.get(`${API_URL}/api/pet/${idMascota}`, {
            headers: {        
                'Authorization': `Bearer ${token}`,                                                                                           
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener la mascota:', error);
        throw error;
    }
}

export const reportarMascota = async (idMascota, latitud, longitud) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/pet/registrar-ubicacion`,
            {
                idMascota,
                latitud,
                longitud
            },
            {
                headers: {        
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al reportar ubicación de la mascota:', error);
        throw error;
    }
}
