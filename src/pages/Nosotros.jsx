import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TerminosCondiciones() {
  return (
    <>
      <Navbar />

      <div className="terminos-page">
        <div className="terminos-contenedor">
          <h1 className="terminos-titulo">TÉRMINOS Y CONDICIONES DE USO</h1>
          <p className="terminos-fecha">Última actualización: 3 de junio de 2026</p>

          <p className="terminos-intro">
            Bienvenido a nuestra plataforma digital de arrendamiento (en adelante, la "Aplicación").
            Al descargar, registrarse o utilizar nuestra Aplicación, usted acepta cumplir y estar
            sujeto a los siguientes Términos y Condiciones. Por favor, léalos detenidamente. Si no
            está de acuerdo con ellos, deberá abstenerse de utilizar nuestros servicios.
          </p>

          <section className="terminos-seccion">
            <h2>1. Naturaleza del Servicio</h2>
            <p>
              Nuestra Aplicación es una plataforma tecnológica que conecta a propietarios o
              administradores de inmuebles ("Anfitriones") con personas que buscan habitaciones,
              departamentos o casas en alquiler ("Inquilinos") en las ciudades de Puno y Juliaca.
            </p>
            <p className="terminos-destacado">
              Nota clave: La Aplicación actúa exclusivamente como un intermediario tecnológico
              facilitador, promoviendo un entorno seguro y transparente para ambas partes.
            </p>
          </section>

          <section className="terminos-seccion">
            <h2>2. Compromiso con la Calidad y Veracidad</h2>
            <p>Para garantizar el estándar de calidad que nos diferencia en la región, implementamos las siguientes directrices:</p>
            <ul>
              <li><strong>Verificación de Identidad:</strong> Todos los usuarios (Anfitriones e Inquilinos) deben completar un proceso de registro con datos reales, incluyendo su Documento Nacional de Identidad (DNI) o Carnet de Extranjería.</li>
              <li><strong>Políticas de Fotos Reales:</strong> Los Anfitriones se comprometen a publicar imágenes actualizadas, verídicas y de autoría propia de las habitaciones, departamentos o casas. Está estrictamente prohibido el uso de imágenes falsas o de internet.</li>
              <li><strong>Descripciones Claras:</strong> Los anuncios deben especificar claramente los servicios incluidos (agua caliente, internet, amoblado, luz, etc.) y las condiciones del inmueble.</li>
            </ul>
          </section>

          <section className="terminos-seccion">
            <h2>3. Protocolos de Seguridad y Confianza</h2>
            <p>La seguridad de nuestra comunidad en Puno y Juliaca es nuestra máxima prioridad. Por ello, la Aplicación cuenta con:</p>
            <ul>
              <li><strong>Filtros de Verificación:</strong> Nos reservamos el derecho de validar la documentación de las propiedades listadas para evitar fraudes, suplantaciones o estafas.</li>
              <li><strong>Sistema de Calificaciones y Reseñas:</strong> Los Inquilinos podrán calificar la veracidad del anuncio y el trato del Anfitrión. Los Anfitriones que acumulen reportes por falta de higiene, maltrato o información falsa serán suspendidos permanentemente para salvaguardar la calidad del ecosistema.</li>
              <li><strong>Reporte de Incidentes:</strong> La app dispone de un botón de alerta o canal de soporte rápido para denunciar cualquier conducta sospechosa, acoso o incumplimiento de lo pactado.</li>
            </ul>
          </section>

          <section className="terminos-seccion">
            <h2>4. Obligaciones de los Usuarios</h2>
            <h3>4.1. De los Anfitriones:</h3>
            <ul>
              <li>Garantizar que el inmueble se encuentra en condiciones óptimas de habitabilidad, limpieza e higiene.</li>
              <li>Respetar el precio pactado en la Aplicación sin cobros arbitrarios o de última hora.</li>
              <li>Cumplir con las leyes y normas municipales vigentes en Puno y Juliaca respecto al alquiler de inmuebles.</li>
            </ul>
            <h3>4.2. De los Inquilinos:</h3>
            <ul>
              <li>Hacer un uso responsable del inmueble, cuidando las instalaciones y respetando las normas de convivencia del lugar.</li>
              <li>Cumplir puntualmente con los pagos acordados con el Anfitrión.</li>
              <li>Brindar información exacta sobre el número de personas que ocuparán el espacio.</li>
            </ul>
          </section>

          <section className="terminos-seccion">
            <h2>5. Exclusión de Responsabilidad</h2>
            <p>La Aplicación no es propietaria, ni administra, ni gestiona de forma directa los inmuebles publicados.</p>
            <p>Los contratos de arrendamiento, depósitos de garantía y acuerdos específicos se celebran directamente entre el Anfitrión y el Inquilino. La Aplicación no se hace responsable por daños materiales, hurtos, incumplimientos de pago o desalojos.</p>
            <p>No obstante, la plataforma colaborará activamente con las autoridades competentes brindando la información requerida en caso de disputas legales o denuncias policiales, de acuerdo con la Ley de Protección de Datos Personales (Ley N° 29733 en el Perú).</p>
          </section>

          <section className="terminos-seccion">
            <h2>6. Cancelaciones y Modificaciones</h2>
            <p>La plataforma promueve el trato justo. Las políticas de cancelación de visitas o reservas previas se coordinarán bajo los parámetros establecidos dentro de la interfaz de la app, buscando siempre no perjudicar el tiempo ni la economía de ninguna de las partes.</p>
          </section>

          <section className="terminos-seccion">
            <h2>7. Propiedad Intelectual y Uso de la App</h2>
            <p>Todo el contenido, logotipos, interfaces, códigos y herramientas de la Aplicación son propiedad exclusiva de la empresa. Queda prohibida su reproducción, copia o uso comercial no autorizado.</p>
          </section>

          <section className="terminos-seccion">
            <h2>8. Modificaciones a los Términos</h2>
            <p>Nos reservamos el derecho de actualizar estos Términos y Condiciones en cualquier momento para adaptarlos a nuevas funciones o normativas legales en el Perú. Se notificará a los usuarios a través de la aplicación antes de que los cambios entren en vigencia.</p>
          </section>

          <section className="terminos-seccion">
            <h2>9. Jurisdicción y Ley Aplicable</h2>
            <p>Estos Términos y Condiciones se rigen por las leyes de la República del Perú. Para cualquier controversia derivada del uso de la plataforma que no pueda ser resuelta mediante conciliación directa, las partes se someten a la competencia de los jueces y tribunales de la ciudad de Puno o Juliaca, según corresponda.</p>
          </section>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .terminos-page {
          background-color: #ffffff;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          padding: 2rem 1rem;
        }

        .terminos-contenedor {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
          padding: 2rem;
        }

        .terminos-titulo {
          font-size: 2rem;
          font-weight: 700;
          color: #0A4B7A; /* Azul profesional */
          border-left: 6px solid #F9A825; /* Amarillo dinámico */
          padding-left: 1rem;
          margin-bottom: 0.5rem;
        }

        .terminos-fecha {
          color: #5f6c7a;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }

        .terminos-intro {
          font-size: 1rem;
          line-height: 1.5;
          color: #1e2a3e;
          background-color: #FEF7E0;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          border-left: 4px solid #F9A825;
        }

        .terminos-seccion {
          margin-bottom: 2rem;
        }

        .terminos-seccion h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0A4B7A;
          margin-bottom: 0.75rem;
          margin-top: 1rem;
          padding-bottom: 0.25rem;
          border-bottom: 2px solid #F9A825;
          display: inline-block;
        }

        .terminos-seccion h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #0A4B7A;
          margin: 1rem 0 0.5rem 0;
        }

        .terminos-seccion p {
          font-size: 1rem;
          line-height: 1.5;
          color: #2c3e4e;
          margin-bottom: 0.75rem;
        }

        .terminos-destacado {
          background-color: #EFF6FF;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-weight: 500;
          color: #0A4B7A;
        }

        .terminos-seccion ul {
          margin: 0.5rem 0 1rem 1.5rem;
          padding-left: 0.5rem;
        }

        .terminos-seccion li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
          color: #2c3e4e;
        }

        .terminos-seccion li strong {
          color: #0A4B7A;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .terminos-contenedor {
            padding: 1.25rem;
          }
          .terminos-titulo {
            font-size: 1.6rem;
          }
          .terminos-seccion h2 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  );
}

export default TerminosCondiciones;