import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  async function obtenerUsuarios() {
    try {
      setCargando(true);
      const { data, error: err } = await supabase
        .from("usuarios")
        .select("*")
        .order("id", { ascending: false });

      if (err) {
        setError(err.message);
        return;
      }

      setUsuarios(data || []);
    } catch (err) {
      setError("Error al cargar usuarios");
    } finally {
      setCargando(false);
    }
  }

  async function eliminarUsuario(id) {
    if (!window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
      return;
    }

    const { error } = await supabase.from("usuarios").delete().eq("id", id);

    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }

    alert("Usuario eliminado correctamente");
    obtenerUsuarios();
  }

  return (
    <div className="admin-container">
      <AdminSidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-main">
        <div className="admin-header">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios registrados en la plataforma</p>
        </div>

        {cargando && <p>Cargando usuarios...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!cargando && usuarios.length === 0 && <p>No hay usuarios registrados</p>}

        {!cargando && usuarios.length > 0 && (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre || "N/A"}</td>
                  <td>{usuario.correo || "N/A"}</td>
                  <td>
                    <span className={`rol-badge rol-${usuario.rol}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => eliminarUsuario(usuario.id)}
                      className="btn-eliminar"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        .usuarios-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .usuarios-table th {
          background: #003087;
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .usuarios-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        .usuarios-table tr:hover {
          background: #f5f5f5;
        }
        .rol-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .rol-admin {
          background: #e8f1ff;
          color: #003087;
        }
        .rol-user,
        .rol-usuario {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .btn-eliminar {
          padding: 6px 12px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-eliminar:hover {
          background: #d32f2f;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

export default UsuariosAdmin;
