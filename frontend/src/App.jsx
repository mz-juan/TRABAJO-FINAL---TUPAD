import React, { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}>
            +
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
            Clínica Médica - Sistema de Turnos
          </span>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Vite + React
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        maxWidth: '960px',
        width: '100%',
        margin: '2rem auto',
        padding: '0 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        <section style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1rem',
          }}>
            Vite Configurado Correctamente
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
            Portal de Gestión de Turnos
          </h1>
          <p style={{ color: '#475569', maxWidth: '600px', margin: '0 auto 1.5rem auto', fontSize: '1rem' }}>
            El entorno de desarrollo con Vite y React está listo para comenzar a construir los componentes y vistas del sistema de salud.
          </p>

          <button
            onClick={() => setCount(prev => prev + 1)}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Prueba de Estado React: {count} {count === 1 ? 'clic' : 'clics'}
          </button>
        </section>

        {/* Modules status */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
              Etapa 1 - Núcleo
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Autenticación, reserva de turnos para pacientes, panel médico y gestión administrativa.
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
              Proxy Backend
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Proxy configurado hacia <code>http://localhost:3000/api</code> para las llamadas REST.
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
              Arquitectura
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Estructura con componentes reutilizables, vistas modulares y estilos CSS desacoplados.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
