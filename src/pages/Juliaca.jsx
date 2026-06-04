import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import HabitacionCard from "../components/HabitacionCard";

function Juliaca() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  async function cargarHabitaciones() {
    try {
      setCargando(true);
      const { data, error: err } = await supabase
        .from("habitaciones")
        .select("*")
        .eq("ciudad", "Juliaca")
        .order("fecha_publicacion", { ascending: false });

      if (err) {
        setError("Error al cargar habitaciones");
        return;
      }

      setHabitaciones(data || []);
    } catch (err) {
      setError("Error al cargar habitaciones");
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Habitaciones en Juliaca</h1>

        {cargando && <p>Cargando habitaciones...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!cargando && habitaciones.length === 0 && <p>No hay habitaciones disponibles en Juliaca</p>}

        {!cargando && habitaciones.length > 0 && (
          <div className="grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem",
            marginTop: "2rem"
          }}>
            {habitaciones.map(h => (
              <Link 
                key={h.id} 
                to={`/habitacion/${h.id}`}
                style={{ textDecoration: 'none' }}
              >
                <HabitacionCard habitacion={h} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Juliaca;