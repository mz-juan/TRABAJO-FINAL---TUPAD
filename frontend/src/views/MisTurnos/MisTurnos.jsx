import React, { useState } from 'react';
import './MisTurnos.css';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/common/Button';

export default function MisTurnos({ onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('activos'); // 'activos' | 'todos' | 'historial'

  // Turnos iniciales de demostración vinculados al paciente logueado
  const [turnos, setTurnos] = useState([
    {
      id: 'TK-841920',
      especialidad: 'Cardiología',
      medico: 'Dr. Alejandro Rossi',
      matricula: 'MP 29.804',
      consultorio: 'Cons. 201 (1° Piso)',
      fecha: '20 Noviembre 2026',
      hora: '14:30 hs',
      cobertura: 'Particular (RN-12)',
      estado: 'CONFIRMADO',
      fechaRegistro: '12/11/2026'
    },
    {
      id: 'TK-719302',
      especialidad: 'Clínica Médica',
      medico: 'Dr. Martín Gómez',
      matricula: 'MP 38.410',
      consultorio: 'Cons. 101 (Planta Baja)',
      fecha: '05 Octubre 2026',
      hora: '09:00 hs',
      cobertura: 'OSDE',
      estado: 'ATENDIDO',
      fechaRegistro: '01/10/2026'
    }
  ]);

  // Si el usuario de alguna forma llega deslogueado a esta vista, se le ofrece volver o iniciar sesión
  if (!isAuthenticated || !user) {
    return (
      <div className="mis-turnos-page">
        <Navbar onNavigate={onNavigate} />
        <div className="mis-turnos-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="turnos-empty-state" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="empty-icon-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="empty-title">Acceso Restringido</h2>
            <p className="empty-desc">
              Debes iniciar sesión con tu cuenta de paciente para poder consultar y gestionar tus turnos médicos.
            </p>
            <Button variant="primary" onClick={() => onNavigate('home')}>
              ← Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Filtrado de turnos
  const filteredTurnos = turnos.filter((t) => {
    if (activeTab === 'activos') return t.estado === 'CONFIRMADO';
    if (activeTab === 'historial') return t.estado === 'CANCELADO' || t.estado === 'ATENDIDO';
    return true;
  });

  // Cancelación de turno (Regla de negocio RN-05 / RF-08)
  const handleCancelarTurno = (id) => {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas cancelar este turno? La franja horaria quedará disponible inmediatamente para otro paciente (RN-05).'
    );
    if (!confirmacion) return;

    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: 'CANCELADO' } : t))
    );
    alert('Turno cancelado exitosamente. La franja horaria ha sido liberada.');
  };

  // Descarga simulada de comprobante PDF (RF-20)
  const handleDescargarPdf = (turno) => {
    alert(
      `[RF-20] Descargando Comprobante Oficial en PDF para el turno #${turno.id}\nEspecialidad: ${turno.especialidad}\nProfesional: ${turno.medico}\nConsultorio: ${turno.consultorio}\nFecha: ${turno.fecha} ${turno.hora}`
    );
  };

  return (
    <div className="mis-turnos-page">
      <Navbar
        onNavigate={onNavigate}
        onOpenActionModal={(target) => onNavigate(target)}
      />

      <main className="mis-turnos-container">
        {/* Cabecera con datos del paciente */}
        <div className="mis-turnos-header">
          <div className="mis-turnos-title-group">
            <h1>Mis Turnos Médicos</h1>
            <p>Consultá tus citas activas, descargá comprobantes oficiales o cancelá franjas horarias.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="patient-info-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{user.nombre || user.email}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('home')}
            >
              ← Volver al Inicio
            </Button>
          </div>
        </div>

        {/* Pestañas de estado */}
        <div className="turnos-tabs">
          <button
            className={`turnos-tab-btn ${activeTab === 'activos' ? 'active' : ''}`}
            onClick={() => setActiveTab('activos')}
          >
            Turnos Activos ({turnos.filter((t) => t.estado === 'CONFIRMADO').length})
          </button>
          <button
            className={`turnos-tab-btn ${activeTab === 'historial' ? 'active' : ''}`}
            onClick={() => setActiveTab('historial')}
          >
            Historial ({turnos.filter((t) => t.estado !== 'CONFIRMADO').length})
          </button>
          <button
            className={`turnos-tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            Todos ({turnos.length})
          </button>
        </div>

        {/* Lista de Turnos */}
        {filteredTurnos.length === 0 ? (
          <div className="turnos-empty-state">
            <div className="empty-icon-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="empty-title">No hay turnos para mostrar</h3>
            <p className="empty-desc">
              {activeTab === 'activos'
                ? 'Actualmente no tenés citas médicas confirmadas pendientes de atención.'
                : 'No se encontraron turnos en este filtro.'}
            </p>
            <Button
              variant="primary"
              onClick={() => onNavigate('home')}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              }
            >
              Solicitar Nuevo Turno
            </Button>
          </div>
        ) : (
          <div className="turnos-list">
            {filteredTurnos.map((turno) => (
              <div
                key={turno.id}
                className={`turno-card ${turno.estado.toLowerCase()}`}
              >
                <div className="turno-main-info">
                  <div className="turno-top-row">
                    <span className="turno-especialidad">{turno.especialidad}</span>
                    <span className={`badge-estado ${turno.estado.toLowerCase()}`}>
                      {turno.estado}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--neutral-400)' }}>
                      #{turno.id}
                    </span>
                  </div>

                  <div className="turno-details-grid">
                    <div className="turno-detail-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>
                        <strong>Profesional:</strong> {turno.medico} ({turno.matricula})
                      </span>
                    </div>

                    <div className="turno-detail-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>
                        <strong>Fecha y Hora:</strong> {turno.fecha} - {turno.hora}
                      </span>
                    </div>

                    <div className="turno-detail-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>
                        <strong>Consultorio:</strong> {turno.consultorio}
                      </span>
                    </div>

                    <div className="turno-detail-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      <span>
                        <strong>Cobertura:</strong> {turno.cobertura}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="turno-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDescargarPdf(turno)}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    }
                  >
                    Comprobante PDF
                  </Button>

                  {turno.estado === 'CONFIRMADO' && (
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      onClick={() => handleCancelarTurno(turno.id)}
                    >
                      Cancelar Turno
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
