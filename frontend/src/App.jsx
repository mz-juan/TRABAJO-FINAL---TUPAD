import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import MisTurnos from './views/MisTurnos/MisTurnos';

function MainRouter() {
  const [currentView, setCurrentView] = useState('home');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState('home');
  const { isAuthenticated } = useAuth();

  const handleNavigate = (view, destinationAfterLogin = 'home') => {
    if (view === 'login') {
      setRedirectAfterLogin(destinationAfterLogin);
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'mis-turnos' && !isAuthenticated) {
      setRedirectAfterLogin('mis-turnos');
      setCurrentView('login');
    } else {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = () => {
    const destination = redirectAfterLogin;
    setRedirectAfterLogin('home');

    if (destination === 'mis-turnos') {
      setCurrentView('mis-turnos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (destination === 'reservar') {
      setCurrentView('home');
      window.alert('Sesión iniciada. Redirigiendo a la página de reserva (/reservar)...');
      return;
    }

    handleNavigate(destination);
  };

  return (
    <div className="app-container">
      {currentView === 'login' ? (
        <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
      ) : currentView === 'mis-turnos' && isAuthenticated ? (
        <MisTurnos onNavigate={handleNavigate} />
      ) : (
        <Home onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}
