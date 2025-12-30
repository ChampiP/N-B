import { useState, useEffect } from 'react'
import Envelope from './components/Envelope/Envelope'
import LandingPage from './components/LandingPage/LandingPage'
import NotificationService from './utils/notifications'
import './App.css'

function App() {
  const [showLanding, setShowLanding] = useState(false)

  // Inicializar notificaciones
  useEffect(() => {
    const initNotifications = async () => {
      if (NotificationService.isSupported()) {
        await NotificationService.registerServiceWorker();
        // Verificar mensajes secretos cada hora
        NotificationService.startPeriodicCheck(60);
      }
    };
    initNotifications();
  }, []);

  const handleContinue = () => {
    setShowLanding(true)
  }

  return (
    <div className="app">
      {!showLanding ? (
        <Envelope onContinue={handleContinue} />
      ) : (
        <LandingPage />
      )}
    </div>
  )
}

export default App
