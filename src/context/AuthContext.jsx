import { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

// Crear contexto de autenticación
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    verificarSesion();
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          verificarRol(session.user.email);
        } else {
          setUsuario(null);
          setEsAdmin(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  async function verificarSesion() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await verificarRol(session.user.email);
      }
    } catch (error) {
    } finally {
      setCargando(false);
    }
  }

  async function verificarRol(email) {
    try {
      const { data: usuarioDB, error } = await supabase
        .from("usuarios")
        .select("id, rol, nombre, correo")
        .eq("correo", email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
      }

      if (usuarioDB) {
        // Usuario encontrado en BD
        setUsuario(usuarioDB);
        setEsAdmin(usuarioDB.rol === "admin");
      } else {
        // Usuario autenticado pero no en BD (nuevo usuario)
        setUsuario({ correo: email, nombre: email });
        setEsAdmin(false);
      }
    } catch (error) {
      // Permitir acceso al usuario autenticado aunque haya error
      setUsuario({ correo: email, nombre: email });
      setEsAdmin(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUsuario(null);
    setEsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ usuario, esAdmin, cargando, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
