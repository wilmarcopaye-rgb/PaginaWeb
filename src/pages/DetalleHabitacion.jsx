import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../services/supabase";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function DetalleHabitacion() {
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const [habitacion, setHabitacion] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  useEffect(() => {
    cargarDetalles();
  }, [id]);

  async function cargarDetalles() {
    try {
      setCargando(true);
      const { data, error: err } = await supabase
        .from("habitaciones")
        .select("*")
        .eq("id", id)
        .single();

      if (err) {
        setError("No se encontró la habitación");
        return;
      }

      setHabitacion(data);
      await cargarComentarios();
    } catch (err) {
      setError("Error cargando la habitación");
    } finally {
      setCargando(false);
    }
  }

  async function cargarComentarios() {
    try {
      const { data, error: err } = await supabase
        .from("comentarios")
        .select("*")
        .eq("habitacion_id", id)
        .order("fecha", { ascending: false });

      if (err) {
        setComentarios([]);
        return;
      }

      setComentarios(data || []);
    } catch (err) {
      setComentarios([]);
    }
  }

  async function enviarComentario() {
    if (!nuevoComentario.trim()) {
      alert("Por favor escribe un comentario");
      return;
    }

    if (!usuario) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    setEnviandoComentario(true);

    try {
      const { error: err } = await supabase
        .from("comentarios")
        .insert({
          habitacion_id: id,
          usuario: usuario.nombre || usuario.correo,
          comentario: nuevoComentario.trim(),
          fecha: new Date().toISOString()
        });

      if (err) {
        alert("Error al enviar comentario");
        return;
      }

      setNuevoComentario("");
      await cargarComentarios();
      alert("✅ Comentario enviado correctamente");
    } catch (err) {
      alert("Error al enviar comentario");
    } finally {
      setEnviandoComentario(false);
    }
  }

  return (
    <>
      <Navbar />

      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem"
      }}>

        {cargando && <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Cargando habitación...</p>}
        
        {error && <p style={{ textAlign: "center", color: "red", fontSize: "1.1rem" }}>{error}</p>}

        {habitacion && (
          <div>
            {/* Imagen principal */}
            <div style={{
              marginBottom: "2rem",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}>
              <img
                src={habitacion.foto_principal}
                alt={habitacion.nombre}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover"
                }}
              />
            </div>

            {/* Información principal */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "2rem",
              marginBottom: "2rem"
            }}>
              <div>
                <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
                  {habitacion.nombre}
                </h1>

                <p style={{
                  fontSize: "1rem",
                  color: "#666",
                  marginBottom: "1rem"
                }}>
                  📍 {habitacion.ciudad} · {habitacion.tipo}
                </p>

                <h2 style={{
                  color: "#2196F3",
                  fontSize: "2rem",
                  marginBottom: "1rem",
                  marginTop: 0
                }}>
                  S/. {habitacion.precio}/mes
                </h2>

                <div style={{
                  backgroundColor: "#f5f5f5",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem"
                }}>
                  <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#333" }}>
                    Descripción
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    color: "#555"
                  }}>
                    {habitacion.descripcion}
                  </p>
                </div>
              </div>

              {/* Card lateral */}
              <div style={{
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "1.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                height: "fit-content"
              }}>
                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Contacto</h3>

                {habitacion.whatsapp && (
                  <a 
                    href={`https://wa.me/${habitacion.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      padding: "0.75rem",
                      backgroundColor: "#25D366",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      textDecoration: "none",
                      textAlign: "center",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#20ba58"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#25D366"}
                  >
                    💬 WhatsApp: {habitacion.whatsapp}
                  </a>
                )}

                {habitacion.email_contacto && (
                  <a 
                    href={`mailto:${habitacion.email_contacto}?subject=Interés en ${habitacion.nombre}`}
                    style={{
                      display: "block",
                      padding: "0.75rem",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      textDecoration: "none",
                      textAlign: "center",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#1976D2"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#2196F3"}
                  >
                    📧 Email: {habitacion.email_contacto}
                  </a>
                )}
              </div>
            </div>

            {/* Detalles adicionales */}
            <div style={{
              backgroundColor: "#f9f9f9",
              padding: "2rem",
              borderRadius: "8px",
              marginBottom: "2rem"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.3rem" }}>
                Información Adicional
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem"
              }}>
                {habitacion.tipo && (
                  <div>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", color: "#666" }}>
                      Tipo de Propiedad
                    </p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>
                      {habitacion.tipo}
                    </p>
                  </div>
                )}

                {habitacion.ciudad && (
                  <div>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", color: "#666" }}>
                      Ciudad
                    </p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>
                      {habitacion.ciudad}
                    </p>
                  </div>
                )}

                {habitacion.precio && (
                  <div>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", color: "#666" }}>
                      Precio Mensual
                    </p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "#2196F3", fontWeight: "bold" }}>
                      S/. {habitacion.precio}
                    </p>
                  </div>
                )}

                {habitacion.direccion && (
                  <div>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", color: "#666" }}>
                      Dirección
                    </p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>
                      {habitacion.direccion}
                    </p>
                  </div>
                )}

                {habitacion.fecha_publicacion && (
                  <div>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", color: "#666" }}>
                      Publicado
                    </p>
                    <p style={{ margin: 0, fontSize: "1rem", color: "#999" }}>
                      {new Date(habitacion.fecha_publicacion).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Comentarios */}
            <div style={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "2rem",
              marginBottom: "2rem"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.3rem" }}>
                💬 Comentarios ({comentarios.length})
              </h3>

              {usuario ? (
                <div style={{
                  backgroundColor: "#f5f5f5",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem"
                }}>
                  <h4 style={{ marginTop: 0 }}>Añade tu comentario</h4>
                  <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribe tu comentario aquí..."
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                      fontFamily: "Arial, sans-serif",
                      minHeight: "100px",
                      marginBottom: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    onClick={enviarComentario}
                    disabled={enviandoComentario}
                    style={{
                      padding: "0.75rem 2rem",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: enviandoComentario ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      opacity: enviandoComentario ? 0.6 : 1
                    }}
                  >
                    {enviandoComentario ? "Enviando..." : "Enviar Comentario"}
                  </button>
                </div>
              ) : (
                <p style={{
                  backgroundColor: "#fff3cd",
                  padding: "1rem",
                  borderRadius: "4px",
                  marginBottom: "2rem"
                }}>
                  📝 <strong>Debes iniciar sesión para comentar</strong>
                </p>
              )}

              {comentarios.length === 0 ? (
                <p style={{ color: "#999", textAlign: "center" }}>No hay comentarios aún. ¡Sé el primero en comentar!</p>
              ) : (
                <div>
                  {comentarios.map((comentario) => (
                    <div
                      key={comentario.id}
                      style={{
                        borderBottom: "1px solid #e0e0e0",
                        paddingBottom: "1rem",
                        marginBottom: "1rem"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "0.5rem"
                      }}>
                        <p style={{
                          margin: 0,
                          fontWeight: "bold",
                          color: "#333"
                        }}>
                          👤 {comentario.usuario}
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "#999"
                        }}>
                          {new Date(comentario.fecha).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                      <p style={{
                        margin: 0,
                        color: "#555",
                        lineHeight: "1.5"
                      }}>
                        {comentario.comentario}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}

export default DetalleHabitacion;