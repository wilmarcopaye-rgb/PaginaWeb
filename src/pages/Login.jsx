import { useState, useContext, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [loginIntenado, setLoginIntenado] = useState(false);

  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  // Si login fue exitoso y ahora hay usuario, redirigir
  useEffect(() => {
    if (loginIntenado && usuario) {
      navigate("/");
    }
  }, [usuario, loginIntenado, navigate]);

  // Si ya hay usuario logueado, redirigir
  if (usuario && !cargando) {
    navigate("/");
    return null;
  }

  async function iniciarSesion() {

    setCargando(true);
    setLoginIntenado(false);

    const { data, error } =
      await supabase.auth.signInWithPassword({

        email,
        password

      });

    if(error){
      alert(error.message);
      setCargando(false);
      setLoginIntenado(false);
      return;
    }

    // Marcar que intentamos login, AuthContext debería actualizar usuario
    setLoginIntenado(true);
    setCargando(false);

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
            Deja de buscar.
            Empieza a vivir.
          </p>

        </div>
        <h2>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button 
          onClick={iniciarSesion}
          disabled={cargando}
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

      </div>

    </div>

  );

}

export default Login;