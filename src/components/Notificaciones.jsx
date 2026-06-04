import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";

function Notificaciones() {
  const { usuario } = useContext(AuthContext);
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuario?.id) {
      cargarNotificaciones();
      // Recargar cada 30 segundos
      const intervalo = setInterval(cargarNotificaciones, 30000);
      return () => clearInterval(intervalo);
    }
  }, [usuario?.id]);

  async function cargarNotificaciones() {
    if (!usuario?.id) return;
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("notificaciones")
        .select("*")
        .eq("usuario_id", usuario.id)
        .order("fecha", { ascending: false });

      // Silently handle if table doesn't exist yet
      if (error?.code === 'PGRST116' || error?.message?.includes('not found')) {
        setNotificaciones([]);
        return;
      }

      if (error) {
        return;
      }

      setNotificaciones(data || []);
    } catch (err) {
      // Silently fail if table doesn't exist
      setNotificaciones([]);
    } finally {
      setCargando(false);
    }
  }

  async function marcarComoLeida(notificacionId) {
    try {
      const { error } = await supabase
        .from("notificaciones")
        .update({ leida: true })
        .eq("id", notificacionId);

      if (!error) {
        cargarNotificaciones();
      }
    } catch (err) {
    }
  }

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  if (!usuario) {
    return null;
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setMostrarDropdown(!mostrarDropdown)}
        style={{
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          position: "relative",
          padding: "0.5rem",
        }}
        title="Notificaciones"
      >
        🔔
        {noLeidas > 0 && (
          <span
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              background: "#ff4444",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            {noLeidas}
          </span>
        )}
      </button>

      {mostrarDropdown && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "0",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            minWidth: "350px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {notificaciones.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>
              No tienes notificaciones
            </div>
          ) : (
            notificaciones.map((notif) => (
              <div
                key={notif.id}
                onClick={() => marcarComoLeida(notif.id)}
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #eee",
                  backgroundColor: notif.leida ? "white" : "#f0f8ff",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notif.leida
                    ? "white"
                    : "#f0f8ff";
                }}
              >
                <div style={{ fontWeight: notif.leida ? "normal" : "bold" }}>
                  {notif.titulo}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                  {notif.mensaje}
                </div>
                {notif.tipo === "colaboracion_aceptada" && notif.qr_url && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <img
                      src={notif.qr_url}
                      alt="QR Pago"
                      style={{ maxWidth: "150px", maxHeight: "150px" }}
                    />
                    <p style={{ fontSize: "0.8rem", color: "#003087", marginTop: "0.3rem" }}>
                      Paga con Yape usando el QR o número adjunto
                    </p>
                  </div>
                )}
                <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem" }}>
                  {new Date(notif.fecha).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notificaciones;
