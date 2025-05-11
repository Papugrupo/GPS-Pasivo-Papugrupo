import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Para manejar el estado de carga inicial

  // Verificar si hay sesión al cargar
  useEffect(() => {
    // Verificar el token al cargar la aplicación
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí podrías también verificar la validez del token con una petición al backend
      // Por ahora asumimos que si hay token, el usuario está autenticado
      setUser({ email: localStorage.getItem('userEmail') || 'usuario' });
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Guardar email en localStorage si está disponible
    if (userData?.email) {
      localStorage.setItem('userEmail', userData.email);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}