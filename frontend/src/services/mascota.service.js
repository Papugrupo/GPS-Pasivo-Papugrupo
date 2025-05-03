import axiosAuth from '../api/axiosAuth'; // Para las peticiones que necesiten token
import axiosPublic from '../api/axiosPublic'; // Para las peticiones que no necesiten token

export const obtenerMascota = async (idMascota) => {
    try {
      const response = await axiosAuth.get(`/api/pet/pet-info/${idMascota}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la mascota:', error);
      throw error;
    }
  };

export const obtenerMascotaQR = async (idMascota) => {
    
    try {
        const response = await axiosPublic.get(`/api/qr/pet/${idMascota}`
        );
        return response.data;
    } catch (error) {
        console.error('Error al obtener la mascota:', error);
        throw error;
    }
}

export const registrarMascotas = async (mascotas) => {
    try {
        const response = await axiosAuth.post(`/api/pet/pet-registration`, mascotas);
        return response.data;
    } catch (error) {
        console.error('Error al guardar mascotas:', error);
        throw error;
    }
}

export const obtenerListadoMascotas = async () => {
    try {
      const response = await axiosAuth.get(`/api/pet/mis-mascotas`);
  
      return response.data.mascotas;
    } catch (error) {
      console.error('Error al obtener el listado de mascotas:', error);
      throw error;
    }
}

export const reportarMascota = async (idMascota, latitud, longitud) => {
    try {
        const response = await axiosAuth.post(
            `/api/qr/registrar-ubicacion`,
            {
                idMascota,
                latitud,
                longitud
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al reportar ubicación de la mascota:', error);
        throw error;
    }
}
