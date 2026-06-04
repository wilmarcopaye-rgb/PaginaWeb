import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside style={{
      position: "fixed",
      left: 0,
      top: 0,
      width: "220px",
      height: "100vh",
      backgroundColor: "#003d99",
      color: "white",
      padding: "1.5rem 0",
      display: "flex",
      flexDirection: "column",
      boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
      zIndex: 100
    }}>
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "1.5rem",
          cursor: "pointer",
          textDecoration: "none",
          color: "white",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <img
          src="/logo-vivoo.png"
          alt="VIVOO"
          style={{
            width: "32px",
            height: "32px"
          }}
        />
        <span style={{
          fontSize: "1.2rem",
          fontWeight: "bold"
        }}>VIVOO</span>
      </Link>

      {/* Separador */}
      <hr style={{
        border: "none",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        margin: "0.5rem 0"
      }} />

      {/* Navegación */}
      <nav style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0
      }}>
        <Link
          to="/admin"
          style={{
            padding: "1rem 1.5rem",
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            transition: "background-color 0.2s",
            fontSize: "0.95rem"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/admin/habitaciones"
          style={{
            padding: "1rem 1.5rem",
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            transition: "background-color 0.2s",
            fontSize: "0.95rem"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          🏠 Anuncios
        </Link>

        <Link
          to="/admin/comentarios"
          style={{
            padding: "1rem 1.5rem",
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            transition: "background-color 0.2s",
            fontSize: "0.95rem"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          💬 Comentarios
        </Link>

        <Link
          to="/admin/usuarios"
          style={{
            padding: "1rem 1.5rem",
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            transition: "background-color 0.2s",
            fontSize: "0.95rem"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          👥 Usuarios
        </Link>

        <Link
          to="/admin/colaboraciones"
          style={{
            padding: "1rem 1.5rem",
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            transition: "background-color 0.2s",
            fontSize: "0.95rem"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          🤝 Colaboraciones
        </Link>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
