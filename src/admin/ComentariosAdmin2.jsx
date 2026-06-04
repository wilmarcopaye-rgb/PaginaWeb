import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Link } from "react-router-dom";

function ComentariosAdmin() {

  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroHabitacion, setFiltroHabitacion] = useState("");
  const [habitaciones, setHabitaciones] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, [filtroHabitacion]);

  async function cargarDatos() {
    try {
      setCargando(true);
      
      // Cargar habitaciones
      const { data: habitacionesData, error: habError } = await supabase
        .from("habitaciones")
        .select("id, nombre")
        .order("nombre");

      if (habError) {
        console.error("Error cargando habitaciones:", habError);
      }

      setHabitaciones(habitacionesData || []);

      // Cargar comentarios
      let query = supabase
        .from("comentarios")
        .select("*")
        .order("fecha", { ascending: false });

      if (filtroHabitacion) {
        query = query.eq("habitacion_id", filtroHabitacion);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error cargando comentarios:", error);
        setComentarios([]);
        return;
      }

      setComentarios(data || []);
    } catch (err) {
      console.error("Error:", err);
      setComentarios([]);
    } finally {
      setCargando(false);
    }
  }

  function getNombreHabitacion(habitacionId) {
    const hab = habitaciones.find(h => h.id === habitacionId);
    return hab?.nombre || "Cargando...";
  }

  async function eliminarComentario(id) {
    if (!window.confirm("¿Eliminar este comentario?")) return;

    try {
      const { error } = await supabase
        .from("comentarios")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Error al eliminar");
        return;
      }

      setComentarios(comentarios.filter(c => c.id !== id));
    } catch (err) {
      alert("Error al eliminar");
      console.error(err);
    }
  }

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <h1 style={{ marginTop: 0 }}>📝 Gestión de Comentarios</h1>

      {/* Filtro */}
      <div style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        marginBottom: "2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
          Filtrar por publicación:
        </label>
        <select
          value={filtroHabitacion}
          onChange={(e) => {
            setFiltroHabitacion(e.target.value);
          }}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            boxSizing: "border-box"
          }}
        >
          <option value="">Todas las publicaciones</option>
          {habitaciones.map(h => (
            <option key={h.id} value={h.id}>
              {h.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de comentarios */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "1.5rem",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f5f5f5"
        }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
            Total de comentarios: {comentarios.length}
          </h2>
        </div>

        {cargando ? (
          <p style={{ padding: "2rem", textAlign: "center" }}>Cargando comentarios...</p>
        ) : comentarios.length === 0 ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
            No hay comentarios disponibles
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0"
                  }}>Publicación</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0"
                  }}>Usuario</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0"
                  }}>Comentario</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0"
                  }}>Fecha</th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    borderBottom: "2px solid #e0e0e0"
                  }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comentarios.map((comentario, index) => (
                  <tr
                    key={comentario.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
                      borderBottom: "1px solid #e0e0e0"
                    }}
                  >
                    <td style={{ padding: "1rem", maxWidth: "200px" }}>
                      <Link
                        to={`/habitacion/${comentario.habitacion_id}`}
                        style={{
                          color: "#2196F3",
                          textDecoration: "none",
                          fontWeight: "bold"
                        }}
                      >
                        {getNombreHabitacion(comentario.habitacion_id)}
                      </Link>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <strong>{comentario.usuario}</strong>
                    </td>
                    <td style={{
                      padding: "1rem",
                      maxWidth: "400px",
                      whiteSpace: "normal",
                      wordBreak: "break-word"
                    }}>
                      {comentario.comentario}
                    </td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "0.9rem",
                      color: "#999"
                    }}>
                      {new Date(comentario.fecha).toLocaleDateString('es-PE')}
                    </td>
                    <td style={{
                      padding: "1rem",
                      textAlign: "center"
                    }}>
                      <button
                        onClick={() => eliminarComentario(comentario.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#d32f2f"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#f44336"}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComentariosAdmin;
