import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FloatingChat() {
  const { usuario, esAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mostrarMenu, setMostrarMenu] = useState(false);

  function handleClick() {
    if (!usuario) {
      alert("Por favor inicia sesión para acceder a atención al cliente");
      return;
    }

    if (esAdmin) {
      navigate("/admin/atencion-al-cliente");
    } else {
      navigate("/chat-soporte");
    }
    setMostrarMenu(false);
  }

  return (
    <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 999 }}>
      {mostrarMenu && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: 0,
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            padding: "1rem",
            minWidth: "250px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#003087" }}>Atención al Cliente</h3>
          <p style={{ margin: "0.5rem 0", color: "#666", fontSize: "0.9rem" }}>
            {esAdmin ? "Gestionar chats de soporte" : "Habla con nuestro equipo de soporte"}
          </p>
          <button
            onClick={handleClick}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#003087",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              marginTop: "0.5rem",
            }}
          >
            {esAdmin ? "Ir al Panel" : "Iniciar Chat"}
          </button>
        </div>
      )}

      <button
        onClick={() => setMostrarMenu(!mostrarMenu)}
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "white",
          border: "3px solid #003087",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.2s",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      >
        <img
          src="/logo-vivoo.png"
          alt="Chat"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "contain",
          }}
        />
      </button>
    </div>
  );
}

export default FloatingChat;
