import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";

function FormularioColaboracion({ onClose }) {
  const { usuario } = useContext(AuthContext);
  const [tipo, setTipo] = useState("arrendador");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!descripcion.trim()) {
      alert("Por favor completa la descripción");
      return;
    }

    setEnviando(true);

    try {
      const { error } = await supabase.from("solicitudes_colaboracion").insert({
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre || usuario.correo,
        usuario_email: usuario.correo,
        tipo_colaboracion: tipo,
        descripcion: descripcion.trim(),
        estado: "pendiente",
        fecha_solicitud: new Date().toISOString(),
      });

      if (error) {
        alert("Error al enviar solicitud: " + error.message);
        setEnviando(false);
        return;
      }

      alert("✅ Solicitud enviada correctamente. Pronto nos pondremos en contacto.");
      setDescripcion("");
      setTipo("arrendador");
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: "1rem", color: "#003087" }}>Contacta con nosotros</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Tipo de colaboración
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            >
              <option value="arrendador">Ser Arrendador</option>
              <option value="socio">Ser Socio</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Descripción de tu solicitud
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cuéntanos más sobre tu interés en colaborar con VIVOO..."
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                minHeight: "120px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              disabled={enviando}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "#003087",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: enviando ? "not-allowed" : "pointer",
                opacity: enviando ? 0.7 : 1,
              }}
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "#f0f0f0",
                color: "#333",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioColaboracion;
