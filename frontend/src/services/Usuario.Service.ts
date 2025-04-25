import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BACKEND;

export const registrarUsuario = async (usuario: any) => {
    try {
        console.log('usuario', usuario);
        const response = await axios.post(`${API_URL}/api/auth/user-registration`, usuario, {
        headers: {
            'Content-Type': 'application/json',
        },
        });
        return response.data;
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
    }