import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedUserRoute({ children }) {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedUserRoute;
