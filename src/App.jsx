import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Habitaciones from "./pages/Habitaciones";
import DetalleHabitacion from "./pages/DetalleHabitacion";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Puno from "./pages/Puno";
import Juliaca from "./pages/Juliaca";
import Nosotros from "./pages/Nosotros";
import MiCuenta from "./pages/MiCuenta";

import Dashboard from "./admin/Dashboard";
import HabitacionesAdmin from "./admin/HabitacionesAdmin";
import ComentariosAdmin from "./admin/ComentariosAdmin";
import UsuariosAdmin from "./admin/UsuariosAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Inicio />} />

        <Route
          path="/habitaciones"
          element={<Habitaciones />}
        />

        <Route
          path="/habitacion/:id"
          element={<DetalleHabitacion />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/admin"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/admin/habitaciones"
          element={<ProtectedRoute><HabitacionesAdmin /></ProtectedRoute>}
        />

        <Route
          path="/admin/comentarios"
          element={<ProtectedRoute><ComentariosAdmin /></ProtectedRoute>}
        />

        <Route
          path="/admin/usuarios"
          element={<ProtectedRoute><UsuariosAdmin /></ProtectedRoute>}
        />

        <Route path="/puno" element={<Puno />} 
        />

        <Route path="/juliaca" element={<Juliaca />} 
        /> 

        <Route path="/nosotros" element={<Nosotros />} 
        />

        <Route
          path="/mi-cuenta"
          element={<ProtectedUserRoute><MiCuenta /></ProtectedUserRoute>}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;