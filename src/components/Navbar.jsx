import { Link } from "react-router-dom";
import UsuarioMenu from "./UsuarioMenu";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="logo-box">

        <img
            src="/logo-vivoo.png"
            alt="VIVOO"
            className="logo-img"
        />

        <span>VIVOO</span>

        </Link>

      <div className="menu">
        <Link to="/puno">Puno</Link>
        <Link to="/juliaca">Juliaca</Link>
        <Link to="/nosotros">Sobre VIVOO</Link>
      </div>

      <UsuarioMenu />

    </nav>
  );
}

export default Navbar;
