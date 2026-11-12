import React, { useState } from 'react';
import './Login.css';
import clinicaConfig from '../../config/clinicaConfig';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function Login({ onNavigate, onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    login({
      id: 1,
      nombre: email.split('@')[0] || 'Usuario',
      email: email || 'paciente@ejemplo.com',
      rol: 'PACIENTE'
    });
    onLoginSuccess();
  };

  return (
    <main className="login-page">
      <header className="login-topbar">
        <button className="login-back-link" type="button" onClick={() => onNavigate('home')}>
          ← Volver al inicio
        </button>
        <div className="login-brand">
          <div className="login-brand-icon">
            {clinicaConfig.logo.tipo === 'icon' ? (
              <span>{clinicaConfig.logo.iconText}</span>
            ) : (
              <img src={clinicaConfig.logo.imageSrc} alt="" />
            )}
          </div>
          <span>{clinicaConfig.nombre}</span>
        </div>
      </header>

      <section className="login-content">
        <div className="login-card">
          <p className="login-eyebrow">Portal de pacientes</p>
          <h1>Iniciar sesión</h1>
          <p className="login-description">
            Ingresá tus credenciales para acceder a la gestión de tus turnos médicos.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Correo electrónico</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="paciente@ejemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Button type="submit" fullWidth>Ingresar</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
