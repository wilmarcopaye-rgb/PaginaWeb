import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { esAdmin, cargando } = useContext(AuthContext);

  if (cargando) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Verificando acceso...</div>;
  }

  if (!esAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
