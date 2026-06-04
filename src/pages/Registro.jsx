import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { AuthContext } from "../context/AuthContext";

function Registro() {

  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  // Si ya hay usuario logueado, redirigir
  if (usuario) {
    navigate("/");
    return null;
  }

  async function registrarUsuario() {

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password
        });

      if (error) {
        alert("Error de autenticación: " + error.message);
        setCargando(false);
        return;
      }

      if (!data.user) {
        alert("Error al crear la cuenta de autenticación");
        setCargando(false);
        return;
      }

      // Esperar un poco antes de insertar en la BD
      await new Promise(resolve => setTimeout(resolve, 500));

      // Crear registro en tabla usuarios
      const { error: insertError } = await supabase
        .from("usuarios")
        .insert({
          id: data.user.id,
          nombre: nombre.trim(),
          correo: email.trim(),
          rol: "usuario"
        });

      if (insertError) {
        alert("Cuenta de autenticación creada, pero hubo error al guardar perfil: " + insertError.message + "\n\nIntenta iniciar sesión de todas formas.");
        setCargando(false);
        navigate("/login");
        return;
      }

      alert("✅ Cuenta creada correctamente. Ahora inicia sesión.");
      setCargando(false);
      navigate("/login");
    } catch (err) {
      alert("Error inesperado: " + err.message);
      setCargando(false);
    }

  }

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">

          <img
            src="/logo-vivoo.png"
            alt="VIVOO"
            className="logo-login"
          />

          <h1>VIVOO</h1>

          <p>
            Tu espacio vale,
            nosotros lo demostramos.
          </p>


        </div>

        <h2>Crear Cuenta</h2>

        <input
          type="text"
          placeholder="Nombre Completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          onClick={registrarUsuario}
          disabled={cargando}
        >
          {cargando ? "Registrando..." : "Registrarme"}
        </button>

        <p>

          ¿Ya tienes cuenta?

          <Link to="/login">
            Iniciar Sesión
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Registro;