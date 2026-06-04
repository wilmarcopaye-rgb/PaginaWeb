import AdminSidebar from "../components/AdminSidebar";

function ComunicacionesAdmin() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <AdminSidebar />
      <div style={{ 
        flex: 1,
        padding: "2.5rem", 
        marginLeft: "220px",
        width: "calc(100% - 220px)",
        maxWidth: "1200px",
        margin: "0 auto",
        overflow: "auto"
      }}>
        <div style={{
          marginBottom: "2.5rem",
          paddingBottom: "1.5rem",
          borderBottom: "2px solid #e0e0e0"
        }}>
          <h1 style={{
            fontSize: "2.2rem",
            margin: "0 0 0.5rem 0",
            color: "#003087",
            fontWeight: "700"
          }}>Configuración de Comunicaciones</h1>
          <p style={{
            color: "#666",
            margin: 0,
            fontSize: "0.95rem"
          }}>Gestiona los canales de comunicación de la plataforma</p>
        </div>

        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
        }}>
          <p style={{ color: "#666" }}>
            Aquí se configurarán los canales de comunicación y notificaciones para los usuarios.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComunicacionesAdmin;