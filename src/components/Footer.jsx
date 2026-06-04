import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Columna izquierda: Información de la marca */}
        <div className="footer-brand">
          <h2>VIVOO</h2>
          <p>Tu espacio vale, nosotros lo demostramos.</p>
          <p>Deja de buscar. Empieza a vivir.</p>
        </div>

        {/* Columna derecha: Redes Sociales y Contacto */}
        <div className="footer-contacto">
          <div className="social-links">
            <a
              href="https://www.instagram.com/vivoo_app/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              📸 Instagram
            </a>
            <a
              href="https://www.tiktok.com/@vivoo.23"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link tiktok"
            >
              🎵 TikTok
            </a>
          </div>
          <div className="contact-info">
            <p>📱 WhatsApp</p>
            <p>✉️ contacto@vivoo.pe</p>
            <p>📍 Puno - Juliaca</p>
          </div>
        </div>

        <p className="copyright">© 2026 VIVOO</p>
      </div>
    </footer>
  );
}

export default Footer;