import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

function HabitacionesAdmin() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ciudad, setCiudad] = useState("Puno");
  const [tipo, setTipo] = useState("Habitación");
  const [direccion, setDireccion] = useState("");
  const [foto, setFoto] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [emailContacto, setEmailContacto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [habitaciones, setHabitaciones] = useState([]);
  const [cargandoList, setCargandoList] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  async function cargarHabitaciones() {
    try {
      setCargandoList(true);
      const { data, error } = await supabase
        .from("habitaciones")
        .select("*")
        .order("fecha_publicacion", { ascending: false });

      if (error) {
        return;
      }

      setHabitaciones(data || []);
    } catch (err) {
    } finally {
      setCargandoList(false);
    }
  }

  async function guardar(e) {
    e.preventDefault();

    // Validaciones básicas
    if (!nombre || !descripcion || !precio || !direccion || !whatsapp) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    setCargando(true);
    
    try {
      if (editandoId) {
        // ACTUALIZAR habitación existente
        const { error } = await supabase
          .from("habitaciones")
          .update({
            nombre,
            descripcion,
            precio: parseFloat(precio),
            ciudad,
            tipo,
            direccion,
            foto_principal: foto,
            whatsapp,
            email_contacto: emailContacto,
          })
          .eq("id", editandoId);

        if (error) {
          alert(error.message);
          setCargando(false);
          return;
        }

        alert("✅ Habitación actualizada correctamente");
        cancelarEdicion();
        cargarHabitaciones();
      } else {
        // INSERTAR nueva habitación
        const { data, error } = await supabase.from("habitaciones").insert({
          nombre,
          descripcion,
          precio: parseFloat(precio),
          ciudad,
          tipo,
          direccion,
          foto_principal: foto,
          whatsapp,
          email_contacto: emailContacto,
        }).select();

        if (error) {
          alert(error.message);
          setCargando(false);
          return;
        }

        // Agregar inmediatamente a la tabla
        if (data && data.length > 0) {
          setHabitaciones([data[0], ...habitaciones]);
        }

        alert("✅ Habitación registrada correctamente");
        // Limpiar formulario
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setCiudad("Puno");
        setTipo("Habitación");
        setDireccion("");
        setFoto("");
        setWhatsapp("");
        setEmailContacto("");
        
        // Recargar la lista en background después de 1 segundo
        setTimeout(() => {
          cargarHabitaciones();
        }, 1000);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setCargando(false);
    }
  }

  async function eliminarHabitacion(id) {
    if (!window.confirm("¿Está seguro de que desea eliminar esta habitación?")) {
      return;
    }

    const { error } = await supabase.from("habitaciones").delete().eq("id", id);

    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }

    alert("Habitación eliminada correctamente");
    cargarHabitaciones();
  }

  function editarHabitacion(habitacion) {
    setEditandoId(habitacion.id);
    setNombre(habitacion.nombre);
    setDescripcion(habitacion.descripcion);
    setPrecio(habitacion.precio.toString());
    setCiudad(habitacion.ciudad);
    setTipo(habitacion.tipo);
    setDireccion(habitacion.direccion);
    setFoto(habitacion.foto_principal || "");
    setWhatsapp(habitacion.whatsapp || "");
    setEmailContacto(habitacion.email_contacto || "");
    window.scrollTo(0, 0);
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setCiudad("Puno");
    setTipo("Habitación");
    setDireccion("");
    setFoto("");
    setWhatsapp("");
    setEmailContacto("");
  }

  return (
    <div className="admin-container">
      <AdminSidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-main">
        <div className="admin-header">
          <h1>{editandoId ? "✏️ Editar anuncio" : "Publicar nuevo anuncio"}</h1>
          <p>{editandoId ? "Modifica los datos del inmueble" : "Completa los datos del inmueble que deseas ofrecer"}</p>
        </div>

        <form onSubmit={guardar} className="admin-form-moderno">
          <div className="form-grid">
            <div className="form-group">
              <label>Título del anuncio *</label>
              <input
                type="text"
                placeholder="Ej: Habitación amoblada cerca del centro"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Precio mensual (S/.) *</label>
              <input
                type="number"
                placeholder="350"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Ciudad *</label>
              <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                <option>Puno</option>
                <option>Juliaca</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tipo de propiedad *</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Habitación</option>
                <option>Minidepartamento</option>
                <option>Departamento</option>
                <option>Casa</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Dirección *</label>
              <input
                type="text"
                placeholder="Calle, número, referencia"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Descripción *</label>
              <textarea
                rows="4"
                placeholder="Describe el inmueble, servicios incluidos, restricciones, etc."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>URL de la imagen principal</label>
              <input
                type="text"
                placeholder="https://ejemplo.com/foto.jpg"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
              />
              {foto && (
                <div className="image-preview">
                  <p>Vista previa:</p>
                  <img src={foto} alt="Vista previa" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>WhatsApp de contacto *</label>
              <input
                type="tel"
                placeholder="Ej: +51 999 123 456"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email de contacto *</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={emailContacto}
                onChange={(e) => setEmailContacto(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={cargando} className="btn-publicar">
              {cargando ? (editandoId ? "Actualizando..." : "Publicando...") : (editandoId ? "✅ Guardar cambios" : "Publicar anuncio")}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="btn-cancelar"
              >
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>

        {/* TABLA DE HABITACIONES PUBLICADAS */}
        <div className="habitaciones-lista-section">
          <div className="habitaciones-header">
            <h2>Anuncios publicados</h2>
            <button onClick={cargarHabitaciones} className="btn-refrescar">
              🔄 Refrescar
            </button>
          </div>

          {cargandoList && <p>Cargando habitaciones...</p>}

          {!cargandoList && habitaciones.length === 0 && (
            <p className="empty-message">No hay anuncios publicados aún</p>
          )}

          {!cargandoList && habitaciones.length > 0 && (
            <table className="habitaciones-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Ciudad</th>
                  <th>Tipo</th>
                  <th>Precio</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {habitaciones.map((hab) => (
                  <tr key={hab.id}>
                    <td className="hab-nombre">{hab.nombre}</td>
                    <td>{hab.ciudad}</td>
                    <td>{hab.tipo}</td>
                    <td>S/. {hab.precio.toFixed(2)}</td>
                    <td className="hab-direccion">{hab.direccion}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => editarHabitacion(hab)}
                          className="btn-editar-hab"
                          title="Editar"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarHabitacion(hab.id)}
                          className="btn-eliminar-hab"
                          title="Eliminar"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Estilos específicos para el formulario moderno */}
      <style>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: #f5f7fa;
        }
        .admin-main {
          flex: 1;
          padding: 2.5rem;
          overflow-y: auto;
          width: calc(100% - 220px);
          max-width: 1200px;
          margin: 0 auto;
        }
        .admin-header {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e0e0e0;
        }
        .admin-header h1 {
          font-size: 2.2rem;
          margin: 0 0 0.5rem 0;
          color: #003087;
          font-weight: 700;
        }
        .admin-header p {
          color: #666;
          margin: 0;
          font-size: 0.95rem;
        }
        .admin-form-moderno {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 2.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group.full-width {
          grid-column: span 2;
        }
        .form-group label {
          font-weight: 600;
          color: #003087;
          font-size: 0.9rem;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #003087;
          box-shadow: 0 0 0 2px rgba(0, 48, 135, 0.1);
        }
        .image-preview {
          margin-top: 12px;
        }
        .image-preview p {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 6px;
        }
        .image-preview img {
          max-width: 100%;
          max-height: 150px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          object-fit: cover;
        }
        .form-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        .btn-publicar {
          background: #003087;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-publicar:hover:not(:disabled) {
          background: #002268;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 48, 135, 0.3);
        }
        .btn-publicar:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .btn-cancelar {
          background: #f44336;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancelar:hover {
          background: #d32f2f;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.full-width {
            grid-column: span 1;
          }
        }
        .habitaciones-lista-section {
          margin-top: 2.5rem;
        }
        .habitaciones-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        }
        .habitaciones-header h2 {
          font-size: 1.6rem;
          color: #003087;
          margin: 0;
          font-weight: 700;
        }
        .btn-refrescar {
          background: white;
          color: #003087;
          border: 2px solid #ddd;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }
        .btn-refrescar:hover {
          background: #e0e0e0;
        }
        .habitaciones-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .habitaciones-table th {
          background: #003087;
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #002268;
        }
        .habitaciones-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        .habitaciones-table tbody tr:hover {
          background: #f9f9f9;
        }
        .hab-nombre {
          font-weight: 600;
          color: #003087;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hab-direccion {
          font-size: 0.9rem;
          color: #5f6c7a;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .btn-eliminar-hab {
          background: #f44336;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-eliminar-hab:hover {
          background: #d32f2f;
          transform: translateY(-1px);
        }
        .btn-editar-hab {
          background: #2196F3;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-editar-hab:hover {
          background: #0b7dda;
          transform: translateY(-1px);
        }
        .empty-message {
          text-align: center;
          color: #5f6c7a;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default HabitacionesAdmin;