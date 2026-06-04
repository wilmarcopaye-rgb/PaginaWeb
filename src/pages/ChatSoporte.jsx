import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ChatSoporte() {
  const { usuario } = useContext(AuthContext);
  const [chatId, setChatId] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (usuario?.id) {
      iniciarChat();
    }
  }, [usuario?.id]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function iniciarChat() {
    try {
      setCargando(true);

      // Buscar chat activo del usuario
      const { data: chatsExistentes } = await supabase
        .from("chats")
        .select("id")
        .eq("usuario_id", usuario.id)
        .eq("estado", "activo")
        .single();

      let chatActual = chatsExistentes?.id;

      // Si no existe, crear uno nuevo
      if (!chatActual) {
        const { data: nuevoChat, error: crearError } = await supabase
          .from("chats")
          .insert({
            usuario_id: usuario.id,
            usuario_nombre: usuario.nombre || usuario.correo,
            usuario_email: usuario.correo,
            estado: "activo",
            fecha_inicio: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (crearError) {
          return;
        }

        chatActual = nuevoChat.id;
      }

      setChatId(chatActual);
      cargarMensajes(chatActual);

      // Suscribirse a nuevos mensajes en tiempo real
      const suscripcion = supabase
        .channel(`chat_${chatActual}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "mensajes_chat",
            filter: `chat_id=eq.${chatActual}`,
          },
          (payload) => {
            setMensajes((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        suscripcion.unsubscribe();
      };
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
    } catch (err) {
    }
  }

  async function enviarMensaje(e) {
    e.preventDefault();

    if (!nuevoMensaje.trim() || !chatId) return;

    setEnviando(true);
    const mensajeTexto = nuevoMensaje.trim();

    try {
      const nuevoMsjObj = {
        chat_id: chatId,
        remitente_id: usuario.id,
        remitente_tipo: "usuario",
        remitente_nombre: usuario.nombre || usuario.correo,
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

  if (cargando) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "2rem" }}>Cargando chat...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "1rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          height: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ margin: "0 0 1rem 0", color: "#003087" }}>💬 Atención al Cliente</h2>

        {/* Área de mensajes */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "1rem",
            padding: "1rem",
            background: "#f9f9f9",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {mensajes.length === 0 ? (
            <div style={{ textAlign: "center", color: "#999", margin: "auto" }}>
              Inicia una conversación con nuestro equipo de soporte
            </div>
          ) : (
            mensajes.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.remitente_tipo === "usuario" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  background:
                    msg.remitente_tipo === "usuario" ? "#003087" : "#e0e0e0",
                  color: msg.remitente_tipo === "usuario" ? "white" : "#333",
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
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulario de envío */}
        <form onSubmit={enviarMensaje} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
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
      </div>

      <Footer />
    </>
  );
}

export default ChatSoporte;
