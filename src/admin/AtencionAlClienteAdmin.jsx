import { useEffect, useState, useRef } from "react";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

function AtencionAlClienteAdmin() {
  const [chats, setChats] = useState([]);
  const [chatSeleccionado, setChatSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    cargarChats();

    // Suscribirse a nuevos chats en tiempo real
    const suscripcion = supabase
      .channel("chats_list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        (payload) => {
          cargarChats();
        }
      )
      .subscribe();

    return () => {
      suscripcion.unsubscribe();
    };
  }, []);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function cargarChats() {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("estado", "activo")
        .order("fecha_inicio", { ascending: false });

      if (error) {
        return;
      }

      setChats(data || []);

      // Si no hay chat seleccionado y hay chats, seleccionar el primero
      if (!chatSeleccionado && data && data.length > 0) {
        setChatSeleccionado(data[0]);
        cargarMensajes(data[0].id);
      }
    } finally {
      setCargando(false);
    }
  }

  async function cargarMensajes(idChat) {
    try {
      const { data } = await supabase
        .from("mensajes_chat")
        .select("*")
        .eq("chat_id", idChat)
        .order("fecha", { ascending: true });

      setMensajes(data || []);

      // Suscribirse a nuevos mensajes en tiempo real
      const suscripcion = supabase
        .channel(`chat_admin_${idChat}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "mensajes_chat",
            filter: `chat_id=eq.${idChat}`,
          },
          (payload) => {
            setMensajes((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        suscripcion.unsubscribe();
      };
    } catch (err) {
    }
  }

  async function enviarMensaje(e) {
    e.preventDefault();

    if (!nuevoMensaje.trim() || !chatSeleccionado) return;

    setEnviando(true);
    const mensajeTexto = nuevoMensaje.trim();

    try {
      const nuevoMsjObj = {
        chat_id: chatSeleccionado.id,
        remitente_id: "admin",
        remitente_tipo: "admin",
        remitente_nombre: "Equipo VIVOO",
        mensaje: mensajeTexto,
        fecha: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("mensajes_chat")
        .insert([nuevoMsjObj])
        .select();

      if (error) {
        alert("Error al enviar mensaje: " + error.message);
      } else {
        // Agregar el mensaje a la lista localmente
        if (data && data.length > 0) {
          setMensajes((prev) => [...prev, data[0]]);
        }
        setNuevoMensaje("");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function cerrarChat() {
    if (!chatSeleccionado) return;

    try {
      const { error } = await supabase
        .from("chats")
        .update({ estado: "cerrado" })
        .eq("id", chatSeleccionado.id);

      if (error) {
        alert("Error al cerrar chat: " + error.message);
        return;
      }

      alert("Chat cerrado");
      setChatSeleccionado(null);
      setMensajes([]);
      cargarChats();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  if (cargando) {
    return (
      <>
        <AdminSidebar />
        <main style={{ marginLeft: "220px", padding: "2rem", textAlign: "center" }}>
          <p>Cargando chats...</p>
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
            💬 Atención al Cliente
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", height: "600px" }}>
            {/* Lista de chats */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ padding: "1rem", background: "#003087", color: "white", fontWeight: "600" }}>
                Conversaciones Activas ({chats.length})
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {chats.length === 0 ? (
                  <div style={{ padding: "1rem", textAlign: "center", color: "#999" }}>
                    Sin chats activos
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        setChatSeleccionado(chat);
                        cargarMensajes(chat.id);
                      }}
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                        background:
                          chatSeleccionado?.id === chat.id ? "#f0f8ff" : "white",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (chatSeleccionado?.id !== chat.id) {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (chatSeleccionado?.id !== chat.id) {
                          e.currentTarget.style.backgroundColor = "white";
                        }
                      }}
                    >
                      <div style={{ fontWeight: "600", color: "#003087", fontSize: "0.9rem" }}>
                        {chat.usuario_nombre}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.25rem" }}>
                        {chat.usuario_email}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {chatSeleccionado ? (
                <>
                  <div
                    style={{
                      padding: "1rem",
                      background: "#003087",
                      color: "white",
                      fontWeight: "600",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>{chatSeleccionado.usuario_nombre}</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: "400" }}>
                        {chatSeleccionado.usuario_email}
                      </div>
                    </div>
                    <button
                      onClick={cerrarChat}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Cerrar
                    </button>
                  </div>

                  {/* Mensajes */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "1rem",
                      background: "#f9f9f9",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {mensajes.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf:
                            msg.remitente_tipo === "admin" ? "flex-end" : "flex-start",
                          maxWidth: "70%",
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          background:
                            msg.remitente_tipo === "admin" ? "#003087" : "#e0e0e0",
                          color: msg.remitente_tipo === "admin" ? "white" : "#333",
                        }}
                      >
                        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                          {msg.mensaje}
                        </p>
                        <p
                          style={{
                            margin: "0.25rem 0 0 0",
                            fontSize: "0.75rem",
                            opacity: 0.8,
                          }}
                        >
                          {new Date(msg.fecha).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Formulario */}
                  <form
                    onSubmit={enviarMensaje}
                    style={{
                      padding: "1rem",
                      display: "flex",
                      gap: "0.5rem",
                      background: "white",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <input
                      type="text"
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                      disabled={enviando}
                    />
                    <button
                      type="submit"
                      disabled={enviando || !nuevoMensaje.trim()}
                      style={{
                        padding: "0.75rem 1.5rem",
                        background: "#003087",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: enviando ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        opacity: enviando ? 0.7 : 1,
                      }}
                    >
                      {enviando ? "Enviando..." : "Enviar"}
                    </button>
                  </form>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#999",
                  }}
                >
                  Selecciona un chat para continuar
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AtencionAlClienteAdmin;
