import { useNavigate } from "react-router-dom";

function HabitacionCard({ habitacion }) {

  const navigate = useNavigate();

  return (

    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s'
    }}>

      <img
        src={habitacion.foto_principal}
        alt={habitacion.nombre}
        style={{
          width: '100%',
          height: '250px',
          objectFit: 'cover'
        }}
      />

      <div style={{
        padding: '1rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>

        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          minHeight: '2.2rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {habitacion.nombre}
        </h3>

        <p style={{
          margin: '0.5rem 0',
          fontSize: '0.9rem',
          color: '#666',
          flex: 1,
          minHeight: '3rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {habitacion.descripcion}
        </p>

        <h4 style={{
          margin: '0.5rem 0',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#2196F3'
        }}>
          S/. {habitacion.precio}
        </h4>

        <button
          onClick={() =>
            navigate(`/habitacion/${habitacion.id}`)
          }
          style={{
            marginTop: 'auto',
            padding: '0.75rem 1rem',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1976D2'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
        >
          Ver Detalles
        </button>

      </div>

    </div>

  );
}

export default HabitacionCard;