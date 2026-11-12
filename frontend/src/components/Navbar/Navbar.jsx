import React, { useState } from 'react';
import './Navbar.css';
import clinicaConfig from '../../config/clinicaConfig';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export default function Navbar({
  onNavigate,
  onOpenRegisterModal,
  onOpenActionModal
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (sectionId === 'inicio') {
      if (onNavigate) onNavigate('home');
      const element = document.getElementById('inicio');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const renderRoleButton = (isMobile = false) => {
    if (!user) return null;

    let label = 'Mi Panel';
    let target = 'panel';

    if (user.rol === 'PACIENTE') {
      label = 'Mis Turnos';
      target = 'mis-turnos';
    } else if (user.rol === 'MEDICO') {
      label = 'Mi Agenda';
      target = 'agenda';
    } else if (user.rol === 'ADMIN') {
      label = 'Panel Admin';
      target = 'admin';
    }

    return (
      <Button
        variant="primary"
        size="sm"
        fullWidth={isMobile}
        onClick={() => {
          setMobileMenuOpen(false);
          if (onOpenActionModal) onOpenActionModal(target);
          else handleNavClick(target);
        }}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        }
      >
        {label}
      </Button>
    );
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-main" aria-label="Navegación principal">
        {/* Brand / Logo + Nombre de la Clínica */}
        <div className="navbar-brand" onClick={() => handleNavClick('inicio')}>
          <div className="brand-icon-box">
            {clinicaConfig.logo.tipo === 'icon' ? (
              <span>{clinicaConfig.logo.iconText}</span>
            ) : (
              <img src={clinicaConfig.logo.imageSrc} alt={clinicaConfig.nombre} />
            )}
          </div>
          <div className="brand-text-group">
            <span className="brand-title">{clinicaConfig.nombre}</span>
            <span className="brand-subtitle">{clinicaConfig.slogan}</span>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <ul className="navbar-nav">
          <li>
            <span className="nav-link" onClick={() => handleNavClick('inicio')}>
              Inicio
            </span>
          </li>
          <li>
            <span className="nav-link" onClick={() => handleNavClick('como-funciona')}>
              ¿Cómo funciona?
            </span>
          </li>
          <li>
            <span className="nav-link" onClick={() => handleNavClick('especialidades')}>
              Especialidades
            </span>
          </li>
          <li>
            <span className="nav-link" onClick={() => handleNavClick('coberturas')}>
              Obras Sociales
            </span>
          </li>
          <li>
            <span className="nav-link" onClick={() => handleNavClick('contacto')}>
              Contacto
            </span>
          </li>
        </ul>

        {/* Acciones y Estado de Autenticación (Desktop) */}
        <div className="navbar-actions desktop-actions">
          {isAuthenticated && user ? (
            <>
              <div className="user-badge" title={`Conectado como ${user.email}`}>
                <span>{user.nombre || user.email.split('@')[0]}</span>
                <span className="user-badge-role">{user.rol}</span>
              </div>
              {renderRoleButton(false)}
              <button 
                className="btn-logout" 
                onClick={() => {
                  logout();
                  if (onNavigate) onNavigate('home');
                }}
                title="Cerrar sesión actual"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('login')}
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenRegisterModal}
              >
                Registrarse
              </Button>
            </>
          )}
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Menú desplegable móvil */}
      {mobileMenuOpen && (
        <div className="mobile-menu open">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item" onClick={() => handleNavClick('inicio')}>Inicio</li>
            <li className="mobile-nav-item" onClick={() => handleNavClick('como-funciona')}>¿Cómo funciona?</li>
            <li className="mobile-nav-item" onClick={() => handleNavClick('especialidades')}>Especialidades</li>
            <li className="mobile-nav-item" onClick={() => handleNavClick('coberturas')}>Obras Sociales y Prepagas</li>
            <li className="mobile-nav-item" onClick={() => handleNavClick('contacto')}>Contacto & Ubicación</li>
          </ul>

          <div className="mobile-actions">
            {isAuthenticated && user ? (
              <>
                <div className="user-badge" style={{ justifyContent: 'center' }}>
                  <span>{user.nombre || user.email}</span>
                  <span className="user-badge-role">{user.rol}</span>
                </div>
                {renderRoleButton(true)}
                <Button variant="outline" size="sm" fullWidth onClick={() => { setMobileMenuOpen(false); logout(); }}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="md" fullWidth onClick={() => { setMobileMenuOpen(false); onNavigate('login'); }}>
                  Iniciar Sesión
                </Button>
                <Button variant="primary" size="md" fullWidth onClick={() => { setMobileMenuOpen(false); onOpenRegisterModal(); }}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
