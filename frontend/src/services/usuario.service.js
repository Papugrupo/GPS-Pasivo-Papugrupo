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
        console.log(token)
        return response.data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
}

export const obtenerUsuario = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/${email}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        throw error;
    }
}

export const actualizarUsuario = async (usuario) => {
    try {
        const response = await axios.put(`${API_URL}/api/users/${usuario.email}`, usuario, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
}