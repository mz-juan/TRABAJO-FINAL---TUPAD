import React, { useState, useEffect } from 'react';
import './Home.css';
import clinicaConfig from '../../config/clinicaConfig';
import { getEspecialidades, getCoberturas } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/common/Button';

export default function Home({ onNavigate }) {
  const { user, isAuthenticated, login } = useAuth();

  // Estados de datos dinámicos (cargados desde API / MySQL)
  const [especialidades, setEspecialidades] = useState([]);
  const [coberturas, setCoberturas] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true);
  const [loadingCoberturas, setLoadingCoberturas] = useState(true);

  // Modal de registro
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Carga dinámica de Especialidades y Coberturas desde el backend al montar el componente
  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingEspecialidades(true);
        const dataEsp = await getEspecialidades();
        setEspecialidades(dataEsp);
      } catch (err) {
        console.error('Error cargando especialidades:', err);
      } finally {
        setLoadingEspecialidades(false);
      }

      try {
        setLoadingCoberturas(true);
        const dataCob = await getCoberturas();
        setCoberturas(dataCob);
      } catch (err) {
        console.error('Error cargando coberturas:', err);
      } finally {
        setLoadingCoberturas(false);
      }
    }

    fetchData();
  }, []);

  // Botón "Reservar Turno": si no está logueado, pide inicio de sesión
  const handleReservarClick = () => {
    if (!isAuthenticated) {
      if (onNavigate) onNavigate('login', 'reservar');
    } else {
      alert(`Sesión activa de ${user?.nombre || 'usuario'}. Redirigiendo a la página de reserva (/reservar)...`);
    }
  };

  // Botón "Consultar Mis Turnos": pide inicio de sesión y lleva a MisTurnos
  const handleConsultarTurnosClick = () => {
    if (!isAuthenticated) {
      if (onNavigate) onNavigate('login', 'mis-turnos');
    } else {
      if (onNavigate) {
        onNavigate('mis-turnos');
      }
    }
  };

  return (
    <div className="home-wrapper">
      {/* 1. Barra de Navegación (Navbar.jsx) */}
      <Navbar
        onNavigate={onNavigate}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenActionModal={(action) => {
          if (action === 'mis-turnos') {
            handleConsultarTurnosClick();
          } else if (onNavigate) {
            onNavigate(action);
          }
        }}
      />

      <main className="main-content">
        {/* 2. Hero Section (Bloque Principal) */}
        <section id="inicio" className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">
              {clinicaConfig.hero.titulo}
            </h1>

            <p className="hero-subtitle">
              {clinicaConfig.hero.subtitulo}
            </p>

            <div className="hero-cta-group">
              <Button
                variant="primary"
                size="lg"
                onClick={handleReservarClick}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              >
                {clinicaConfig.hero.btnPrimary}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleConsultarTurnosClick}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                }
              >
                {clinicaConfig.hero.btnSecondary}
              </Button>
            </div>
          </div>
        </section>

        {/* 3. Sección: ¿Cómo funciona? (3 Tarjetas Informativas) */}
        <section id="como-funciona" className="how-it-works-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">Rápido y Accesible</span>
              <h2 className="section-title">¿Cómo funciona?</h2>
              <p className="section-subtitle">
                Sacá tu turno médico en tres pasos simples desde cualquier dispositivo y sin esperas telefónicas.
              </p>
            </div>

            <div className="steps-container">
              {clinicaConfig.comoFunciona.map((item, idx) => (
                <div key={idx} className="step-card">
                  <div className="step-badge">{item.paso}</div>
                  <h3 className="step-title">{item.titulo}</h3>
                  <p className="step-desc">{item.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Grilla de Especialidades (Informativo, no seleccionable, cargado desde MySQL) */}
        <section id="especialidades" className="especialidades-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">Cuerpo Profesional</span>
              <h2 className="section-title">Nuestras Especialidades</h2>
              <p className="section-subtitle">
                Atención ambulatoria integral con profesionales capacitados y equipamiento médico especializado.
              </p>
            </div>

            {loadingEspecialidades ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--neutral-500)' }}>
                Cargando especialidades médicas...
              </div>
            ) : (
              <div className="especialidades-grid">
                {especialidades.map((esp) => (
                  <div key={esp.id} className="especialidad-card">
                    <h3 className="especialidad-name">{esp.nombre}</h3>
                    <p className="especialidad-desc">
                      {esp.descripcion || 'Atención ambulatoria de excelencia con profesionales certificados.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. Tira de Obras Sociales y Coberturas (Badges cargados desde MySQL) */}
        <section id="coberturas" className="coberturas-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">Convenios Asistenciales</span>
              <h2 className="section-title">Obras Sociales y Prepagas Aceptadas</h2>
              <p className="section-subtitle">
                Atendemos con las principales mutuales y prepagas del país, y disponemos de atención particular.
              </p>
            </div>

            {loadingCoberturas ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--neutral-500)' }}>
                Cargando convenios de cobertura...
              </div>
            ) : (
              <div className="badges-container">
                {coberturas.map((cob) => {
                  const isPart = cob.nombre.toLowerCase().includes('particular');
                  return (
                    <div
                      key={cob.id}
                      className={`cobertura-badge ${isPart ? 'badge-particular' : ''}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{cob.nombre}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="coberturas-notice">
              <strong>¿No tenés obra social o tu plan no tiene convenio directo?</strong>
              <br />
              Atendemos de forma particular sin necesidad de autorización previa, con entrega de comprobante.
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer Institucional (Parametrizable desde clinicaConfig.js) */}
      <footer id="contacto" className="institutional-footer">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <div className="footer-brand-title">{clinicaConfig.nombre}</div>
            <p className="footer-slogan">{clinicaConfig.slogan}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--neutral-400)' }}>
              {clinicaConfig.subtitulo}
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Atención y Urgencias</h4>
            <ul className="footer-info-list">
              <li className="footer-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span><strong>Central:</strong> {clinicaConfig.contacto.telefonoPrincipal}</span>
              </li>
              <li className="footer-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{clinicaConfig.contacto.horarios.semana}</span>
              </li>
              <li className="footer-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{clinicaConfig.contacto.horarios.sabado}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Ubicación</h4>
            <ul className="footer-info-list">
              <li className="footer-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <div>{clinicaConfig.contacto.direccion}</div>
                  <div style={{ color: 'var(--neutral-400)', fontSize: '0.8rem' }}>{clinicaConfig.contacto.ciudad}</div>
                  <a
                    href={clinicaConfig.contacto.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-maps-link"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} {clinicaConfig.nombre}. Sistema de Gestión de Turnos.
          </div>
        </div>
      </footer>

      {/* ====================================================================
          MODAL: REGISTRARSE
          ==================================================================== */}
      {isRegisterModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Registro de Paciente</h3>
              <button className="modal-close-btn" onClick={() => setIsRegisterModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              login({ id: 2, nombre: 'Paciente Registrado', email: 'nuevo@paciente.com', rol: 'PACIENTE' });
              setIsRegisterModalOpen(false);
            }}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre y Apellido</label>
                  <input type="text" className="form-input" placeholder="Juan Pérez" required />
                </div>
                <div className="form-group">
                  <label className="form-label">DNI</label>
                  <input type="text" className="form-input" placeholder="30123456" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo Electrónico</label>
                  <input type="email" className="form-input" placeholder="juan@ejemplo.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contraseña</label>
                  <input type="password" className="form-input" placeholder="••••••••" required />
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="ghost" onClick={() => setIsRegisterModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" type="submit">Crear Cuenta</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
