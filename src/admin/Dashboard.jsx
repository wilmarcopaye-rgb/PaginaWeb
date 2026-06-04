import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

function Dashboard() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ciudad, setCiudad] = useState("Puno");
  const [tipo, setTipo] = useState("Habitación");
  const [direccion, setDireccion] = useState("");
  const [foto, setFoto] = useState("");
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);

      // Cargar habitaciones
      const { data: hab, error: habError } = await supabase
        .from("habitaciones")
        .select("*")
        .order("fecha_publicacion", { ascending: false });

      if (habError) {
      }

      // Cargar usuarios
      const { data: usr, error: usrError } = await supabase
        .from("usuarios")
        .select("*")
        .order("id", { ascending: false })
        .limit(5);

      if (usrError) {
      }

      // Cargar comentarios
      const { data: com, error: comError } = await supabase
        .from("comentarios")
        .select("*")
        .order("fecha", { ascending: false })
        .limit(5);

      if (comError) {
      }

      setHabitaciones(hab || []);
      setUsuarios(usr || []);
      setComentarios(com || []);
    } catch (err) {
    } finally {
      setCargando(false);
    }
  }

  async function publicarHabitacion(e) {
    e.preventDefault();

    if (!nombre || !descripcion || !precio || !direccion) {
      alert("Por favor completa todos los campos");
      return;
    }

    setPublicando(true);
    
    try {
      const { data, error } = await supabase.from("habitaciones").insert({
        nombre,
        descripcion,
        precio: parseFloat(precio),
        ciudad,
        tipo,
        direccion,
        foto_principal: foto,
      }).select();

      if (error) {
        alert("Error: " + error.message);
        setPublicando(false);
        return;
      }

      if (data && data.length > 0) {
        // Agregar inmediatamente a la tabla
        const nuevaHabitacion = data[0];
        setHabitaciones([nuevaHabitacion, ...habitaciones]);
      }

      alert("✅ Habitación publicada correctamente");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setCiudad("Puno");
      setTipo("Habitación");
      setDireccion("");
      setFoto("");
      setMostrarFormulario(false);
      
      // Recargar en background después de un delay
      setTimeout(() => {
        cargarDatos();
      }, 1000);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setPublicando(false);
    }
  }

  async function eliminarHabitacion(id) {
    if (!window.confirm("¿Eliminar esta habitación?")) return;

    const { error } = await supabase.from("habitaciones").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("Habitación eliminada");
    cargarDatos();
  }

  return (
    <div className="admin-container">
      <AdminSidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Panel Administrativo</h1>
            <p>Gestiona tus anuncios y usuarios</p>
          </div>
          <div className="header-buttons">
            <button 
              onClick={cargarDatos}
              className="btn-refrescar-header"
              title="Refrescar datos"
            >
              🔄
            </button>
            <button 
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="btn-nueva-publicacion"
            >
              ➕ Nueva Publicación
            </button>
          </div>
        </div>

        {/* FORMULARIO FLOTANTE */}
        {mostrarFormulario && (
          <div className="formulario-flotante">
            <div className="formulario-contenido">
              <button 
                className="btn-cerrar-formulario"
                onClick={() => setMostrarFormulario(false)}
              >
                ✕
              </button>
              <h2>Publicar nuevo anuncio</h2>
              <form onSubmit={publicarHabitacion}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Título del anuncio *"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Precio (S/.) *"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                    <option>Puno</option>
                    <option>Juliaca</option>
                  </select>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option>Habitación</option>
                    <option>Minidepartamento</option>
                    <option>Departamento</option>
                    <option>Casa</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Dirección *"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />

                <textarea
                  placeholder="Descripción *"
                  rows="3"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />

                <input
                  type="text"
                  placeholder="URL de imagen"
                  value={foto}
                  onChange={(e) => setFoto(e.target.value)}
                />

                <button type="submit" disabled={publicando} className="btn-publicar-form">
                  {publicando ? "Publicando..." : "Publicar"}
                </button>
              </form>
            </div>
          </div>
        )}

        {cargando ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            {/* STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏠</div>
                <div className="stat-info">
                  <h2>{habitaciones.length}</h2>
                  <p>Anuncios</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h2>{usuarios.length}</h2>
                  <p>Usuarios</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <h2>{comentarios.length}</h2>
                  <p>Comentarios</p>
                </div>
              </div>
            </div>

            {/* ÚLTIMOS ANUNCIOS */}
            <div className="admin-section">
              <div className="section-header">
                <h2>Últimos anuncios</h2>
                <Link to="/admin/habitaciones" className="ver-todos">Ver todos →</Link>
              </div>

              {habitaciones.length === 0 ? (
                <p className="empty-message">No hay anuncios publicados</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Ciudad</th>
                      <th>Tipo</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habitaciones.map((hab) => (
                      <tr key={hab.id}>
                        <td>{hab.nombre}</td>
                        <td>{hab.ciudad}</td>
                        <td>{hab.tipo}</td>
                        <td>S/. {hab.precio.toFixed(2)}</td>
                        <td>
                          <button
                            onClick={() => eliminarHabitacion(hab.id)}
                            className="btn-tabla-eliminar"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>

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
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e0e0e0;
        }
        .admin-header h1 {
          font-size: 2.2rem;
          margin: 0;
          color: #003087;
          font-weight: 700;
        }
        .admin-header p {
          color: #666;
          margin: 0.5rem 0 0 0;
          font-size: 0.95rem;
        }
        .header-buttons {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .btn-refrescar-header {
          background: white;
          border: 2px solid #ddd;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
        }
        .btn-refrescar-header:hover {
          background: #f0f0f0;
          border-color: #003087;
        }
        .btn-nueva-publicacion {
          background: #003087;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .btn-nueva-publicacion:hover {
          background: #002268;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 48, 135, 0.3);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.2s;
        }
        .stat-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }
        .stat-icon {
          font-size: 2.5rem;
        }
        .stat-info h2 {
          font-size: 2rem;
          margin: 0;
          color: #003087;
          font-weight: 700;
        }
        .stat-info p {
          margin: 0.3rem 0 0 0;
          color: #666;
          font-size: 0.9rem;
        }
        .admin-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-top: 2rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .section-header h2 {
          margin: 0;
          color: #003087;
        }
        .ver-todos {
          color: #003087;
          text-decoration: none;
          font-weight: 600;
          transition: 0.2s;
        }
        .ver-todos:hover {
          text-decoration: underline;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th {
          background: #f5f7fa;
          color: #003087;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #ddd;
        }
        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        .admin-table tr:hover {
          background: #fafbfc;
        }
        .btn-tabla-eliminar {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-tabla-eliminar:hover {
          transform: scale(1.2);
        }
        .empty-message {
          text-align: center;
          color: #5f6c7a;
          padding: 2rem;
        }
        .formulario-flotante {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .formulario-contenido {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .btn-cerrar-formulario {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #5f6c7a;
        }
        .formulario-contenido h2 {
          color: #003087;
          margin-top: 0;
        }
        .formulario-contenido form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .formulario-contenido input,
        .formulario-contenido select,
        .formulario-contenido textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
        }
        .formulario-contenido input:focus,
        .formulario-contenido select:focus,
        .formulario-contenido textarea:focus {
          outline: none;
          border-color: #003087;
          box-shadow: 0 0 0 2px rgba(0, 48, 135, 0.1);
        }
        .btn-publicar-form {
          background: #003087;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 0.5rem;
        }
        .btn-publicar-form:hover:not(:disabled) {
          background: #002268;
        }
        .btn-publicar-form:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;