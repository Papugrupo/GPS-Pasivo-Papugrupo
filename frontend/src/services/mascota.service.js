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

export const registrarMascotas = async (mascotas) => {
    try {
        console.log('mascotas', mascotas);
        const token = Cookies.get('token');
        const response = await axios.post(`${API_URL}/api/pet/pet-registration`, mascotas, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        return response.data;
    } catch (error) {
        console.error('Error al guardar mascotas:', error);
        throw error;
    }
}
