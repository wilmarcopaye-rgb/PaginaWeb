import {
 BrowserRouter,
 Routes,
 Route
}
from "react-router-dom";

function App() {
 return (
  <BrowserRouter>
   <Routes>

    <Route
      path="/"
      element={<Inicio />}
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
      path="/habitaciones"
      element={<Habitaciones />}
    />

    <Route
      path="/admin"
      element={<Dashboard />}
    />

   </Routes>
  </BrowserRouter>
 );
}