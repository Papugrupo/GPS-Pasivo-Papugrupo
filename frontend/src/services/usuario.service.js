import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_BACKEND;
const token = Cookies.get('token');

export const registrarUsuario = async (usuario) => {
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

export const loginUsuario = async (usuario) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, usuario, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const token = response.data.token;
        Cookies.set('token', token, { expires: 1 });
        return response.data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
}