import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; // O algún spinner de carga
  }

  return user ? children : <Navigate to="/" replace />;
}