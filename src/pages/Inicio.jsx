import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Inicio() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [ciudad, setCiudad] = useState("");
  const [tipo, setTipo] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  async function cargarHabitaciones(filtros = {}) {
    try {
      setCargando(true);
      let query = supabase
        .from("habitaciones")
        .select("*");

      if (filtros.ciudad) {
        query = query.eq("ciudad", filtros.ciudad);
      }
      if (filtros.tipo) {
        query = query.eq("tipo", filtros.tipo);
      }
      if (filtros.precioMax) {
        query = query.lte("precio", parseInt(filtros.precioMax));
      }

      const { data, error } = await query
        .order("fecha_publicacion", { ascending: false })
        .limit(6);

      if (error) {
      } else {
        setHabitaciones(data || []);
      }
    } catch (err) {
    } finally {
      setCargando(false);
    }
  }

  function handleBuscar() {
    cargarHabitaciones({
      ciudad: ciudad,
      tipo: tipo,
      precioMax: precioMax
    });
  }

  return (
    <>
      <Navbar />

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <h1>
            Deja de buscar.
            <br />
            Empieza a vivir.
          </h1>

          <p>
            Encuentra habitaciones,
            minidepartamentos,
            departamentos y casas
            en alquiler en Puno y Juliaca.
          </p>

          <div className="search-bar">

            <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
              <option value="">Selecciona Ciudad</option>
              <option value="Puno">Puno</option>
              <option value="Juliaca">Juliaca</option>
            </select>

            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Selecciona Tipo</option>
              <option value="Habitación">Habitación</option>
              <option value="Minidepartamento">Minidepartamento</option>
              <option value="Departamento">Departamento</option>
              <option value="Casa">Casa</option>
            </select>

            <select value={precioMax} onChange={(e) => setPrecioMax(e.target.value)}>
              <option value="">Precio Máximo</option>
              <option value="200">Hasta S/. 200</option>
              <option value="300">Hasta S/. 300</option>
              <option value="500">Hasta S/. 500</option>
              <option value="800">Hasta S/. 800</option>
              <option value="1000">Hasta S/. 1000</option>
            </select>

            <button onClick={handleBuscar}>Buscar</button>

          </div>

        </div>

      </section>

      {/* DESTACADAS */}

      <section className="destacadas">

        <h2>
          Últimas Publicaciones
        </h2>

        {cargando ? (
          <p>Cargando habitaciones...</p>
        ) : habitaciones.length === 0 ? (
          <p>No hay habitaciones publicadas aún</p>
        ) : (
          <div className="cards">

            {habitaciones.map((habitacion) => (

              <Link 
                to={`/habitacion/${habitacion.id}`}
                key={habitacion.id}
                style={{ textDecoration: 'none' }}
              >
                <div className="card">

                  <div className="placeholder-image">
                    {habitacion.foto_principal ? (
                      <img 
                        src={habitacion.foto_principal} 
                        alt={habitacion.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      'Imagen'
                    )}
                  </div>

                  <div className="card-content">

                    <h3>
                      {habitacion.nombre}
                    </h3>

                    <p>
                      {habitacion.ciudad} • {habitacion.tipo}
                    </p>

                    <h4>
                      S/.{habitacion.precio.toFixed(2)}
                    </h4>

                    <button onClick={(e) => {
                      e.preventDefault();
                    }}>
                      Ver Detalles
                    </button>

                  </div>

                </div>
              </Link>

            ))}

          </div>
        )}

      </section>

      <Footer />
    </>
  );
}

export default Inicio;