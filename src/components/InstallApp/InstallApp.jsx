import { useState, useEffect } from 'react';
import './InstallApp.css';
import NotificationService from '../../utils/notifications';

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Calcular valores iniciales sin setState en useEffect
  const isInstalled = typeof window !== 'undefined' && 
    window.matchMedia('(display-mode: standalone)').matches;
  
  const notificationsEnabled = localStorage.getItem('nb_notifications_enabled') === 'true';
  
  const [selectedHour, setSelectedHour] = useState(() => {
    const savedHour = localStorage.getItem('nb_notification_hour');
    return savedHour ? parseInt(savedHour) : 8;
  });

  useEffect(() => {
    // Capturar el evento de instalación
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      window.location.reload(); // Recargar para actualizar estado
      setDeferredPrompt(null);
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await NotificationService.requestPermission();
    if (granted) {
      NotificationService.scheduleDailyNotification(selectedHour, 0);
      NotificationService.sendLocalNotification(
        '🔔 ¡Notificaciones activadas!',
        { body: `Te enviaré tu carta de amor todos los días a las ${selectedHour}:00 💜` }
      );
      window.location.reload(); // Recargar para actualizar estado
    }
  };

  const handleChangeHour = (e) => {
    const hour = parseInt(e.target.value);
    setSelectedHour(hour);
    if (notificationsEnabled) {
      NotificationService.scheduleDailyNotification(hour, 0);
    }
  };

  const handleDisableNotifications = () => {
    NotificationService.disableDailyNotifications();
    window.location.reload(); // Recargar para actualizar estado
  };

  return (
    <div className="install-app-section">
      <div className="install-card">
        <h3>📱 Instala la App</h3>
        <p>Recibe tu carta de amor todos los días</p>

        {/* Botón de instalación */}
        {!isInstalled && deferredPrompt && (
          <button className="install-btn" onClick={handleInstall}>
            ⬇️ Agregar a Inicio
          </button>
        )}

        {isInstalled && (
          <p className="installed-badge">✅ App instalada</p>
        )}

        {/* Configuración de notificaciones */}
        <div className="notification-settings">
          {!notificationsEnabled ? (
            <div className="enable-section">
              <p>¿A qué hora quieres recibir tu carta? 💌</p>
              <select 
                value={selectedHour} 
                onChange={handleChangeHour}
                className="hour-select"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`}
                  </option>
                ))}
              </select>
              <button className="enable-btn" onClick={handleEnableNotifications}>
                🔔 Activar Notificaciones Diarias
              </button>
            </div>
          ) : (
            <div className="enabled-section">
              <p className="enabled-text">
                🔔 Recibirás tu carta todos los días a las {selectedHour}:00
              </p>
              <button 
                className="settings-toggle"
                onClick={() => setShowSettings(!showSettings)}
              >
                ⚙️ Cambiar hora
              </button>
              
              {showSettings && (
                <div className="settings-panel">
                  <select 
                    value={selectedHour} 
                    onChange={handleChangeHour}
                    className="hour-select"
                  >
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="disable-btn"
                    onClick={handleDisableNotifications}
                  >
                    Desactivar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="install-hint">
          💡 Tip: Instala la app y activa notificaciones para no perderte ningún mensaje
        </p>
      </div>
    </div>
  );
};

export default InstallApp;
