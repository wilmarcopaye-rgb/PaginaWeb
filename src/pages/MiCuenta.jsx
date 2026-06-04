import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FormularioColaboracion from "../components/FormularioColaboracion";

function MiCuenta(){

  const { usuario, esAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (

    <>

      <Navbar />

      <div style={{
        maxWidth: "800px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>

        <h1 style={{
          marginTop: 0,
          color: "#333",
          borderBottom: "2px solid #2196F3",
          paddingBottom: "1rem"
        }}>Mi Perfil</h1>

        <div style={{
          marginTop: "2rem",
          padding: "1.5rem",
          backgroundColor: "white",
          borderRadius: "8px"
        }}>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#666" }}>Nombre:</label>
            <p style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>
              {usuario?.nombre || usuario?.correo || "Sin nombre"}
            </p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#666" }}>Correo:</label>
            <p style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>
              {usuario?.correo || usuario?.email || "Sin correo"}
            </p>
          </div>

          {usuario?.id && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#666" }}>ID de Usuario:</label>
              <p style={{ margin: 0, fontSize: "1rem", color: "#999", fontFamily: "monospace" }}>
                {usuario.id}
              </p>
            </div>
          )}

          {esAdmin && (
            <div style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#e3f2fd",
              borderLeft: "4px solid #2196F3",
              borderRadius: "4px"
            }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#1976D2" }}>Rol:</label>
              <p style={{ margin: 0, fontSize: "1rem", color: "#1976D2", fontWeight: "bold" }}>
                👨‍💼 Administrador
              </p>
            </div>
          )}

          {!esAdmin && (
            <div style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f3e5f5",
              borderLeft: "4px solid #9c27b0",
              borderRadius: "4px"
            }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#6a1b9a" }}>Rol:</label>
              <p style={{ margin: 0, fontSize: "1rem", color: "#6a1b9a" }}>
                👤 Usuario Regular
              </p>
            </div>
          )}

        </div>

        <div style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => setMostrarFormulario(true)}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#003087",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#002268"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#003087"}
          >
            📞 Contáctanos con nosotros
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#d32f2f"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#f44336"}
          >
            Cerrar Sesión
          </button>
        </div>

        {mostrarFormulario && (
          <FormularioColaboracion onClose={() => setMostrarFormulario(false)} />
        )}

      </div>

      <Footer />

    </>

  );

}

export default MiCuenta;