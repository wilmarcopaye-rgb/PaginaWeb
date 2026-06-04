import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

function ColaboracionesAdmin() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [numeroYape, setNumeroYape] = useState("987654321");
  const [enviandoNotificacion, setEnviandoNotificacion] = useState(false);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  async function cargarSolicitudes() {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("solicitudes_colaboracion")
        .select("*")
        .order("fecha_solicitud", { ascending: false });

      if (error) {
        return;
      }

      setSolicitudes(data || []);
    } finally {
      setCargando(false);
    }
  }

  async function notificarAceptacion() {
    if (!usuarioSeleccionado) return;

    if (!numeroYape.trim()) {
      alert("Por favor completa el número Yape");
      return;
    }

    setEnviandoNotificacion(true);

    try {
      // Usar QR desde la carpeta pública
      const qrUrl = "/QR-pagos.png";

      // Crear notificación para el usuario
      const { error: notifError } = await supabase
        .from("notificaciones")
        .insert({
          usuario_id: usuarioSeleccionado.usuario_id,
          titulo: "✅ Solicitud Aceptada",
          mensaje: `Tu solicitud de ${usuarioSeleccionado.tipo_colaboracion} ha sido aceptada. Por favor realiza el pago usando el código QR o número Yape para confirmar.`,
          tipo: "colaboracion_aceptada",
          qr_url: qrUrl,
          numero_yape: numeroYape,
          leida: false,
          fecha: new Date().toISOString(),
        });

      if (notifError) {
        alert("Error al enviar notificación: " + notifError.message);
        setEnviandoNotificacion(false);
        return;
      }

      // Actualizar estado de la solicitud a "aceptada"
      const { error: updateError } = await supabase
        .from("solicitudes_colaboracion")
        .update({ estado: "aceptada" })
        .eq("id", usuarioSeleccionado.id);

      if (updateError) {
        alert("Error al actualizar solicitud");
        setEnviandoNotificacion(false);
        return;
      }

      alert("✅ Notificación enviada correctamente");
      setUsuarioSeleccionado(null);
      setNumeroYape("987654321");
      cargarSolicitudes();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setEnviandoNotificacion(false);
    }
  }

  async function rechazarSolicitud() {
    if (!usuarioSeleccionado) return;

    if (!window.confirm("¿Estás seguro de que deseas rechazar esta solicitud?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("solicitudes_colaboracion")
        .update({ estado: "rechazada" })
        .eq("id", usuarioSeleccionado.id);

      if (error) {
        alert("Error al rechazar solicitud: " + error.message);
        return;
      }

      alert("Solicitud rechazada");
      setUsuarioSeleccionado(null);
      cargarSolicitudes();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  if (cargando) {
    return (
      <>
        <AdminSidebar />
        <main style={{ marginLeft: "220px", padding: "2rem", textAlign: "center" }}>
          <p>Cargando solicitudes...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />

      <main style={{ marginLeft: "220px", padding: "2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ color: "#003087", marginBottom: "1.5rem" }}>
            🤝 Solicitudes de Colaboración
          </h1>

          {solicitudes.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                background: "white",
                borderRadius: "12px",
                textAlign: "center",
                color: "#999",
              }}
            >
              No hay solicitudes de colaboración
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {solicitudes.map((solicitud) => (
                <div
                  key={solicitud.id}
                  style={{
                    padding: "1.5rem",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderLeft:
                      solicitud.estado === "pendiente"
                        ? "4px solid #ff9800"
                        : solicitud.estado === "aceptada"
                        ? "4px solid #4caf50"
                        : "4px solid #f44336",
                  }}
                >
                  <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ margin: "0.5rem 0", color: "#003087" }}>
                      {solicitud.usuario_nombre}
                    </h3>
                    <p style={{ margin: "0.2rem 0", color: "#666" }}>
                      📧 {solicitud.usuario_email}
                    </p>
                    <p style={{ margin: "0.2rem 0", color: "#666" }}>
                      📝 Tipo: <strong>{solicitud.tipo_colaboracion}</strong>
                    </p>
                    <p style={{ margin: "0.2rem 0", color: "#666" }}>
                      📍 Estado:{" "}
                      <strong style={{ color: solicitud.estado === "pendiente" ? "#ff9800" : solicitud.estado === "aceptada" ? "#4caf50" : "#f44336" }}>
                        {solicitud.estado.toUpperCase()}
                      </strong>
                    </p>
                  </div>

                  <div
                    style={{
                      background: "#f9f9f9",
                      padding: "1rem",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                    }}
                  >
                    <p style={{ margin: 0, color: "#333" }}>
                      <strong>Descripción:</strong>
                    </p>
                    <p style={{ margin: "0.5rem 0", color: "#666", whiteSpace: "pre-wrap" }}>
                      {solicitud.descripcion}
                    </p>
                  </div>

                  <div style={{ fontSize: "0.9rem", color: "#999", marginBottom: "1rem" }}>
                    Fecha: {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                  </div>

                  {solicitud.estado === "pendiente" && (
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <button
                        onClick={() => setUsuarioSeleccionado(solicitud)}
                        style={{
                          padding: "0.6rem 1.2rem",
                          background: "#4caf50",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          flex: 1,
                        }}
                      >
                        ✅ Aceptar & Enviar QR
                      </button>
                      <button
                        onClick={() => {
                          setUsuarioSeleccionado(solicitud);
                          setTimeout(() => rechazarSolicitud(), 100);
                        }}
                        style={{
                          padding: "0.6rem 1.2rem",
                          background: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          flex: 1,
                        }}
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {usuarioSeleccionado && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
            onClick={() => setUsuarioSeleccionado(null)}
          >
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "2rem",
                maxWidth: "600px",
                width: "90%",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ color: "#003087", marginTop: 0 }}>
                Enviar Datos de Pago a {usuarioSeleccionado.usuario_nombre}
              </h2>

              <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f0f8ff", borderRadius: "8px", border: "1px solid #ddd" }}>
                <p style={{ margin: "0.5rem 0", color: "#333" }}>
                  📸 <strong>QR Yape:</strong> Se enviará automáticamente desde QR-pagos.png
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Número Yape
                </label>
                <input
                  type="text"
                  value={numeroYape}
                  onChange={(e) => setNumeroYape(e.target.value)}
                  placeholder="Ej: 987654321"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={notificarAceptacion}
                  disabled={enviandoNotificacion}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: enviandoNotificacion ? "not-allowed" : "pointer",
                    opacity: enviandoNotificacion ? 0.7 : 1,
                  }}
                >
                  {enviandoNotificacion ? "Enviando..." : "✅ Enviar Notificación"}
                </button>
                <button
                  onClick={() => setUsuarioSeleccionado(null)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#f0f0f0",
                    color: "#333",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default ColaboracionesAdmin;
