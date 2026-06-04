import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function UsuarioMenu() {

  const { usuario, esAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleCerrarSesion() {
    await logout();
    navigate("/");
  }

  if(!usuario){

    return (
      <div className="auth-links">
        <Link to="/login">Iniciar Sesión</Link>
        <Link to="/registro">Registrarse</Link>
      </div>
    );
  }

  return (

    <div className="usuario-box">

      <Link 
        to="/mi-cuenta"
        style={{
          textDecoration: 'none',
          color: '#333',
          cursor: 'pointer',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          backgroundColor: 'white',
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#e8e8e8'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
      >
        👤 {usuario?.nombre || usuario?.correo || 'Usuario'}
      </Link>

      {esAdmin && (

        <Link
          to="/admin"
          className="admin-btn"
        >
          ⚙️ Panel Admin
        </Link>

      )}

      <button 
        onClick={handleCerrarSesion}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
      >
        Salir
      </button>

    </div>  

  );

}

export default UsuarioMenu;